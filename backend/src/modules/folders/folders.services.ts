import AppError from "../../error/app-error";
import FolderRepository from "./folders.repositories";

export class FolderService {
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
};