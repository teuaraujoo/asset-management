import prisma from "../../../libs/prisma";
import { IProjectsRepository } from "../projects.repository";
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
                folder: true,
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

        return projects.map((project) => PrismaProjectsMapper.toProjectDetails(project));
    };

    async getById(id: string, userId: string): Promise<ProjectDetails | null> {
        const project = await prisma.projects.findUnique({
            where: {
                id: id,
                user_id: userId
            },
            include: {
                folder: true,
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
                user_id: userId,
                folder: {
                    is: {
                        id: folderId
                    }
                }
            },
            include: {
                folder: true
            }
        });

        return project ? PrismaProjectsMapper.toProjectWithFolder(project) : null;
    };

    async getByFileId(fileId: string, userId: string): Promise<ProjectDetails | null> {
        const project = await prisma.projects.findFirst({
            where: {
                user_id: userId,
                cover_file_id: fileId
            },
            include: {
                folder: true,
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
    }

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
                folder: {
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
                folder: true
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
                folder: {
                    update: {
                        name: data.folder.name,
                        description: data.folder.description,
                        slug: data.folder.slug
                    },
                },
            },
            include: {
                folder: true
            },
        });

        return PrismaProjectsMapper.toProjectWithFolder(project);
    };

    async delete(id: string): Promise<void> {
        await prisma.projects.delete({
            where: {
                id: id
            }
        });
    };

    async publish(id: string): Promise<void> {
        await prisma.projects.update({
            where: {
                id: id
            },
            data: {
                published: true,
                published_at: new Date()
            }
        });
    };

    async unPublish(id: string): Promise<void> {
        await prisma.projects.update({
            where: {
                id: id
            },
            data: {
                published: false,
            },
        });
    };

    async setCover(id: string, fileId: string): Promise<void> {
        await prisma.projects.update({
            where: {
                id: id
            },
            data: {
                cover_file_id: fileId
            }
        });
    };

    async removeCover(id: string): Promise<void> {
        await prisma.projects.update({
            where: {
                id: id
            },
            data: {
                cover_file_id: null
            }
        });
    };
}
