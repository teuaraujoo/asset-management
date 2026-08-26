import { Router } from "express";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import ProjectsController from "./projects.controllers";
import {
    authenticatedReadLimiter,
    createProjectLimiter,
    projectMutationLimiter,
} from "../../libs/express-rate-limit";

export function ProjectsRoutes(controller: ProjectsController): Router {
    const router = Router();

    router.get(
        "/projects",
        authenticatedReadLimiter,
        authenticateMiddleware,
        (req, res) => controller.get(req, res)
    );

    router.get(
        "/projects/:id",
        authenticatedReadLimiter,
        authenticateMiddleware,
        (req, res) => controller.getById(req, res)
    );

    // router.get("projects/:id/download");

    router.post(
        "/projects",
        createProjectLimiter,
        authenticateMiddleware,
        (req, res) => controller.create(req, res)
    );

    router.patch(
        "/projects/:id",
        projectMutationLimiter,
        authenticateMiddleware,
        (req, res) => controller.update(req, res)
    );

    router.delete(
        "/projects/:id",
        projectMutationLimiter,
        authenticateMiddleware,
        (req, res) => controller.delete(req, res)
    );

    return router;
};
