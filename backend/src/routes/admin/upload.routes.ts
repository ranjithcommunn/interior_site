import { Router } from "express";
import { getUploadSignature } from "../../controllers/admin/upload.controller";

const router = Router();

router.post("/signature", getUploadSignature);

export default router;
