import { apiClient } from "./client";

export interface InteriorSlide {
  _id: string;
  image: string;
  title: string;
  description: string;
  link?: string;
  rank: number;
  isActive: boolean;
}

export async function fetchInteriorSlides() {
  const { data } = await apiClient.get<{ slides: InteriorSlide[] }>("/admin/interior-slides");
  return data.slides;
}

export interface InteriorSlideInput {
  image: string;
  title: string;
  description?: string;
  link?: string;
  rank?: number;
  isActive?: boolean;
}

export async function createInteriorSlide(input: InteriorSlideInput) {
  const { data } = await apiClient.post<{ slide: InteriorSlide }>("/admin/interior-slides", input);
  return data.slide;
}

export async function updateInteriorSlide(id: string, input: Partial<InteriorSlideInput>) {
  const { data } = await apiClient.put<{ slide: InteriorSlide }>(
    `/admin/interior-slides/${id}`,
    input
  );
  return data.slide;
}

export async function deleteInteriorSlide(id: string) {
  await apiClient.delete(`/admin/interior-slides/${id}`);
}

export async function reorderInteriorSlides(updates: { id: string; rank: number }[]) {
  await apiClient.put("/admin/interior-slides/reorder", { updates });
}
