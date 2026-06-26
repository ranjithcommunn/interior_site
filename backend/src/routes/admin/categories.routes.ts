import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  listCategoriesAdmin,
  reorderCategories,
  updateCategory,
} from "../../controllers/admin/categories.controller";

const router = Router();

router.get("/", listCategoriesAdmin);
router.post("/", createCategory);
router.put("/reorder", reorderCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
