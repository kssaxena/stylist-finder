import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyStore } from "../middlewares/store.middleware.js";
import { VerifyProfessional } from "../middlewares/professional.middleware.js";
import {
  createStoreService,
  getServiceById,
  getServices,
  updateStoreService,
  deleteStoreService,
  markAsActiveInactive,
} from "../controllers/service.controller.js";

const router = Router();

router
  .route("/add/service/store/:storeId")
  .post(VerifyStore, upload.array("coverImage", 5), createStoreService);
router.route("/get/service").get(getServices);
router.route("/get/service/by-id/:serviceId").get(getServiceById);
router
  .route("/update/service/:serviceId")
  .post(VerifyStore, upload.array("coverImage", 5), updateStoreService);
router
  .route("/delete/service/:serviceId")
  .delete(VerifyStore, deleteStoreService);
router
  .route("/update/service-status/:action/:serviceId")
  .post(markAsActiveInactive);

export default router;
