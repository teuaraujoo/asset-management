import AppError from "../../error/app-error";
import slugify from "slugify";
import { CreateProjectBody, createProjectSchema } from "./projects.schema";
import ProjectRepository from "./projects.repositories";
import { ProjectMapper } from "./projects.mapper";
import { FolderService } from "../folders/folders.services";

export default class ProjectService {

    private static MAIN_FOLDER = "projetos"

    static async get() {
        const projects = await ProjectRepository.get();

        if (!projects) throw new AppError("Nenhum projeto encontrado.", 404);

        return projects.map((project) => ProjectMapper.toResponseGet(project));
    };

    static async getById(id: string) {
        const project = await ProjectRepository.getById(id);
        if (!project) throw new AppError("Projeto não encontrado.", 404);

        await FolderService.getById(project?.folder_id);

        return ProjectMapper.toResponseGet(project);
    };

    static async create(body: CreateProjectBody) {
        const data = createProjectSchema.parse(body);

        const slug = this.generateProjectSlug(data.name);
        const folderPath = `${this.MAIN_FOLDER}/${slug}/`;
        const folderData = {
            name: data.name,
            description: data.description,
            slug: slug,
            path: folderPath,
        };

        const folder = await FolderService.create(folderData);

        const project = await ProjectRepository.create(ProjectMapper.toPrismaCreate(data, folder.id));

        return ProjectMapper.toResponseCreatae(project, folder)
    };

    static async update() {

    };

    static async delete(id: string) {

    };

    private static generateProjectSlug(name: string) {
        return slugify(name, {
            replacement: "-",
            lower: true,
            strict: true
        });
    };
};