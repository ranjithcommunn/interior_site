import { Request, Response } from "express";
import { z } from "zod";
import { InteriorSlide } from "../../models/InteriorSlide";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

export const listInteriorSlidesAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const slides = await InteriorSlide.find().sort({ rank: 1 });
  res.json({ slides });
});

const slideInputSchema = z.object({
  image: z.string().min(1),
  title: z.string().trim().min(1),
  description: z.string().optional().default(""),
  link: z.string().optional(),
  rank: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const createInteriorSlide = asyncHandler(async (req: Request, res: Response) => {
  const data = slideInputSchema.parse(req.body);
  const maxRank = await InteriorSlide.countDocuments();

  const slide = await InteriorSlide.create({
    image: data.image,
    title: data.title,
    description: data.description,
    link: data.link,
    rank: data.rank ?? maxRank,
    isActive: data.isActive ?? true,
  });

  res.status(201).json({ slide });
});

export const updateInteriorSlide = asyncHandler(async (req: Request, res: Response) => {
  const data = slideInputSchema.partial().parse(req.body);

  const slide = await InteriorSlide.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!slide) {
    throw new ApiError(404, "Slide not found");
  }
  res.json({ slide });
});

export const deleteInteriorSlide = asyncHandler(async (req: Request, res: Response) => {
  const slide = await InteriorSlide.findByIdAndDelete(req.params.id);
  if (!slide) {
    throw new ApiError(404, "Slide not found");
  }
  res.json({ success: true });
});

const reorderSchema = z.object({
  updates: z.array(z.object({ id: z.string(), rank: z.number() })),
});

export const reorderInteriorSlides = asyncHandler(async (req: Request, res: Response) => {
  const { updates } = reorderSchema.parse(req.body);
  await Promise.all(updates.map(({ id, rank }) => InteriorSlide.findByIdAndUpdate(id, { rank })));
  res.json({ success: true });
});
