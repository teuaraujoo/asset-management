import {
    CreateProjectData,
    ProjectDetails,
    ProjectWithFolder,
    UpdateProjectData
} from "./projects.types";

export interface IProjectsRepository {
    get(userId: string): Promise<ProjectDetails[]>;

    getById(id: string, userId: string): Promise<ProjectDetails | null>;

    getByFolderId(folderId: string, userId: string): Promise<ProjectWithFolder | null>;

    create(data: CreateProjectData): Promise<ProjectWithFolder>;

    update(id: string, data: UpdateProjectData): Promise<ProjectWithFolder>;

    delete(id: string): Promise<void>;
};