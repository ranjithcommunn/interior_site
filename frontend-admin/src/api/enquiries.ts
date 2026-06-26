import { apiClient } from "./client";

export interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: "product_enquiry" | "contact_page";
  product: { _id: string; title: string; handle: string; thumbnail: string } | null;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export interface EnquiryListParams {
  search?: string;
  source?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function fetchEnquiries(params: EnquiryListParams = {}) {
  const { data } = await apiClient.get<{
    enquiries: Enquiry[];
    total: number;
    page: number;
    limit: number;
  }>("/admin/enquiries", { params });
  return data;
}

export async function updateEnquiryStatus(id: string, status: Enquiry["status"]) {
  const { data } = await apiClient.put<{ enquiry: Enquiry }>(`/admin/enquiries/${id}`, { status });
  return data.enquiry;
}
