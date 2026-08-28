import AppError from "./error/app-error";
import s3 from "./libs/r2-bucket";

// Routes
import { FilesRoutes } from "./modules/files/files.routes";

// Controllers
import FilesController from "./modules/files/files.controllers";
import ProjectsController from "./modules/projects/projects.controllers";


// Services
import { FilesService } from "./modules/files/files.services";
import { FoldersService } from "./modules/folders/folders.services";
import { ProjectsRoutes } from "./modules/projects/projects.routes";
import { ProjectsService } from "./modules/projects/projects.services";

// Repositories
import PostgresFoldersRepository from "./modules/folders/implementations/postgres-folders.repository";
import PostgresProjectsRepository from "./modules/projects/implementations/postgres-projects.repository";
import PostgresFilesRepository from "./modules/files/implementations/postgres-files.repository";

// Storage
import R2StorageProvider from "./providers/storage/implementations/r2storage.provider";

const bucket = process.env.STORAGE_BUCKET;

if (!bucket) throw new AppError("Storage Bucket não configurado.", 500);

const storageProvider = new R2StorageProvider(s3, bucket);
const postgresFilesRepository = new PostgresFilesRepository();
const postgresProjectsRepository = new PostgresProjectsRepository();
const postgresFoldersRepository = new PostgresFoldersRepository();

const foldersService = new FoldersService(postgresFoldersRepository);
export const projectsService = new ProjectsService(storageProvider, foldersService, postgresProjectsRepository);
export const filesService = new FilesService(storageProvider, projectsService, foldersService, postgresFilesRepository);

export const projectsController = new ProjectsController(projectsService);
export const filesController = new FilesController(filesService);

export const projectsRoutes = ProjectsRoutes(projectsController);
export const filesRoutes = FilesRoutes(filesController);
