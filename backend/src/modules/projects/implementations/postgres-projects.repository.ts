import prisma from "../../../libs/prisma";
import FolderRepository from "../../folders/folders.repositories";
import { IProjectsRepository } from "../projects.repositories";
import {
    CreateProjectData,
    ProjectDetails,
    ProjectWithFolder,
    UpdateProjectData
} from "../projects.types";
import PrismaProjectsMapper from "./postgres-projects.mapper";

export default class PostgresProjectsRepository implements IProjectsRepository {
    async get(userId: string): Promise<ProjectDetails[]> {
        const projects = await prisma.projects.findMany({
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

        return projects.map(PrismaProjectsMapper.toProjectDetails);
    };

    async getById(id: string, userId: string): Promise<ProjectDetails | null> {
        const project = await prisma.projects.findUnique({
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

        return project ? PrismaProjectsMapper.toProjectDetails(project) : null;
    };

    async getByFolderId(folderId: string, userId: string): Promise<ProjectWithFolder | null> {
        const project = await prisma.projects.findFirst({
            where: {
                folder_id: folderId,
                user_id: userId
            },
            include: {
                folders: true
            }
        });

        return project ? PrismaProjectsMapper.toProjectWithFolder(project) : null;
    };

    async create(data: CreateProjectData): Promise<ProjectWithFolder> {
        const project = await prisma.projects.create({
            data: {
                name: data.name,
                mini_description: data.miniDescription,
                description: data.description,
                users: {
                    connect: {
                        id: data.userId
                    },
                },
                folders: {
                    create: {
                        id: data.folder.id,
                        name: data.folder.name,
                        description: data.folder.description,
                        slug: data.folder.slug,
                        path: data.folder.path,
                    },
                },
            },
            include: {
                folders: true
            }
        });

        return PrismaProjectsMapper.toProjectWithFolder(project);
    };

    async update(id: string, data: UpdateProjectData): Promise<ProjectWithFolder> {
        const project = await prisma.projects.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                mini_description: data.miniDescription,
                description: data.description,
                updated_at: data.updatedAt,
                folders: {
                    update: {
                        name: data.folder.name,
                        description: data.folder.description,
                        slug: data.folder.slug
                    },
                },
            },
            include: {
                folders: true
            },
        });

        return PrismaProjectsMapper.toProjectWithFolder(project);
    };

    async delete(id: string) {
        await prisma.$transaction(async (tx) => {
            const deletedProject = await tx.projects.delete({
                where: {
                    id: id
                }
            });
            await FolderRepository.delete(tx, deletedProject.folder_id);
        });
    };
};