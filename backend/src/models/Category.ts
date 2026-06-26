import { Schema, model, Types } from "mongoose";

export interface ICategory {
  name: string;
  handle: string;
  parentCategory: Types.ObjectId | null;
  rank: number;
  isActive: boolean;
  description?: string;
  image?: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    handle: { type: String, required: true, unique: true, lowercase: true, trim: true },
    parentCategory: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    rank: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

categorySchema.index({ parentCategory: 1, rank: 1 });

export const Category = model<ICategory>("Category", categorySchema);
