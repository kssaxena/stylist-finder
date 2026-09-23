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
  deleteBankDetails,
  getCustomerById,
  updateProfile,
  passwordLogin,
  updatePassword,
  actionsForStore,
  changePassword,
} from "../controllers/customer.controller.js";

import { VerifyCustomer } from "../middlewares/customer.middleware.js";

const router = Router();

//public routes
router.route("/register").post(registerCustomer);
router.route("/login").post(loginCustomer);
router.route("/login/via/password").post(passwordLogin);
router.route("/auth/re-login").post(reLoginToken);
router.route("/get/customer/data/:customerId").get(getCustomerById);
router.route("/update/password/:userId").post(updatePassword);
router.route("/update/change-password").post(changePassword);

//private routes
router
  .route("/otp/authentication/:verificationType/:customerId")
  .post(otpVerification);
router.route("/update/gender/:customerId").post(VerifyCustomer, updateGender);
router.route("/update/profile/:customerId").post(VerifyCustomer, updateProfile);
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
  .post(markAddressDefault); // i have removed the middleware of customer from this route fix it and make it work here
router
  .route("/update/modify-address/:customerId/:addressId")
  .post(VerifyCustomer, updateAddress);
router
  .route("/update/action-on-store/:action/:keyId/:customerId")
  .post(VerifyCustomer, actionsForStore);
router
  .route("/update/delete-address/:addressId/:customerId")
  .delete(VerifyCustomer, deleteAddress);
router
  .route("/update/add-bank-details/:customerId")
  .post(VerifyCustomer, addBankDetails);
router
  .route("/update/delete-bank-details/:bankId/:customerId")
  .delete(VerifyCustomer, deleteBankDetails);
router
  .route("/update/add-upi-details/:customerId")
  .post(VerifyCustomer, addUPIid);
router
  .route("/get/dashboard/data/:customerId/:query")
  .get(VerifyCustomer, dashboardData);

export default router;
