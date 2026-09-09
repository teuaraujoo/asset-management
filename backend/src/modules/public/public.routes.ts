import { Router } from "express";
import PublicController from "./public.controller";


export function PublicRoutes(controller: PublicController) {
    const router = Router();

    router.get(
        "/public/projects",
        (req, res) => controller.getProjects(req, res),
    );
    router.get(
        "/public/projects/:slug",
        (req, res) => controller.getProjectBySlug(req, res),
    );

    return router;
};