import mongoose, { Schema } from "mongoose";

const timeWindowSchema = new Schema(
  {
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

    capacityOverride: {
      type: Number,
      min: 0,
      default: null,
    },

    note: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: true }
);

const overrideTargetSchema = new Schema(
  {
    overrideLevel: {
      type: String,
      enum: ["store", "service", "staff"],
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
  },
  { _id: false }
);

const dateRangeSchema = new Schema(
  {
    startDate: {
      type: Date,
      required: true,
      index: true,
    },

    endDate: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { _id: false }
);

const modeApplicabilitySchema = new Schema(
  {
    appliesToInStore: {
      type: Boolean,
      default: true,
    },

    appliesToAtHome: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const availabilityOverrideSchema = new Schema(
  {
    overrideCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    target: {
      type: overrideTargetSchema,
      required: true,
    },

    overrideType: {
      type: String,
      enum: [
        "full_day_unavailable",
        "partial_day_unavailable",
        "custom_available_hours",
        "holiday",
        "special_opening",
      ],
      required: true,
      index: true,
    },

    dateRange: {
      type: dateRangeSchema,
      required: true,
    },

    modeApplicability: {
      type: modeApplicabilitySchema,
      default: () => ({}),
    },

    isRecurring: {
      type: Boolean,
      default: false,
      index: true,
    },

    recurringConfig: {
      daysOfWeek: [
        {
          type: Number,
          min: 0,
          max: 6,
        },
      ],

      recurrenceEndDate: {
        type: Date,
        default: null,
      },
    },

    timeWindows: {
      type: [timeWindowSchema],
      default: [],
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    internalNote: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    priority: {
      type: Number,
      default: 0,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
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
  },
  {
    timestamps: true,
  }
);

availabilityOverrideSchema.index({ overrideCode: 1 }, { unique: true });

availabilityOverrideSchema.index({
  "target.overrideLevel": 1,
  "target.store": 1,
  "target.service": 1,
  "target.staff": 1,
  status: 1,
});

availabilityOverrideSchema.index({
  "dateRange.startDate": 1,
  "dateRange.endDate": 1,
  status: 1,
});

availabilityOverrideSchema.index({
  isRecurring: 1,
  status: 1,
});

availabilityOverrideSchema.index({
  priority: -1,
  status: 1,
});

availabilityOverrideSchema.pre("validate", function (next) {
  const { overrideLevel, service, staff } = this.target || {};

  if (overrideLevel === "service" && !service) {
    return next(new Error("Service override must include target.service."));
  }

  if (overrideLevel === "staff" && !staff) {
    return next(new Error("Staff override must include target.staff."));
  }

  if (
    this.dateRange?.startDate &&
    this.dateRange?.endDate &&
    this.dateRange.endDate < this.dateRange.startDate
  ) {
    return next(new Error("endDate cannot be before startDate."));
  }

  const requiresTimeWindows = [
    "partial_day_unavailable",
    "custom_available_hours",
    "special_opening",
  ].includes(this.overrideType);

  if (requiresTimeWindows && (!this.timeWindows || this.timeWindows.length === 0)) {
    return next(
      new Error("This override type requires at least one time window.")
    );
  }

  if (
    ["full_day_unavailable", "holiday"].includes(this.overrideType) &&
    this.timeWindows?.length
  ) {
    return next(
      new Error("Full-day unavailable / holiday overrides should not have time windows.")
    );
  }

  next();
});

availabilityOverrideSchema.pre("save", function (next) {
  if (this.dateRange?.endDate && this.dateRange.endDate < new Date()) {
    if (this.status === "active") {
      this.status = "expired";
    }
  }
  next();
});

const AvailabilityOverride = mongoose.model(
  "AvailabilityOverride",
  availabilityOverrideSchema
);

export default AvailabilityOverride;