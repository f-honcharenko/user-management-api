import { RequestHandler, Router } from "express";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware as unknown as RequestHandler,
  UserController.getUsers as unknown as RequestHandler
);
router.patch(
  "/:id/boss/",
  authMiddleware as unknown as RequestHandler,
  UserController.changeUserBoss as unknown as RequestHandler
);

export default router;
