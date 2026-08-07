import { Prisma } from "../../generated/prisma/browser";
import { requestFileBody } from "./files.schemas";

type payloadPedingCreate = {
    data: requestFileBody;
    mimeType: string;
    storageName: string;
    objectKey: string;
    extension: string;
    bucket: string;
};

export default class FilesMapper {

    static toPrismaPendingCreate({
        data,
        mimeType,
        storageName,
        objectKey,
        extension,
        bucket,
    }: payloadPedingCreate) {
        return {
            user_id: data.user_id,
            folder_id: data.folder_id,
            mime_type: mimeType,
            original_name: data.originial_name,
            storage_name: storageName,
            object_key: objectKey,
            size: data.size,
            extension: extension,
            bucket: bucket,
        };
    };

    static async toResponsePendingCreate(file: Prisma.filesUncheckedCreateInput, uploadUrl: string) {
        return {
            file_id: file.id,
            uploadUrl: uploadUrl,
            objectKey: file.object_key,
            storageName: file.storage_name
        };
    };
};