import { Prisma } from "../../../generated/prisma/client";
import { PublicProjectSummaryRecord } from "../public.types";

type PrismaProjectWithFileAndSlug = Prisma.projectsGetPayload<{
    select: {
        id: true,
        name: true,
        mini_description: true,
        published_at: true,
        folder: {
            select: {
                slug: true
            },
        },
        cover_file: {
            select: {
                id: true,
                original_name: true,
                object_key: true,
                thumbnail_key: true,
                mime_type: true
            },
        },
    },
}>;

export default class PrismaPublicMapper {

    static toPublicProjectSummaryRecord(project: PrismaProjectWithFileAndSlug): PublicProjectSummaryRecord {
        if (!project.folder) throw new Error(`Projeto públcio ${project.id} não possui pasta associada.`);

        return {
            id: project.id,
            name: project.name,
            miniDescription: project.mini_description,
            publishedAt: project.published_at,
            slug: project.folder.slug,
            coverFile: project.cover_file
                ? {
                    id: project.cover_file.id,
                    originalName: project.cover_file.original_name,
                    objectKey: project.cover_file.object_key,
                    thumbnailKey: project.cover_file.thumbnail_key,
                    mimeType: project.cover_file.mime_type
                }
                : null,
        };
    };

};
