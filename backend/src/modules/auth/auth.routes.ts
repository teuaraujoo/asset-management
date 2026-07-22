import express from "express";
import AuthController from "./auth.controllers";
import refreshTokenMiddleware from "../../middlewares/refresh-token.middleware";
import accessTokenMiddleware from "../../middlewares/access-token.middleware";
import { loginLimiter } from "../../libs/express-rate-limit";

const router = express.Router();

router.post("/login", loginLimiter, AuthController.login);
router.post("/logout", refreshTokenMiddleware, AuthController.logout);
router.post("/refresh", refreshTokenMiddleware, AuthController.refresh);

router.get("/test", AuthController.test);

export default router;