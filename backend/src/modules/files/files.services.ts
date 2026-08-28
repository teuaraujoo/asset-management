import path from "node:path";
import AppError from "../../error/app-error";
import { IFilesRepository } from "./files.repositories";
import { randomUUID } from "node:crypto";
import {
    PrepareFileUploadDTO,
    RenameFileDTO,
    renameFileSchema,
    requestFileSchema
} from "./files.schemas";
import FilesMapper from "./files.mapper";
import { IStorageProvider } from "../../providers/storage/storage.provider";
import { IProjectReader } from "../projects/projects.contracts";
import { IFolderReader } from "../folders/folders.contracts";
export class FilesService {

    constructor(
        private StorageProvider: IStorageProvider,
        private ProjectReader: IProjectReader,
        private FolderReader: IFolderReader,
        private FilesRepository: IFilesRepository,
    ) { }

    private MAX_FILE_SIZE = 1024 * 1024 * 1024;
    private readonly ALLOWED_FILE_TYPES = {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/webp": [".webp"],
        "video/mp4": [".mp4"],
    };

    async getByFolderId(folderId: string, userId: string) {
        await this.FolderReader.getById(folderId);

        const existingFiles = await this.FilesRepository.getByFolderId(folderId, userId);

        if (!existingFiles) throw new AppError("Arquivos não encontrados.", 404);

        return existingFiles.map((file) => FilesMapper.toResponseGet(file));
    };

    async prepareUpload(body: PrepareFileUploadDTO, userId: string) {
        const data = requestFileSchema.parse(body);

        const { existingFolder, mimeType, extension } = await this.validateFileOnPrepare(data, userId);
        const storageName = this.generateStorageName(extension, data.original_name);
        const objectKey = `${existingFolder.path}${storageName}`;

        console.log("mimeType: ", mimeType);
        console.log("extensao: ", extension);
        console.log("tamanho do arquivo: ", data.size);
        console.log("object_key: ", objectKey);
        console.log("cheksum 1° requisicao: ", data.checksum);

        const prepareUpload = await this.StorageProvider.generatePresignedUrl(objectKey, mimeType, data.checksum);

        const file = await this.FilesRepository.create(
            FilesMapper.toPendingCreate({
                data,
                mimeType,
                storageName,
                objectKey,
                extension,
                bucket: prepareUpload.storageLocation,
                userId
            }));

        return FilesMapper.toResponsePendingCreate(file, prepareUpload.uploadUrl);
    };

    async complete(id: string, userId: string) {
        const file = await this.validateFileOnComplete(id, userId);

        const completedUpload = await this.FilesRepository.completeUpload(id);

        if (!completedUpload) await this.handleFailedUpload(file.id, file.objectKey);

        return;
    };

    async delete(id: string, userId: string) {
        const file = await this.validateExistingAndIDORFiles(id, userId);

        await this.StorageProvider.delete(file.objectKey);
        await this.FilesRepository.delete(id);

        return;
    };

    async rename(id: string, userId: string, body: RenameFileDTO) {
        const data = renameFileSchema.parse(body);

        const file = await this.validateExistingAndIDORFiles(id, userId);

        const existingFolder = await this.FolderReader.getById(file.folderId!);

        const storageName = this.generateStorageName(file.extension, data.name);
        const objectKey = `${existingFolder.path}${storageName}`;

        await this.StorageProvider.rename(file.objectKey, objectKey);
        await this.FilesRepository.rename(id, { originalName: data.name, storageName: storageName, objectKey: objectKey });

        return;
    };

    async download(id: string, userId: string) {
        const file = await this.validateExistingAndIDORFiles(id, userId);

        const signedUrl = await this.StorageProvider.generateDownloadPresignedUrl(file.objectKey);

        return FilesMapper.toResponseDownload(file, signedUrl);
    };

    async getPreview(id: string, userId: string) {
        const existingFile = await this.validateExistingAndIDORFiles(id, userId);

        const isImage = existingFile.mimeType.startsWith("image/");
        const isVideo = existingFile.mimeType.startsWith("video/");

        if (!isImage && !isVideo) throw new AppError("Arquivo não possui preview disponível.", 422);


        const key = existingFile.thumbnailKey ?? existingFile.objectKey;
        const previewUrl = await this.StorageProvider.generatePreviewUrl(key);

        return { preview_url: previewUrl };
    };

    private async validateExistingAndIDORFiles(fileId: string, userId: string) {
        const existingFile = await this.FilesRepository.getById(fileId);

        if (!existingFile) throw new AppError("Arquivo não encontrado.", 400);

        if (existingFile.userId !== userId) throw new AppError("Usuário não tem autorização para realizar essa operação.", 403);

        return existingFile;
    };

    private async validateFileOnComplete(id: string, userId: string) {
        const existingFile = await this.validateExistingAndIDORFiles(id, userId);

        if (existingFile.status === "COMPLETE") throw new AppError("Arquivo com upload já feito.", 409);

        if (existingFile.status !== "PENDING") throw new AppError("O upload não pode ser finalizado nesse estado.", 400);

        const metada = await this.StorageProvider.getObjectMetaData(existingFile.objectKey);

        if (!metada) throw new AppError("Não é possível concluir upload de arquivo não existente no bucket.", 409);

        if (BigInt(metada.contentLength) !== existingFile.size) await this.handleFailedUpload(existingFile.id, existingFile.objectKey);

        return existingFile;
    };

    private async validateFileOnPrepare(data: PrepareFileUploadDTO, userId: string) {
        const existingFolder = await this.FolderReader.getById(data.folder_id);

        if (!existingFolder) throw new AppError("Pasta não foi encontrada", 404);

        await this.ProjectReader.getByFolderId(existingFolder.id, userId);

        const mimeType = data.mime_type;
        const extension = path.extname(data.original_name).toLocaleLowerCase();

        this.validateFileSize(data.size);
        this.validateFileType(mimeType, extension);

        return {
            existingFolder,
            mimeType,
            extension,
        };
    };

    private async handleFailedUpload(id: string, objectKey: string) {
        await this.StorageProvider.delete(objectKey);
        await this.FilesRepository.failedUpload(id);
        throw new AppError("Não foi possível completar o upload.", 500);
    };

    private validateFileType(mimeType: string, extension: string) {
        const allowedExtensions = this.ALLOWED_FILE_TYPES[
            mimeType as keyof typeof this.ALLOWED_FILE_TYPES
        ];

        if (!allowedExtensions) throw new AppError("Tipo MIME não permitido.", 415);

        if (!(allowedExtensions as readonly string[]).includes(extension)) {
            throw new AppError(
                "Extensão incompatível com o tipo MIME.",
                415,
            );
        }
    };

    private validateFileSize(size: number) {
        if (size > this.MAX_FILE_SIZE) {
            throw new AppError("O arquivo execede o tamanho máximo permitido de 1gib", 415);
        };
    };

    private generateStorageName(extension: string, originalName: string) {
        const filename = path
            .basename(originalName, extension)
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-");

        return `${filename}-${randomUUID()}${extension}`;
    };
};
