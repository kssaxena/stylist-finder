import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: "Professional" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },

    flatNumber: String,
    floor: String,
    block: String,
    societyName: String,
    street1: String,
    street2: String,
    area: String,
    locality: String,
    sector: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },

    // exact location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      // the location coordinates are stored in indexes [0]:longitude and [1]:latitude
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    // address type
    addressType: {
      type: String,
      enum: ["Home", "Friend's", "Others"],
      default: "Home",
    },
    contactDetails: { name: String, contact: String },
    otherAddressType: String,
    defaultAddress: { type: Boolean, default: false },
  },
  { timestamps: true },
);

addressSchema.index({ location: "2dsphere" });

export const Address = mongoose.model("Address", addressSchema);
