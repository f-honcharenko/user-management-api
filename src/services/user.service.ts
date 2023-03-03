import { ProjectionType, ToObjectOptions, Types } from "mongoose";

import UserModel, { IUser, UserRole } from "../models/user.model";
import AuthService from "./auth.service";
import { IError } from "../utils/types";

export default class UserService {
  static createUser = async (user: IUser): Promise<IUser> => {
    // if (user.role != UserRole.ADMIN && !user.boss) {
    //   throw new Error(
    //     "Every user except the administrator should have a boss."
    //   );
    // }
    user.password = await AuthService.hashPassword(user.password);
    user = new UserModel(user);

    return (await user.save()).toObject();
  };
  static getUserById = async (
    userId: string,
    projection?: ProjectionType<IUser>
  ): Promise<IUser> => {
    const user = await UserModel.findById(userId, projection);
    if (!user) {
      throw new IError(404, "User does not exist");
    }
    return user.toObject();
  };
  static getUserByEmail = async (
    email: string,
    projection?: ProjectionType<IUser>
  ): Promise<IUser | null> => {
    const user = await UserModel.findOne({ email }, projection);
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
      {
        new: true,
        select: {
          _id: true,
          email: true,
          role: true,
          boss: true,
        },
      }
    );
  };
  static getUsers = async (
    userId: string,

    projection?: ProjectionType<IUser>
  ): Promise<IUser[]> => {
    const user = await UserModel.findById(userId, projection);
    if (!user) {
      throw new IError(404, "User does not exist");
    }

    if (user.role === UserRole.ADMIN) {
      const users = await UserModel.find({}, projection);
      return users.map((user) => user.toObject());
    }

    if (user.role === UserRole.BOSS) {
      const subordinates = await UserModel.find({ boss: user._id }, projection);
      const subordinateObjects = await Promise.all(
        subordinates.map(async (subordinate) => {
          const recursiveSubordinates = await getRecursiveSubordinates(
            subordinate._id,
            projection
          );
          return [
            subordinate.toObject(projection as ToObjectOptions),
            ...recursiveSubordinates,
          ];
        })
      );
      const list = subordinateObjects.flat();
      list.push(user);
      return list;
    }

    return [user.toObject(projection as ToObjectOptions)];
  };
}

const getRecursiveSubordinates = async (
  userId: string,
  projection: any
): Promise<IUser[]> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new IError(404, "User does not exist");
  }

  const subordinates = await UserModel.find({ boss: user._id }, projection);
  if (!subordinates.length) {
    return [];
  }

  const subordinateObjects = await Promise.all(
    subordinates.map(async (subordinateObject) => {
      const recursiveSubordinates = await getRecursiveSubordinates(
        subordinateObject._id,
        projection
      );
      return [subordinateObject.toObject(projection), ...recursiveSubordinates];
    })
  );

  return subordinateObjects.flat();
};
