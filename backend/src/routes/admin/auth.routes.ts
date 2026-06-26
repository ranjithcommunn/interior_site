import { Router } from "express";
import { login, me } from "../../controllers/admin/auth.controller";
import { requireAdminAuth } from "../../middleware/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/me", requireAdminAuth, me);

export default router;
