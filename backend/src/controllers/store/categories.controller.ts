import { Request, Response } from "express";
import { Category } from "../../models/Category";
import { asyncHandler } from "../../utils/asyncHandler";
import { serializeCategoryTree } from "../../utils/serializers";

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true }).lean(false);
  const tree = serializeCategoryTree(categories, null);
  res.json({ product_categories: tree });
});
