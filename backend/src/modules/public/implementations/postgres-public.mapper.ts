import { Prisma } from "../../../generated/prisma/client";
import { PublicProjectDetailsRecord, PublicProjectSummaryRecord } from "../public.types";

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

type PrismaProjectDetails = Prisma.projectsGetPayload<{
    select: {
        id: true,
        name: true,
        description: true,
        mini_description: true,
        published_at: true,
        created_at: true,
        folder: {
            select: {
                slug: true,
                files: {
                    where: {
                        status: "COMPLETE",
                        deleted_at: null
                    },
                    select: {
                        id: true,
                        original_name: true,
                        object_key: true,
                        thumbnail_key: true,
                        mime_type: true,
                    },
                    orderBy: {
                        created_at: "asc"
                    }
                }
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
    }
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

    static toPublicProjectDetailsRecord(project: PrismaProjectDetails): PublicProjectDetailsRecord {
        if (!project.folder) throw new Error(`Projeto ${project.id} não possui pasta.`);

        return {
            id: project.id,
            name: project.name,
            description: project.description,
            miniDescription: project.mini_description,
            createdAt: project.created_at,
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
            files: project.folder.files.map((file) => ({
                id: file.id,
                originalName: file.original_name,
                objectKey: file.object_key,
                thumbnailKey: file.thumbnail_key,
                mimeType: file.mime_type
            })),
        };
    };
};
