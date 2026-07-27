import AppError from "../../error/app-error";
import FolderRepository from "../folders/folders.services";
import { CreateProjectBody, createProjectSchema } from "./project.schema";
import ProjectRepository from "./projects.repositories";

export default class ProjectService {
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