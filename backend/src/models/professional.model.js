import mongoose, { Schema } from "mongoose";

const professionalSchema = new mongoose.Schema(
  {
    // initials for registration
    name: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Prefer not to say"],
      default: "Prefer not to say",
    },
    alternateContactNumber: { type: String },
    about: String,
    specialization: [String],

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
      default: "Both (In house and On site)",
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
        verified: { type: Boolean, default: false },
        number: { type: Number },
        image: {
          front: { url: String, fileId: String },
          back: { url: String, fileId: String },
        },
      },
      pan: {
        verified: { type: Boolean, default: false },
        number: { type: Number },
        image: { url: String, fileId: String },
      },
      gst: {
        verified: { type: Boolean, default: false },
        number: { type: Number },
        image: { url: String, fileId: String },
      },
    },

    // authentications
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    role: "Professional",
    currentlyUnderBooking: { type: Boolean, default: false },

    // admin controls
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    kycSubmitted: { type: Boolean, default: false },
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

professionalSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: "Professional" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "20m" },
  );
};

professionalSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, role: "Professional" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};

export const Professional = mongoose.model("Professional", professionalSchema);
