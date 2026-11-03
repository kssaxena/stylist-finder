import { Router } from "express";
import {
  createPayment,
  createServiceBookingPayment,
  getPaymentTransaction,
  verifyPayment,
  paymentWebhook,
  retryPayment,
} from "../controllers/payment.controller.js";
import { VerifyStore } from "../middlewares/store.middleware.js";
import { VerifyCustomer } from "../middlewares/customer.middleware.js";

const router = Router();

router.post("/create", VerifyStore, createPayment);
router.post(
  "/service-booking/create",
  VerifyCustomer,
  createServiceBookingPayment,
);
router.get("/transaction/:transactionId", getPaymentTransaction);
router.post("/verify", VerifyStore, verifyPayment);
router.post("/service-booking/verify", VerifyCustomer, verifyPayment);
router.post("/product-order/verify", VerifyCustomer, verifyPayment);
router.post("/webhook", paymentWebhook);
router.post("/retry/:transactionId", retryPayment);

export default router;
