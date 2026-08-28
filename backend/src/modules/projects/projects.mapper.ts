import { PreparedFolder, PreparedFolderUpdate } from "../folders/folders.types";
import { CreateProjectDTO, UpdateProjectDTO } from "./projects.schema";
import { ProjectDetails, ProjectWithFolder } from "./projects.types";

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

    static toCreate(project: CreateProjectDTO, folder: PreparedFolder, userId: string) {
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

    static toUpdate(project: UpdateProjectDTO, folder: PreparedFolderUpdate) {
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
