import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    planName: {
      type: String,
      enum: ["platinum", "gold", "silver", "bronze", "basic", "custom"],
      required: true,
    },

    planFor: {
      type: String,
      enum: ["customer", "store", "professional", "custom"],
      required: true,
    },

    customModel: {
      type: Boolean,
      default: false,
    },

    customModelFor: String,

    tagline: String,

    validity: {
      months: Number,
      renewalType: {
        type: String,
        enum: ["oneTime", "monthly", "yearly"],
        default: "yearly",
      },
    },

    price: {
      mrp: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      sellingPrice: { type: Number, required: true },
    },

    support: {
      type: String,
      enum: ["basic", "priority", "dedicated"],
      default: "basic",
    },

    mediaLimit: {
      photos: Number,
      videos: Number,
      unlimitedPhotos: Boolean,
      unlimitedVideos: Boolean,
    },

    serviceLimit: {
      count: { type: Number, default: 0, min: 0 },
      unlimited: { type: Boolean, default: false },
    },

    booking: {
      enabled: Boolean,
      advancedBooking: Boolean,
    },

    visibility: {
      featured: Boolean,
      verifiedBadge: Boolean,
    },

    franchise: {
      enabled: Boolean,
      enquiryButton: Boolean,
    },

    managementTools: {
      staffAttendance: Boolean,
      inventory: Boolean,
      commissionTracking: Boolean,
      analytics: Boolean,
    },

    marketing: {
      socialPromotion: Boolean,
      couponManager: Boolean,
      smsWhatsapp: Boolean,
      reviews: Boolean,
    },

    features: [String],

    faqs: [
      {
        question: String,
        answer: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
