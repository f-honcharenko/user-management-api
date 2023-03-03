import { Document, Model, model, Schema } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  BOSS = "boss",
  REGULAR = "regular",
}

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  boss?: IUser["_id"];
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  boss: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model<IUser>("User", userSchema);
