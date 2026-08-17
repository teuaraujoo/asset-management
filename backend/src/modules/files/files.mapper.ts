import { Prisma } from "../../generated/prisma/client";
import { requestFileBody } from "./files.schemas";

type payloadPedingCreate = {
    data: requestFileBody;
    mimeType: string;
    storageName: string;
    objectKey: string;
    extension: string;
    bucket: string;
    userId: string;
};

// FIXME: TENTAR PEGAR UM TIPO PRONTO AO INVES DE CRIAR UM

type Files = {
    folder_id: string | null;
    original_name: string;
    mime_type: string;
    size: bigint;
    id: string;
    storage_name: string;
    object_key: string;
    bucket: string;
    extension: string;
    checksum: string | null;
    status: string;
    created_at: Date;
    uploaded_at: Date | null;
    updated_at: Date;
    user_id: string;
    deleted_at: Date | null;
};

export default class FilesMapper {

    static toResponseGet(file: Files) {
        return {
            id: file.id,
            folder_id: file.folder_id,
            original_name: file.original_name,
            storage_name: file.storage_name,
            object_key: file.object_key,
            bucket: file.bucket,
            mime_type: file.mime_type,
            extension: file.extension,
            size: Number(file.size),
            checksum: file.checksum,
            status: file.status,
            created_at: file.created_at,
            uploaded_at: file.uploaded_at,
            updated_at: file.updated_at,
        }
    };

    static toPrismaPendingCreate({
        data,
        mimeType,
        storageName,
        objectKey,
        extension,
        bucket,
        userId
    }: payloadPedingCreate) {
        return {
            user_id: userId,
            folder_id: data.folder_id,
            mime_type: mimeType,
            original_name: data.original_name,
            storage_name: storageName,
            object_key: objectKey,
            size: data.size,
            extension: extension,
            bucket: bucket,
            checksum: data.checksum
        };
    };

    static toResponsePendingCreate(file: Prisma.filesUncheckedCreateInput, uploadUrl: string) {
        return {
            file_id: file.id,
            uploadUrl: uploadUrl,
            objectKey: file.object_key,
            storageName: file.storage_name
        };
    };

    static toResponseDownload(file: Prisma.filesUncheckedCreateInput, downloadUrl: string) {
        return {
            file_id: file.id,
            file_name: file.original_name,
            downloadUrl: downloadUrl
        };
    };
};