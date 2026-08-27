import prisma from "../../../libs/prisma";
import { IFilesRepository } from "../files.repositories";
import { CreateFileData, FileRecord, RenameFileData } from "../files.types";
import PrismaFilesMapper from "./postgres-files.mapper";
export default class PostgresFilesRepository implements IFilesRepository {

    async getById(id: string): Promise<FileRecord | null> {
        const file = await prisma.files.findUnique({
            where: {
                id: id
            }
        });

        return file ? PrismaFilesMapper.toFileRecord(file) : null;
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

        return files.map(PrismaFilesMapper.toFileRecord);
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

        return PrismaFilesMapper.toFileRecord(file);
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

        return PrismaFilesMapper.toFileRecord(file);
    };

    async delete(id: string): Promise<FileRecord> {
        const file = await prisma.files.delete({
            where: {
                id: id
            }
        });

        return PrismaFilesMapper.toFileRecord(file);
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

        return PrismaFilesMapper.toFileRecord(file)
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

        return PrismaFilesMapper.toFileRecord(file);
    };

    async setThumbnailKey(id: string, thumbnailKey: string): Promise<FileRecord> {
        const file = await prisma.files.update({
            where: { id },
            data: { thumbnail_key: thumbnailKey }
        });

        return PrismaFilesMapper.toFileRecord(file);
    };
};