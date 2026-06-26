import { apiClient } from "./client";
import { Enquiry } from "./enquiries";

export interface DashboardStats {
  totalCategories: number;
  totalProducts: number;
  activeProducts: number;
  enquiries: {
    total: number;
    byStatus: { new: number; contacted: number; closed: number };
    bySource: { product_enquiry: number; contact_page: number };
  };
  recentEnquiries: Enquiry[];
}

export async function fetchDashboardStats() {
  const { data } = await apiClient.get<DashboardStats>("/admin/dashboard");
  return data;
}
