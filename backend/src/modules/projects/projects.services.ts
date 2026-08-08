import AppError from "../../error/app-error";
import { CreateProjectBody, createProjectSchema } from "./projects.schema";
import ProjectRepository from "./projects.repositories";
import ProjectMapper from "./projects.mapper";
import FolderService from "../folders/folders.services";
import FilesServices from "../files/files.services";
import prisma from "../../libs/prisma";

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

    static async getFiles(folderId: string) {
        const files = FilesServices.getByFolderId(folderId);

        if (!files) throw new AppError("", 404);

        return files;
    };

    static async create(body: CreateProjectBody, userId: string) {
        const data = createProjectSchema.parse(body);

        const folder = await FolderService.create({ name: data.name, description: data.description });

        const project = await ProjectRepository.create(ProjectMapper.toPrismaCreate(data, folder.id, userId));

        return ProjectMapper.toResponseCreate(project, folder)
    };

    static async update() {

    };

    static async delete(id: string) {
        const project = ProjectRepository.getById(id);

        if (!project) throw new AppError("Projeto não encontrado ou já deletado.", 404);

         await ProjectRepository.delete(id);
    };
};