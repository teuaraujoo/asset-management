import prisma from "../../../libs/prisma";
import { IPublicRepository } from "../public.repository";
import PrismaPublicMapper from "./postgres-public.mapper";
import { PublicProjectDetailsRecord } from "../public.types";

export default class PostgresPublicRepository implements IPublicRepository {

    async getProjects() {
        const projects = await prisma.projects.findMany({
            where: {
                published: true
            },
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
            orderBy: {
                published_at: "desc"
            },
        });

        return projects.map((project) => PrismaPublicMapper.toPublicProjectSummaryRecord(project));
    };

    async getProjectBySlug(slug: string): Promise<PublicProjectDetailsRecord | null> {

        const project = await prisma.projects.findFirst({
            where: {
                published: true,
                folder: {
                    is: {
                        slug: slug
                    }
                }
            },
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
                            },
                        },
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
        });

        if (!project) return null;

        return PrismaPublicMapper.toPublicProjectDetailsRecord(project)
    };
};