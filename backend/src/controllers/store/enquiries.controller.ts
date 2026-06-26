import { Request, Response } from "express";
import { z } from "zod";
import { Types } from "mongoose";
import { Enquiry } from "../../models/Enquiry";
import { asyncHandler } from "../../utils/asyncHandler";

const createEnquirySchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.string().trim().email(),
  message: z.string().trim().optional().default(""),
  source: z.enum(["product_enquiry", "contact_page"]),
  product_id: z.string().optional(),
});

export const createEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const data = createEnquirySchema.parse(req.body);

  await Enquiry.create({
    name: data.name,
    phone: data.phone,
    email: data.email,
    message: data.message,
    source: data.source,
    product: data.product_id && Types.ObjectId.isValid(data.product_id) ? data.product_id : null,
  });

  res.status(201).json({ success: true });
});
