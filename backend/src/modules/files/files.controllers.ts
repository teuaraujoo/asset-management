import { Request, Response } from "express";
import { FilesService } from "./files.services";

export default class FilesController {

    constructor(
        private FilesService: FilesService
    ) { }

    async getByFolderId(req: Request, res: Response) {
        const folderId = req.params.folderId as string;
        const userId = req.user.sub;

        const result = await this.FilesService.getByFolderId(folderId, userId);

        return res.status(200).json({ message: "Arquivos encontrados com sucesso.", data: result });
    };

    async prepareUpload(req: Request, res: Response) {
        const body = req.body;
        const userId = req.user.sub;

        const result = await this.FilesService.prepareUpload(body, userId);

        return res.status(201).json({ message: "Arquivo armazenado com sucesso.", data: result })

    };

    async complete(req: Request, res: Response) {
        const id = req.params.id;
        const userId = req.user.sub;

        await this.FilesService.complete(id as string, userId);

        return res.status(200).json({ message: "Status atualizado com sucesso." });
    };

    async delete(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.sub;

        await this.FilesService.delete(id, userId)

        return res.status(200).json({
            message: "Arquivo deletado com sucesso."
        });
    };

    async rename(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.sub;
        const body = req.body;

        await this.FilesService.rename(id, userId, body);

        return res.status(200).json({
            message: "Arquivo renomeado com sucesso."
        });
    };

    async download(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.sub;

        const result = await this.FilesService.download(id, userId);

        return res.status(200).json({
            data: result
        });
    };

    async getPreview(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.sub;

        const result = await this.FilesService.getPreview(id, userId);

        return res.status(200).json({ data: result });
    };
};