import AppError from "../../error/app-error";
import slugify from "slugify";
import { IFoldersRepository } from "./folders.repositories";
import FolderMapper from "./folders.mapper";
import { randomUUID } from "node:crypto";
import { IFolderPreparer, IFolderReader } from "./folders.contracts";
import { PrepareFolderInput } from "./folders.types";

export class FoldersService implements IFolderReader, IFolderPreparer {
    constructor(
        private FoldersRepository: IFoldersRepository
    ) { }

    private readonly MAIN_FOLDER_NAME = "projetos"

    async get() {
        const folders = await this.FoldersRepository.get();

        if (!folders) throw new AppError("Nenhuma pasta encontrada", 404);

        return folders;
    };

    async getById(id: string) {
        const folder = await this.FoldersRepository.getById(id);

        if (!folder) throw new AppError("Nenhuma pasta encontrada com esse ID.", 404);

        return folder;
    };

    async toPrepareCreate(data: PrepareFolderInput) {
        const existingFolder = await this.FoldersRepository.getByName(data.name);

        if (existingFolder) throw new AppError("Já existe uma pasta com esse nome.", 409);

        const folderId = randomUUID();
        const slug = this.generateFolderSlug(data.name);
        const folderPath = `${this.MAIN_FOLDER_NAME}/${folderId}/`;

        return FolderMapper.toCreate(data, slug, folderPath, folderId);
    };

    async toPrepareUpdate(folderId: string, data: PrepareFolderInput) {

        if (data.name !== undefined) {
            const duplicateFolder = await this.FoldersRepository.getByNameExcludingId(data.name, folderId);

            if (duplicateFolder) throw new AppError("Já existe pasta com esse nome.", 409);
        };

        const slug = this.generateFolderSlug(data?.name!);

        return FolderMapper.toUpdate(data, slug);
    };

    private generateFolderSlug(name: string) {
        return slugify(name, {
            replacement: "-",
            lower: true,
            strict: true
        });
    };
};
