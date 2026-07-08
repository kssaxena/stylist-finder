import mongoose, { Schema } from "mongoose";

const commissionConfigSchema = new Schema(
  {
    commissionModel: {
      type: String,
      enum: ["percentage", "flat_per_booking", "fixed_monthly", "hybrid"],
      default: "percentage",
    },

    commissionValue: {
      type: Number,
      min: 0,
      default: 0,
    },

    professionalSharePercent: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    storeSharePercent: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    platformSharePercent: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    payoutCycle: {
      type: String,
      enum: ["per_booking", "weekly", "biweekly", "monthly", "manual"],
      default: "weekly",
    },

    notes: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const serviceScopeSchema = new Schema(
  {
    allowedServices: [
      {
        type: Schema.Types.ObjectId,
        ref: "StoreService",
      },
    ],

    restrictedServices: [
      {
        type: Schema.Types.ObjectId,
        ref: "StoreService",
      },
    ],

    allowedCategories: [
      {
        type: String,
        trim: true,
      },
    ],

    canAcceptDirectStoreBookings: {
      type: Boolean,
      default: true,
    },

    canAcceptHomeServiceBookingsViaStore: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const scheduleRuleSchema = new Schema(
  {
    worksWithStoreSchedule: {
      type: Boolean,
      default: true,
    },

    customWorkingDays: [
      {
        dayOfWeek: {
          type: Number,
          min: 0,
          max: 6,
          required: true,
        },
        startTime: {
          type: String,
          trim: true,
          required: true,
        },
        endTime: {
          type: String,
          trim: true,
          required: true,
        },
      },
    ],

    appointmentBufferInMinutes: {
      type: Number,
      min: 0,
      default: 0,
    },

    maxBookingsPerDayForThisStore: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  { _id: false }
);

const lifecycleSchema = new Schema(
  {
    linkedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    activeFrom: {
      type: Date,
      default: null,
    },

    activeTill: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    endReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const professionalStoreLinkSchema = new Schema(
  {
    professional: {
      type: Schema.Types.ObjectId,
      ref: "ProfessionalProfile",
      required: true,
      index: true,
    },

    professionalUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    storeOwnerUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    relationshipType: {
      type: String,
      enum: [
        "exclusive_partner",
        "non_exclusive_partner",
        "visiting_professional",
        "on_demand_associate",
        "rented_chair_or_space",
      ],
      default: "non_exclusive_partner",
      index: true,
    },

    status: {
      type: String,
      enum: [
        "invited",
        "pending_professional_approval",
        "pending_store_approval",
        "active",
        "paused",
        "rejected",
        "ended",
        "suspended",
      ],
      default: "pending_store_approval",
      index: true,
    },

    serviceScope: {
      type: serviceScopeSchema,
      default: () => ({}),
    },

    commissionConfig: {
      type: commissionConfigSchema,
      default: () => ({}),
    },

    scheduleRules: {
      type: scheduleRuleSchema,
      default: () => ({}),
    },

    lifecycle: {
      type: lifecycleSchema,
      default: () => ({}),
    },

    source: {
      type: String,
      enum: ["professional_request", "store_invite", "admin_created", "system"],
      default: "professional_request",
      index: true,
    },

    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    internalNote: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },

    isPrimaryStore: {
      type: Boolean,
      default: false,
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

professionalStoreLinkSchema.index(
  { professional: 1, store: 1 },
  { unique: true }
);

professionalStoreLinkSchema.index({
  professionalUser: 1,
  status: 1,
  createdAt: -1,
});

professionalStoreLinkSchema.index({
  store: 1,
  status: 1,
  createdAt: -1,
});

professionalStoreLinkSchema.index({
  relationshipType: 1,
  status: 1,
});

professionalStoreLinkSchema.index({
  isPrimaryStore: 1,
  professional: 1,
});

professionalStoreLinkSchema.pre("validate", function (next) {
  if (!this.professional || !this.professionalUser || !this.store) {
    return next(
      new Error(
        "professional, professionalUser, and store are required in ProfessionalStoreLink."
      )
    );
  }

  if (
    this.lifecycle?.activeFrom &&
    this.lifecycle?.activeTill &&
    this.lifecycle.activeTill < this.lifecycle.activeFrom
  ) {
    return next(new Error("activeTill cannot be before activeFrom."));
  }

  const {
    professionalSharePercent,
    storeSharePercent,
    platformSharePercent,
  } = this.commissionConfig || {};

  const shareFields = [
    professionalSharePercent,
    storeSharePercent,
    platformSharePercent,
  ].filter((v) => typeof v === "number");

  if (shareFields.length > 0) {
    const total =
      (professionalSharePercent || 0) +
      (storeSharePercent || 0) +
      (platformSharePercent || 0);

    if (total > 100) {
      return next(
        new Error("professional/store/platform share percentages cannot exceed 100.")
      );
    }
  }

  next();
});

const ProfessionalStoreLink = mongoose.model(
  "ProfessionalStoreLink",
  professionalStoreLinkSchema
);

export default ProfessionalStoreLink;