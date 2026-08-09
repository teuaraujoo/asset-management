import path from "node:path";
import AppError from "../../error/app-error";
import FilesRepository from "./files.repositories";
import { randomUUID } from "node:crypto";
import FolderService from "../folders/folders.services";
import { completeUploadFileBody, completeUploadFileSchema, requestFileBody, requestFileSchema } from "./files.schemas";
import FilesMapper from "./files.mapper";
import StorageService from "../storage/storage.services";
import { UserServices } from "../users/users.services";
export default class FilesServices {

    private static MAX_FILE_SIZE = 1024 * 1024 * 1024;
    private static MAIN_FOLDER_NAME = "projetos";
    private static BLOCKED_MIME_TYPES = new Set([
        "application/x-msdownload",      // .exe
        "application/x-dosexec",         // .exe (Linux)
        "application/x-msdos-program",   // .exe
        "application/x-msi",             // .msi
        "application/x-msdownload",      // .dll
        "application/x-bat",             // .bat
        "application/x-msdos-program",   // .bat/.cmd
        "application/x-sh",              // .sh
        "application/x-cgi",             // .cgi
        "application/java-archive",      // .jar
        "application/x-mach-binary",     // .app (macOS)
    ]);
    private static BLOCKED_EXTENSIONS = new Set([
        ".exe",
        ".dll",
        ".bat",
        ".cmd",
        ".sh",
        ".cgi",
        ".jar",
        ".app",
    ]);

    static async getByFolderId(folderId: string) {
        const files = await FilesRepository.getByFolderId(folderId);

        if (!files) throw new AppError("", 404);

        return files;
    };

    static async create(body: requestFileBody, userId: string) {
        const data = requestFileSchema.parse(body);

        const { folder, mimeType, extension, bucket } = await this.validateFile(data, userId);
        const storageName = this.generateStorageName(extension, data.original_name);
        const objectKey = `${this.MAIN_FOLDER_NAME}/${folder?.slug}/${storageName}`;

        console.log("mimeType: ", mimeType);
        console.log("extensao: ", extension);
        console.log("tamanho do arquivo: ", data.size);
        console.log("object_key: ", objectKey);

        const signedUrl = await StorageService.generatePressignedUrl(bucket, objectKey, mimeType);

        const file = await FilesRepository.create(
            FilesMapper.toPrismaPendingCreate(
                {
                    data,
                    mimeType,
                    storageName,
                    objectKey,
                    extension,
                    bucket,
                    userId
                }));

        return FilesMapper.toResponsePendingCreate(file, signedUrl);
    };

    static async complete(id: string, body: completeUploadFileBody) {
        const file = await FilesRepository.getById(id);
        const data = completeUploadFileSchema.parse(body);

        if (!file) throw new AppError("File não encontrado.", 404);

        if (file.status !== "PENDING") throw new AppError("File já foi baixado no bucket.", 400); //FIXME: CORRIGIR MENSAGEM E STATUS CODE

        const completedUpload = await FilesRepository.completeUpload(id, data.checksum);

        if (!completedUpload) {
            await StorageService.deleteObject(file.object_key);
            throw new AppError("Não foi possível completar o upload."); //TODO: COLOCAR STATUS CODE
        };
    };

    private static async validateFile(data: requestFileBody, userId: string) {
        const folder = await FolderService.getById(data.folder_id);
        const user = await UserServices.getById(userId);

        if (!folder) throw new AppError("Pasta não foi encontrada", 404);
        if (!user) throw new AppError("Usuário não encontrado"); //TODO: COLOCAR STATUS CODE

        const bucket = process.env.STORAGE_BUCKET;
        if (!bucket) throw new AppError("Nome do bucket não configurado na variável de amebiente.") //TODO: COLOCAR STATUS CODE

        const mimeType = data.mime_type;
        const extension = path.extname(data.original_name).toLocaleLowerCase();

        this.validateExtension(extension);
        this.validateFileSize(data.size);
        this.validateMimeType(mimeType);

        return {
            folder,
            mimeType,
            extension,
            bucket
        };
    };

    private static validateMimeType(mimeType: string) {
        if (this.BLOCKED_MIME_TYPES.has(mimeType)) {
            throw new AppError("Tipo de arquivo não permitido.", 415);
        };
    };

    private static validateExtension(extension: string) {
        if (this.BLOCKED_EXTENSIONS.has(extension)) {
            throw new AppError("Extensão do arquivo não permitida.", 415);
        };
    };

    private static validateFileSize(size: number) {
        if (size > this.MAX_FILE_SIZE) {
            throw new AppError("O arquivo execede o tamanho máximo permitido de 1gb", 415);
        };
    };

    private static generateStorageName(extension: string, originalName: string) {
        const filename = path
            .basename(originalName, extension)
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        return `${filename}-${randomUUID()}${extension}`;
    };
};