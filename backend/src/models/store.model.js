import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    storeName: { type: String },
    storeContactNumber: { type: String },
    storeEmail: { type: String },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    bank: { type: mongoose.Schema.Types.ObjectId, ref: "BankDetails" },
    storeStaffs: [{ type: mongoose.Schema.Types.ObjectId, ref: "StoreStaff" }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Services" }],
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bookings" }],

    // enums
    serviceType: {
      type: String,
      enum: ["In House", "On Site", "Both (In house and On site)"],
      default: "Both",
    },
    paymentOptions: {
      inStore: { type: String, enum: ["Online (Cards / UPI)", "Cash", "Both"] },
      onSite: { type: String, enum: ["UPI", "Cash", "Both"] },
    },

    // extras for profile
    storeTimings: { openFrom: { type: Date }, openTill: { type: Date } },
    images: {
      logo: { url: String, fileId: String },
      gallery: [{ url: String, fileId: String }],
    },

    // owner details
    owner: {
      ownerName: { type: String, required: true },
      ownerContact: { type: String, required: true },
      ownerEmail: { type: String, required: true },
      ownerAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
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
    },

    // store kyc
    pan: {
      number: { type: Number },
      image: { url: String, fileId: String },
    },
    gst: {
      number: { type: Number },
      image: { url: String, fileId: String },
    },

    // authentications
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    role: "Store",

    // admin controls
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    ownerKycComplete: { type: Boolean, default: false },
    storeKycComplete: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },

    // validation if the user has temporarily registered or not
    isTemporaryRegistered: { type: Boolean, default: false },

    // make it "true" when the user starts the registering process. if the user holds back button or reloads the tab delete the temporary registration. when he is smart and closes the browser... this will be marked as "true" earlier and when he tries to register or login again... we will verify this step once again.
  },
  { timestamps: true },
);

export const Store = mongoose.model("Store", storeSchema);
