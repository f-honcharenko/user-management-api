import { Response, NextFunction } from "express";

import { IRequest } from "../utils/types";
import AuthService from "../services/auth.service";

export const authMiddleware = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  req.user = AuthService.decodeToken(token);
  next();
};
