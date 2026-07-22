import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT || 9000),
  mongoUri: required("MONGO_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  storeApiKey: required("STORE_API_KEY"),
  adminCorsOrigins: (process.env.ADMIN_CORS_ORIGIN || "http://localhost:5174").split(",").map(s => s.trim()),
  storeCorsOrigins: (process.env.STORE_CORS_ORIGIN || "http://localhost:5173").split(",").map(s => s.trim()),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    uploadFolder: process.env.CLOUDINARY_UPLOAD_FOLDER || "vibrer",
  },
};
