import express  from "express"
import { UserController } from "./users.controller";
import authenticateMiddleware from "../../middlewares/authenticate.middleware";
import {
    authenticatedReadLimiter,
    userMutationLimiter,
} from "../../libs/express-rate-limit";
const router = express.Router();

// router.post("/users", UserController.create);

router.get(
    "/users/me",
    authenticateMiddleware,
    authenticatedReadLimiter,
    UserController.get,
);

router.patch(
    "/users/me",
    authenticateMiddleware,
    userMutationLimiter,
    UserController.update,
);

export default router;
