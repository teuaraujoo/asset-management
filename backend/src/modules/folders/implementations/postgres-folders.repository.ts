import { Prisma } from "../../../generated/prisma/client";
import prisma from "../../../libs/prisma";
import PrismaFoldersMapper from "./postgres-folders.mapper";
import { FolderRecord } from "../folders.types";
import { IFoldersRepository } from "../folders.repositories";

export default class PostgresFoldersRepository implements IFoldersRepository {
    async get(): Promise<FolderRecord[]> {
        const folders = await prisma.folders.findMany();

        return folders.map((folder) => PrismaFoldersMapper.toFolderRecord(folder));
    };

    async getById(id: string): Promise<FolderRecord | null> {
        const folder = await prisma.folders.findUnique({
            where: { id: id }
        });

        return folder ? PrismaFoldersMapper.toFolderRecord(folder) : null;
    };

    async getByName(name: string): Promise<FolderRecord | null> {
        const folder = await prisma.folders.findFirst({
            where: {
                name: name
            },
        });

        return folder ? PrismaFoldersMapper.toFolderRecord(folder) : null;
    };

    async getByNameExcludingId(name: string, folderId: string): Promise<FolderRecord | null> {
        const folder = await prisma.folders.findFirst({
            where: {
                name: name,
                id: {
                    not: folderId,
                },
            },
        });

        return folder ? PrismaFoldersMapper.toFolderRecord(folder) : null;
    };
};
