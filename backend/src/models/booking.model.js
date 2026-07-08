import mongoose, { Schema } from "mongoose";

const bookingAddressSchema = new Schema(
  {
    fullName: { type: String, trim: true, default: null },
    phoneNumber: { type: String, trim: true, default: null },

    addressLine1: { type: String, trim: true, default: null },
    addressLine2: { type: String, trim: true, default: null },
    landmark: { type: String, trim: true, default: null },
    locality: { type: String, trim: true, default: null },

    city: { type: String, trim: true, default: null },
    state: { type: String, trim: true, default: null },
    country: { type: String, trim: true, default: "India" },
    pincode: { type: String, trim: true, default: null },

    geo: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: undefined,
      },
    },
  },
  { _id: false }
);

const bookedServiceSnapshotSchema = new Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "StoreService",
      required: true,
    },

    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    serviceSlug: {
      type: String,
      trim: true,
      default: null,
    },

    category: {
      type: String,
      trim: true,
      default: null,
    },

    subCategory: {
      type: String,
      trim: true,
      default: null,
    },

    availabilityMode: {
      type: String,
      enum: ["in_store", "at_home", "both"],
      default: "in_store",
    },

    targetAudience: {
      type: String,
      enum: ["men", "women", "unisex"],
      default: "unisex",
    },
  },
  { _id: false }
);

const bookedPricingSnapshotSchema = new Schema(
  {
    priceType: {
      type: String,
      enum: ["fixed", "starting_from", "custom_quote"],
      default: "fixed",
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    homeServiceExtraCharge: {
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

    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },
  },
  { _id: false }
);

const bookedDurationSnapshotSchema = new Schema(
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

    totalOccupiedMinutes: {
      type: Number,
      required: true,
      min: 5,
    },
  },
  { _id: false }
);

const resourceSnapshotSchema = new Schema(
  {
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
  },
  { _id: false }
);

const paymentSnapshotSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["online", "cash", "wallet", "mixed", "unknown"],
      default: "unknown",
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "partial_refund",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    gatewayName: {
      type: String,
      trim: true,
      default: null,
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

    gatewaySignature: {
      type: String,
      trim: true,
      default: null,
      select: false,
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

    paidAt: {
      type: Date,
      default: null,
    },

    refundedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "pending_payment",
        "confirmed",
        "checked_in",
        "in_progress",
        "completed",
        "cancelled",
        "rejected",
        "no_show",
        "rescheduled",
        "expired",
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

const bookingSchema = new Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
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

    assignedStaff: [
      {
        type: Schema.Types.ObjectId,
        ref: "StoreStaff",
      },
    ],

    bookingMode: {
      type: String,
      enum: ["in_store", "at_home"],
      required: true,
      index: true,
    },

    bookingDate: {
      type: String,
      required: true,
      index: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    startDateTime: {
      type: Date,
      required: true,
      index: true,
    },

    endDateTime: {
      type: Date,
      required: true,
      index: true,
    },

    bookedServiceSnapshot: {
      type: bookedServiceSnapshotSchema,
      required: true,
    },

    bookedPricingSnapshot: {
      type: bookedPricingSnapshotSchema,
      required: true,
    },

    bookedDurationSnapshot: {
      type: bookedDurationSnapshotSchema,
      required: true,
    },

    resourceSnapshot: {
      type: resourceSnapshotSchema,
      default: () => ({}),
    },

    homeServiceAddress: {
      type: bookingAddressSchema,
      default: null,
    },

    notes: {
      customerNote: {
        type: String,
        trim: true,
        maxlength: 1500,
        default: null,
      },
      storeNote: {
        type: String,
        trim: true,
        maxlength: 1500,
        default: null,
      },
      internalNote: {
        type: String,
        trim: true,
        maxlength: 1500,
        default: null,
      },
      cancellationReason: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: null,
      },
      rescheduleReason: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: null,
      },
    },

    status: {
      type: String,
      enum: [
        "pending_payment",
        "confirmed",
        "checked_in",
        "in_progress",
        "completed",
        "cancelled",
        "rejected",
        "no_show",
        "rescheduled",
        "expired",
      ],
      default: "pending_payment",
      index: true,
    },

    statusHistory: [statusHistorySchema],

    payment: {
      type: paymentSnapshotSchema,
      default: () => ({}),
    },

    slotHold: {
      isHeld: {
        type: Boolean,
        default: false,
        index: true,
      },
      holdExpiresAt: {
        type: Date,
        default: null,
        index: true,
      },
    },

    rescheduleMeta: {
      parentBooking: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        default: null,
      },
      childBooking: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        default: null,
      },
      rescheduledAt: {
        type: Date,
        default: null,
      },
    },

    cancellationMeta: {
      cancelledBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      cancelledAt: {
        type: Date,
        default: null,
      },
      refundInitiated: {
        type: Boolean,
        default: false,
      },
    },

    completionMeta: {
      checkedInAt: {
        type: Date,
        default: null,
      },
      serviceStartedAt: {
        type: Date,
        default: null,
      },
      completedAt: {
        type: Date,
        default: null,
      },
    },

    source: {
      type: String,
      enum: ["customer_app", "store_panel", "admin_panel", "walk_in", "system"],
      default: "customer_app",
      index: true,
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

bookingSchema.index({ customer: 1, createdAt: -1 });

bookingSchema.index({
  store: 1,
  bookingDate: 1,
  status: 1,
});

bookingSchema.index({
  store: 1,
  startDateTime: 1,
  endDateTime: 1,
  status: 1,
});

bookingSchema.index({
  assignedStaff: 1,
  startDateTime: 1,
  endDateTime: 1,
  status: 1,
});

bookingSchema.index({
  service: 1,
  bookingDate: 1,
  status: 1,
});

bookingSchema.index({
  "slotHold.isHeld": 1,
  "slotHold.holdExpiresAt": 1,
});

bookingSchema.index({
  status: 1,
  "payment.paymentStatus": 1,
});

bookingSchema.index({
  bookingMode: 1,
  status: 1,
});

bookingSchema.pre("save", function (next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [
      {
        status: this.status || "pending_payment",
        note: "Booking created",
        changedAt: new Date(),
      },
    ];
  }

  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;