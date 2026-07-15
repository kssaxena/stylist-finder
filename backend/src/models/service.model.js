import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    executive: { type: mongoose.Schema.Types.ObjectId, ref: "StoreStaff" },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: "Professional" },
    products: [
      {
        productType: { type: String, required: true, trim: true },
        brand: { type: String, required: true, trim: true },
      },
    ],
    serviceInclusion: [{ type: String, trim: true }],
    serviceExclusion: [{ type: String, trim: true }],
    duration: { type: String, required: true },
    prepTime: { type: String, default: 0, required: true },
    isPrepTime: { type: Boolean, default: true },
    timeIncludingPrepTime: { type: Boolean, default: false },
    onSite: { type: Boolean, default: true },
    inHouse: { type: Boolean, default: true },
    serviceFor: {
      type: String,
      enum: ["Male", "Female", "Both"],
      default: "Both",
    },
    charges: { type: String, default: "0", required: true, trim: true },
    bookingDays: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Whole week",
      ],
      default: "Whole week",
    },
    bookingAcceptingHours: { from: { type: Date }, till: { type: Date } },
    coverImage: [{ url: String, fileId: String }],
    serviceArea: {
      type: String,
      enum: ["Inside city", "Outside city", "Both"],
      default: "Inside city",
    },
    // requirements from customer
    serviceRequirements: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Services = mongoose.model("Services", serviceSchema);
