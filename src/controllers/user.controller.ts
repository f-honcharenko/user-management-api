import { Response } from "express";
import { IError, IRequest } from "../utils/types";

import UserService from "../services/user.service";
import { UserRole } from "../models/user.model";

export default class UserController {
  static async getUsers(req: IRequest, res: Response) {
    const { _id } = req.user;
    try {
      const list = await UserService.getUsers(_id, {
        _id: 1,
        email: 1,
        boss: 1,
        role: 1,
      });
      res.status(200).json({ list });
    } catch (error: any) {
      res.status(error.status).json({ error: error.message });
    }
  }
  static async changeUserBoss(req: IRequest, res: Response) {
    const { role, _id } = req.user;
    const newBossID = req.body.newBossID;
    const subordinateID = req.params.id;
    try {
      if (!newBossID && subordinateID) {
        throw new IError(400, "Not enough input parameters");
      }
      if (role != UserRole.ADMIN && role != UserRole.BOSS) {
        throw new IError(403, "You don't have permission");
      }
      const subordinateList = (await UserService.getUsers(_id, { _id: 1 })).map(
        (obj) => obj._id.toString()
      );

      const isInList = subordinateList.includes(subordinateID);
      if (!isInList) {
        throw new IError(
          403,
          "You cannot change subordinates who do not belong to you."
        );
      }
      const user = await UserService.updateBoss(subordinateID, newBossID);
      res.status(200).json({
        user,
      });
    } catch (error: any) {
      res.status(error.status).json({ error: error.message });
    }
  }
}
