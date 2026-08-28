import {
    PreparedFolder,
    PrepareFolderInput,
    PreparedFolderUpdate,
    FolderRecord
} from "./folders.types";

export interface IFolderReader {
    getById(folderId: string): Promise<FolderRecord>;
};

export interface IFolderPreparer {

    toPrepareCreate(data: PrepareFolderInput): Promise<PreparedFolder>;

    toPrepareUpdate(folderId: string, data: PrepareFolderInput): Promise<PreparedFolderUpdate>;
};

export type ProjectFolderService = IFolderReader & IFolderPreparer;