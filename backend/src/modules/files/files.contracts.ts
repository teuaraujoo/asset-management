import { FileRecord } from "./files.types";

export interface IFileReader {
    getById(fileId: string): Promise<FileRecord | null>;
};

// export interface IPublicFileReader {
//     getByFolderId(folderId: string): Promise<FileRecord | null>;
// };