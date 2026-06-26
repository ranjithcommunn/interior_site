import { Router } from "express";
import { getDashboardStats } from "../../controllers/admin/dashboard.controller";

const router = Router();

router.get("/", getDashboardStats);

export default router;
