import AppError from "../../error/app-error";
import { CreateProjectDTO, createProjectSchema, UpdateProjectDTO, updateProjectSchema } from "./projects.schema";
import { IProjectsRepository } from "./projects.repositories";
import ProjectMapper from "./projects.mapper";
import { IProjectStorageCleaner } from "../../providers/storage/storage.provider";
import { ProjectWithFolder } from "./projects.types";
import { IProjectReader } from "./projects.contracts";
import { ProjectFolderService } from "../folders/folders.contracts";

export class ProjectsService implements IProjectReader {

    constructor(
        private StorageCleanner: IProjectStorageCleaner,
        private FolderContract: ProjectFolderService,
        private ProjectsRepository: IProjectsRepository,
    ) { }

    async get(userId: string) {
        const existingProjects = await this.ProjectsRepository.get(userId);

        if (!existingProjects) throw new AppError("Nenhum projeto encontrado.", 404);

        return existingProjects.map((project) => ProjectMapper.toResponseGet(project));
    };

    async getById(id: string, userId: string) {
        const existingProject = await this.ProjectsRepository.getById(id, userId);

        if (!existingProject) throw new AppError("Projeto não encontrado.", 404);

        await this.FolderContract.getById(existingProject.folderId);

        return ProjectMapper.toResponseGet(existingProject);
    };

    async getByFolderId(folderId: string, userId: string): Promise<ProjectWithFolder> {
        const project = await this.ProjectsRepository.getByFolderId(folderId, userId);

        if (!project) throw new AppError("Projeto sem pasta vinculada ou não encontrado.", 404);

        if (project.userId !== userId) throw new AppError("Você não tem permissão para realizar essa ação.", 403);

        return project;
    };

    async create(body: CreateProjectDTO, userId: string) {
        const data = createProjectSchema.parse(body);

        const folderData = await this.FolderContract.toPrepareCreate({ name: data.name, description: data.description });

        await this.ProjectsRepository.create(ProjectMapper.toCreate(data, folderData, userId));
    };

    async update(projectId: string, userId: string, body: UpdateProjectDTO) {
        const existingProject = await this.validateUpdateProject(projectId, userId);

        const data = updateProjectSchema.parse(body);

        const folderData = await this.FolderContract.toPrepareUpdate(existingProject.folderId, {
            name: data.name ?? existingProject.name,
            description: data.description ?? existingProject.description,
        },);

        const project = ProjectMapper.toUpdate(data, folderData);

        const updatedProject = await this.ProjectsRepository.update(projectId, project);

        return ProjectMapper.toResponseUpdate(updatedProject);
    };

    async delete(id: string, userId: string) {
        const project = await this.ProjectsRepository.getById(id, userId);

        if (!project) throw new AppError("Projeto não encontrado ou já deletado.", 404);

        await this.StorageCleanner.deleteByPrefix(project.folder.path);
        await this.ProjectsRepository.delete(id);

        return;
    };

    private async validateUpdateProject(projectId: string, userId: string) {
        const existingProject = await this.ProjectsRepository.getById(projectId, userId);

        if (!existingProject) throw new AppError("Projeto não encontrado.", 404);

        // Comparando para retornar explicitamente o erro
        if (existingProject.userId !== userId) throw new AppError("Usuário sem permissão para realizar essa ação.", 403);

        return existingProject;
    };
};
