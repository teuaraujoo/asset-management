import { Response, Request } from "express";
import { ProjectsService } from "./projects.services";

export default class ProjectsController {

    constructor(
        private ProjectsService: ProjectsService
    ) { }

    async get(req: Request, res: Response) {
        const userId = req.user.sub;

        const result = await this.ProjectsService.get(userId);

        return res.status(200).json({ message: "Projetos encontrados com sucesso.", data: result });
    };

    async getById(req: Request, res: Response) {

        const id = req.params.id;
        const userId = req.user.sub;

        const result = await this.ProjectsService.getById(id as string, userId);

        return res.status(200).json({ message: "Projeto encontrado com sucesso.", data: result });
    };

    async create(req: Request, res: Response) {
        const body = await req.body;
        const userId = req.user.sub;

        await this.ProjectsService.create(body, userId);

        req.log.info({
            event: "project.created",
            userId,
        }, "Project created");

        return res.status(201).json({ message: "Projeto criado com sucesso." });
    };

    async update(req: Request, res: Response) {
        const projectId = req.params.id as string;
        const userId = req.user.sub;
        const body = req.body;

        const result = await this.ProjectsService.update(projectId, userId, body);

        req.log.info({
            event: "project.updated",
            projectId,
            userId,
        }, "Project updated");

        return res.status(200).json({ message: "Projeto atualizado com sucesso", data: result });
    };

    async delete(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.sub;

        await this.ProjectsService.delete(id, userId);

        req.log.info({
            event: "project.deleted",
            projectId: id,
            userId,
        }, "Project deleted");

        return res.status(200).json({ message: "Projeto excluído com sucesso." });
    };
};
