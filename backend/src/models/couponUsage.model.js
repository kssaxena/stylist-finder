import mongoose, { Schema } from "mongoose";

const couponSnapshotSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    couponTitle: {
      type: String,
      default: null,
      trim: true,
    },

    couponType: {
      type: String,
      enum: ["promo_code", "auto_apply"],
      default: "promo_code",
    },

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

const usagePricingSchema = new Schema(
  {
    bookingAmountBeforeDiscount: {
      type: Number,
      required: true,
      min: 0,
    },

    discountAppliedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    finalAmountAfterDiscount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      trim: true,
      uppercase: true,
    },
  },
  { _id: false }
);

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["reserved", "applied", "released", "cancelled", "refunded"],
      required: true,
    },

    note: {
      type: String,
      trim: true,
      default: null,
    },

    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const releaseMetaSchema = new Schema(
  {
    releaseReason: {
      type: String,
      trim: true,
      default: null,
    },

    releasedAt: {
      type: Date,
      default: null,
    },

    releasedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { _id: false }
);

const refundMetaSchema = new Schema(
  {
    refundAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    refundReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const couponUsageSchema = new Schema(
  {
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
      index: true,
    },

    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
      index: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    customerProfile: {
      type: Schema.Types.ObjectId,
      ref: "CustomerProfile",
      default: null,
      index: true,
    },

    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    service: {
      type: Schema.Types.ObjectId,
      ref: "StoreService",
      default: null,
      index: true,
    },

    couponSnapshot: {
      type: couponSnapshotSchema,
      required: true,
    },

    pricing: {
      type: usagePricingSchema,
      required: true,
    },

    status: {
      type: String,
      enum: ["reserved", "applied", "released", "cancelled", "refunded"],
      default: "reserved",
      index: true,
    },

    countsTowardUsageLimit: {
      type: Boolean,
      default: false,
      index: true,
    },

    reservationExpiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    appliedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    releasedMeta: {
      type: releaseMetaSchema,
      default: () => ({}),
    },

    refundMeta: {
      type: refundMetaSchema,
      default: () => ({}),
    },

    statusHistory: [statusHistorySchema],

    source: {
      type: String,
      enum: ["customer_checkout", "store_panel", "admin_panel", "system"],
      default: "customer_checkout",
      index: true,
    },

    notes: {
      internalNote: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: null,
      },
    },

    visibility: {
      isActive: {
        type: Boolean,
        default: true,
        index: true,
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
  },
  {
    timestamps: true,
  }
);

couponUsageSchema.index({ booking: 1 }, { unique: true });

couponUsageSchema.index({
  coupon: 1,
  customer: 1,
  status: 1,
});

couponUsageSchema.index({
  coupon: 1,
  status: 1,
  countsTowardUsageLimit: 1,
});

couponUsageSchema.index({
  customer: 1,
  coupon: 1,
  status: 1,
});

couponUsageSchema.index({
  reservationExpiresAt: 1,
  status: 1,
});

couponUsageSchema.index({
  payment: 1,
});

couponUsageSchema.index({
  store: 1,
  createdAt: -1,
});

couponUsageSchema.pre("save", function (next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [
      {
        status: this.status || "reserved",
        note: "Coupon usage created",
        changedAt: new Date(),
      },
    ];
  }

  if (this.status === "applied") {
    this.countsTowardUsageLimit = true;
    if (!this.appliedAt) this.appliedAt = new Date();
  }

  if (["released", "cancelled"].includes(this.status)) {
    this.countsTowardUsageLimit = false;
  }

  if (this.status === "refunded") {
    this.countsTowardUsageLimit = true;
  }

  next();
});

const CouponUsage = mongoose.model("CouponUsage", couponUsageSchema);

export default CouponUsage;