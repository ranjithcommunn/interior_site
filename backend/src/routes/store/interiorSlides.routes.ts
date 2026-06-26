import { Router } from "express";
import { listInteriorSlides } from "../../controllers/store/interiorSlides.controller";

const router = Router();

router.get("/", listInteriorSlides);

export default router;
