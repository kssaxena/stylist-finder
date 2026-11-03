import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ProductOrder } from "../models/productOrder.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UploadImages } from "../utils/imageKit.io.js";

const parseImages = (value) => {
  if (!value) return [];
  try {
    const images = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(images)) throw new Error("Images must be an array.");
    return images.filter((image) => image?.url);
  } catch {
    throw new ApiError(400, "Product images must be a valid image list.");
  }
};

const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 24, 1), 100);
  const filter = { isActive: true };
  const search = String(req.query.search || "").trim();

  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: escaped, $options: "i" } },
      { description: { $regex: escaped, $options: "i" } },
      { category: { $regex: escaped, $options: "i" } },
    ];
  }
  if (req.query.category) filter.category = String(req.query.category);

  const sortBy = req.query.sortBy === "price-low" ? { price: 1 } :
    req.query.sortBy === "price-high" ? { price: -1 } : { createdAt: -1 };
  const [products, total, categories] = await Promise.all([
    Product.find(filter).sort(sortBy).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
    Product.distinct("category", { isActive: true }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      products,
      categories: categories.sort((left, right) => left.localeCompare(right)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }, "Products fetched successfully"),
  );
});

const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
    throw new ApiError(400, "Invalid product ID.");
  }
  const product = await Product.findOne({
    _id: req.params.productId,
    isActive: true,
  });
  if (!product) throw new ApiError(404, "Product not found.");
  return res.status(200).json(new ApiResponse(200, product, "Product fetched."));
});

const listAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ updatedAt: -1 }).lean();
  return res.status(200).json(new ApiResponse(200, products, "Products fetched."));
});

const saveProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, description = "", category, sku = "", price, stock, isActive } = req.body;
  const numericPrice = Number(price);
  const numericStock = Number(stock);

  if (!name?.trim() || !category?.trim()) {
    throw new ApiError(400, "Product name and category are required.");
  }
  if (!Number.isFinite(numericPrice) || numericPrice < 1) {
    throw new ApiError(400, "Enter a valid product price.");
  }
  if (!Number.isInteger(numericStock) || numericStock < 0) {
    throw new ApiError(400, "Stock must be a non-negative whole number.");
  }
  if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID.");
  }

  const images = parseImages(req.body.images);
  if (images.length + (req.files || []).length > 5) {
    throw new ApiError(400, "A product can have no more than five images.");
  }
  for (const [index, file] of (req.files || []).entries()) {
    if (!file.mimetype?.startsWith("image/")) {
      throw new ApiError(400, "Product images must be image files.");
    }
    const uploaded = await UploadImages(file.filename, {
      folderStructure: "ecommerce/products",
    });
    images.push({ url: uploaded.url, fileId: uploaded.fileId });
    if (index >= 4) break;
  }

  const productData = {
    name: name.trim(),
    description: String(description).trim(),
    category: category.trim(),
    sku: String(sku).trim().toUpperCase() || undefined,
    price: numericPrice,
    stock: numericStock,
    images,
    ...(isActive !== undefined && {
      isActive: isActive === true || isActive === "true",
    }),
  };

  try {
    const product = productId
      ? await Product.findByIdAndUpdate(productId, productData, {
          new: true,
          runValidators: true,
        })
      : await Product.create(productData);
    if (!product) throw new ApiError(404, "Product not found.");
    return res.status(productId ? 200 : 201).json(
      new ApiResponse(productId ? 200 : 201, product, "Product saved successfully."),
    );
  } catch (error) {
    if (error?.code === 11000) throw new ApiError(409, "That SKU is already in use.");
    throw error;
  }
});

const updateProductStatus = asyncHandler(async (req, res) => {
  const { productId, action } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId) || !["activate", "deactivate"].includes(action)) {
    throw new ApiError(400, "Invalid product status request.");
  }
  const product = await Product.findByIdAndUpdate(
    productId,
    { isActive: action === "activate" },
    { new: true },
  );
  if (!product) throw new ApiError(404, "Product not found.");
  return res.status(200).json(new ApiResponse(200, product, "Product status updated."));
});

const listProductOrders = asyncHandler(async (_req, res) => {
  const orders = await ProductOrder.find()
    .populate("customer", "name email contactNumber")
    .sort({ createdAt: -1 })
    .lean();
  return res.status(200).json(new ApiResponse(200, orders, "Orders fetched."));
});

const listCustomerProductOrders = asyncHandler(async (req, res) => {
  const orders = await ProductOrder.find({ customer: req.user._id })
    .sort({ createdAt: -1 })
    .lean();
  return res.status(200).json(new ApiResponse(200, orders, "Orders fetched."));
});

const updateProductOrderStatus = asyncHandler(async (req, res) => {
  const allowedStatuses = ["Packed", "Shipped", "Delivered"];
  const { orderId } = req.params;
  const { status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(orderId) || !allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid order status.");
  }
  const order = await ProductOrder.findOneAndUpdate(
    {
      _id: orderId,
      status: { $in: ["Processing", "Packed", "Shipped"] },
    },
    { status },
    { new: true, runValidators: true },
  );
  if (!order) throw new ApiError(404, "Order not found or cannot be updated.");
  return res.status(200).json(new ApiResponse(200, order, "Order status updated."));
});

export {
  getProducts,
  getProductById,
  listAdminProducts,
  saveProduct,
  updateProductStatus,
  listProductOrders,
  listCustomerProductOrders,
  updateProductOrderStatus,
};
