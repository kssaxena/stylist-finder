import mongoose from "mongoose";

const storeStaffSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },

    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    specialization: String,
    otherServices: [String],
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    profileImage: { url: String, fileId: String },
    designation: String,
    experience: String,
    role: { type: String, default: "StoreStaff" },

    // kyc
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

    // store controls
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    kycComplete: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const StoreStaff = mongoose.model("StoreStaff", storeStaffSchema);
