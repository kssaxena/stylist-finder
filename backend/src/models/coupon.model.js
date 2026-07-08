import mongoose, { Schema } from "mongoose";

const discountConfigSchema = new Schema(
  {
    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    maxDiscountAmount: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  { _id: false }
);

const applicabilitySchema = new Schema(
  {
    providerType: {
      type: String,
      enum: ["platform", "store"],
      default: "platform",
      index: true,
    },

    applicableStores: [
      {
        type: Schema.Types.ObjectId,
        ref: "Store",
      },
    ],

    applicableServices: [
      {
        type: Schema.Types.ObjectId,
        ref: "StoreService",
      },
    ],

    applicableServiceCategories: [
      {
        type: String,
        trim: true,
      },
    ],

    applicableBookingModes: [
      {
        type: String,
        enum: ["in_store", "at_home"],
      },
    ],

    applicableAudience: [
      {
        type: String,
        enum: ["men", "women", "unisex"],
      },
    ],
  },
  { _id: false }
);

const eligibilitySchema = new Schema(
  {
    userEligibilityType: {
      type: String,
      enum: ["all", "new_users_only", "existing_users_only", "specific_users"],
      default: "all",
    },

    specificUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    firstBookingOnly: {
      type: Boolean,
      default: false,
    },

    minBookingAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    maxBookingAmount: {
      type: Number,
      min: 0,
      default: null,
    },

    minCompletedBookingsRequired: {
      type: Number,
      min: 0,
      default: 0,
    },

    maxCompletedBookingsAllowed: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  { _id: false }
);

const usageLimitSchema = new Schema(
  {
    totalUsageLimit: {
      type: Number,
      min: 0,
      default: null,
    },

    perCustomerUsageLimit: {
      type: Number,
      min: 0,
      default: 1,
    },

    totalUsedCount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

const validitySchema = new Schema(
  {
    startsAt: {
      type: Date,
      required: true,
      index: true,
    },

    endsAt: {
      type: Date,
      required: true,
      index: true,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
  },
  { _id: false }
);

const couponSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    couponCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    couponType: {
      type: String,
      enum: ["promo_code", "auto_apply"],
      default: "promo_code",
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    createdByRole: {
      type: String,
      enum: ["admin", "super_admin", "store"],
      required: true,
      index: true,
    },

    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      default: null,
      index: true,
    },

    discount: {
      type: discountConfigSchema,
      required: true,
    },

    applicability: {
      type: applicabilitySchema,
      default: () => ({}),
    },

    eligibility: {
      type: eligibilitySchema,
      default: () => ({}),
    },

    usageLimits: {
      type: usageLimitSchema,
      default: () => ({}),
    },

    validity: {
      type: validitySchema,
      required: true,
    },

    combinability: {
      canCombineWithOtherCoupons: {
        type: Boolean,
        default: false,
      },

      canCombineWithStoreOffers: {
        type: Boolean,
        default: false,
      },
    },

    visibility: {
      showOnCustomerApp: {
        type: Boolean,
        default: true,
      },

      isFeatured: {
        type: Boolean,
        default: false,
      },
    },

    status: {
      type: String,
      enum: ["draft", "active", "paused", "expired", "disabled"],
      default: "draft",
      index: true,
    },

    stats: {
      totalDiscountGiven: {
        type: Number,
        min: 0,
        default: 0,
      },

      totalBookingsUsingCoupon: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    internalNotes: {
      type: String,
      trim: true,
      maxlength: 1500,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.index({ couponCode: 1 }, { unique: true });

couponSchema.index({
  status: 1,
  "validity.startsAt": 1,
  "validity.endsAt": 1,
});

couponSchema.index({
  store: 1,
  status: 1,
});

couponSchema.index({
  createdBy: 1,
  createdAt: -1,
});

couponSchema.index({
  "applicability.providerType": 1,
  status: 1,
});

couponSchema.pre("validate", function (next) {
  if (
    this.discount?.discountType === "percentage" &&
    this.discount.discountValue > 100
  ) {
    return next(new Error("Percentage discount cannot be greater than 100."));
  }

  if (
    this.validity?.startsAt &&
    this.validity?.endsAt &&
    this.validity.endsAt <= this.validity.startsAt
  ) {
    return next(new Error("Coupon end date must be after start date."));
  }

  if (this.createdByRole === "store" && !this.store) {
    return next(new Error("Store coupon must have a store reference."));
  }

  next();
});

couponSchema.pre("save", function (next) {
  if (this.validity?.endsAt && this.validity.endsAt < new Date()) {
    if (!["disabled"].includes(this.status)) {
      this.status = "expired";
    }
  }

  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;