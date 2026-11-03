import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import { Store } from "../models/store.model.js";
import { Admin } from "../models/admin.model.js";

const createSubscription = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(404, "Admin not found.");

  const { planName, planFor, customModel, customModelFor, tagline, isActive } =
    req.body;

  if (!req.body.parsingData) {
    throw new ApiError(400, "Subscription data is missing.");
  }

  const parsed = JSON.parse(req.body.parsingData);

  const {
    validity = {},
    price = {},
    support = "basic",
    mediaLimit = {},
    serviceLimit = {},
    booking = {},
    visibility = {},
    franchise = {},
    managementTools = {},
    marketing = {},
    features = [],
    faqs = [],
  } = parsed;

  if (
    !planName ||
    !planFor ||
    price.mrp === undefined ||
    price.sellingPrice === undefined ||
    !validity.months
  ) {
    throw new ApiError(400, "Required fields are missing.");
  }

  const newSubscription = await Subscription.create({
    admin: adminId,

    planName,
    planFor,

    customModel:
      customModel === "true" || planFor === "custom" || Boolean(customModelFor),

    customModelFor,
    tagline,

    validity: {
      months: Number(validity.months),
      renewalType: validity.renewalType || "yearly",
    },

    price: {
      mrp: Number(price.mrp),
      discount: Number(price.discount || 0),
      sellingPrice: Number(price.sellingPrice),
    },

    support,

    mediaLimit: {
      photos: Number(mediaLimit.photos || 0),
      videos: Number(mediaLimit.videos || 0),
      unlimitedPhotos: Boolean(mediaLimit.unlimitedPhotos),
      unlimitedVideos: Boolean(mediaLimit.unlimitedVideos),
    },

    serviceLimit: {
      count: Number(serviceLimit.count || 0),
      unlimited: Boolean(serviceLimit.unlimited),
    },

    booking: {
      enabled: Boolean(booking.enabled),
      advancedBooking: Boolean(booking.advancedBooking),
    },

    visibility: {
      featured: Boolean(visibility.featured),
      verifiedBadge: Boolean(visibility.verifiedBadge),
    },

    franchise: {
      enabled: Boolean(franchise.enabled),
      enquiryButton: Boolean(franchise.enquiryButton),
    },

    managementTools: {
      staffAttendance: Boolean(managementTools.staffAttendance),
      inventory: Boolean(managementTools.inventory),
      commissionTracking: Boolean(managementTools.commissionTracking),
      analytics: Boolean(managementTools.analytics),
    },

    marketing: {
      socialPromotion: Boolean(marketing.socialPromotion),
      couponManager: Boolean(marketing.couponManager),
      smsWhatsapp: Boolean(marketing.smsWhatsapp),
      reviews: Boolean(marketing.reviews),
    },

    features,
    faqs,

    // isActive: isActive === "true",
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newSubscription,
        "Subscription created successfully.",
      ),
    );
});

const getSubscriptionByMadeFor = asyncHandler(async (req, res) => {
  const { query } = req.params;
  if (!query) throw new ApiError(400, "Invalid request");

  const subscription = await Subscription.find({
    planFor: query.toLowerCase(),
    isActive: true,
  }).select("-admin");
  if (!subscription) throw new ApiError(400, "No subscriptions found !");

  return res
    .status(200)
    .json(new ApiResponse(200, subscription, "Fetched successfully !"));
});

const getAllSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.find();
  if (!subscription) throw new ApiError(400, "No subscription found");

  return res
    .status(200)
    .json(new ApiResponse(400, subscription, "Data fetched successfully !"));
});

const purchaseSubscription = asyncHandler(async (req, res) => {
  const { subscriptionId, userId } = req.params;
  if (!subscriptionId || !userId) throw new ApiError(400, "Invalid request");

  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new ApiError(400, "Subscription not available");

  if (
    subscription.planFor !== "store" ||
    subscription.price.sellingPrice > 0 ||
    req.user?._id?.toString() !== userId.toString()
  ) {
    throw new ApiError(400, "Invalid complimentary subscription purchase");
  }

  const validity = new Date();
  validity.setMonth(validity.getMonth() + (subscription.validity.months || 0));
  const store = await Store.findByIdAndUpdate(
    userId,
    {
      subscription: {
        subscriptionModel: subscriptionId,
        subscriptionPurchased: true,
        subscriptionValidity: validity,
      },
    },
    { new: true },
  );
  if (!store) throw new ApiError(400, "Unable to process request");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Complimentary subscription activated"));
});

const getSubscriptionById = asyncHandler(async (req, res) => {
  const { subscriptionId } = req.params;
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new ApiError(400, "Data not found");

  return res
    .status(200)
    .json(new ApiResponse(200, subscription, "Data fetched successfully !"));
});

const updateSubscription = asyncHandler(async (req, res) => {
  const { subscriptionId } = req.params;
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new ApiError(404, "Subscription not found");
  if (!req.body.parsingData)
    throw new ApiError(400, "Subscription data is missing.");

  const parsed = JSON.parse(req.body.parsingData);
  const { planName, planFor, customModelFor, tagline, isActive } = req.body;
  const updated = await Subscription.findByIdAndUpdate(
    subscriptionId,
    {
      planName,
      planFor,
      customModel:
        req.body.customModel === "true" ||
        planFor === "custom" ||
        Boolean(customModelFor),
      customModelFor,
      tagline,
      validity: {
        months: Number(parsed.validity?.months),
        renewalType: parsed.validity?.renewalType || "yearly",
      },
      price: {
        mrp: Number(parsed.price?.mrp),
        discount: Number(parsed.price?.discount || 0),
        sellingPrice: Number(parsed.price?.sellingPrice),
      },
      support: parsed.support || "basic",
      mediaLimit: {
        photos: Number(parsed.mediaLimit?.photos || 0),
        videos: Number(parsed.mediaLimit?.videos || 0),
        unlimitedPhotos: Boolean(parsed.mediaLimit?.unlimitedPhotos),
        unlimitedVideos: Boolean(parsed.mediaLimit?.unlimitedVideos),
      },
      serviceLimit: {
        count: Number(parsed.serviceLimit?.count || 0),
        unlimited: Boolean(parsed.serviceLimit?.unlimited),
      },
      booking: parsed.booking || {},
      visibility: parsed.visibility || {},
      franchise: parsed.franchise || {},
      managementTools: parsed.managementTools || {},
      marketing: parsed.marketing || {},
      features: parsed.features || [],
      faqs: parsed.faqs || [],
      isActive: isActive === "true",
    },
    { new: true, runValidators: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Subscription updated successfully."));
});

export {
  createSubscription,
  getSubscriptionByMadeFor,
  getAllSubscription,
  purchaseSubscription,
  getSubscriptionById,
  updateSubscription,
};
