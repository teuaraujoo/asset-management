import prisma from "../../libs/prisma";

export default class FolderRepository {
    static async getById(id: string) {
        return prisma.folders.findUnique({
            where: { id: id }
        });
    };
}