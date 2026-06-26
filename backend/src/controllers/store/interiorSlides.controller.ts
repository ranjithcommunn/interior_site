import { Request, Response } from "express";
import { InteriorSlide } from "../../models/InteriorSlide";
import { asyncHandler } from "../../utils/asyncHandler";

export const listInteriorSlides = asyncHandler(async (_req: Request, res: Response) => {
  const slides = await InteriorSlide.find({ isActive: true }).sort({ rank: 1 });
  res.json({
    slides: slides.map((s) => ({
      id: String(s._id),
      image: s.image,
      title: s.title,
      description: s.description,
      link: s.link || null,
    })),
  });
});
