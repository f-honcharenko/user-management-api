import { Types } from "mongoose";

import UserModel, { IUser, UserRole } from "../models/user.model";
import AuthService from "./auth.service";

export default class UserService {
  static createUser = async (user: IUser): Promise<IUser> => {
    user.password = await AuthService.hashPassword(user.password);
    user = new UserModel(user);

    return (await user.save()).toObject();
  };
  static getUserById = async (userId: string): Promise<IUser> => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User does not exist");
    }
    return user.toObject();
  };
  static getUserByEmail = async (email: string): Promise<IUser | null> => {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return null;
    }
    return user.toObject();
  };
  static updateBoss = async (
    userId: string,
    newBossId: string
  ): Promise<IUser | null> => {
    return UserModel.findByIdAndUpdate(
      userId,
      { boss: new Types.ObjectId(newBossId) },
      { new: true }
    );
  };
  static getUsers = async (userId: string): Promise<IUser[]> => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    if (user.role === UserRole.ADMIN) {
      const users = await UserModel.find();
      return users.map((user) => user.toObject());
    }
    if (user.role === UserRole.BOSS) {
      const subordinates = await UserModel.find({ boss: user._id });
      const subordinateObjects = await Promise.all(
        subordinates.map(async (subordinate) => {
          const recursiveSubordinates = await getRecursiveSubordinates(
            subordinate._id
          );
          return [subordinate.toObject(), ...recursiveSubordinates];
        })
      );
      return subordinateObjects.flat();
    }
    return [user.toObject()];
  };
}

const getRecursiveSubordinates = async (userId: string): Promise<IUser[]> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User does not exist");
  }

  const subordinates = await UserModel.find({ boss: user._id });
  if (!subordinates.length) {
    return [];
  }

  const subordinateObjects = await Promise.all(
    subordinates.map(async (subordinateObject) => {
      const recursiveSubordinates = await getRecursiveSubordinates(
        subordinateObject._id
      );
      const subordinate = await UserModel.findById(subordinateObject._id);
      return [subordinateObject.toObject(), ...recursiveSubordinates];
    })
  );
  return subordinateObjects.flat();
};
