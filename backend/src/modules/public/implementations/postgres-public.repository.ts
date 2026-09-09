import prisma from "../../../libs/prisma";
import { IPublicRepository } from "../public.repository";
import PrismaPublicMapper from "./postgres-public.mapper";

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

    // getProjectBySlug(slug: string): Promise<void> {
    //     console.log(1 + 1);
    // }
};