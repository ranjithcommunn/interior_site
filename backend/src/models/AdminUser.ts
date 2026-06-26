import { Schema, model } from "mongoose";

export interface IAdminUser {
  email: string;
  passwordHash: string;
  name?: string;
  role: "owner" | "editor";
  isActive: boolean;
  lastLoginAt?: Date;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: ["owner", "editor"], default: "owner" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const AdminUser = model<IAdminUser>("AdminUser", adminUserSchema);
