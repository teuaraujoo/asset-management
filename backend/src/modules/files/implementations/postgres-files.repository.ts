import prisma from "../../../libs/prisma";
import { IFilesRepository } from "../files.repositories";
import { CreateFileData, FileRecord, RenameFileData } from "../files.types";
import type { files } from "../../../generated/prisma/client";

function toFileRecord(file: files): FileRecord {
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
}

export default class PostgresFilesRepository implements IFilesRepository {

    async getById(id: string): Promise<FileRecord | null> {
        const file = await prisma.files.findUnique({
            where: {
                id: id
            }
        });

        return file ? toFileRecord(file) : null;
    };

    async getByFolderId(folderId: string, userId: string): Promise<FileRecord[]> {
        const files = await prisma.files.findMany({
            where: {
                folder_id: folderId,
                user_id: userId
            },
            orderBy: {
                created_at: "asc"
            }
        });

        return files.map(toFileRecord);
    };

    async create(data: CreateFileData): Promise<FileRecord> {
        const file = await prisma.files.create({
            data: {
                user_id: data.userId,
                folder_id: data.folderId,
                original_name: data.originalName,
                storage_name: data.storageName,
                object_key: data.objectKey,
                bucket: data.bucket,
                mime_type: data.mimeType,
                extension: data.extension,
                size: data.size,
                checksum: data.checksum,
            }
        });

        return toFileRecord(file);
    };

    async completeUpload(id: string): Promise<FileRecord> {
        const file = await prisma.files.update({
            where: {
                id: id
            },
            data: {
                status: "COMPLETE",
                uploaded_at: new Date()
            },
        });

        return toFileRecord(file);
    };

    async delete(id: string): Promise<FileRecord> {
        const file = await prisma.files.delete({
            where: {
                id: id
            }
        });

        return toFileRecord(file);
    };

    async failedUpload(id: string): Promise<FileRecord> {
        const file = await prisma.files.update({
            where: {
                id: id,
            },
            data: {
                status: "FAILED"
            }
        });

        return toFileRecord(file)
    };

    async rename(id: string, data: RenameFileData): Promise<FileRecord> {
        const file = await prisma.files.update({
            where: {
                id: id,
            },
            data: {
                original_name: data.originalName,
                storage_name: data.storageName,
                object_key: data.objectKey
            }
        });

        return toFileRecord(file);
    };

    async setThumbnailKey(id: string, thumbnailKey: string): Promise<FileRecord> {
        const file = await prisma.files.update({
            where: { id },
            data: { thumbnail_key: thumbnailKey }
        });

        return toFileRecord(file);
    };
};