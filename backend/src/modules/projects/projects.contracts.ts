import { ProjectFolderRecord, ProjectWithFolder } from "./projects.types";

export interface IProjectReader {
    getByFolderId(folderId: string, userId: string): Promise<ProjectWithFolder>;

    getFolderByProjectId(projectId: string, userId: string): Promise<ProjectFolderRecord>;
};
