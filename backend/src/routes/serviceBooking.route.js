import { Router } from "express";

import {
  cancelAppointment,
  cancelAppointmentByStore,
  createAppointment,
} from "../controllers/serviceBooking.controller.js";
import { VerifyCustomer } from "../middlewares/customer.middleware.js";
import { VerifyStore } from "../middlewares/store.middleware.js";

const router = Router();

router
  .route("/add/create/new-appointment/:customerId/:serviceId/:storeId")
  .post(createAppointment);
router
  .route("/cancel/:bookingId/:customerId")
  .post(VerifyCustomer, cancelAppointment);
router
  .route("/cancel/store/:bookingId/:storeId")
  .post(VerifyStore, cancelAppointmentByStore);

export default router;
