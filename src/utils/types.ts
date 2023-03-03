import { Request } from "express";
import { IUser } from "../models/user.model";

export interface IRequest extends Request {
  user: IUser;
}

export class IError extends Error {
  statusError: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusError = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
