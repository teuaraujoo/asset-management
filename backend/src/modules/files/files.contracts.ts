import { FileRecord } from "./files.types";

export interface IFileReader {
    getById(fileId: string): Promise<FileRecord | null>;
};