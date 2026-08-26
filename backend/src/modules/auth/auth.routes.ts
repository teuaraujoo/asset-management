import express from "express";
import AuthController from "./auth.controllers";
import refreshTokenMiddleware from "../../middlewares/refresh-token.middleware";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import {
    authenticatedReadLimiter,
    loginLimiter,
    refreshTokenLimiter,
    sessionMutationLimiter,
} from "../../libs/express-rate-limit";

const router = express.Router();

router.post(
    "/auth/login",
    loginLimiter,
    AuthController.login
);
router.post("/auth/logout",
    refreshTokenMiddleware,
    sessionMutationLimiter,
    AuthController.logout
);
router.post(
    "/auth/refresh",
    refreshTokenMiddleware,
    refreshTokenLimiter,
    AuthController.refresh
);
router.get(
    "/auth/me",
    authenticateMiddleware,
    authenticatedReadLimiter,
    AuthController.me
);

export default router;
