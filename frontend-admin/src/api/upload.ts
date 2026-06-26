import axios from "axios";
import { apiClient } from "./client";

interface UploadSignature {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export async function uploadImage(file: File): Promise<string> {
  const { data: sig } = await apiClient.post<UploadSignature>("/admin/upload/signature");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("signature", sig.signature);
  formData.append("folder", sig.folder);

  const { data } = await axios.post<{ secure_url: string }>(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    formData
  );

  return data.secure_url;
}
