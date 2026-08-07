import { CreateFolderBody } from "./folder.schema";

export default class FolderMapper {

    static toPrismaCreate(data: CreateFolderBody, slug: string, path: string) {
        return {
            name: data.name,
            description: data.description,
            slug: slug,
            path: path
        };
    };
};