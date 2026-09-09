import AppError from "../../error/app-error";
import { IPublicRepository } from "./public.repository";
import PublicMapper from "./public.mapper";
import { IStoragePreview } from "../../providers/storage/storage.provider";

export default class PublicService {
    constructor(
        private PublicRepository: IPublicRepository,
        private StoragePreview: IStoragePreview,
    ) { };

    async getProjects() {
        const projects = await this.PublicRepository.getProjects();

        if (!projects || projects.length <= 0) return [];

        return Promise.all(
            projects.map(async (project) => {
                if (!project.coverFile) return PublicMapper.toResponseGetProjects(project, null);

                const previewKey = project.coverFile.thumbnailKey ?? project.coverFile.objectKey;

                const coverUrl = await this.StoragePreview.generatePreviewUrl(previewKey);

                return PublicMapper.toResponseGetProjects(project, coverUrl);
            }),
        );
    };

    async getProjectBySlug(slug: string) {

    };
};