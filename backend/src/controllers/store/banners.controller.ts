import { Request, Response } from "express";
import { Banner } from "../../models/Banner";
import { asyncHandler } from "../../utils/asyncHandler";

export const listBanners = asyncHandler(async (_req: Request, res: Response) => {
  const banners = await Banner.find({ isActive: true }).sort({ rank: 1 });
  res.json({
    banners: banners.map((b) => ({
      id: String(b._id),
      image: b.image,
      link: b.link || null,
    })),
  });
});
