import { apiClient } from "./client";

export interface AdminProfile {
  id: string;
  email: string;
  name?: string;
  role: "owner" | "editor";
}

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<{ token: string; admin: AdminProfile }>(
    "/admin/auth/login",
    { email, password }
  );
  return data;
}

export async function me() {
  const { data } = await apiClient.get<{ admin: AdminProfile }>("/admin/auth/me");
  return data.admin;
}
