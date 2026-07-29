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
}