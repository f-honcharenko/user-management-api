import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthService from "../services/auth.service";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  //@ts-ignore
  req.user = AuthService.decodeToken(token);
  next();
};
