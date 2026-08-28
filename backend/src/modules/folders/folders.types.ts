export interface FolderRecord {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    path: string;
    createdAt: Date;
    updatedAt: Date;
};

export type PreparedFolder = {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    path: string;
};

export interface PreparedFolderUpdate {
    name?: string;
    description?: string | null;
    slug: string;
};

export interface PrepareFolderInput {
    name: string;
    description: string;
};
