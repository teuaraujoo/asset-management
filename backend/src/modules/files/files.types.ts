
export type FileStatus =
    | "PENDING"
    | "COMPLETE"
    | "FAILED";

export interface FileRecord {
    id: string;
    userId: string;
    folderId: string | null;
    originalName: string;
    storageName: string;
    objectKey: string;
    bucket: string;
    mimeType: string;
    extension: string;
    size: bigint;
    checksum: string | null;
    thumbnailKey: string | null;
    status: FileStatus;
    createdAt: Date;
    uploadedAt: Date | null;
    updatedAt: Date;
    deletedAt: Date | null;
};

export interface CreateFileData {
    userId: string;
    folderId: string;
    originalName: string;
    storageName: string;
    objectKey: string;
    bucket: string;
    mimeType: string;
    extension: string;
    size: bigint;
    checksum: string;
};

export interface RenameFileData {
    originalName: string;
    storageName: string;
    objectKey: string;
};                     