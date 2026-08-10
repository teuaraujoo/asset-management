import express from "express";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import FilesController from "./files.controllers";
import { Limiters } from "../../libs/express-rate-limit";

const router = express.Router();

router.post(
    "/files/upload-url",
    Limiters.generalCreateLimiter,
    authenticateMiddleware,
    FilesController.prepareUpload
);

router.put(
    "/files/:id/complete", 
    Limiters.generalCreateLimiter,
    authenticateMiddleware, 
    FilesController.complete
);

router.get(
    "/files/:folderId",
    authenticateMiddleware,
    FilesController.getByFolderId
);

export default router;