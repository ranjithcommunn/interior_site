import { Router } from "express";
import {
  createBanner,
  deleteBanner,
  listBannersAdmin,
  reorderBanners,
  updateBanner,
} from "../../controllers/admin/banners.controller";

const router = Router();

router.get("/", listBannersAdmin);
router.post("/", createBanner);
router.put("/reorder", reorderBanners);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);

export default router;
