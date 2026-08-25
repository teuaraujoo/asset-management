import AppError from "../../error/app-error";
import { CreateProjectBody, createProjectSchema, UpdateProjectBody, updateProjectSchema } from "./projects.schema";
import ProjectRepository from "./projects.repositories";
import ProjectMapper from "./projects.mapper";
import FolderService from "../folders/folders.services";
import FilesServices from "../files/files.services";
import prisma from "../../libs/prisma";
import * as StorageService from "../storage/storage.services";

export default class ProjectService {

    static async get(userId: string) {
        const projects = await ProjectRepository.get(userId);

        if (!projects) throw new AppError("Nenhum projeto encontrado.", 404);

        return projects.map((project) => ProjectMapper.toResponseGet(project));
    };

    static async getById(id: string, userId: string) {
        const project = await ProjectRepository.getById(id, userId);

        if (!project) throw new AppError("Projeto não encontrado.", 404);

        // if (project.user_id !== userId) throw new AppError("Você não tem permissão para realizar essa ação.", 403);

        await FolderService.getById(project.folder_id);

        return ProjectMapper.toResponseGet(project);
    };

    static async getByFolderId(folderId: string, userId: string) {
        const project = await ProjectRepository.getByFolderId(folderId, userId);

        if (!project) throw new AppError("Projeto sem pasta vinculada ou não encontrado.", 404);

        if (project.user_id !== userId) throw new AppError("Você não tem permissão para realizar essa ação.", 403);

        return project;
    };

    static async getFiles(folderId: string, userId: string) {
        const files = await FilesServices.getByFolderId(folderId, userId);

        if (!files) throw new AppError("Arquivos não encontrados", 404);

        return files;
    };

    static async create(body: CreateProjectBody, userId: string) {
        const data = createProjectSchema.parse(body);

        const folderData = await FolderService.toPrepareCreate({ name: data.name, description: data.description });

        const project = await ProjectRepository.create(ProjectMapper.toPrismaCreate(data, folderData, userId));

        return ProjectMapper.toResponseCreate(project, project.folders);
    };

    static async update(projectId: string, userId: string, body: UpdateProjectBody) {
        const existingProject = await this.validateUpdateProject(projectId, userId);

        const data = updateProjectSchema.parse(body);

        const folderData = await FolderService.toPrepareUpdate(existingProject.folder_id, {
            name: data.name ?? existingProject.name,
            description: data.description ?? existingProject.description,
        },);

        const project = ProjectMapper.toPrismaUpdate(data, folderData);

        const updatedProject = await ProjectRepository.update(projectId, project);

        return ProjectMapper.toResponseUpdate(updatedProject, updatedProject.folders);
    };

    static async delete(id: string, userId: string) {
        const project = await ProjectRepository.getById(id, userId);

        if (!project) throw new AppError("Projeto não encontrado ou já deletado.", 404);

        await StorageService.deleteObjectByPrefix(project.folders.path);
        await ProjectRepository.delete(id);

        return;
    };

    private static async validateUpdateProject(projectId: string, userId: string) {
        const existingProject = await ProjectRepository.getById(projectId, userId);

        if (!existingProject) throw new AppError("Projeto não encontrado.", 404);

        // Comparando para retornar explicitamente o erro
        if (existingProject.user_id !== userId) throw new AppError("Usuário sem permissão para realizar essa ação.", 403);

        return existingProject;
    };
};
