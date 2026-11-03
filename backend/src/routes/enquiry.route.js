import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  listVerifiedEnquiries,
  sendEnquiryOtp,
  verifyEnquiryOtp,
} from "../controllers/enquiry.controller.js";
import { VerifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/send-otp", otpLimiter, sendEnquiryOtp);
router.post("/verify-otp", otpLimiter, verifyEnquiryOtp);
router.get("/admin/list", VerifyAdmin, listVerifiedEnquiries);

export default router;
