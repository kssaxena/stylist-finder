import { Router } from "express";
import {
  createAdmin,
  reLoginToken,
  getAllAdmins,
  getAdminById,
  markAsActiveVerified,
  dashboardData,
  adminLogin,
  getCurrentRequestData,
  createStoreWithServices,
} from "../controllers/admin.controller.js";

import { VerifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Admin } from "../models/admin.model.js";
import { createPasswordResetHandlers } from "../controllers/passwordReset.controller.js";

const router = Router();
const passwordReset = createPasswordResetHandlers({
  Model: Admin,
  identityFields: {
    contactNumber: "contactNumber",
    email: "email",
    employeeId: "employeeId",
  },
  emailField: "email",
  nameField: "name",
});

//public routes
router.route("/register/new").post(createAdmin);
router.route("/login").post(adminLogin);
router
  .route("/password-reset/request")
  .post(passwordReset.requestPasswordReset);
router
  .route("/password-reset/confirm")
  .post(passwordReset.confirmPasswordReset);
router.route("/auth/re-login").post(reLoginToken);
router.route("/get/data/dashboard-data/:query").get(dashboardData);
router
  .route("/get/data/current/:query/:keyId/:adminId")
  .get(getCurrentRequestData);

//private routes
router.route("/store/create-with-services").post(
  VerifyAdmin,
  upload.fields([
    { name: "serviceImage0", maxCount: 1 },
    { name: "serviceImage1", maxCount: 1 },
  ]),
  createStoreWithServices,
);
// router
//   .route("/otp/authentication/:verificationType/:customerId")
//   .post(otpVerification);

export default router;
