import { Prisma } from "@prisma/client/extension";
import { CreateProjectBody, UpdateProjectBody } from "./projects.schema";
import { ProjectDetails, ProjectRecord, ProjectWithFolder } from "./projects.types";

type Folder = {
    id: string;
    name: string;
    description: string;
    slug: string;
    path: string;
}

type UpdateFolder = {
    name?: string;
    description?: string | null;
    slug: string;
}
export default class ProjectMapper {
    static toResponseGet(project: ProjectDetails) {
        return {
            id: project.id,
            folder_id: project.folderId,
            name: project.name,
            mini_description: project.miniDescription,
            description: project.description,
            slug: project.folder.slug,
            path: project.folder.path,
            updated_at: project.updatedAt,
            user: {
                id: project.userId,
                name: project.user.name,
                email: project.user.email,
            },
        };
    };

    static toCreate(project: CreateProjectBody, folder: Folder, userId: string) {
        return {
            userId: userId,
            name: project.name,
            miniDescription: project.mini_description,
            description: project.description,
            folder: {
                id: folder.id,
                name: folder.name,
                description: folder.description,
                slug: folder.slug,
                path: folder.path
            }
        };
    };

    static toUpdate(project: UpdateProjectBody, folder: UpdateFolder) {
        return {
            name: project.name,
            miniDescription: project.mini_description,
            description: project.description,
            updatedAt: new Date(),
            folder: {
                name: folder.name,
                description: folder.description,
                slug: folder.slug
            }
        }
    };

    static toResponseCreate(
        project: ProjectWithFolder,
    ) {
        return {
            id: project.id,
            folder_id: project.folderId,
            name: project.name,
            mini_description: project.miniDescription,
            description: project.description,
            slug: project.folder.slug,
            path: project.folder.path,
            created_at: project.createdAt,
        };
    };

    static toResponseUpdate(
        project: ProjectWithFolder
    ) {
        return {
            id: project.id,
            folder_id: project.folderId,
            name: project.name,
            mini_description: project.miniDescription,
            description: project.description,
            slug: project.folder.slug,
            path: project.folder.path,
            updated_at: project.updatedAt,
        };
    };
};