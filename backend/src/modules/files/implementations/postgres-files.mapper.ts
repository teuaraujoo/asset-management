import { FileRecord } from "../files.types";
import type { files } from "../../../generated/prisma/client";


export default class PrismaFilesMapper {
    static toFileRecord(file: files): FileRecord {
        return {
            id: file.id,
            userId: file.user_id,
            folderId: file.folder_id,
            originalName: file.original_name,
            storageName: file.storage_name,
            objectKey: file.object_key,
            bucket: file.bucket,
            mimeType: file.mime_type,
            extension: file.extension,
            size: file.size,
            checksum: file.checksum,
            thumbnailKey: file.thumbnail_key,
            status: file.status as FileRecord["status"],
            createdAt: file.created_at,
            uploadedAt: file.uploaded_at,
            updatedAt: file.updated_at,
            deletedAt: file.deleted_at,
        };
    };
};