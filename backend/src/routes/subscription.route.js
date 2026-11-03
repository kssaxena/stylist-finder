import { Router } from "express";
import {
  createSubscription,
  getSubscriptionByMadeFor,
  getSubscriptionById,
  updateSubscription,
  purchaseSubscription,
} from "../controllers/subscription.controller.js";
import { VerifyStore } from "../middlewares/store.middleware.js";

const router = Router();

router.route("/create/new-model/:adminId").post(createSubscription);
router.route("/get/subscription/:query").get(getSubscriptionByMadeFor);
router
  .route("/get/subscription/details/by-id/:subscriptionId")
  .get(getSubscriptionById);
router.route("/update/:subscriptionId").post(updateSubscription);
router
  .route("/purchase/:subscriptionId/:userId")
  .post(VerifyStore, purchaseSubscription);

export default router;
