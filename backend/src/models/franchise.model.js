import mongoose from "mongoose";

const franchiseSchema = new mongoose.Schema(
  {
    name: String,
    subtitle: String,
    budget: String,
    franchiseFee: String,
    interior: String,
    equipment: String,
    stock: String,
    marketing: String,
    workingCapital: String,
    space: String,
    staff: String,
    roi: String,
    location: String,
    services: String,
    advantage: String,
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true },
);

export const Franchise = mongoose.model("Franchise", franchiseSchema);
