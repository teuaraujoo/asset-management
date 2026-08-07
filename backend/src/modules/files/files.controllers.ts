import { Request, Response } from "express";
import FilesServices from "./files.services";

export default class FilesController {
    static async create(req: Request, res: Response) {
        const body = req.body;

        const result = await FilesServices.create(body);

        return res.status(201).json({ message: "Arquivo armazenado com sucesso.", data: result })

    };

    static async complete(req: Request, res: Response) {
        const id = req.params.id;
        const body = await req.body;

        await FilesServices.complete(id as string, body);

        return res.status(200).json({ message: "Status atualizado com sucesso." });
    };
};