import { Router } from "express";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import FilesController from "./files.controllers";
import { uploadFileLimiter } from "../../libs/express-rate-limit";

export function FilesRoutes(controller: FilesController): Router {
    const router = Router();

    router.get(
        "/files/:id/download",
        authenticateMiddleware,
        (req, res) => controller.download(req, res)
    );

    router.get(
        "/files/:id/preview",
        authenticateMiddleware,
        (req, res) => controller.getPreview(req, res)
    );

    router.get(
        "/files/:folderId",
        authenticateMiddleware,
        (req, res) => controller.getByFolderId(req, res)
    );


    router.post(
        "/files/upload-url",
        uploadFileLimiter,
        authenticateMiddleware,
        (req, res) => controller.prepareUpload(req, res)
    );

    router.put(
        "/files/:id/complete",
        uploadFileLimiter,
        authenticateMiddleware,
        (req, res) => controller.complete(req, res)
    );

    router.delete(
        "/files/:id",
        authenticateMiddleware,
        (req, res) => controller.delete(req, res)
    );

    router.patch(
        "/files/:id",
        authenticateMiddleware,
        (req, res) => controller.rename(req, res)
    );

    return router;
};