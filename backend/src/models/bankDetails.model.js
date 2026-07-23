import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: "Professional" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },

    accountDetails: {
      bankName: String,
      branchName: String,
      accountHolderName: String,
      accountNumber: String,
      confirmAccountNumber: String,
      ifscCode: String,
    },

    upiID: String,

    // owner operations
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const BankDetails = mongoose.model("BankDetails", bankDetailsSchema);
