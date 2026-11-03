import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const professionalSchema = new mongoose.Schema(
  {
    // initials for registration
    name: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    password: { type: String },

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
        number: { type: String },
        image: {
          front: { url: String, fileId: String },
          back: { url: String, fileId: String },
        },
      },
      pan: {
        verified: { type: Boolean, default: false },
        number: { type: String },
        image: { url: String, fileId: String },
      },
      gst: {
        verified: { type: Boolean, default: false },
        number: { type: String },
        image: { url: String, fileId: String },
      },
    },

    // authentications
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    role: { type: String, default: "Professional" },
    currentlyUnderBooking: { type: Boolean, default: false },

    // admin controls
    promotionLevel: {
      type: String,
      enum: [
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eighth",
        "ninth",
        "tenth",
        "none",
      ],
      default: "none",
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isRegistrationFee: { type: String, default: "500" },
    isRegistrationFeePaid: { type: Boolean, default: false },
    kycSubmitted: { type: Boolean, default: false },
    kycComplete: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },

    // validation if the user has temporarily registered or not
    isTemporaryRegistered: { type: Boolean, default: true },

    // make it "true" when the user starts the registering process. if the user holds back button or reloads the tab delete the temporary registration. when he is smart and closes the browser... this will be marked as "true" earlier and when he tries to register or login again... we will verify this step once again.
    registration: {
      paid: { type: Boolean, default: false },
      amountPaid: Number,
    },
    subscription: {
      subscriptionModel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
      },
      subscriptionPurchased: { type: Boolean, default: false },
      subscriptionValidity: Date,
    },
  },
  { timestamps: true },
);

professionalSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

professionalSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

professionalSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: "Professional" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" },
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
