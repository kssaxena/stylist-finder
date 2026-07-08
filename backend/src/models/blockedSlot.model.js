import mongoose, { Schema } from "mongoose";

const timeRangeSchema = new Schema(
  {
    slotDate: {
      type: Date,
      required: true,
      index: true,
    },

    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      required: true,
      trim: true,
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
  },
  { _id: false }
);

const targetSchema = new Schema(
  {
    blockLevel: {
      type: String,
      enum: ["store", "service", "staff", "resource", "booking_hold"],
      required: true,
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

    staff: {
      type: Schema.Types.ObjectId,
      ref: "StoreStaff",
      default: null,
      index: true,
    },

    resourceType: {
      type: String,
      trim: true,
      default: null,
    },

    resourceId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
  },
  { _id: false }
);

const blockModeSchema = new Schema(
  {
    appliesToInStore: {
      type: Boolean,
      default: true,
    },

    appliesToAtHome: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const holdMetaSchema = new Schema(
  {
    heldByCustomer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
      index: true,
    },

    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
      index: true,
    },

    holdReason: {
      type: String,
      trim: true,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { _id: false }
);

const releaseMetaSchema = new Schema(
  {
    releasedAt: {
      type: Date,
      default: null,
    },

    releasedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    releaseReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const blockedSlotSchema = new Schema(
  {
    blockCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    target: {
      type: targetSchema,
      required: true,
    },

    serviceBookingMode: {
      type: String,
      enum: ["in_store", "at_home"],
      required: true,
      index: true,
    },

    timeRange: {
      type: timeRangeSchema,
      required: true,
    },

    blockType: {
      type: String,
      enum: [
        "temporary_hold",
        "confirmed_booking",
        "manual_block",
        "staff_leave",
        "maintenance",
        "resource_block",
      ],
      required: true,
      index: true,
    },

    blockMode: {
      type: blockModeSchema,
      default: () => ({}),
    },

    capacityBlocked: {
      type: Number,
      min: 1,
      default: 1,
    },

    status: {
      type: String,
      enum: ["active", "released", "expired", "consumed", "cancelled"],
      default: "active",
      index: true,
    },

    holdMeta: {
      type: holdMetaSchema,
      default: () => ({}),
    },

    releaseMeta: {
      type: releaseMetaSchema,
      default: () => ({}),
    },

    note: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    internalReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

blockedSlotSchema.index({ blockCode: 1 }, { unique: true });

blockedSlotSchema.index({
  "target.store": 1,
  "target.service": 1,
  "target.staff": 1,
  serviceBookingMode: 1,
  status: 1,
  "timeRange.startDateTime": 1,
  "timeRange.endDateTime": 1,
});

blockedSlotSchema.index({
  "target.store": 1,
  blockType: 1,
  status: 1,
});

blockedSlotSchema.index({
  "holdMeta.booking": 1,
});

blockedSlotSchema.index({
  "holdMeta.payment": 1,
});

blockedSlotSchema.index({
  "holdMeta.heldByCustomer": 1,
  status: 1,
});

blockedSlotSchema.index({
  "holdMeta.expiresAt": 1,
  status: 1,
});

blockedSlotSchema.pre("validate", function (next) {
  const { blockLevel, service, staff, resourceId } = this.target || {};

  if (this.timeRange?.endDateTime <= this.timeRange?.startDateTime) {
    return next(new Error("Blocked slot endDateTime must be after startDateTime."));
  }

  if (blockLevel === "service" && !service) {
    return next(new Error("Service-level blocked slot must include target.service."));
  }

  if (blockLevel === "staff" && !staff) {
    return next(new Error("Staff-level blocked slot must include target.staff."));
  }

  if (blockLevel === "resource" && !resourceId) {
    return next(new Error("Resource-level blocked slot must include target.resourceId."));
  }

  if (this.blockType === "temporary_hold" && !this.holdMeta?.expiresAt) {
    return next(new Error("Temporary hold blocked slot must include holdMeta.expiresAt."));
  }

  if (this.blockType === "confirmed_booking" && !this.holdMeta?.booking) {
    return next(new Error("Confirmed booking blocked slot must include linked booking."));
  }

  next();
});

blockedSlotSchema.pre("save", function (next) {
  if (
    this.status === "active" &&
    this.blockType === "temporary_hold" &&
    this.holdMeta?.expiresAt &&
    this.holdMeta.expiresAt < new Date()
  ) {
    this.status = "expired";
  }

  next();
});

const BlockedSlot = mongoose.model("BlockedSlot", blockedSlotSchema);

export default BlockedSlot;