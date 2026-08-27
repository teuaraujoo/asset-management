import { Prisma } from "../../../generated/prisma/client";
import {
    ProjectDetails,
    ProjectWithFolder,
} from "../projects.types";

type PrismaProjectDetails = Prisma.projectsGetPayload<{
    include: {
        folders: true;
        users: {
            select: {
                name: true;
                email: true;
                is_active: true;
            };
        };
    };
}>;

type PrismaProjectWithFolder = Prisma.projectsGetPayload<{
    include: {
        folders: true;
    };
}>;

export default class PrismaProjectsMapper {

    static toProjectWithFolder(
        project: PrismaProjectWithFolder,
    ): ProjectWithFolder {
        return {
            id: project.id,
            userId: project.user_id,
            folderId: project.folder_id,
            name: project.name,
            miniDescription: project.mini_description,
            description: project.description,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
            folder: {
                id: project.folders.id,
                name: project.folders.name,
                description: project.folders.description,
                slug: project.folders.slug,
                path: project.folders.path,
                createdAt: project.folders.created_at,
                updatedAt: project.folders.updated_at,
            },
        };
    };

    static toProjectDetails(
        project: PrismaProjectDetails,
    ): ProjectDetails {
        return {
            ...this.toProjectWithFolder(project),
            user: {
                name: project.users.name,
                email: project.users.email,
                isActive: project.users.is_active,
            },
        };
    };
}