import express from "express";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import FilesController from "./files.controllers";
import { Limiters } from "../../libs/express-rate-limit";

const router = express.Router();

router.post(
    "/files/upload",
    Limiters.generalCreateLimiter,
    authenticateMiddleware,
    FilesController.create
);

router.put(
    "/files/:id/complete", 
    Limiters.generalCreateLimiter,
    authenticateMiddleware, 
    FilesController.complete
);

export default router;