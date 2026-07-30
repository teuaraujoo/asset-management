import { Prisma } from "../../generated/prisma/browser";
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

    };
};