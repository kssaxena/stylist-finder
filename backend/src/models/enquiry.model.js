import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["course", "franchise", "general"],
      required: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    contactNumber: { type: String, required: true, trim: true, maxlength: 20 },
    interest: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, default: "", trim: true, maxlength: 2000 },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    emailVerified: { type: Boolean, default: false, index: true },
    otpHash: { type: String, select: false },
    otpExpiry: { type: Date, default: null, expires: 0 },
  },
  { timestamps: true },
);

export const Enquiry = mongoose.model("Enquiry", enquirySchema);
