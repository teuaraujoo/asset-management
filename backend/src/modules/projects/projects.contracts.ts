import { ProjectWithFolder } from "./projects.types";

export interface ProjectReader {
    getByFolderId(folderId: string, userId: string): Promise<ProjectWithFolder>;
};