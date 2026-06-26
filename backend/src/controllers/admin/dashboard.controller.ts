import { Request, Response } from "express";
import { Enquiry } from "../../models/Enquiry";
import { Product } from "../../models/Product";
import { Category } from "../../models/Category";
import { asyncHandler } from "../../utils/asyncHandler";

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalCategories,
    totalProducts,
    activeProducts,
    totalEnquiries,
    newCount,
    contactedCount,
    closedCount,
    productEnquiryCount,
    contactPageCount,
    recentEnquiries,
  ] = await Promise.all([
    Category.countDocuments(),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.countDocuments({ status: "contacted" }),
    Enquiry.countDocuments({ status: "closed" }),
    Enquiry.countDocuments({ source: "product_enquiry" }),
    Enquiry.countDocuments({ source: "contact_page" }),
    Enquiry.find().populate("product", "title").sort({ createdAt: -1 }).limit(5),
  ]);

  res.json({
    totalCategories,
    totalProducts,
    activeProducts,
    enquiries: {
      total: totalEnquiries,
      byStatus: { new: newCount, contacted: contactedCount, closed: closedCount },
      bySource: { product_enquiry: productEnquiryCount, contact_page: contactPageCount },
    },
    recentEnquiries,
  });
});
