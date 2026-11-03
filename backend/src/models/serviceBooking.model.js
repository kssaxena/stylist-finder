import mongoose from "mongoose";

import { BOOKING_STATUS } from "../constants/payment.constants.js";

const bookingSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Services" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: "Professional" },
    paymentTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentTransaction",
    },
    bookingOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceBookingOrder",
    },

    dateOfBooking: { type: Date, required: true },
    dateForBooking: { type: Date, required: true },
    payment: { service: String, afterCoupon: String },
    bookingAmount: Number,

    modeOfPayment: { type: String, enum: ["Online Payment", "Cash Payment"] },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.CREATED,
      index: true,
    },
    cancellation: {
      reason: { type: String, trim: true },
      cancelledAt: Date,
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "cancelledByModel",
      },
      cancelledByModel: {
        type: String,
        enum: ["Customer", "Store"],
      },
    },
  },
  { timestamps: true },
);

export const ServiceBookings = mongoose.model("ServiceBookings", bookingSchema);
