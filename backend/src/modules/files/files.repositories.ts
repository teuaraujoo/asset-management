import { Prisma } from "../../generated/prisma/browser";
import prisma from "../../libs/prisma";

export default class FilesRepository {

    static async getById(id: string) {
        return prisma.files.findUnique({
            where: {
                id: id
            }
        });
    };

    static async getByFolderId(folderId: string) {
        return prisma.files.findMany({
            where: {
                folder_id: folderId
            },
            orderBy: {
                created_at: "asc"
            }
        });
    };

    static async create(file: Prisma.filesUncheckedCreateInput) {
        return prisma.files.create({
            data: file
        });
    };

    static async completeUpload(id: string, checksum: string) {
        return prisma.files.update({
            where: {
                id: id
            },
            data: {
                status: "COMPLETE",
                checksum: checksum,
                uploaded_at: new Date()
            },
        });
    };

    static async failedUplaod(id: string) {
        return prisma.files.update({
            where: {
                id: id,
            },
            data: {
                status: "FAILED"
            }
        });
    };
};