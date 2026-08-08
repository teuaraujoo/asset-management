import { Prisma } from "../../generated/prisma/browser";
import prisma from "../../libs/prisma";
import FolderRepository from "../folders/folders.repositories";

export default class ProjectRepository {
    static async get() {
        return prisma.projects.findMany({
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

    static async getById(id: string) {
        return prisma.projects.findUnique({
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
            where: {
                id: id
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