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
  passwordLogin,
  updatePassword,
} from "../controllers/professional.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { VerifyProfessional } from "../middlewares/professional.middleware.js";
import { Professional } from "../models/professional.model.js";
import { createPasswordResetHandlers } from "../controllers/passwordReset.controller.js";

const router = Router();
const passwordReset = createPasswordResetHandlers({
  Model: Professional,
  identityFields: { contactNumber: "contactNumber", email: "email" },
  emailField: "email",
  nameField: "name",
});

router.route("/register").post(registerProfessional);
router.route("/login").post(loginProfessional);
router.route("/login/via/password").post(passwordLogin);
router.route("/auth/re-login").post(reLoginToken);
router.route("/update/password/:userId").post(updatePassword);
router
  .route("/password-reset/request")
  .post(passwordReset.requestPasswordReset);
router
  .route("/password-reset/confirm")
  .post(passwordReset.confirmPasswordReset);

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
