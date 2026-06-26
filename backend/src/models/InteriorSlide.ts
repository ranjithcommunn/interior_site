import { Schema, model } from "mongoose";

export interface IInteriorSlide {
  image: string;
  title: string;
  description: string;
  link?: string;
  rank: number;
  isActive: boolean;
}

const interiorSlideSchema = new Schema<IInteriorSlide>(
  {
    image: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    link: { type: String },
    rank: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

interiorSlideSchema.index({ isActive: 1, rank: 1 });

export const InteriorSlide = model<IInteriorSlide>("InteriorSlide", interiorSlideSchema);
