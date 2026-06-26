import { Request, Response } from "express";
import { z } from "zod";
import slugify from "slugify";
import { Product } from "../../models/Product";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

const imageSchema = z.object({ url: z.string(), rank: z.number().default(0) });

const productInputSchema = z.object({
  title: z.string().trim().min(1),
  handle: z.string().trim().min(1).optional(),
  description: z.string().optional().default(""),
  category: z.string().min(1),
  images: z.array(imageSchema).default([]),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  rank: z.number().optional(),
  price: z.number().optional(),
});

function deriveThumbnail(images: { url: string; rank: number }[]): string {
  const sorted = [...images].sort((a, b) => a.rank - b.rank);
  return sorted[0]?.url || "";
}

export const listProductsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { search, category, page = "1", limit = "20" } = req.query;

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.title = { $regex: String(search), $options: "i" };
  }
  if (category) {
    filter.category = category;
  }

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Number(limit) || 20, 100);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name handle")
      .sort({ updatedAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({ products, total, page: pageNum, limit: limitNum });
});

export const getProductAdmin = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate("category", "name handle");
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.json({ product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = productInputSchema.parse(req.body);
  const handle = data.handle ? slugify(data.handle, { lower: true }) : slugify(data.title, { lower: true });

  const product = await Product.create({
    title: data.title,
    handle,
    description: data.description,
    category: data.category,
    images: data.images,
    thumbnail: deriveThumbnail(data.images),
    isActive: data.isActive ?? true,
    isFeatured: data.isFeatured ?? false,
    rank: data.rank ?? 0,
    price: data.price,
  });

  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = productInputSchema.partial().parse(req.body);
  const update: Record<string, unknown> = { ...data };

  if (data.handle) {
    update.handle = slugify(data.handle, { lower: true });
  }
  if (data.images) {
    update.thumbnail = deriveThumbnail(data.images);
  }

  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.json({ success: true });
});
