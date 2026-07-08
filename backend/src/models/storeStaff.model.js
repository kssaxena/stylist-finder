import mongoose, { Schema } from "mongoose";

const mediaSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    fileId: { type: String, default: null },
    alt: { type: String, trim: true, default: null },
  },
  { _id: true, timestamps: true }
);

const weeklyAvailabilitySchema = new Schema(
  {
    day: {
      type: String,
      enum: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
    startTime: { type: String, default: null }, // "09:00"
    endTime: { type: String, default: null },   // "18:00"
    breakStartTime: { type: String, default: null },
    breakEndTime: { type: String, default: null },
  },
  { _id: false }
);

const blockedDateSchema = new Schema(
  {
    date: { type: Date, required: true },
    reason: { type: String, trim: true, default: null },
    fullDay: { type: Boolean, default: true },
    startTime: { type: String, default: null },
    endTime: { type: String, default: null },
  },
  { _id: true, timestamps: true }
);

const emergencyContactSchema = new Schema(
  {
    name: { type: String, trim: true, default: null },
    relation: { type: String, trim: true, default: null },
    phoneNumber: { type: String, trim: true, default: null },
  },
  { _id: false }
);

const bankDetailsSchema = new Schema(
  {
    accountHolderName: { type: String, trim: true, default: null },
    bankName: { type: String, trim: true, default: null },
    accountNumber: { type: String, trim: true, default: null, select: false },
    ifscCode: { type: String, trim: true, default: null },
    upiId: { type: String, trim: true, default: null },
  },
  { _id: false }
);

const storeStaffSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    linkedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    professionalProfile: {
      type: Schema.Types.ObjectId,
      ref: "ProfessionalProfile",
      default: null,
      index: true,
    },

    staffCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    profileImage: {
      url: { type: String, default: null },
      fileId: { type: String, default: null },
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
      default: "prefer_not_to_say",
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: null,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    designation: {
      type: String,
      trim: true,
      default: null,
    },

    staffType: {
      type: String,
      enum: ["employee", "freelancer", "partner_professional"],
      default: "employee",
      index: true,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 1500,
      default: null,
    },

    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    supportedServices: [
      {
        type: Schema.Types.ObjectId,
        ref: "StoreService",
      },
    ],

    supportedCategories: [
      {
        type: String,
        trim: true,
      },
    ],

    workModes: {
      inStore: { type: Boolean, default: true },
      atHome: { type: Boolean, default: false },
    },

    availability: {
      weeklyAvailability: [weeklyAvailabilitySchema],
      blockedDates: [blockedDateSchema],

      slotDurationOverride: {
        type: Number,
        min: 5,
        default: null,
      },

      maxDailyBookings: {
        type: Number,
        min: 1,
        default: null,
      },

      maxConcurrentBookings: {
        type: Number,
        min: 1,
        default: 1,
      },
    },

    employment: {
      joiningDate: {
        type: Date,
        default: null,
      },

      leavingDate: {
        type: Date,
        default: null,
      },

      salaryType: {
        type: String,
        enum: ["fixed", "commission", "fixed_plus_commission", "not_applicable"],
        default: "not_applicable",
      },

      fixedSalaryAmount: {
        type: Number,
        min: 0,
        default: 0,
      },

      commissionPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },

    bankDetails: bankDetailsSchema,

    emergencyContact: emergencyContactSchema,

    verification: {
      isIdentityVerified: {
        type: Boolean,
        default: false,
      },
      isSkillVerified: {
        type: Boolean,
        default: false,
      },
    },

    performanceStats: {
      totalBookingsHandled: {
        type: Number,
        min: 0,
        default: 0,
      },
      completedBookingsHandled: {
        type: Number,
        min: 0,
        default: 0,
      },
      cancelledBookingsHandled: {
        type: Number,
        min: 0,
        default: 0,
      },
      ratingAverage: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      ratingCount: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    flags: {
      isPrimaryStaff: { type: Boolean, default: false },
      isBookable: { type: Boolean, default: true, index: true },
      isVisibleToCustomers: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true, index: true },
      isDeleted: { type: Boolean, default: false, index: true },
      deletedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

storeStaffSchema.index({ store: 1, fullName: 1 });
storeStaffSchema.index({ store: 1, staffCode: 1 }, { sparse: true });
storeStaffSchema.index({ store: 1, staffType: 1 });
storeStaffSchema.index({ store: 1, supportedServices: 1 });
storeStaffSchema.index({
  "flags.isBookable": 1,
  "flags.isActive": 1,
  "flags.isDeleted": 1,
});
storeStaffSchema.index({ linkedUser: 1 });
storeStaffSchema.index({ professionalProfile: 1 });

const StoreStaff = mongoose.model("StoreStaff", storeStaffSchema);

export default StoreStaff;