import { Request, Response } from "express";
import { Types } from "mongoose";
import { Product } from "../../models/Product";
import { Category } from "../../models/Category";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { serializeProduct } from "../../utils/serializers";

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const { category_id, limit, featured } = req.query;

  const filter: Record<string, unknown> = { isActive: true };
  if (category_id) {
    if (!Types.ObjectId.isValid(String(category_id))) {
      res.json({ products: [] });
      return;
    }
    // Products are assigned directly to sub-categories. When viewing a
    // top-level (or any parent) category, include products from all of
    // its child categories too, not just the parent's own id.
    const children = await Category.find({ parentCategory: category_id }).select("_id");
    const categoryIds = [category_id, ...children.map((c) => c._id)];
    filter.category = categoryIds.length > 1 ? { $in: categoryIds } : category_id;
  }
  if (featured === "true") {
    filter.isFeatured = true;
  }

  const parsedLimit = Math.min(Number(limit) || 100, 100);

  const products = await Product.find(filter)
    .sort({ rank: 1, createdAt: -1 })
    .limit(parsedLimit);

  res.json({ products: products.map(serializeProduct) });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(404, "Product not found");
  }
  const product = await Product.findOne({ _id: req.params.id, isActive: true }).populate({
    path: "category",
    select: "name handle parentCategory",
    populate: { path: "parentCategory", select: "name handle" },
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.json({ product: serializeProduct(product) });
});
