import { Request, Response } from "express";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import { IUser } from "../models/user.model";

export default class UserController {
  static async getUsers(req: Request, res: Response) {
    //@ts-ignore
    const { _id } = req.user;
    try {
      const list = await UserService.getUsers(_id);
      res.status(201).json({ list });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  static async changeUserBoss(req: Request, res: Response) {
    //@ts-ignore
    res.status(200).json({ msg: `ok, ${req.user.email}` });
  }
}
