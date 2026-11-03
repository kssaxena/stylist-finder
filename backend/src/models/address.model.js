import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    storeStaff: { type: mongoose.Schema.Types.ObjectId, ref: "StoreStaff" },
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
    pincode: String,
    city: { type: String },
    state: { type: String },
    country: { type: String },

    // exact location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      // the location coordinates are stored in indexes [0]:latitude and [1]:longitude
      coordinates: {
        type: [Number], // [lat, lng]
      },
    },

    // address type
    addressType: {
      type: String,
      enum: [
        "Home",
        "Friend's",
        "Address 1",
        "Address 2",
        "Address 3",
        "Others",
      ],
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
