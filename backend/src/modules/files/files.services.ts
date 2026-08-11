import path from "node:path";
import AppError from "../../error/app-error";
import FilesRepository from "./files.repositories";
import { randomUUID } from "node:crypto";
import FolderService from "../folders/folders.services";
import { completeUploadFileBody, completeUploadFileSchema, requestFileBody, requestFileSchema } from "./files.schemas";
import FilesMapper from "./files.mapper";
import StorageService from "../storage/storage.services";
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

    static async getByFolderId(folderId: string) {
        const files = await FilesRepository.getByFolderId(folderId);

        if (!files) throw new AppError("Arquivos não encontrados.", 404);

        return files.map((file) => FilesMapper.toResponseGet(file));
    };

    static async prepareUpload(body: requestFileBody, userId: string) {
        //TODO: VERIFICAR DE FATO O MIMETYPE  / EXTESNION -> UMA OPCAO SERIA PASSAR O ARQUIVO PARA A API MAS NAO RETORNA-LO PARA VERIFICAR DE FATO O ARQUIVO EM SI, POREM TEM QUE VER O CONSUMO DE MEMORIA E SE ISSO É VANTAJSO PARA A ARQUITETURA IDEAL COM PRE SIGNED URLs
        const data = requestFileSchema.parse(body);

        const { folder, mimeType, extension, bucket } = await this.validateFile(data);
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
        //TODO: IDEMPOTENCIA DE FILES -> CASO JA EXISTA RETORNA PARA O CLIENTE DE IMEDIATO
        const file = await FilesRepository.getById(id);

        const data = completeUploadFileSchema.parse(body);

        if (!file) throw new AppError("File não encontrado.", 404);

        const bucketFile = await StorageService.getObjectMetaData(file.object_key);
        
        if (!bucketFile) throw new AppError("Não é possível concluir upload de arquivo não existente no bucket.", 409);
        
        if (BigInt(bucketFile.ContentLength!) !== file.size) throw new AppError("Arquivo diferente do esperado.", 409);

        if (file.status !== "PENDING") throw new AppError("O upload não pode ser finalizado nesse estado.", 400);

        const completedUpload = await FilesRepository.completeUpload(id, data.checksum);

        if (!completedUpload) {
            await StorageService.deleteObject(file.object_key);
            await FilesRepository.failedUplaod(file.id);
            throw new AppError("Não foi possível completar o upload.", 500);
        };
    };

    private static async validateFile(data: requestFileBody) {
        const folder = await FolderService.getById(data.folder_id);

        if (!folder) throw new AppError("Pasta não foi encontrada", 404);

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