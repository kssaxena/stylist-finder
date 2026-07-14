import mongoose, { Schema } from "mongoose";

const professionalSchema = new mongoose.Schema(
  {
    // initials for registration
    name: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },

    // model links
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    bank: { type: mongoose.Schema.Types.ObjectId, ref: "BankDetails" },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Services" }],
    bookings: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ServiceBookings" },
    ],

    // enums
    serviceType: {
      type: String,
      enum: ["In House", "On Site", "Both (In house and On site)"],
      default: "Both",
    },
    paymentOptions: {
      type: String,
      enum: ["Cash", "Online (UPI)", "Both"],
      default: "Both",
    },

    // extras for profile
    images: {
      profileImage: { url: String, fileId: String },
      gallery: { url: String, fileId: String },
    },

    // kyc
    kycDetails: {
      aadhar: {
        number: { type: Number },
        image: {
          front: { url: String, fileId: String },
          back: { url: String, fileId: String },
        },
      },
      pan: {
        number: { type: Number },
        image: { url: String, fileId: String },
      },
      gst: {
        number: { type: Number },
        image: { url: String, fileId: String },
      },
    },

    // authentications
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    role: "Professional",

    // admin controls
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    kycComplete: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },

    // validation if the user has temporarily registered or not
    isTemporaryRegistered: { type: Boolean, default: true },

    // make it "true" when the user starts the registering process. if the user holds back button or reloads the tab delete the temporary registration. when he is smart and closes the browser... this will be marked as "true" earlier and when he tries to register or login again... we will verify this step once again.
  },
  { timestamps: true },
);

export const Professional = mongoose.model("Professional", professionalSchema);
