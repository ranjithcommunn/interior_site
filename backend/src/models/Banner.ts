import { Schema, model } from "mongoose";

export interface IBanner {
  image: string;
  link?: string;
  rank: number;
  isActive: boolean;
}

const bannerSchema = new Schema<IBanner>(
  {
    image: { type: String, required: true },
    link: { type: String },
    rank: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bannerSchema.index({ isActive: 1, rank: 1 });

export const Banner = model<IBanner>("Banner", bannerSchema);
