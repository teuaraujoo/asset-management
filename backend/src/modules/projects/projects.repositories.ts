import { Prisma } from "../../generated/prisma/client";
import prisma from "../../libs/prisma";
import FolderRepository from "../folders/folders.repositories";

export default class ProjectRepository {
    static async get(userId: string) {
        return prisma.projects.findMany({
            where: {
                user_id: userId
            },
            include: {
                folders: true,
                users: {
                    select: {
                        name: true,
                        email: true,
                        is_active: true
                    }
                }
            },
            orderBy: {
                created_at: "asc"
            }
        });
    };

    static async getById(id: string, userId: string) {
        return prisma.projects.findUnique({
            where: {
                id: id,
                user_id: userId
            },
            include: {
                folders: true,
                users: {
                    select: {
                        name: true,
                        email: true,
                        is_active: true
                    },
                },
            },
        });
    };

    static async getByFolderId(folderId: string, userId: string) {
        return prisma.projects.findFirst({
            where: {
                folder_id: folderId,
                user_id: userId
            },
            include: {
                folders: true
            }
        });
    };

    static create(project: Prisma.projectsCreateInput) {
        return prisma.projects.create({
            data: project
        });
    };

    static update() {

    };

    static async delete(id: string) {
        await prisma.$transaction(async (tx) => {
            const deletedProject = await prisma.projects.delete({
                where: {
                    id: id
                }
            });
            await FolderRepository.delete(tx, deletedProject.folder_id);
        });
    };
};