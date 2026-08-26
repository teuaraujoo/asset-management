export interface ProjectRecord {
    id: string;
    userId: string;
    folderId: string;
    name: string;
    miniDescription: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface ProjectFolderRecord {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    path: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface ProjectUserRecord {
    name: string;
    email: string;
    isActive: boolean | null;
};

export interface ProjectWithFolder
    extends ProjectRecord {
    folder: ProjectFolderRecord;
};

export interface ProjectDetails
    extends ProjectWithFolder {
    user: ProjectUserRecord;
};

export interface CreateProjectData {
    userId: string;
    name: string;
    miniDescription: string;
    description: string;
    folder: {
        id: string;
        name: string;
        description: string | null;
        slug: string;
        path: string;
    };
};

export interface UpdateProjectData {
    name?: string;
    miniDescription?: string;
    description?: string;
    updatedAt: Date;
    folder: {
        name?: string;
        description?: string | null;
        slug?: string;
    };
};