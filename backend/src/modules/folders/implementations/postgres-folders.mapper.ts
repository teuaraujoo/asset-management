import { folders } from "../../../generated/prisma/client";

export default class PrismaFoldersMapper {
    static toFolderRecord(folder: folders) {
        return {
            id: folder.id,
            name: folder.name,
            description: folder.description,
            slug: folder.slug,
            path: folder.path,
            createdAt: folder.created_at,
            updatedAt: folder.updated_at,
        }
    };
};