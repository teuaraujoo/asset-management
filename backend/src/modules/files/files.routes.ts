import express from "express";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import FilesController from "./files.controllers";
import { uploadFileLimiter } from "../../libs/express-rate-limit";

const router = express.Router();

router.get(
    "/files/:id/download",
    authenticateMiddleware,
    FilesController.download
);

router.get(
    "/files/:folderId",
    authenticateMiddleware,
    FilesController.getByFolderId
);


router.post(
    "/files/upload-url",
    uploadFileLimiter,
    authenticateMiddleware,
    FilesController.prepareUpload
);

router.put(
    "/files/:id/complete",
    uploadFileLimiter,
    authenticateMiddleware,
    FilesController.complete
);

router.delete(
    "/files/:id",
    authenticateMiddleware,
    FilesController.delete
);

router.patch(
    "/files/:id",
    authenticateMiddleware,
    FilesController.rename
);

export default router;