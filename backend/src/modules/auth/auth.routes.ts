import express from "express";
import AuthController from "./auth.controllers";
import refreshTokenMiddleware from "../../middlewares/refresh-token.middleware";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import { loginLimiter } from "../../libs/express-rate-limit";

const router = express.Router();

router.post("/auth/login", loginLimiter, AuthController.login);
router.post("/auth/logout", refreshTokenMiddleware, AuthController.logout);
router.post("/auth/refresh", refreshTokenMiddleware, AuthController.refresh);
router.get("/auth/me", authenticateMiddleware, AuthController.me)

export default router;