import { CreateFolderBody, UpdateFolderBody } from "./folders.schema";

export default class FolderMapper {

    static toPrismaCreate(data: CreateFolderBody, slug: string, path: string, id: string) {
        return {
            id: id,
            name: data.name,
            description: data.description,
            slug: slug,
            path: path
        };
    };

    static toPrismaUpdate(data: UpdateFolderBody, slug: string) {
        return {
            name: data.name,
            description: data.description,
            slug: slug,
        };
    };
};