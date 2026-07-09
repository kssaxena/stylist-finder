import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: "Professional" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },

    bankName: { type: String, required: true },
    branchName: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },

    // owner operations
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const BankDetails = mongoose.model("BankDetails", bankDetailsSchema);
