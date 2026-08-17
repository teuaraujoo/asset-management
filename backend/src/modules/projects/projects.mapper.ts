import { Prisma } from "../../generated/prisma/client";
import { CreateProjectBody } from "./projects.schema";

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

    static toPrismaCreate(project: CreateProjectBody, folderId: string, userId: string) {
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
                connect: {
                    id: folderId
                }
            }
        };
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
};