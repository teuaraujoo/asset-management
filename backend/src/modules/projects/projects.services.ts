import AppError from "../../error/app-error";
import FolderRepository from "../folders/folders.services";
import { CreateProjectBody, createProjectSchema } from "./projects.schema";
import ProjectRepository from "./projects.repositories";
import { ProjectMapper } from "./projects.mapper";

export default class ProjectService {
    static async get() {
        const projects = await ProjectRepository.get();
        const folders = await FolderRepository.get();

        if (!projects) throw new AppError("Nenhum projeto encontrado.", 404);
        if (!folders) throw new AppError("Nenhuma pasta encontrada.", 404);

        return projects;
    };

    static async getById(id: string) {
        const project = await ProjectRepository.getById(id);
        const folder = await FolderRepository.getById(id);

        if (!project) throw new AppError("Projeto não encontrado.", 404);
        if (!folder) throw new AppError("Nenhuma pasta encontrada.", 404);

        return ProjectMapper.toResponseGet(project, folder);
    };

    static async createProject(body: CreateProjectBody) {
        const data = createProjectSchema.parse(body);
        const folder = await FolderRepository.getById(data.folder_id);

        if (folder) throw new AppError("Já existe um projeto vinculado a essa pasta.", 409);

    };

    static async updateProject() {

    };

    static async deleteProject() {

    };

    private async generateProjectSlug() {

    };
};