import { Request, Response } from "express";
import FilesServices from "./files.services";

export default class FilesController {

    static async getByFolderId(req: Request, res: Response) {
        const folderId = req.params.folderId as string;
        const userId = req.user.sub;

        const result = await FilesServices.getByFolderId(folderId, userId);

        return res.status(200).json({ message: "Arquivos encontrados com sucesso.", data: result });
    };

    static async prepareUpload(req: Request, res: Response) {
        const body = req.body;
        const userId = req.user.sub;

        const result = await FilesServices.prepareUpload(body, userId);

        return res.status(201).json({ message: "Arquivo armazenado com sucesso.", data: result })

    };

    static async complete(req: Request, res: Response) {
        const id = req.params.id;
        const userId = req.user.sub;

        await FilesServices.complete(id as string, userId);

        return res.status(200).json({ message: "Status atualizado com sucesso." });
    };

    static async delete(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.sub;

        await FilesServices.delete(id, userId)

        return res.status(200).json({ 
            message: "Arquivo deletado com sucesso."
         });
    };
};