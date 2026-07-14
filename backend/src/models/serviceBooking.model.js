import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },

  dateOfBooking: { type: Date, required: true },
  dateForBooking: { type: Date, required: true },
  payment: { service: String, afterCoupon: String },

  modeOfPayment: { type: String, enum: ["Online Payment", "Cash Payment"] },
});

export const ServiceBookings = mongoose.Model("ServiceBookings", bookingSchema);
