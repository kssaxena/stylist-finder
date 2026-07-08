import mongoose, { Schema } from "mongoose";

const slotSnapshotSchema = new Schema(
  {
    slotDate: {
      type: Date,
      default: null,
    },

    startTime: {
      type: String,
      trim: true,
      default: null,
    },

    endTime: {
      type: String,
      trim: true,
      default: null,
    },

    startDateTime: {
      type: Date,
      default: null,
    },

    endDateTime: {
      type: Date,
      default: null,
    },

    bookingMode: {
      type: String,
      enum: ["in_store", "at_home"],
      default: null,
    },
  },
  { _id: false }
);

const staffSnapshotSchema = new Schema(
  {
    staff: {
      type: Schema.Types.ObjectId,
      ref: "StoreStaff",
      default: null,
    },

    staffName: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const paymentSnapshotSchema = new Schema(
  {
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    paymentStatus: {
      type: String,
      trim: true,
      default: null,
    },

    paidAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    refundAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

const actorSchema = new Schema(
  {
    actorType: {
      type: String,
      enum: ["customer", "store", "professional", "admin", "super_admin", "system"],
      required: true,
      index: true,
    },

    actorUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    actorStore: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      default: null,
    },

    actorProfessional: {
      type: Schema.Types.ObjectId,
      ref: "ProfessionalProfile",
      default: null,
    },

    actorName: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const bookingStatusLogSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    bookingCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
      index: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      default: null,
      index: true,
    },

    service: {
      type: Schema.Types.ObjectId,
      ref: "StoreService",
      default: null,
      index: true,
    },

    oldStatus: {
      type: String,
      default: null,
      index: true,
    },

    newStatus: {
      type: String,
      required: true,
      index: true,
    },

    eventType: {
      type: String,
      enum: [
        "booking_created",
        "payment_pending",
        "payment_success",
        "payment_failed",
        "booking_confirmed",
        "booking_rejected",
        "booking_cancelled",
        "booking_rescheduled",
        "booking_started",
        "booking_completed",
        "booking_no_show",
        "refund_initiated",
        "refund_completed",
        "status_updated",
        "staff_assigned",
        "staff_changed",
      ],
      required: true,
      index: true,
    },

    statusReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    actor: {
      type: actorSchema,
      required: true,
    },

    previousSlot: {
      type: slotSnapshotSchema,
      default: () => ({}),
    },

    newSlot: {
      type: slotSnapshotSchema,
      default: () => ({}),
    },

    previousStaff: {
      type: staffSnapshotSchema,
      default: () => ({}),
    },

    newStaff: {
      type: staffSnapshotSchema,
      default: () => ({}),
    },

    paymentSnapshot: {
      type: paymentSnapshotSchema,
      default: () => ({}),
    },

    metadata: {
      triggerSource: {
        type: String,
        enum: [
          "customer_app",
          "store_panel",
          "professional_panel",
          "admin_panel",
          "super_admin_panel",
          "system",
          "payment_webhook",
        ],
        default: "system",
        index: true,
      },

      ipAddress: {
        type: String,
        default: null,
      },

      userAgent: {
        type: String,
        default: null,
      },
    },

    note: {
      type: String,
      trim: true,
      maxlength: 1500,
      default: null,
    },

    isVisibleToCustomer: {
      type: Boolean,
      default: false,
      index: true,
    },

    isSystemGenerated: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingStatusLogSchema.index({
  booking: 1,
  createdAt: -1,
});

bookingStatusLogSchema.index({
  bookingCode: 1,
  createdAt: -1,
});

bookingStatusLogSchema.index({
  customer: 1,
  createdAt: -1,
});

bookingStatusLogSchema.index({
  store: 1,
  createdAt: -1,
});

bookingStatusLogSchema.index({
  eventType: 1,
  newStatus: 1,
  createdAt: -1,
});

bookingStatusLogSchema.index({
  "actor.actorType": 1,
  "actor.actorUser": 1,
  createdAt: -1,
});

bookingStatusLogSchema.pre("validate", function (next) {
  if (!this.booking) {
    return next(new Error("Booking status log must reference a booking."));
  }

  if (!this.actor?.actorType) {
    return next(new Error("Booking status log must include actor.actorType."));
  }

  if (
    this.eventType === "booking_rescheduled" &&
    (!this.previousSlot?.startDateTime || !this.newSlot?.startDateTime)
  ) {
    return next(
      new Error("Reschedule log must include previousSlot and newSlot details.")
    );
  }

  if (
    ["payment_success", "payment_failed", "refund_initiated", "refund_completed"].includes(
      this.eventType
    ) &&
    !this.paymentSnapshot?.payment
  ) {
    return next(
      new Error("Payment/refund related logs should include paymentSnapshot.payment.")
    );
  }

  next();
});

const BookingStatusLog = mongoose.model(
  "BookingStatusLog",
  bookingStatusLogSchema
);

export default BookingStatusLog;