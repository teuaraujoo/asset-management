import { Request, Response } from "express";
import PublicServices from "./public.services";

export default class PublicController {
    constructor(
        private PublicServices: PublicServices
    ) { }

    async getProjects(_req: Request, res: Response) {
        const result = await this.PublicServices.getProjects();

        return res.status(200).json({ data: result });
    };

    async getProjectBySlug(req: Request, res: Response) {
        const slug = req.params.slug as string;

        const result = await this.PublicServices.getProjectBySlug(slug);

        return res.status(200).json({ data: result });
    };
};