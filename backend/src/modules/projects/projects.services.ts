import AppError from "../../error/app-error";
import { CreateProjectBody, createProjectSchema } from "./projects.schema";
import ProjectRepository from "./projects.repositories";
import { ProjectMapper } from "./projects.mapper";
import { FolderService } from "../folders/folders.services";

export default class ProjectService {
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

    static async createProject(body: CreateProjectBody) {
        const data = createProjectSchema.parse(body);

        const slug = this.generateProjectSlug(data.name);
        const folder_path = `${mainFolder_name}/${childFolder_name}`;

        const folderData = {
            name: data.name,
            description: data.description,
            slug: slug,
            path: ,
        }

        const folder = await FolderService.create(folderData);

        const dataWithFolderId = {
            ...data,
            folder_id: folder.id
        };

        const project = await ProjectRepository.create(dataWithFolderId);

        return project;
        // return ProjectMapper.toResponseCreate(project);
    };

    static async updateProject() {

    };

    static async deleteProject(id: string) {

    };

    private static generateProjectSlug(name: string) {

    };
};