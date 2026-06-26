import { apiClient } from "./client";
import { Category } from "./categories";

export interface ProductImage {
  url: string;
  rank: number;
}

export interface ProductCategory extends Omit<Category, "parentCategory"> {
  parentCategory: { _id: string; name: string; handle: string } | string | null;
}

export interface Product {
  _id: string;
  title: string;
  handle: string;
  description: string;
  category: ProductCategory | string;
  images: ProductImage[];
  thumbnail: string;
  isActive: boolean;
  isFeatured: boolean;
  rank: number;
  price?: number;
  updatedAt: string;
}

export interface ProductListParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export async function fetchProducts(params: ProductListParams = {}) {
  const { data } = await apiClient.get<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }>("/admin/products", { params });
  return data;
}

export async function fetchProduct(id: string) {
  const { data } = await apiClient.get<{ product: Product }>(`/admin/products/${id}`);
  return data.product;
}

export interface ProductInput {
  title: string;
  handle?: string;
  description?: string;
  category: string;
  images: ProductImage[];
  isActive?: boolean;
  isFeatured?: boolean;
  rank?: number;
  price?: number;
}

export async function createProduct(input: ProductInput) {
  const { data } = await apiClient.post<{ product: Product }>("/admin/products", input);
  return data.product;
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const { data } = await apiClient.put<{ product: Product }>(`/admin/products/${id}`, input);
  return data.product;
}

export async function deleteProduct(id: string) {
  await apiClient.delete(`/admin/products/${id}`);
}
