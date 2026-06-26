import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductAdmin,
  listProductsAdmin,
  updateProduct,
} from "../../controllers/admin/products.controller";

const router = Router();

router.get("/", listProductsAdmin);
router.post("/", createProduct);
router.get("/:id", getProductAdmin);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
