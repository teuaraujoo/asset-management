import express from "express";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import FilesController from "./files.controllers";

const router = express.Router();

router.post(
    "/files/upload",
    authenticateMiddleware,
    FilesController.create
);

router.put(
    "/files/:id/complete", 
    authenticateMiddleware, 
    FilesController.complete
);

export default router;