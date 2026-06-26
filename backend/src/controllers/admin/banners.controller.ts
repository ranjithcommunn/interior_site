import { Request, Response } from "express";
import { z } from "zod";
import { Banner } from "../../models/Banner";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

export const listBannersAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const banners = await Banner.find().sort({ rank: 1 });
  res.json({ banners });
});

const bannerInputSchema = z.object({
  image: z.string().min(1),
  link: z.string().optional(),
  rank: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const data = bannerInputSchema.parse(req.body);
  const maxRank = await Banner.countDocuments();

  const banner = await Banner.create({
    image: data.image,
    link: data.link,
    rank: data.rank ?? maxRank,
    isActive: data.isActive ?? true,
  });

  res.status(201).json({ banner });
});

export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const data = bannerInputSchema.partial().parse(req.body);

  const banner = await Banner.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }
  res.json({ banner });
});

export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }
  res.json({ success: true });
});

const reorderSchema = z.object({
  updates: z.array(z.object({ id: z.string(), rank: z.number() })),
});

export const reorderBanners = asyncHandler(async (req: Request, res: Response) => {
  const { updates } = reorderSchema.parse(req.body);
  await Promise.all(updates.map(({ id, rank }) => Banner.findByIdAndUpdate(id, { rank })));
  res.json({ success: true });
});
