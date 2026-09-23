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
  reLoginToken,
  dashboardData,
  addStoreStaff,
  addGalleryImages,
  deleteGalleryImage,
  getStaffForService,
  registrationFeePaid,
  passwordLogin,
  updatePassword,
  deleteAddress,
  changePassword,
  getStoreById,
} from "../controllers/store.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { VerifyStore } from "../middlewares/store.middleware.js";

const router = Router();

router.route("/register").post(registerStore);
router.route("/login").post(loginStore);
router.route("/login/via/password").post(passwordLogin);
router.route("/auth/re-login").post(reLoginToken);
router.route("/update/password/:userId").post(updatePassword);
router.route("/update/change-password").post(changePassword);
router
  .route("/otp/authentication/:verificationType/:storeId")
  .post(otpVerification);
router.route("/update/profile/:storeId").post(VerifyStore, updateProfile);
router.route("/update/add-address/:storeId").post(VerifyStore, addAddress);
router
  .route("/update/modify-address/:addressId/:storeId")
  .post(VerifyStore, addAddress);
router
  .route("/update/delete-address/:addressId/:storeId")
  .delete(VerifyStore, deleteAddress);
router
  .route("/update/add-bank-details/:storeId")
  .post(VerifyStore, addBankDetails);
router
  .route("/update/registration-fee-paid/true/:storeId")
  .post(VerifyStore, registrationFeePaid);
router.route("/update/submit-kyc/:storeId").post(
  upload.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "PAN", maxCount: 1 },
    { name: "StorePAN", maxCount: 1 },
    { name: "GST", maxCount: 1 },
  ]),
  VerifyStore,
  submitKYCVerification,
);
router.route("/get/store-by-id/store/:storeId").get(getStoreById);

// store staff routes
router
  .route("/update/add-store-staff/:storeId")
  .post(VerifyStore, upload.single("profileImage"), addStoreStaff);
router
  .route("/update/add-gallery-images/:storeId")
  .post(VerifyStore, upload.array("images", 20), addGalleryImages);
router
  .route("/update/delete-gallery-image/:storeId/:fileId")
  .delete(VerifyStore, deleteGalleryImage);
router
  .route("/get/staff-for-service/store-staff/:storeId")
  .get(VerifyStore, getStaffForService);

router
  .route("/get/dashboard/data/:storeId/:query")
  .get(VerifyStore, dashboardData);

export default router;
