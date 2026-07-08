import mongoose, { Schema } from "mongoose";

const payoutItemSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      index: true,
    },

    service: {
      type: Schema.Types.ObjectId,
      ref: "StoreService",
      default: null,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    bookingCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },

    paymentCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },

    grossBookingAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    couponDiscountAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    netCollectedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    platformCommissionAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    platformCommissionPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    paymentGatewayFeeAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    taxAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    otherAdjustmentAmount: {
      type: Number,
      default: 0,
    },

    storePayableAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    includedAt: {
      type: Date,
      default: Date.now,
    },

    note: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: true }
);

const payoutSummarySchema = new Schema(
  {
    grossBookingAmountTotal: {
      type: Number,
      min: 0,
      default: 0,
    },

    couponDiscountAmountTotal: {
      type: Number,
      min: 0,
      default: 0,
    },

    netCollectedAmountTotal: {
      type: Number,
      min: 0,
      default: 0,
    },

    platformCommissionAmountTotal: {
      type: Number,
      min: 0,
      default: 0,
    },

    paymentGatewayFeeAmountTotal: {
      type: Number,
      min: 0,
      default: 0,
    },

    taxAmountTotal: {
      type: Number,
      min: 0,
      default: 0,
    },

    otherAdjustmentAmountTotal: {
      type: Number,
      default: 0,
    },

    finalPayableAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

const transferMetaSchema = new Schema(
  {
    transferMethod: {
      type: String,
      enum: ["bank_transfer", "upi", "manual", "wallet", "other"],
      default: "bank_transfer",
    },

    transferReferenceId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    bankReferenceNumber: {
      type: String,
      trim: true,
      default: null,
    },

    beneficiaryName: {
      type: String,
      trim: true,
      default: null,
    },

    beneficiaryBankName: {
      type: String,
      trim: true,
      default: null,
    },

    beneficiaryAccountMasked: {
      type: String,
      trim: true,
      default: null,
    },

    beneficiaryUpiId: {
      type: String,
      trim: true,
      default: null,
    },

    transferNote: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const payoutStatusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "draft",
        "scheduled",
        "processing",
        "paid",
        "failed",
        "reversed",
        "cancelled",
      ],
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

const payoutSchema = new Schema(
  {
    payoutCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
    },

    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    payoutType: {
      type: String,
      enum: ["regular_settlement", "manual_adjustment", "refund_adjustment"],
      default: "regular_settlement",
      index: true,
    },

    settlementPeriod: {
      from: {
        type: Date,
        default: null,
        index: true,
      },

      to: {
        type: Date,
        default: null,
        index: true,
      },
    },

    items: {
      type: [payoutItemSchema],
      default: [],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Payout must contain at least one payout item.",
      },
    },

    summary: {
      type: payoutSummarySchema,
      default: () => ({}),
    },

    status: {
      type: String,
      enum: [
        "draft",
        "scheduled",
        "processing",
        "paid",
        "failed",
        "reversed",
        "cancelled",
      ],
      default: "draft",
      index: true,
    },

    transferMeta: {
      type: transferMetaSchema,
      default: () => ({}),
    },

    scheduledAt: {
      type: Date,
      default: null,
    },

    processedAt: {
      type: Date,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    failedAt: {
      type: Date,
      default: null,
    },

    reversedAt: {
      type: Date,
      default: null,
    },

    failureReason: {
      type: String,
      trim: true,
      default: null,
    },

    reversalReason: {
      type: String,
      trim: true,
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    statusHistory: [payoutStatusHistorySchema],

    notes: {
      internalNote: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: null,
      },

      storeVisibleNote: {
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

payoutSchema.index({ payoutCode: 1 }, { unique: true });

payoutSchema.index({
  store: 1,
  status: 1,
  createdAt: -1,
});

payoutSchema.index({
  payoutType: 1,
  status: 1,
});

payoutSchema.index({
  "settlementPeriod.from": 1,
  "settlementPeriod.to": 1,
});

payoutSchema.index({
  "items.booking": 1,
});

payoutSchema.index({
  "items.payment": 1,
});

payoutSchema.index({
  "transferMeta.transferReferenceId": 1,
});

payoutSchema.pre("save", function (next) {
  if (this.items?.length) {
    const summary = {
      grossBookingAmountTotal: 0,
      couponDiscountAmountTotal: 0,
      netCollectedAmountTotal: 0,
      platformCommissionAmountTotal: 0,
      paymentGatewayFeeAmountTotal: 0,
      taxAmountTotal: 0,
      otherAdjustmentAmountTotal: 0,
      finalPayableAmount: 0,
    };

    for (const item of this.items) {
      summary.grossBookingAmountTotal += item.grossBookingAmount || 0;
      summary.couponDiscountAmountTotal += item.couponDiscountAmount || 0;
      summary.netCollectedAmountTotal += item.netCollectedAmount || 0;
      summary.platformCommissionAmountTotal += item.platformCommissionAmount || 0;
      summary.paymentGatewayFeeAmountTotal += item.paymentGatewayFeeAmount || 0;
      summary.taxAmountTotal += item.taxAmount || 0;
      summary.otherAdjustmentAmountTotal += item.otherAdjustmentAmount || 0;
      summary.finalPayableAmount += item.storePayableAmount || 0;
    }

    this.summary = summary;
  }

  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [
      {
        status: this.status || "draft",
        note: "Payout record created",
        changedAt: new Date(),
      },
    ];
  }

  next();
});

const Payout = mongoose.model("Payout", payoutSchema);

export default Payout;