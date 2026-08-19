import { Response, Request } from "express";
import ProjectService from "./projects.services";

export default class ProjectController {

    static async get(req: Request, res: Response) {
        const userId = req.user.sub;

        const result = await ProjectService.get(userId);

        return res.status(200).json({ message: "Projetos encontrados com sucesso.", data: result });
    };

    static async getById(req: Request, res: Response) {

        const id = req.params.id;
        const userId = req.user.sub;

        const result = await ProjectService.getById(id as string, userId);

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
        const userId = req.user.sub;

        const result = await ProjectService.getFiles(folderId, userId);

        return res.status(200).json({ message: "Arquivos do projeto encontrados com sucesso.", data: result });
    };

    static async update(req: Request, res: Response) {
        const projectId = req.params.id as string;
        const userId = req.user.sub;
        const body = req.body;

        const result = await ProjectService.update(projectId, userId, body);

        return res.status(200).json({ message: "Projeto atualizado com sucesso", data: result });
    };

    static async delete(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.sub;

        await ProjectService.delete(id, userId);

        return res.status(200).json({ message: "Projeto excluído com sucesso." });
    };
};