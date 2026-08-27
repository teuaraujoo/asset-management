import { PrepareFileUploadDTO } from "./files.schemas";
import { FileRecord } from "./files.types";

type payloadPedingCreate = {
    data: PrepareFileUploadDTO;
    mimeType: string;
    storageName: string;
    objectKey: string;
    extension: string;
    bucket: string;
    userId: string;
};

type Files = {
    folderId: string | null;
    originalName: string;
    mimeType: string;
    size: bigint;
    id: string;
    storageName: string;
    objectKey: string;
    bucket: string;
    extension: string;
    checksum: string | null;
    status: string;
    createdAt: Date;
    uploadedAt: Date | null;
    updatedAt: Date;
    userId: string;
    deletedAt: Date | null;
};

export default class FilesMapper {

    static toResponseGet(file: Files) {
        return {
            id: file.id,
            folderId: file.folderId,
            originalName: file.originalName,
            storageName: file.storageName,
            objectKey: file.objectKey,
            bucket: file.bucket,
            mime_type: file.mimeType,
            extension: file.extension,
            size: Number(file.size),
            checksum: file.checksum,
            status: file.status,
            createdAt: file.createdAt,
            uploadedAt: file.uploadedAt,
            updatedAt: file.updatedAt,
        }
    };

    static toPendingCreate({
        data,
        mimeType,
        storageName,
        objectKey,
        extension,
        bucket,
        userId
    }: payloadPedingCreate) {
        return {
            userId: userId,
            folderId: data.folder_id,
            mimeType: mimeType,
            originalName: data.original_name,
            storageName: storageName,
            objectKey: objectKey,
            size: BigInt(data.size),
            extension: extension,
            bucket: bucket,
            checksum: data.checksum
        };
    };

    static toResponsePendingCreate(file: FileRecord, uploadUrl: string) {
        return {
            file_id: file.id,
            uploadUrl: uploadUrl,
            objectKey: file.objectKey,
            storageName: file.storageName
        };
    };

    static toResponseDownload(file: FileRecord, downloadUrl: string) {
        return {
            file_id: file.id,
            file_name: file.originalName,
            downloadUrl: downloadUrl
        };
    };
};
