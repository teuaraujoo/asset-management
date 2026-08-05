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

        const result = await ProjectService.create(body);

        return res.status(201).json({ message: "Projeto criado com sucesso.", data: result });
    };

    static async getFiles(req: Request, res: Response) {

    };

    static async update(req: Request, res: Response) {

    };

    static async delete(_req: Request, res: Response) {

    };
};