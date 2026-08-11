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

    static async getByFolderId(folderId: string, userId: string) {
        return prisma.files.findMany({
            where: {
                folder_id: folderId,
                user_id: userId
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

    static async completeUpload(id: string) {
        return prisma.files.update({
            where: {
                id: id
            },
            data: {
                status: "COMPLETE",
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