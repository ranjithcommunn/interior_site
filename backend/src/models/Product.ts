import { Schema, model, Types } from "mongoose";

export interface IProductImage {
  url: string;
  rank: number;
}

export interface IProduct {
  title: string;
  handle: string;
  description: string;
  category: Types.ObjectId;
  images: IProductImage[];
  thumbnail: string;
  isActive: boolean;
  isFeatured: boolean;
  rank: number;
  price?: number;
}

const productImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    rank: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    handle: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    images: { type: [productImageSchema], default: [] },
    thumbnail: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    rank: { type: Number, default: 0 },
    price: { type: Number },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, rank: 1 });
productSchema.index({ isFeatured: 1, rank: 1 });

export const Product = model<IProduct>("Product", productSchema);
