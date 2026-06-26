import { Router } from "express";
import {
  createInteriorSlide,
  deleteInteriorSlide,
  listInteriorSlidesAdmin,
  reorderInteriorSlides,
  updateInteriorSlide,
} from "../../controllers/admin/interiorSlides.controller";

const router = Router();

router.get("/", listInteriorSlidesAdmin);
router.post("/", createInteriorSlide);
router.put("/reorder", reorderInteriorSlides);
router.put("/:id", updateInteriorSlide);
router.delete("/:id", deleteInteriorSlide);

export default router;
