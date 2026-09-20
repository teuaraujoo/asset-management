import AppError from "./shared/error/app-error";
import s3 from "./libs/r2-bucket";

// Routes
import { FilesRoutes } from "./modules/files/files.routes";

// Controllers
import FilesController from "./modules/files/files.controller";
import ProjectsController from "./modules/projects/projects.controller";


// Services
import { FilesService } from "./modules/files/files.service";
import { FoldersService } from "./modules/folders/folders.service";
import { ProjectsRoutes } from "./modules/projects/projects.routes";
import { ProjectsService } from "./modules/projects/projects.service";

// Repositories
import PostgresFoldersRepository from "./modules/folders/implementations/postgres-folders.repository";
import PostgresProjectsRepository from "./modules/projects/implementations/postgres-projects.repository";
import PostgresFilesRepository from "./modules/files/implementations/postgres-files.repository";

// Storage
import { R2StorageAdapeter } from "./providers/storage/implementations/r2-storage.adapter";
import PostgresPublicRepository from "./modules/public/implementations/postgres-public.repository";
import PublicService from "./modules/public/public.service";
import PublicController from "./modules/public/public.controller";
import { PublicRoutes } from "./modules/public/public.routes";

const bucket = process.env.STORAGE_BUCKET;

if (!bucket) throw new AppError("Storage Bucket não configurado.", 500);

const storageProvider = new R2StorageAdapeter(s3, bucket);
const postgresFilesRepository = new PostgresFilesRepository();
const postgresProjectsRepository = new PostgresProjectsRepository();
const postgresFoldersRepository = new PostgresFoldersRepository();
const postgresPublicRepository = new PostgresPublicRepository();

const foldersService = new FoldersService(postgresFoldersRepository);
export const projectsService = new ProjectsService(storageProvider, foldersService, postgresProjectsRepository, postgresFilesRepository);
export const filesService = new FilesService(storageProvider, projectsService, foldersService, postgresFilesRepository);
export const publicService = new PublicService(postgresPublicRepository, storageProvider);

export const projectsController = new ProjectsController(projectsService);
export const filesController = new FilesController(filesService);
export const publicController = new PublicController(publicService);

export const projectsRoutes = ProjectsRoutes(projectsController);
export const filesRoutes = FilesRoutes(filesController);
export const publicRoutes = PublicRoutes(publicController);
