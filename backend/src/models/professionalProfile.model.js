import mongoose, { Schema } from "mongoose";

const portfolioImageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    fileId: { type: String, default: null },
    caption: { type: String, trim: true, default: null },
    isFeatured: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const portfolioVideoSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    fileId: { type: String, default: null },
    caption: { type: String, trim: true, default: null },
    thumbnail: { type: String, default: null },
  },
  { _id: true, timestamps: true }
);

const certificationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    issuedBy: { type: String, trim: true, default: null },
    issueDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    document: {
      url: { type: String, default: null },
      fileId: { type: String, default: null },
    },
  },
  { _id: true, timestamps: true }
);

const serviceAreaSchema = new Schema(
  {
    areaName: { type: String, required: true, trim: true },
    city: { type: String, trim: true, default: null },
    state: { type: String, trim: true, default: null },
    pincode: { type: String, trim: true, default: null },
  },
  { _id: true }
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

const professionalProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    profileImage: {
      url: { type: String, default: null },
      fileId: { type: String, default: null },
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },

    tagline: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
      default: "prefer_not_to_say",
    },

    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },

    professionType: {
      type: String,
      enum: [
        "makeup_artist",
        "hairstylist",
        "barber",
        "nail_artist",
        "mehendi_artist",
        "skincare_expert",
        "bridal_artist",
        "spa_therapist",
        "massage_therapist",
        "grooming_specialist",
        "other",
      ],
      required: true,
      index: true,
    },

    otherProfessionType: {
      type: String,
      trim: true,
      default: null,
    },

    serviceCategories: [
      {
        type: String,
        trim: true,
      },
    ],

    serviceModes: {
      inStore: { type: Boolean, default: false },
      atHome: { type: Boolean, default: true },
    },

    pricing: {
      priceType: {
        type: String,
        enum: ["fixed", "starting_from", "custom_quote"],
        default: "starting_from",
      },
      startingPrice: {
        type: Number,
        min: 0,
        default: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
      consultationFee: {
        type: Number,
        min: 0,
        default: 0,
      },
      homeServiceExtraCharge: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    baseLocation: {
      city: { type: String, trim: true, required: true, index: true },
      state: { type: String, trim: true, required: true, index: true },
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

    homeServiceConfig: {
      isAvailableForHomeService: { type: Boolean, default: true },
      serviceRadiusKm: {
        type: Number,
        min: 0,
        default: 0,
      },
      serviceAreas: [serviceAreaSchema],
      travelCharges: {
        type: Number,
        min: 0,
        default: 0,
      },
      travelBufferMinutes: {
        type: Number,
        min: 0,
        default: 30,
      },
    },

    availability: {
      weeklyAvailability: [weeklyAvailabilitySchema],
      blockedDates: [blockedDateSchema],
      slotDurationDefault: {
        type: Number,
        min: 5,
        default: 30,
      },
      advanceBookingDays: {
        type: Number,
        min: 0,
        default: 30,
      },
      minAdvanceBookingMinutes: {
        type: Number,
        min: 0,
        default: 30,
      },
      allowSameDayBooking: {
        type: Boolean,
        default: true,
      },
    },

    portfolio: {
      images: [portfolioImageSchema],
      videos: [portfolioVideoSchema],
    },

    socialLinks: {
      instagram: { type: String, trim: true, default: null },
      youtube: { type: String, trim: true, default: null },
      website: { type: String, trim: true, default: null },
      facebook: { type: String, trim: true, default: null },
    },

    certifications: [certificationSchema],

    verification: {
      isVerified: { type: Boolean, default: false, index: true },
      verificationStatus: {
        type: String,
        enum: ["draft", "pending", "under_review", "approved", "rejected"],
        default: "draft",
        index: true,
      },
      submittedAt: { type: Date, default: null },
      verifiedAt: { type: Date, default: null },
      rejectionReason: { type: String, trim: true, default: null },
    },

    marketplaceStats: {
      ratingAverage: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      ratingCount: {
        type: Number,
        default: 0,
        min: 0,
      },
      reviewCount: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalBookings: {
        type: Number,
        default: 0,
        min: 0,
      },
      completedJobs: {
        type: Number,
        default: 0,
        min: 0,
      },
      cancelledJobs: {
        type: Number,
        default: 0,
        min: 0,
      },
      repeatCustomers: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    businessFlags: {
      isIndependent: { type: Boolean, default: true },
      worksWithMultipleStores: { type: Boolean, default: false },
      isFeatured: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true, index: true },
      isDeleted: { type: Boolean, default: false, index: true },
      deletedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

professionalProfileSchema.index({ user: 1 }, { unique: true });
professionalProfileSchema.index({ professionType: 1, "verification.verificationStatus": 1 });
professionalProfileSchema.index({ "baseLocation.geo": "2dsphere" });
professionalProfileSchema.index({ "marketplaceStats.ratingAverage": -1 });
professionalProfileSchema.index({ "businessFlags.isActive": 1, "businessFlags.isDeleted": 1 });

const ProfessionalProfile = mongoose.model(
  "ProfessionalProfile",
  professionalProfileSchema
);

export default ProfessionalProfile;