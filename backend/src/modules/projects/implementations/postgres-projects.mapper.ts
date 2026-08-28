import { Prisma } from "../../../generated/prisma/client";
import {
    ProjectDetails,
    ProjectWithFolder,
} from "../projects.types";

type PrismaProjectDetails = Prisma.projectsGetPayload<{
    include: {
        folder: true;
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
        folder: true;
    };
}>;

export default class PrismaProjectsMapper {

    static toProjectWithFolder(
        project: PrismaProjectWithFolder,
    ): ProjectWithFolder {
        if (!project.folder) {
            throw new Error(`Projeto ${project.id} não possui pasta vinculada.`);
        }

        return {
            id: project.id,
            userId: project.user_id,
            folderId: project.folder.id,
            name: project.name,
            miniDescription: project.mini_description,
            description: project.description,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
            folder: {
                id: project.folder.id,
                name: project.folder.name,
                description: project.folder.description,
                slug: project.folder.slug,
                path: project.folder.path,
                createdAt: project.folder.created_at,
                updatedAt: project.folder.updated_at,
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
