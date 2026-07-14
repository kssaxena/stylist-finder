import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    // initial details
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String },

    // extra details
    gender: {
      type: String,
      enum: ["Male", "Female", "Prefer not to say"],
      default: "Prefer not to say",
    },
    alternateContactNumber: { type: String },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    defaultAddress: String,

    // banking details
    bankingDetails: [
      { type: mongoose.Schema.Types.ObjectId, ref: "BankDetails" },
    ],

    // model linking
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "ServiceBookings" }],
    favStore: [{ type: mongoose.Schema.Types.ObjectId, ref: "Store" }],
    favProfessional: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Professional" },
    ],
    quickServices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Services" }],
    wishListServices: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Services" },
    ],

    // admin controls
    isActive: { type: Boolean, default: true },
    isProfileComplete: { type: Boolean, default: false },

    // authentication
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    role: "Customer",
    currentlyUnderBooking: { type: Boolean, default: false },

    // validation if the user has temporarily registered or not
    isTemporaryRegistered: { type: Boolean, default: true },

    // make it "true" when the user starts the registering process. if the user holds back button or reloads the tab delete the temporary registration. when he is smart and closes the browser... this will be marked as "true" earlier and when he tries to register or login again... we will verify this step once again.
  },
  { timestamps: true },
);

export const Customer = mongoose.model("Customer", customerSchema);
