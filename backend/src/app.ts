import cors from "cors";
import express, { Express } from "express";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requireStoreApiKey } from "./middleware/publishableKey.middleware";

import storeCategoriesRoutes from "./routes/store/categories.routes";
import storeProductsRoutes from "./routes/store/products.routes";
import storeEnquiriesRoutes from "./routes/store/enquiries.routes";
import storeBannersRoutes from "./routes/store/banners.routes";
import storeInteriorSlidesRoutes from "./routes/store/interiorSlides.routes";

import adminAuthRoutes from "./routes/admin/auth.routes";
import adminCategoriesRoutes from "./routes/admin/categories.routes";
import adminProductsRoutes from "./routes/admin/products.routes";
import adminEnquiriesRoutes from "./routes/admin/enquiries.routes";
import adminUploadRoutes from "./routes/admin/upload.routes";
import adminBannersRoutes from "./routes/admin/banners.routes";
import adminInteriorSlidesRoutes from "./routes/admin/interiorSlides.routes";
import { requireAdminAuth } from "./middleware/auth.middleware";

export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: [env.storeCorsOrigin, env.adminCorsOrigin],
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  // Public storefront API — requires publishable key, no JWT
  app.use("/store/product-categories", requireStoreApiKey, storeCategoriesRoutes);
  app.use("/store/products", requireStoreApiKey, storeProductsRoutes);
  app.use("/store/enquiries", requireStoreApiKey, storeEnquiriesRoutes);
  app.use("/store/banners", requireStoreApiKey, storeBannersRoutes);
  app.use("/store/interior-slides", requireStoreApiKey, storeInteriorSlidesRoutes);

  // Admin API — login is public, everything else requires JWT
  app.use("/admin/auth", adminAuthRoutes);
  app.use("/admin/categories", requireAdminAuth, adminCategoriesRoutes);
  app.use("/admin/products", requireAdminAuth, adminProductsRoutes);
  app.use("/admin/enquiries", requireAdminAuth, adminEnquiriesRoutes);
  app.use("/admin/upload", requireAdminAuth, adminUploadRoutes);
  app.use("/admin/banners", requireAdminAuth, adminBannersRoutes);
  app.use("/admin/interior-slides", requireAdminAuth, adminInteriorSlidesRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
