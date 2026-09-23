import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import {
  UploadImages,
  DeleteBulkImage,
  DeleteImage,
} from "../utils/imageKit.io.js";
import { Services } from "../models/service.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Store } from "../models/store.model.js";
import { Professional } from "../models/professional.model.js";
import { Customer } from "../models/customer.model.js";

const createStoreService = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const {
    name,
    category,
    subcategory,
    duration,
    executive,
    prepTime,
    isPrepTime,
    timeIncludingPrepTime,
    serviceFor,
    bookingDays,
    bookingFrom,
    bookingTill,
    onSite,
    inHouse,
    serviceArea,
    mrp,
    discount,
    sellingPrice,
    description,
  } = req.body;

  if (!name || !category || !subcategory || !mrp || !sellingPrice) {
    throw new ApiError(
      400,
      "Service name, category, subcategory, and price are required.",
    );
  }

  let parsedServiceData = {};
  try {
    parsedServiceData = req.body.serviceData
      ? JSON.parse(req.body.serviceData)
      : {};
  } catch (error) {
    throw new ApiError(400, "Invalid service form data.");
  }

  const {
    products = [],
    serviceInclusion = [],
    serviceExclusion = [],
    serviceRequirements = [],
  } = parsedServiceData;

  const store = await Store.findById(storeId);
  if (!store) throw new ApiError(400, "Invalid access !");

  const plan = await Subscription.findById(
    store.subscription?.subscriptionModel,
  );
  if (
    !store.subscription?.subscriptionPurchased ||
    !store.subscription?.subscriptionValidity ||
    // store.subscription.subscriptionValidity <= new Date() ||
    !plan?.isActive
  ) {
    throw new ApiError(403, "Purchase an active subscription to add services");
  }

  const serviceCount = await Services.countDocuments({ store: storeId });
  const serviceLimit = plan.serviceLimit?.count || 2;
  if (!plan.serviceLimit?.unlimited && serviceCount >= serviceLimit) {
    throw new ApiError(
      403,
      `This plan allows ${serviceLimit} service${serviceLimit === 1 ? "" : "s"}`,
    );
  }

  const sanitize = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/\s+/g, "-");
  const safeName = sanitize(store.name);

  const images = req.files || [];
  const uploadedImages = [];

  for (const img of images) {
    const uploaded = await UploadImages(img.filename, {
      folderStructure: `store/${safeName
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase()}/serviceCoverImage`,
    });

    uploadedImages.push({
      url: uploaded.url,
      fileId: uploaded.fileId,
      altText: name,
    });
  }

  const sanitizePrepTime = isPrepTime === "on" ? true : false;
  const sanitizeTimeIncludingPrepTime =
    timeIncludingPrepTime === "on" ? true : false;
  const sanitizeOnSite = onSite === "on" ? true : false;
  const sanitizeInHouse = inHouse === "on" ? true : false;

  const service = await Services.create({
    name,
    store: storeId,
    ...(executive?.trim() && { executive }),
    category,
    subcategory,
    products,
    serviceInclusion,
    serviceExclusion,
    duration,
    prepTime,
    isPrepTime: sanitizePrepTime,
    timeIncludingPrepTime: sanitizeTimeIncludingPrepTime,
    onSite: sanitizeOnSite,
    inHouse: sanitizeInHouse,
    serviceFor,
    price: { mrp, discount, sellingPrice },
    bookingDays,
    bookingAcceptingHours: {
      from: bookingFrom,
      till: bookingTill,
    },
    coverImage: uploadedImages,
    serviceArea,
    serviceRequirements,
    description,
    // sponsor: "first",
  });
  if (!service)
    throw new ApiError(403, "Something went wrong please try again later");

  return res
    .status(200)
    .json(new ApiResponse(200, service, "Added successfully !"));
});

const getServices = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 20,
    category,
    subcategory,
    serviceFor,
    onSite,
    inHouse,
    search,
    store,
    professional,
    executive,
    sortBy = "latest",
  } = req.query;

  page = Math.max(Number(page) || 1, 1);
  limit = Math.max(Number(limit) || 20, 1);

  const skip = (page - 1) * limit;

  const filter = {
    isActive: true,
  };

  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid category ID."));
    }

    filter.category = category;
  }

  if (subcategory) {
    if (!mongoose.Types.ObjectId.isValid(subcategory)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid subcategory ID."));
    }

    filter.subcategory = subcategory;
  }

  if (serviceFor) {
    filter.serviceFor = serviceFor;
  }

  if (store) {
    if (!mongoose.Types.ObjectId.isValid(store)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid store ID."));
    }

    filter.store = store;
  }

  if (professional) {
    if (!mongoose.Types.ObjectId.isValid(professional)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid professional ID."));
    }

    filter.professional = professional;
  }

  if (executive) {
    if (!mongoose.Types.ObjectId.isValid(executive)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid executive ID."));
    }

    filter.executive = executive;
  }

  if (onSite !== undefined) {
    filter.onSite = onSite === "true";
  }

  if (inHouse !== undefined) {
    filter.inHouse = inHouse === "true";
  }

  if (search?.trim()) {
    filter.name = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  let sort = {};

  switch (sortBy) {
    case "priceLow":
      sort = {
        "price.sellingPrice": 1,
      };
      break;

    case "priceHigh":
      sort = {
        "price.sellingPrice": -1,
      };
      break;

    case "duration":
      sort = {
        duration: 1,
      };
      break;

    case "latest":
    default:
      sort = {
        "sponsor.priority": 1,
        createdAt: -1,
      };
      break;
  }

  const [services, total] = await Promise.all([
    Services.find(filter)
      .populate("store", "storeName")
      .populate("professional", "name")
      .populate("executive", "name")
      .populate("category", "title subcategories")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

    Services.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        services,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
      "Services fetched successfully.",
    ),
  );
});

const getServiceById = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  if (!serviceId) throw new ApiError(400, "Invalid request");

  const service = await Services.findById(serviceId)
    .populate({
      path: "store",
      select: "storeName",
    })
    .populate({
      path: "executive",
      select: "name specialization profileImage designation experience",
    })
    .populate({
      path: "category",
      select: "title",
    })
    .populate({
      path: "professional",
      select: "name images.profileImage gender specialization about",
    });
  if (!service) throw new ApiError(400, "Unable to process request !");

  const otherServices = await Services.find({ store: service.store })
    .select("price coverImage name")
    .limit(10);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { service, otherServices },
        "Data fetched successfully !",
      ),
    );
});

const updateStoreService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  if (!serviceId) throw new ApiError(400, "Invalid request");

  const service = await Services.findById(serviceId);
  if (!service) throw new ApiError(400, "Invalid service requested");

  const payload = req.body.serviceData ? JSON.parse(req.body.serviceData) : {};
  const images = req.files || [];

  const uploadedImages = [];

  for (const img of images) {
    const uploaded = await UploadImages(img.filename, {
      folderStructure: `store/service/${serviceId}`,
    });

    uploadedImages.push({
      url: uploaded.url,
      fileId: uploaded.fileId,
      altText: req.body.name || service.name,
    });
  }

  const normalizedProducts = Array.isArray(payload.products)
    ? payload.products
    : service.products || [];
  const normalizedInclusions = Array.isArray(payload.serviceInclusion)
    ? payload.serviceInclusion
    : service.serviceInclusion || [];
  const normalizedExclusions = Array.isArray(payload.serviceExclusion)
    ? payload.serviceExclusion
    : service.serviceExclusion || [];
  const normalizedRequirements = Array.isArray(payload.serviceRequirements)
    ? payload.serviceRequirements
    : service.serviceRequirements || [];

  service.name = req.body.name || service.name;
  service.category = req.body.category || service.category;
  service.subcategory = req.body.subcategory || service.subcategory;
  service.duration = req.body.duration || service.duration;
  service.executive = req.body.executive || service.executive;
  service.prepTime = req.body.prepTime || service.prepTime;
  service.isPrepTime = req.body.isPrepTime === "on" ? true : service.isPrepTime;
  service.timeIncludingPrepTime =
    req.body.timeIncludingPrepTime === "on"
      ? true
      : service.timeIncludingPrepTime;
  service.serviceFor = req.body.serviceFor || service.serviceFor;
  service.bookingDays = req.body.bookingDays || service.bookingDays;
  service.bookingAcceptingHours = {
    from: req.body.bookingFrom || service.bookingAcceptingHours?.from,
    till: req.body.bookingTill || service.bookingAcceptingHours?.till,
  };
  service.onSite = req.body.onSite === "on" ? true : service.onSite;
  service.inHouse = req.body.inHouse === "on" ? true : service.inHouse;
  service.serviceArea = req.body.serviceArea || service.serviceArea;
  service.products = normalizedProducts;
  service.serviceInclusion = normalizedInclusions;
  service.serviceExclusion = normalizedExclusions;
  service.serviceRequirements = normalizedRequirements;

  if (req.body.mrp || req.body.discount || req.body.sellingPrice) {
    service.price = {
      mrp: Number(req.body.mrp || service.price?.mrp || 0),
      discount: Number(req.body.discount || service.price?.discount || 0),
      sellingPrice: Number(
        req.body.sellingPrice || service.price?.sellingPrice || 0,
      ),
    };
  }

  if (uploadedImages.length) {
    service.coverImage = [...(service.coverImage || []), ...uploadedImages];
  }

  await service.save();

  return res
    .status(200)
    .json(new ApiResponse(200, service, "Service updated successfully !"));
});

const deleteStoreService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  if (!serviceId) throw new ApiError(400, "Invalid request");

  const service = await Services.findById(serviceId);
  if (!service) throw new ApiError(400, "Invalid service requested");

  if (service.coverImage?.length) {
    await Promise.all(
      service.coverImage.map((image) =>
        image.fileId ? DeleteImage(image.fileId) : Promise.resolve(),
      ),
    );
  }

  await Services.findByIdAndDelete(serviceId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Service deleted successfully !"));
});

const markAsActiveInactive = asyncHandler(async (req, res) => {
  const { serviceId, action } = req.params;
  if (!serviceId || !action) throw new ApiError(400, "Invalid request");

  const service = await Services.findById(serviceId);
  if (!service) throw new ApiError(400, "Invalid service requested");

  switch (action) {
    case "active": {
      service.isActive = true;
      await service.save();

      return res
        .status(200)
        .json(new ApiResponse(200, service, "Action performed successfully !"));
    }
    case "inactive": {
      service.isActive = false;
      await service.save();

      return res
        .status(200)
        .json(new ApiResponse(200, service, "Action performed successfully !"));
    }
    default: {
      throw new ApiError(400, "Invalid request");
    }
  }
});

export {
  createStoreService,
  getServices,
  getServiceById,
  updateStoreService,
  deleteStoreService,
  markAsActiveInactive,
};
