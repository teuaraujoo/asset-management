import { Prisma } from "../../generated/prisma/client";
import prisma from "../../libs/prisma";

export default class FolderRepository {
    static async get() {
        return prisma.folders.findMany();
    };

    static async getById(id: string) {
        return prisma.folders.findUnique({
            where: { id: id }
        });
    };

    static async getByName(name: string) {
        return prisma.folders.findFirst({
            where: {
                name: name
            },
        });
    };

    static async create(folder: Prisma.foldersCreateInput) {
        return prisma.folders.create({
            data: folder
        });
    };

    static async delete(tx: Prisma.TransactionClient, id: string) {
        return tx.folders.delete({
            where: {
                id: id
            }
        });
    };
};