import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    executive: { type: mongoose.Schema.Types.ObjectId, ref: "StoreStaff" },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: "Professional" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    products: [
      {
        productType: { type: String, trim: true },
        brand: { type: String, trim: true },
      },
    ],
    description: String,
    serviceInclusion: [{ type: String, trim: true }],
    serviceExclusion: [{ type: String, trim: true }],
    duration: { type: Number, default: 1 },
    prepTime: { type: Number, default: 0 },
    isPrepTime: { type: Boolean, default: true },
    timeIncludingPrepTime: { type: Boolean, default: false },
    onSite: { type: Boolean, default: true },
    inHouse: { type: Boolean, default: true },
    serviceFor: {
      type: String,
      enum: ["Male", "Female", "Both"],
      default: "Both",
    },
    price: {
      // charges: { type: Number, default: 0 },
      mrp: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      sellingPrice: { type: Number, required: true },
    },
    bookingDays: {
      type: String,
      enum: [
        "Only on Sunday",
        "Only on Monday, Wednesday, Friday",
        "Only on Tuesday, Thursday, Saturday",
        "Monday to Friday",
        "Monday to Saturday",
        "Whole week (All 7 days)",
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
    bookingAcceptingHours: { from: { type: String }, till: { type: String } },
    coverImage: [{ url: String, fileId: String }],
    serviceArea: {
      type: String,
      enum: ["Inside city", "Outside city", "Both"],
      default: "Inside city",
    },
    // requirements from customer
    serviceRequirements: [{ type: String }],
    isActive: { type: Boolean, default: true },
    // sponsor: {
    //   type: String,
    //   enum: ["first", "second", "third", "fourth", "fifth", "none"],
    //   default: "none",
    // },
    sponsor: {
      enabled: { type: Boolean, default: false },
      priority: { type: Number, default: 999, min: 1 },
    },
  },
  { timestamps: true },
);

export const Services = mongoose.model("Services", serviceSchema);
