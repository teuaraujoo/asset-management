import { PublicProjectDetailsRecord, PublicProjectSummaryRecord, PublicFileResponseDTO } from "./public.types";

export default class PublicMapper {

    static toResponseGetProjects(project: PublicProjectSummaryRecord, url: string | null) {
        return {
            id: project.id,
            slug: project.slug,
            name: project.name,
            miniDescription: project.miniDescription,
            publishedAt: project.publishedAt,
            cover: project.coverFile && url
                ? {
                    id: project.coverFile.id,
                    url: url,
                    alt: `Foto do Projeto ${project.name}`,
                    mimeType: project.coverFile.mimeType
                }
                : null,
        };
    };

    static toResponseGetProject(
        project: PublicProjectDetailsRecord,
        coverUrl: string | null,
        files: PublicFileResponseDTO[]
    ) {
        return {
            id: project.id,
            slug: project.slug,
            name: project.name,
            description: project.description,
            miniDescription: project.miniDescription,
            createdAt: project.createdAt,
            publishedAt: project.publishedAt,
            cover_url: {
                id: project.coverFile?.id,
                url: coverUrl
            },
            files: files
        }
    };

};