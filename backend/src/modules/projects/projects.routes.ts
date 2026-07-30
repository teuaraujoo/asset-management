import express from "express";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import ProjectController from "./projects.controllers";
import { ProjectLimiters } from "../../libs/express-rate-limit";

const router = express.Router();

router.get(
    "/projects",
    // authenticateMiddleware,
    ProjectController.get
);
router.get(
    "projects/:id",
    // authenticateMiddleware,
    ProjectController.getById
);
// router.get("projects/:id/download");
router.post(
    "/projects",
    ProjectLimiters.createProjectLimiter,
    // authenticateMiddleware,
    ProjectController.create
);
// router.patch("/projects/:id");
// router.delete("/projects/:id")

export default router;