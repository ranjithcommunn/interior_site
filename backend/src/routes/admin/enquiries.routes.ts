import { Router } from "express";
import { listEnquiries, updateEnquiryStatus } from "../../controllers/admin/enquiries.controller";

const router = Router();

router.get("/", listEnquiries);
router.put("/:id", updateEnquiryStatus);

export default router;
