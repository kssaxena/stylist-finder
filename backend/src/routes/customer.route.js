import { Router } from "express";
import {
  addAlternateContactNumber,
  otpVerification,
  registerCustomer,
  updateGender,
  updateAlternateNumber,
  addAddress,
  markAddressDefault,
  updateAddress,
  deleteAddress,
  addBankDetails,
  addUPIid,
  dashboardData,
  loginCustomer,
  reLoginToken,
} from "../controllers/customer.controller.js";

import { VerifyCustomer } from "../middlewares/customer.middleware.js";

const router = Router();

router.route("/register").post(registerCustomer);
router.route("/login").post(loginCustomer);
router.route("/auth/re-login").post(reLoginToken);

router
  .route("/otp/authentication/:verificationType/:customerId")
  .post(otpVerification);
router.route("/update/gender/:customerId").post(VerifyCustomer, updateGender);
router
  .route("/update/add/alternate-contact-number/:customerId")
  .post(VerifyCustomer, addAlternateContactNumber);
router
  .route("/update/modify/alternate-contact-number/:customerId")
  .post(VerifyCustomer, updateAlternateNumber);
router
  .route("/update/add-address/:customerId")
  .post(VerifyCustomer, addAddress);
router
  .route("/update/add-address/:customerId/:addressId")
  .post(VerifyCustomer, markAddressDefault);
router
  .route("/update/modify-address/:customerId/:addressId")
  .post(VerifyCustomer, updateAddress);
router
  .route("/update/delete-address/:customerId/:addressId")
  .post(VerifyCustomer, deleteAddress);
router
  .route("/update/add-bank-details/:customerId")
  .post(VerifyCustomer, addBankDetails);
router
  .route("/update/add-upi-details/:customerId")
  .post(VerifyCustomer, addUPIid);
router
  .route("/get/dashboard/data/:customerId/:query")
  .get(VerifyCustomer, dashboardData);

export default router;
