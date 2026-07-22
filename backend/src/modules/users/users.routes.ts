import express  from "express"
import { UserController } from "./users.controllers";
const router = express.Router();

router.post("/", UserController.create);
export default router;