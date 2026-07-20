import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  professional: { type: mongoose.Schema.Types.ObjectId, ref: "Professional" },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },

  planFor: {
    type: String,
    enum: ["Customer", "Store", "Professional"],
    default: "Customer",
  },

  plan: {
    type: String,
    enum: ["Free", "Third", "Second", "First"],
    default: "Free",
  },
  planPrice: String,
  validity: String,
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
