import { Request, Response } from "express";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import { IUser } from "../models/user.model";
import { IError } from "../utils/types";

export default class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password, role } = req.body;
    try {
      const isEmailUsed = await UserService.getUserByEmail(email);
      if (isEmailUsed) {
        throw new IError(401, "This Email already in use");
      }
      const user = await UserService.createUser({
        email,
        password,
        role,
      } as IUser);
      const token = AuthService.generateToken(user);
      res.status(201).json({ token, user });
    } catch (error: any) {
      res.status(error.status).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        throw new IError(404, "User does not exits");
      }

      const isAuth = await AuthService.comparePasswords(
        password,
        user?.password
      );
      if (!isAuth) {
        throw new IError(401, "Email or Password wrong");
      }

      const token = AuthService.generateToken(user);
      res.status(200).json({ token, user });
    } catch (error: any) {
      res.status(error.status).json({ error: error.message });
    }
  }
}
