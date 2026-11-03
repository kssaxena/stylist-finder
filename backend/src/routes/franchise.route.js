import { Router } from "express";
import {
  createFranchise,
  editModel,
  getAllFranchise,
} from "../controllers/franchise.controller.js";
import { VerifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post(
  "/update/create/new-franchise/:adminId",
  VerifyAdmin,
  createFranchise,
);
router.post(
  "/update/modify/franchise-by-id/:adminId/:franchiseId",
  VerifyAdmin,
  editModel,
);
router.get("/get/all-models/all-franchise-model", getAllFranchise);

export default router;
