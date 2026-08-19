import { Prisma } from "../../generated/prisma/client";
import { CreateProjectBody, UpdateProjectBody } from "./projects.schema";

export type ProjectWithRelations = Prisma.projectsGetPayload<{
    include: {
        folders: true,
        users: {
            select: {
                name: true,
                email: true,
                is_active: true
            }
        }
    };
}>;

export default class ProjectMapper {
    static toResponseGet(project: ProjectWithRelations) {
        return {
            id: project.id,
            folder_id: project.folder_id,
            name: project.name,
            mini_description: project.mini_description,
            description: project.description,
            slug: project.folders.slug,
            path: project.folders.path,
            updated_at: project.updated_at,
            user: {
                id: project.user_id,
                name: project.users.name,
                email: project.users.email,
            }
        };
    };

    static toPrismaCreate(project: CreateProjectBody, folder: Prisma.foldersCreateWithoutProjectsInput, userId: string) {
        return {
            name: project.name,
            mini_description: project.mini_description,
            description: project.description,
            users: {
                connect: {
                    id: userId
                }
            },
            folders: {
                create: folder
            }
        };
    };

    static toPrismaUpdate(project: UpdateProjectBody, folder: Prisma.foldersUpdateWithoutProjectsInput) {
        return {
            name: project.name,
            mini_description: project.mini_description,
            description: project.description,
            updated_at: new Date(),
            folders: {
                update: folder
            }
        }
    };

    static toResponseCreate(
        project: Prisma.projectsUncheckedCreateInput,
        folder: Prisma.foldersUncheckedCreateInput
    ) {
        return {
            id: project.id,
            folder_id: project.folder_id,
            name: project.name,
            mini_description: project.mini_description,
            description: project.description,
            slug: folder.slug,
            path: folder.path,
            created_at: project.created_at,
        };
    };

    static toResponseUpdate(
        project: Prisma.projectsUncheckedUpdateInput,
        folder: Prisma.foldersUncheckedCreateInput
    ) {
        return {
            id: project.id,
            folder_id: folder.id,
            name: project.name,
            mini_description: project.mini_description,
            description: project.description,
            slug: folder.slug,
            path: folder.path,
            updated_at: project.updated_at,
        };
    };
};