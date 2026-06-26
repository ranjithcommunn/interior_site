import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createEnquiry } from "../../controllers/store/enquiries.controller";

const router = Router();

const enquiryRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions, please try again in a minute." },
});

router.post("/", enquiryRateLimit, createEnquiry);

export default router;
