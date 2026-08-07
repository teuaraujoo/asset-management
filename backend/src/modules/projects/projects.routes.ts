import express from "express";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import ProjectController from "./projects.controllers";
import { Limiters } from "../../libs/express-rate-limit";

const router = express.Router();

router.get(
    "/projects",
    authenticateMiddleware,
    ProjectController.get
);
router.get(
    "/projects/:id",
    authenticateMiddleware,
    ProjectController.getById
);

router.get(
    "/projects/:folderId/files",
    authenticateMiddleware,
    ProjectController.getFiles
)

// router.get("projects/:id/download");
router.post(
    "/projects",
    Limiters.generalCreateLimiter,
    authenticateMiddleware,
    ProjectController.create
);

router.patch(
    "/projects/:id",
    Limiters.generalCreateLimiter,
    authenticateMiddleware,
    ProjectController.update
);

router.delete(
    "/projects/:id",
    Limiters.generalCreateLimiter,
    authenticateMiddleware,
    ProjectController.delete
);

export default router;