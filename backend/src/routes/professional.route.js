import { Router } from "express";
import {
  registerProfessional,
  loginProfessional,
  otpVerification,
  updateProfile,
  addAddress,
  updateAddress,
  addBankDetails,
  addAlternateContactNumber,
  addProfileImage,
  addGalleryImages,
  getProfessionalById,
  getAllProfessionals,
  submitKYCVerification,
  dashboardData,
  reLoginToken,
} from "../controllers/professional.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { VerifyProfessional } from "../middlewares/professional.middleware.js";

const router = Router();

router.route("/register").post(registerProfessional);
router.route("/login").post(loginProfessional);
router.route("/auth/re-login").post(reLoginToken);
router
  .route("/otp/authentication/:verificationType/:professionalId")
  .post(otpVerification);
router
  .route("/update/profile/:professionalId")
  .post(VerifyProfessional, updateProfile);
router
  .route("/update/add/alternate-contact-number/:professionalId")
  .post(VerifyProfessional, addAlternateContactNumber);
router
  .route("/update/add-address/:professionalId")
  .post(VerifyProfessional, addAddress);
router
  .route("/update/add-profile-image/:professionalId")
  .post(VerifyProfessional, upload.single("image"), addProfileImage);
router
  .route("/update/add-gallery-images/:professionalId")
  .post(VerifyProfessional, upload.array("images", 5), addGalleryImages);
router
  .route("/get/professional/by-id/:professionalId")
  .get(getProfessionalById);
router.route("/get/professional/all").get(getAllProfessionals);
router
  .route("/update/add-bank-details/:professionalId")
  .post(VerifyProfessional, addBankDetails);
router
  .route("/get/dashboard/data/:professionalId/:query")
  .get(VerifyProfessional, dashboardData);
router.route("/update/submit-kyc/:professionalId").post(
  upload.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "PAN", maxCount: 1 },
    { name: "GST", maxCount: 1 },
  ]),
  VerifyProfessional,
  submitKYCVerification,
);

export default router;
