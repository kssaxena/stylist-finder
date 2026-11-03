import mongoose from "mongoose";

const productOrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        sku: String,
        image: String,
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
      },
    ],
    shippingAddress: {
      name: String,
      contact: String,
      flatNumber: String,
      floor: String,
      street1: String,
      street2: String,
      area: String,
      locality: String,
      pincode: String,
      city: String,
      state: String,
      country: String,
    },
    amount: { type: Number, required: true, min: 1 },
    paymentTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentTransaction",
    },
    status: {
      type: String,
      enum: [
        "Pending Payment",
        "Payment Failed",
        "Processing",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending Payment",
    },
    stockReleased: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const ProductOrder = mongoose.model("ProductOrder", productOrderSchema);
