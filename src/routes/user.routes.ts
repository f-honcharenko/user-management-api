import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, UserController.getUsers);
router.patch("/:id/boss/", authMiddleware, UserController.changeUserBoss);

export default router;
