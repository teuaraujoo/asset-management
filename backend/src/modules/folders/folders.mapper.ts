import { PrepareFolderInput } from "./folders.types";

export default class FolderMapper {

    static toCreate(data: PrepareFolderInput, slug: string, path: string, id: string) {
        return {
            id: id,
            name: data.name,
            description: data.description,
            slug: slug,
            path: path
        };
    };

    static toUpdate(data: PrepareFolderInput, slug: string) {
        return {
            name: data.name,
            description: data.description,
            slug: slug,
        };
    };
};