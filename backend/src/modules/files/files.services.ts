import path from "node:path";
import AppError from "../../error/app-error";
import FilesRepository from "./files.repositories";
import { randomUUID } from "node:crypto";
import FolderService from "../folders/folders.services";
import { renameFileSchema, requestFileBody, requestFileSchema } from "./files.schemas";
import FilesMapper from "./files.mapper";
import StorageService from "../storage/storage.services";
import ProjectService from "../projects/projects.services";
export default class FilesServices {

    private static MAX_FILE_SIZE = 1024 * 1024 * 1024;
    private static MAIN_FOLDER_NAME = "projetos";
    private static BLOCKED_MIME_TYPES = new Set<string>([
        "application/x-msdownload",      // .exe
        "application/x-dosexec",         // .exe (Linux)
        "application/x-msdos-program",   // .exe
        "application/x-msi",             // .msi
        "application/x-bat",             // .bat
        "application/x-msdos-program",   // .bat/.cmd
        "application/x-sh",              // .sh
        "application/x-cgi",             // .cgi
        "application/java-archive",      // .jar
        "application/x-mach-binary",     // .app (macOS)
    ]);
    private static BLOCKED_EXTENSIONS = new Set<string>([
        ".exe",
        ".dll",
        ".bat",
        ".cmd",
        ".sh",
        ".cgi",
        ".jar",
        ".app",
    ]);

    static async getByFolderId(folderId: string, userId: string) {
        const folder = await FolderService.getById(folderId);

        if (!folder) throw new AppError("Projeto sem pasta vinculada ou não encontrado.", 404);

        const files = await FilesRepository.getByFolderId(folderId, userId);

        if (!files) throw new AppError("Arquivos não encontrados.", 404);

        return files.map((file) => FilesMapper.toResponseGet(file));
    };

    static async prepareUpload(body: requestFileBody, userId: string) {
        const data = requestFileSchema.parse(body);

        const { folder, mimeType, extension, bucket } = await this.validateFileOnPrepare(data, userId);
        const storageName = this.generateStorageName(extension, data.original_name);
        const objectKey = `${this.MAIN_FOLDER_NAME}/${folder?.slug}/${storageName}`;

        console.log("mimeType: ", mimeType);
        console.log("extensao: ", extension);
        console.log("tamanho do arquivo: ", data.size);
        console.log("object_key: ", objectKey);
        console.log("cheksum 1° requisicao: ", data.checksum);

        const signedUrl = await StorageService.generatePressignedUrl(bucket, objectKey, mimeType, data.checksum);

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

    static async complete(id: string, userId: string) {
        const file = await this.validateFileOnComplete(id, userId);

        const completedUpload = await FilesRepository.completeUpload(id);

        if (!completedUpload) await this.handleFailedUpload(file.id, file.object_key);

        return;
    };

    static async delete(id: string, userId: string) {
        const file = await FilesRepository.getById(id);

        if (!file) throw new AppError("Arquivo não encontrado.", 400);

        if (file.user_id !== userId) throw new AppError("Usuário não tem autorização para realizar essa operação.", 403);

        const fileOnBucket = await StorageService.getObjectMetaData(file.object_key);

        if (!fileOnBucket) {
            await StorageService.deleteObject(file.object_key);
            throw new AppError("Arquivo não encontado no bucket.", 409);
        };

        await FilesRepository.delete(id);
        await StorageService.deleteObject(file.object_key);

        return;
    };

    static async rename(id: string, userId: string, body: string) {
        const data = renameFileSchema.parse(body);

        const file = await this.validateExistingAndIDORFiles(id, userId);

        const folder = await FolderService.getById(file.folder_id!);

        if (!folder) throw new AppError("Nenhuma pasta encontrada para esse arquivo.", 404);

        const storageName = this.generateStorageName(file.extension, data.name);
        const objectKey = `${this.MAIN_FOLDER_NAME}/${folder.slug}/${storageName}`;

        await StorageService.renameObject(file.object_key, objectKey);
        await FilesRepository.rename(id, { original_name: data.name, storage_name: storageName, object_key: objectKey });

        return;
    };

    static async download(id: string, userId: string) {
        const file = await this.validateExistingAndIDORFiles(id, userId);

        const signedUrl = await StorageService.generateDownloadPreSignedUrl(file.object_key);

        return FilesMapper.toResponseDownload(file, signedUrl);
    };

    private static async validateExistingAndIDORFiles(fileId: string, userId: string) {
        const file = await FilesRepository.getById(fileId);

        if (!file) throw new AppError("Arquivo não encontrado.", 400);

        if (file.user_id !== userId) throw new AppError("Usuário não tem autorização para realizar essa operação.", 403);

        return file;
    };

    private static async validateFileOnComplete(id: string, userId: string) {
        const file = await this.validateExistingAndIDORFiles(id, userId);

        if (file.status === "COMPLETE") throw new AppError("Arquivo com upload já feito.", 409);

        if (file.status !== "PENDING") throw new AppError("O upload não pode ser finalizado nesse estado.", 400);

        const bucketFile = await StorageService.getObjectMetaData(file.object_key);

        if (!bucketFile) throw new AppError("Não é possível concluir upload de arquivo não existente no bucket.", 409);

        if (BigInt(bucketFile.ContentLength!) !== file.size) await this.handleFailedUpload(file.id, file.object_key);

        return file;
    };

    private static async validateFileOnPrepare(data: requestFileBody, userId: string) {
        const folder = await FolderService.getById(data.folder_id);

        if (!folder) throw new AppError("Pasta não foi encontrada", 404);

        await ProjectService.getByFolderId(folder.id, userId);

        const bucket = process.env.STORAGE_BUCKET;

        if (!bucket) throw new AppError("Nome do bucket não configurado na variável de amebiente.", 500);

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

    private static async handleFailedUpload(id: string, objectKey: string) {
        await StorageService.deleteObject(objectKey);
        await FilesRepository.failedUplaod(id);
        throw new AppError("Não foi possível completar o upload.", 500);
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
            throw new AppError("O arquivo execede o tamanho máximo permitido de 1gib", 415);
        };
    };

    private static generateStorageName(extension: string, originalName: string) {
        const filename = path
            .basename(originalName, extension)
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-");

        return `${filename}-${randomUUID()}${extension}`;
    };
};