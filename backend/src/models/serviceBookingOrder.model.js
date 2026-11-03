import mongoose from "mongoose";

const serviceBookingOrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    items: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Services",
          required: true,
        },
        dateForBooking: { type: Date, required: true },
        bookingAmount: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true, min: 1 },
    paymentTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentTransaction",
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceBookings",
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Processing", "Confirmed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export const ServiceBookingOrder = mongoose.model(
  "ServiceBookingOrder",
  serviceBookingOrderSchema,
);
