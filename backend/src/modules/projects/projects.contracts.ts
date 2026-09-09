import { ProjectFolderRecord, ProjectWithFolder, ProjectDetails } from "./projects.types";

export interface IProjectReader {
    getByFolderId(folderId: string, userId: string): Promise<ProjectWithFolder>;

    getFolderByProjectId(projectId: string, userId: string): Promise<ProjectFolderRecord>;
};

// export interface IPublicProjectReader {
//     getAll(): Promise<ProjectDetails[]>;

//     getBySlug(): Promise<ProjectDetails | null>;
// };