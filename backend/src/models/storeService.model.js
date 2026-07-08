import mongoose, { Schema } from "mongoose";

const mediaSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    fileId: { type: String, default: null },
    alt: { type: String, trim: true, default: null },
    isFeatured: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true },
);

const pricingSchema = new Schema(
  {
    priceType: {
      type: String,
      enum: ["fixed", "starting_from", "custom_quote"],
      default: "fixed",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountedPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    currency: {
      type: String,
      default: "INR",
    },

    homeServiceExtraCharge: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: false },
);

const durationSchema = new Schema(
  {
    durationMinutes: {
      type: Number,
      required: true,
      min: 5,
    },

    prepTimeMinutes: {
      type: Number,
      min: 0,
      default: 0,
    },

    cleanupTimeMinutes: {
      type: Number,
      min: 0,
      default: 0,
    },

    bufferAfterMinutes: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: false },
);

const bookingConfigSchema = new Schema(
  {
    slotIntervalMinutes: {
      type: Number,
      min: 5,
      default: 15,
    },

    maxBookingsPerSlot: {
      type: Number,
      min: 1,
      default: 1,
    },

    requiresStaffAssignment: {
      type: Boolean,
      default: true,
    },

    requiredStaffCount: {
      type: Number,
      min: 1,
      default: 1,
    },

    resourceType: {
      type: String,
      enum: ["none", "chair", "bed", "room"],
      default: "none",
    },

    resourceCountRequired: {
      type: Number,
      min: 1,
      default: 1,
    },

    allowConcurrentBookings: {
      type: Boolean,
      default: false,
    },

    requiresManualApproval: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const homeServiceConfigSchema = new Schema(
  {
    isAvailableForHomeService: {
      type: Boolean,
      default: false,
    },

    serviceRadiusKm: {
      type: Number,
      min: 0,
      default: 0,
    },

    serviceAreas: [
      {
        type: String,
        trim: true,
      },
    ],

    travelBufferMinutes: {
      type: Number,
      min: 0,
      default: 30,
    },

    extraCharge: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: false },
);

const storeServiceSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    serviceCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    subCategory: {
      type: String,
      trim: true,
      default: null,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2500,
      default: null,
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 300,
      default: null,
    },

    images: [mediaSchema],

    pricing: pricingSchema,

    duration: durationSchema,

    availabilityMode: {
      type: String,
      enum: ["in_store", "at_home", "both"],
      default: "in_store",
      index: true,
    },

    bookingConfig: bookingConfigSchema,

    homeServiceConfig: homeServiceConfigSchema,

    targetAudience: {
      type: String,
      enum: ["men", "women", "unisex"],
      default: "unisex",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    seo: {
      metaTitle: {
        type: String,
        trim: true,
        default: null,
      },
      metaDescription: {
        type: String,
        trim: true,
        default: null,
      },
    },

    stats: {
      totalBookings: {
        type: Number,
        min: 0,
        default: 0,
      },
      completedBookings: {
        type: Number,
        min: 0,
        default: 0,
      },
      cancelledBookings: {
        type: Number,
        min: 0,
        default: 0,
      },
      ratingAverage: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      ratingCount: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    visibility: {
      isFeatured: { type: Boolean, default: false },
      isPublished: { type: Boolean, default: true },
      isActive: { type: Boolean, default: true, index: true },
      isDeleted: { type: Boolean, default: false, index: true },
      deletedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  },
);

storeServiceSchema.index({ store: 1, name: 1 });
storeServiceSchema.index({ store: 1, slug: 1 }, { sparse: true });
storeServiceSchema.index({ store: 1, category: 1 });
storeServiceSchema.index({ availabilityMode: 1, targetAudience: 1 });
storeServiceSchema.index({
  "visibility.isActive": 1,
  "visibility.isDeleted": 1,
  "visibility.isPublished": 1,
});
storeServiceSchema.index({ "stats.ratingAverage": -1 });

const StoreService = mongoose.model("StoreService", storeServiceSchema);

export default StoreService;
