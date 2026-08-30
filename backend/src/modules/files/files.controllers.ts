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

        req.log.info({
            event: "file.upload_prepared",
            folderId: body.folder_id,
            userId,
        }, "File upload prepared");

        return res.status(201).json({ message: "Arquivo armazenado com sucesso.", data: result })

    };

    async complete(req: Request, res: Response) {
        const id = req.params.id;
        const userId = req.user.sub;

        await this.FilesService.complete(id as string, userId);

        req.log.info({
            event: "file.upload_completed",
            fileId: id,
            userId,
        }, "File upload completed");

        return res.status(200).json({ message: "Status atualizado com sucesso." });
    };

    async delete(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.sub;

        await this.FilesService.delete(id, userId)

        req.log.info({
            event: "file.deleted",
            fileId: id,
            userId,
        }, "File deleted");

        return res.status(200).json({
            message: "Arquivo deletado com sucesso."
        });
    };

    async rename(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.sub;
        const body = req.body;

        await this.FilesService.rename(id, userId, body);

        req.log.info({
            event: "file.renamed",
            fileId: id,
            userId,
        }, "File renamed");

        return res.status(200).json({
            message: "Arquivo renomeado com sucesso."
        });
    };

    async download(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.sub;

        const result = await this.FilesService.download(id, userId);

        req.log.info({
            event: "file.download_url_generated",
            fileId: id,
            userId,
        }, "File download URL generated");

        return res.status(200).json({
            data: result
        });
    };

    async getPreview(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.sub;

        const result = await this.FilesService.getPreview(id, userId);

        req.log.info({
            event: "file.thumbnaiel_generated",
            fileId: id,
            userId,
        }, "File thumbnail URL generated");

        return res.status(200).json({ data: result });
    };
};
