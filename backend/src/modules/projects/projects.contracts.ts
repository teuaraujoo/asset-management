import { ProjectWithFolder } from "./projects.types";

export interface IProjectReader {
    getByFolderId(folderId: string, userId: string): Promise<ProjectWithFolder>;
};