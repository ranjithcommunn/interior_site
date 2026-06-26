import { ICategory } from "../models/Category";
import { IProduct } from "../models/Product";
import { HydratedDocument } from "mongoose";

type CategoryDoc = HydratedDocument<ICategory>;
type ProductDoc = HydratedDocument<IProduct>;

export interface SerializedCategory {
  id: string;
  name: string;
  handle: string | null;
  parent_category_id: string | null;
  category_children: SerializedCategory[];
}

export function serializeCategoryTree(
  categories: CategoryDoc[],
  parentId: string | null = null
): SerializedCategory[] {
  return categories
    .filter((cat) => String(cat.parentCategory ?? null) === String(parentId))
    .sort((a, b) => a.rank - b.rank)
    .map((cat) => ({
      id: String(cat._id),
      name: cat.name,
      handle: cat.handle,
      parent_category_id: cat.parentCategory ? String(cat.parentCategory) : null,
      category_children: serializeCategoryTree(categories, String(cat._id)),
    }));
}

export function serializeProduct(product: ProductDoc) {
  const categoryDoc = product.category as unknown as
    | (CategoryDoc & { parentCategory?: CategoryDoc | null })
    | null
    | undefined;
  const isPopulated = !!categoryDoc && typeof categoryDoc === "object" && "name" in categoryDoc;

  return {
    id: String(product._id),
    title: product.title,
    description: product.description,
    handle: product.handle,
    thumbnail: product.thumbnail,
    collection_id: null,
    category_id: isPopulated ? String(categoryDoc!._id) : String(product.category),
    category: isPopulated
      ? {
          id: String(categoryDoc!._id),
          name: categoryDoc!.name,
          handle: categoryDoc!.handle,
          parent:
            categoryDoc!.parentCategory && typeof categoryDoc!.parentCategory === "object"
              ? {
                  id: String((categoryDoc!.parentCategory as CategoryDoc)._id),
                  name: (categoryDoc!.parentCategory as CategoryDoc).name,
                  handle: (categoryDoc!.parentCategory as CategoryDoc).handle,
                }
              : null,
        }
      : null,
    images: product.images
      .slice()
      .sort((a, b) => a.rank - b.rank)
      .map((img) => ({ url: img.url, rank: img.rank })),
  };
}
