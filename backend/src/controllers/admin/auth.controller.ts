import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AdminUser } from "../../models/AdminUser";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { signAdminToken } from "../../services/jwt.service";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const admin = await AdminUser.findOne({ email, isActive: true });
  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signAdminToken({ id: String(admin._id), email: admin.email, role: admin.role });

  res.json({
    token,
    admin: { id: String(admin._id), email: admin.email, name: admin.name, role: admin.role },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.admin) {
    throw new ApiError(401, "Not authenticated");
  }
  const admin = await AdminUser.findById(req.admin.id);
  if (!admin) {
    throw new ApiError(401, "Not authenticated");
  }
  res.json({ admin: { id: String(admin._id), email: admin.email, name: admin.name, role: admin.role } });
});
