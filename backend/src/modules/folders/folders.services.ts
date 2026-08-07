import AppError from "../../error/app-error";
import slugify from "slugify";
import { CreateFolderBody, createFolderSchema } from "./folder.schema";
import FolderRepository from "./folders.repositories";
import FolderMapper from "./folder.mapper";

export default class FolderService {
    private static MAIN_FOLDER_NAME = "projetos"

    static async get() {
        const folders = await FolderRepository.get();

        if (!folders) throw new AppError("Nenhuma pasta encontrada", 404);

        return folders;
    };

    static async getById(id: string) {
        const folder = await FolderRepository.getById(id);

        if (!folder) throw new AppError("Nenhuma pasta encontrada com esse ID.", 404);

        return folder;
    };

    static async create(body: CreateFolderBody) {
        const data = createFolderSchema.parse(body);
        const folder = await FolderRepository.getByName(data.name);

        if (folder) throw new AppError("Já existe uma pasta com esse nome.", 409);

        const slug = this.generateFolderSlug(data.name);
        const folderPath = `${this.MAIN_FOLDER_NAME}/${slug}/`;

        const persistFolder = await FolderRepository.create(
            FolderMapper.toPrismaCreate(data, slug, folderPath)
        );

        return persistFolder;
    };

    private static generateFolderSlug(name: string) {
        return slugify(name, {
            replacement: "-",
            lower: true,
            strict: true
        });
    };
};