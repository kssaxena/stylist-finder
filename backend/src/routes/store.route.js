import { Router } from "express";
import {
  registerStore,
  loginStore,
  otpVerification,
  addAddress,
  updateAddress,
  addBankDetails,
  updateProfile,
  submitKYCVerification,
} from "../controllers/store.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { VerifyStore } from "../middlewares/store.middleware.js";

const router = Router();

router.route("/register").post(registerStore);
router.route("/login").post(loginStore);
router
  .route("/otp/authentication/:verificationType/:storeId")
  .post(otpVerification);
router.route("/update/profile/:storeId").post(VerifyStore, updateProfile);
router.route("/update/add-address/:storeId").post(VerifyStore, addAddress);
router
  .route("/update/modify-address/:addressId/:storeId")
  .post(VerifyStore, addAddress);
router
  .route("/update/add-bank-details/:storeId")
  .post(VerifyStore, addBankDetails);
router.route("/update/submit-kyc/:storeId").post(
  upload.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "PAN", maxCount: 1 },
    { name: "GST", maxCount: 1 },
  ]),
  VerifyStore,
  submitKYCVerification,
);

export default router;
