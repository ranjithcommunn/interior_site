import { apiClient } from "./client";

export interface Banner {
  _id: string;
  image: string;
  link?: string;
  rank: number;
  isActive: boolean;
}

export async function fetchBanners() {
  const { data } = await apiClient.get<{ banners: Banner[] }>("/admin/banners");
  return data.banners;
}

export interface BannerInput {
  image: string;
  link?: string;
  rank?: number;
  isActive?: boolean;
}

export async function createBanner(input: BannerInput) {
  const { data } = await apiClient.post<{ banner: Banner }>("/admin/banners", input);
  return data.banner;
}

export async function updateBanner(id: string, input: Partial<BannerInput>) {
  const { data } = await apiClient.put<{ banner: Banner }>(`/admin/banners/${id}`, input);
  return data.banner;
}

export async function deleteBanner(id: string) {
  await apiClient.delete(`/admin/banners/${id}`);
}

export async function reorderBanners(updates: { id: string; rank: number }[]) {
  await apiClient.put("/admin/banners/reorder", { updates });
}
