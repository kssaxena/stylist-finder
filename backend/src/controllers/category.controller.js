import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.model.js";
import { DeleteImage, UploadImages } from "../utils/imageKit.io.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

const sanitizeFolderName = (value = "") => {
  return value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
};

const createCategory = asyncHandler(async (req, res) => {
  const admin = req.user;

  if (!admin) {
    throw new ApiError(401, "Unauthorized");
  }
  const { title, description, displayOrder } = req.body;
  if (!title?.trim()) {
    throw new ApiError(400, "Category title is required");
  }
  if (!req.file) {
    throw new ApiError(400, "Category image is required");
  }

  let uploadedImage = null;

  uploadedImage = await UploadImages(
    req.file.filename,
    {
      folderStructure: `categories/${sanitizeFolderName(title)}`,
    },
    ["category"],
  );
  const isAdmin = admin.role === "admin";
  const category = await Category.create({
    createdBy: admin._id,
    title: title.trim(),
    description: description?.trim() || "",
    image: {
      url: uploadedImage.url,
      fileId: uploadedImage.fileId,
    },
    status: isAdmin ? "Verified" : "Under-review",
    isActive: isAdmin,
    displayOrder: Number(displayOrder) || 0,
    subcategories: [],
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        category,
        isAdmin
          ? "Category created successfully"
          : "Category submitted for admin approval",
      ),
    );
});

const createSubCategory = asyncHandler(async (req, res) => {
  const admin = req.user;

  if (!admin) {
    throw new ApiError(401, "Unauthorized");
  }
  const { categoryId } = req.params;
  const { title, description, displayOrder } = req.body;

  if (!title?.trim()) {
    throw new ApiError(400, "Subcategory title is required");
  }
  if (!req.file) {
    throw new ApiError(400, "Subcategory image is required");
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  let uploadedImage = null;
  uploadedImage = await UploadImages(
    req.file.filename,
    {
      folderStructure: `/categories/${category._id}/subcategories`,
    },
    ["subcategory"],
  );
  const isAdmin = admin.role === "admin";
  const subCategory = {
    createdBy: admin._id,
    title: title.trim(),
    description: description?.trim() || "",
    image: {
      url: uploadedImage.url,
      fileId: uploadedImage.fileId,
    },
    status: isAdmin ? "Verified" : "Under-review",
    isActive: isAdmin,
    displayOrder: Number(displayOrder) || 0,
  };

  category.subcategories.push(subCategory);
  await category.save();

  const createdSubCategory =
    category.subcategories[category.subcategories.length - 1];

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdSubCategory,
        isAdmin
          ? "Subcategory created successfully"
          : "Subcategory submitted for admin approval",
      ),
    );
});

const approveCategory = asyncHandler(async (req, res) => {
  const admin = req.user;

  if (admin.role !== "admin") {
    throw new ApiError(403, "Only admin can approve categories");
  }

  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  category.status = "Verified";
  category.isActive = true;

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category approved successfully"));
});

const rejectCategory = asyncHandler(async (req, res) => {
  const admin = req.user;

  if (admin.role !== "admin") {
    throw new ApiError(403, "Only admin can reject categories");
  }

  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  category.status = "Inactive";
  category.isActive = false;

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category rejected successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  if (!categories) throw new ApiError(400, "No category found");

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Data fetched successfully !"));
});

const getAllCategoriesName = asyncHandler(async (req, res) => {
  const categories = await Category.find().select("title");
  if (!categories) throw new ApiError(400, "No category found");

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Data fetched successfully !"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  // Only admin can delete
  if (req.admin?.role !== "admin") {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "Only admin can delete a category."));
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid category ID."));
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Category not found."));
  }

  if (!category.isActive && category.status === "Inactive") {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Category is already inactive."));
  }

  if (category.image?.fileId) {
    await DeleteImage(category.image.fileId);
  }

  for (const subcategory of category.subcategories) {
    if (subcategory.image?.fileId) {
      await DeleteImage(subcategory.image.fileId);
    }
  }

  category.isActive = false;
  category.status = "Inactive";

  category.subcategories.forEach((subcategory) => {
    subcategory.isActive = false;
    subcategory.status = "Inactive";
  });

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category deleted successfully."));
});

const deleteSubCategory = asyncHandler(async (req, res) => {
  const { categoryId, subcategoryId } = req.params;

  // Only admin can delete
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "Only admin can delete a subcategory."));
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid category ID."));
  }

  if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid subcategory ID."));
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Category not found."));
  }

  // Find subcategory before removing it
  const subcategory = category.subcategories.id(subcategoryId);

  if (!subcategory) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Subcategory not found."));
  }

  // Delete image from ImageKit first
  if (subcategory.image?.fileId) {
    await DeleteImage(subcategory.image.fileId);
  }

  // Remove subcategory completely from embedded array
  category.subcategories.pull(subcategoryId);

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Subcategory deleted successfully."));
});

export {
  createCategory,
  createSubCategory,
  approveCategory,
  rejectCategory,
  getAllCategories,
  getAllCategoriesName,
  deleteCategory,
  deleteSubCategory,
};
