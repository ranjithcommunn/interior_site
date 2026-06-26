import { apiClient } from "./client";

export interface Category {
  _id: string;
  name: string;
  handle: string;
  parentCategory: string | null;
  rank: number;
  isActive: boolean;
  description?: string;
  image?: string;
}

export async function fetchCategories() {
  const { data } = await apiClient.get<{ categories: Category[] }>("/admin/categories");
  return data.categories;
}

export interface CategoryInput {
  name: string;
  handle?: string;
  parentCategory?: string | null;
  rank?: number;
  isActive?: boolean;
  description?: string;
  image?: string;
}

export async function createCategory(input: CategoryInput) {
  const { data } = await apiClient.post<{ category: Category }>("/admin/categories", input);
  return data.category;
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  const { data } = await apiClient.put<{ category: Category }>(`/admin/categories/${id}`, input);
  return data.category;
}

export async function deleteCategory(id: string) {
  await apiClient.delete(`/admin/categories/${id}`);
}

export async function reorderCategories(updates: { id: string; rank: number }[]) {
  await apiClient.put("/admin/categories/reorder", { updates });
}
