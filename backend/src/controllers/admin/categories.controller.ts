import { Request, Response } from "express";
import { z } from "zod";
import slugify from "slugify";
import { Category } from "../../models/Category";
import { Product } from "../../models/Product";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { serializeCategoryTree } from "../../utils/serializers";

const categoryInputSchema = z.object({
  name: z.string().trim().min(1),
  handle: z.string().trim().min(1).optional(),
  parentCategory: z.string().nullable().optional(),
  rank: z.number().optional(),
  isActive: z.boolean().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const listCategoriesAdmin = asyncHandler(async (req: Request, res: Response) => {
  if (req.query.tree === "true") {
    const categories = await Category.find();
    res.json({ categories: serializeCategoryTree(categories, null) });
    return;
  }
  const categories = await Category.find().sort({ rank: 1 });
  res.json({ categories });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = categoryInputSchema.parse(req.body);
  const handle = data.handle ? slugify(data.handle, { lower: true }) : slugify(data.name, { lower: true });

  const category = await Category.create({
    name: data.name,
    handle,
    parentCategory: data.parentCategory || null,
    rank: data.rank ?? 0,
    isActive: data.isActive ?? true,
    description: data.description,
    image: data.image,
  });

  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = categoryInputSchema.partial().parse(req.body);
  const update: Record<string, unknown> = { ...data };

  if (data.handle) {
    update.handle = slugify(data.handle, { lower: true });
  }
  if (data.parentCategory !== undefined) {
    update.parentCategory = data.parentCategory || null;
  }

  const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  res.json({ category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const [childCount, productCount] = await Promise.all([
    Category.countDocuments({ parentCategory: req.params.id }),
    Product.countDocuments({ category: req.params.id }),
  ]);

  if (childCount > 0 || productCount > 0) {
    throw new ApiError(
      409,
      `Cannot delete: category has ${childCount} subcategories and ${productCount} products. Move or delete those first.`
    );
  }

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  res.json({ success: true });
});

const reorderSchema = z.object({
  updates: z.array(z.object({ id: z.string(), rank: z.number() })),
});

export const reorderCategories = asyncHandler(async (req: Request, res: Response) => {
  const { updates } = reorderSchema.parse(req.body);

  await Promise.all(
    updates.map(({ id, rank }) => Category.findByIdAndUpdate(id, { rank }))
  );

  res.json({ success: true });
});
