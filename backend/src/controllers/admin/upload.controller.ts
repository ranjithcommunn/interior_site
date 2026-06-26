import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { generateUploadSignature } from "../../services/cloudinary.service";

export const getUploadSignature = asyncHandler(async (_req: Request, res: Response) => {
  res.json(generateUploadSignature());
});
