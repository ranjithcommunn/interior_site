import { Router } from "express";
import { listBanners } from "../../controllers/store/banners.controller";

const router = Router();

router.get("/", listBanners);

export default router;
