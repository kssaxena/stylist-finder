import mongoose, { Schema } from "mongoose";

const moneyBreakdownSchema = new Schema(
  {
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    baseAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    homeServiceCharge: {
      type: Number,
      min: 0,
      default: 0,
    },

    platformFee: {
      type: Number,
      min: 0,
      default: 0,
    },

    taxAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    tipAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    discountAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    couponDiscountAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    walletUsedAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    grossAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    netPayableAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    amountPaid: {
      type: Number,
      min: 0,
      default: 0,
    },

    amountRefunded: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

const gatewayMetaSchema = new Schema(
  {
    gatewayName: {
      type: String,
      enum: ["razorpay", "stripe", "cashfree", "payu", "offline", "wallet", "other"],
      default: "razorpay",
      index: true,
    },

    gatewayOrderId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    gatewayPaymentId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    gatewaySignature: {
      type: String,
      trim: true,
      default: null,
      select: false,
    },

    gatewayRefundIds: [
      {
        type: String,
        trim: true,
      },
    ],

    receiptId: {
      type: String,
      trim: true,
      default: null,
    },

    rawCreateOrderPayload: {
      type: Schema.Types.Mixed,
      default: null,
      select: false,
    },

    rawPaymentVerificationPayload: {
      type: Schema.Types.Mixed,
      default: null,
      select: false,
    },

    rawWebhookPayloads: [
      {
        event: { type: String, default: null },
        payload: { type: Schema.Types.Mixed, default: null },
        receivedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { _id: false }
);

const refundEntrySchema = new Schema(
  {
    refundId: {
      type: String,
      trim: true,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    reason: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "processed",
    },

    gatewayRefundId: {
      type: String,
      trim: true,
      default: null,
    },

    refundedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    refundedAt: {
      type: Date,
      default: Date.now,
    },

    note: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: true, timestamps: true }
);

const paymentAttemptSchema = new Schema(
  {
    attemptNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["created", "initiated", "success", "failed", "cancelled", "expired"],
      default: "created",
    },

    gatewayOrderId: {
      type: String,
      trim: true,
      default: null,
    },

    gatewayPaymentId: {
      type: String,
      trim: true,
      default: null,
    },

    amount: {
      type: Number,
      min: 0,
      default: 0,
    },

    failureReason: {
      type: String,
      trim: true,
      default: null,
    },

    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const paymentStatusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "created",
        "pending",
        "authorized",
        "paid",
        "failed",
        "cancelled",
        "expired",
        "partially_refunded",
        "refunded",
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

const paymentSchema = new Schema(
  {
    paymentCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
    },

    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
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
      required: true,
      index: true,
    },

    paymentFor: {
      type: String,
      enum: ["booking", "reschedule_fee", "penalty", "manual_adjustment"],
      default: "booking",
      index: true,
    },

    providerType: {
      type: String,
      enum: ["store"],
      default: "store",
      index: true,
    },

    method: {
      type: String,
      enum: ["online", "cash", "wallet", "mixed"],
      default: "online",
      index: true,
    },

    money: {
      type: moneyBreakdownSchema,
      required: true,
    },

    gateway: {
      type: gatewayMetaSchema,
      default: () => ({}),
    },

    status: {
      type: String,
      enum: [
        "created",
        "pending",
        "authorized",
        "paid",
        "failed",
        "cancelled",
        "expired",
        "partially_refunded",
        "refunded",
      ],
      default: "created",
      index: true,
    },

    failureReason: {
      type: String,
      trim: true,
      default: null,
    },

    failureCode: {
      type: String,
      trim: true,
      default: null,
    },

    attempts: [paymentAttemptSchema],

    refunds: [refundEntrySchema],

    statusHistory: [paymentStatusHistorySchema],

    initiatedAt: {
      type: Date,
      default: null,
    },

    authorizedAt: {
      type: Date,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    expiredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    lastRefundedAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    notes: {
      internalNote: {
        type: String,
        trim: true,
        maxlength: 1500,
        default: null,
      },
      customerNote: {
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

paymentSchema.index({ booking: 1, createdAt: -1 });
paymentSchema.index({ customer: 1, createdAt: -1 });
paymentSchema.index({ store: 1, createdAt: -1 });

paymentSchema.index({
  status: 1,
  method: 1,
  "gateway.gatewayName": 1,
});

paymentSchema.index({
  "gateway.gatewayOrderId": 1,
});

paymentSchema.index({
  "gateway.gatewayPaymentId": 1,
});

paymentSchema.index({
  paymentFor: 1,
  status: 1,
});

paymentSchema.index({
  createdAt: -1,
});

paymentSchema.pre("save", function (next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [
      {
        status: this.status || "created",
        note: "Payment record created",
        changedAt: new Date(),
      },
    ];
  }

  next();
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;