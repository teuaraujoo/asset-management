import {
    CreateFileData,
    FileRecord,
    RenameFileData
} from "./files.types";

export interface IFilesRepository {
    getById(id: string): Promise<FileRecord | null>;

    getByFolderId(folderId: string, userId: string): Promise<FileRecord[]>;

    create(data: CreateFileData): Promise<FileRecord>;

    completeUpload(id: string): Promise<FileRecord>;

    delete(id: string): Promise<FileRecord>;

    failedUpload(id: string): Promise<FileRecord>;

    rename(id: string, data: RenameFileData): Promise<FileRecord>;

    setThumbnailKey(id: string, thumbnailKey: string): Promise<FileRecord>;
};