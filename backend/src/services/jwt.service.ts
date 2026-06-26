import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthenticatedAdmin } from "../types/express";

export function signAdminToken(admin: AuthenticatedAdmin): string {
  return jwt.sign(admin, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}
