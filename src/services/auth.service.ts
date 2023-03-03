import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUser } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

export default class AuthService {
  static generateToken = (user: IUser): string => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
  };
  static decodeToken = (token: string): IUser => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded as IUser;
    } catch (error) {
      throw new Error("Invalid token");
    }
  };

  static hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  };

  static comparePasswords = async (
    plaintextPassword: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return bcrypt.compare(plaintextPassword, hashedPassword);
  };
}
