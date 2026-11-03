import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", trim: true, maxlength: 5000 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    sku: { type: String, trim: true, uppercase: true, maxlength: 40 },
    price: { type: Number, required: true, min: 1 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: [{ url: String, fileId: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", description: "text", category: "text" });
productSchema.index({ sku: 1 }, { unique: true, sparse: true });

export const Product = mongoose.model("Product", productSchema);
