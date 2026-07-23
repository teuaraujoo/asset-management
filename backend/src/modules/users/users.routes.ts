import express  from "express"
import { UserController } from "./users.controllers";
const router = express.Router();

router.post("/users", UserController.create);
router.get("/users/test", UserController.test);
export default router;