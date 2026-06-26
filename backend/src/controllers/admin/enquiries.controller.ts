import { Request, Response } from "express";
import { z } from "zod";
import { Enquiry } from "../../models/Enquiry";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

export const listEnquiries = asyncHandler(async (req: Request, res: Response) => {
  const { search, source, status, page = "1", limit = "20" } = req.query;

  const filter: Record<string, unknown> = {};
  if (source) filter.source = source;
  if (status) filter.status = status;
  if (search) {
    const regex = { $regex: String(search), $options: "i" };
    filter.$or = [{ name: regex }, { phone: regex }, { email: regex }, { message: regex }];
  }

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Number(limit) || 20, 100);

  const [enquiries, total] = await Promise.all([
    Enquiry.find(filter)
      .populate("product", "title handle thumbnail")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Enquiry.countDocuments(filter),
  ]);

  res.json({ enquiries, total, page: pageNum, limit: limitNum });
});

const updateStatusSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]),
});

export const updateEnquiryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = updateStatusSchema.parse(req.body);

  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!enquiry) {
    throw new ApiError(404, "Enquiry not found");
  }
  res.json({ enquiry });
});
