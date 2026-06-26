import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

export function requireStoreApiKey(req: Request, res: Response, next: NextFunction): void {
  const key = req.header("x-publishable-api-key");
  if (!key || key !== env.storeApiKey) {
    res.status(401).json({ message: "Invalid or missing x-publishable-api-key" });
    return;
  }
  next();
}
