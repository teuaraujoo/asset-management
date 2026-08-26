import AppError from "./error/app-error";
import s3 from "./libs/r2-bucket";
import FilesController from "./modules/files/files.controllers";
import { FilesRoutes } from "./modules/files/files.routes";
import FilesServices from "./modules/files/files.services";
import PostgresFilesRepository from "./modules/files/implementations/postgres-files.repository";
import PostgresProjectsRepository from "./modules/projects/implementations/postgres-projects.repository";
import ProjectsController from "./modules/projects/projects.controllers";
import { ProjectsRoutes } from "./modules/projects/projects.routes";
import ProjectsService from "./modules/projects/projects.services";
import R2StorageProvider from "./providers/storage/implementations/r2storage.provider";

const bucket = process.env.STORAGE_BUCKET;

if (!bucket) throw new AppError("Storage Bucket não configurado.", 500);

const storageProvider = new R2StorageProvider(s3, bucket);
const postgresFilesRepository = new PostgresFilesRepository();
const postgresProjectsRepository = new PostgresProjectsRepository();

export const projectsService = new ProjectsService(storageProvider, postgresProjectsRepository);
export const filesService = new FilesServices(storageProvider, projectsService, postgresFilesRepository);

export const projectsController = new ProjectsController(projectsService);
export const filesController = new FilesController(filesService);

export const projectsRoutes = ProjectsRoutes(projectsController);
export const filesRoutes = FilesRoutes(filesController);
