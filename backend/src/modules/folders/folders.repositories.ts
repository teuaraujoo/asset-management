import { FolderRecord } from "./folders.types";

export interface IFoldersRepository {

    get(): Promise<FolderRecord[]>;

    getById(folderId: string): Promise<FolderRecord | null>;

    getByName(name: string): Promise<FolderRecord | null>

    getByNameExcludingId(name: string, folderId: string): Promise<FolderRecord | null>;
};
