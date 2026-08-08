import { Response, Request } from "express";
import ProjectService from "./projects.services";

export default class ProjectController {

    static async get(_req: Request, res: Response) {

        const result = await ProjectService.get();

        return res.status(200).json({ message: "Projetos encontrados com sucesso.", data: result });
    };

    static async getById(req: Request, res: Response) {

        const id = req.params.id;

        const result = await ProjectService.getById(id as string);

        return res.status(200).json({ message: "Projeto encontrado com sucesso.", data: result });
    };

    static async create(req: Request, res: Response) {
        const body = await req.body;
        const userId = req.user.sub;

        const result = await ProjectService.create(body, userId);

        return res.status(201).json({ message: "Projeto criado com sucesso.", data: result });
    };

    static async getFiles(req: Request, res: Response) {
        const folderId = req.params.folderId as string;

        const result = await ProjectService.getFiles(folderId);

        return res.status(200).json({ message: "Arquivos do projeto encontrados com sucesso.", data: result });
    };

    static async update(req: Request, res: Response) {

    };

    static async delete(req: Request, res: Response) {
        const id = req.params.id as string;

        await ProjectService.delete(id);

        return res.status(200).json({ message: "Projeto excluído com sucesso." });
    };
};