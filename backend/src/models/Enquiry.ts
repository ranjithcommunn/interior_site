import { Schema, model, Types } from "mongoose";

export type EnquirySource = "product_enquiry" | "contact_page";
export type EnquiryStatus = "new" | "contacted" | "closed";

export interface IEnquiry {
  name: string;
  phone: string;
  email: string;
  message: string;
  source: EnquirySource;
  product: Types.ObjectId | null;
  status: EnquiryStatus;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, default: "" },
    source: { type: String, enum: ["product_enquiry", "contact_page"], required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", default: null },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ source: 1, createdAt: -1 });

export const Enquiry = model<IEnquiry>("Enquiry", enquirySchema);
