import mongoose, { Schema } from "mongoose";

const mediaSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    fileId: { type: String, default: null },
    alt: { type: String, trim: true, default: null },
    isFeatured: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const weeklyWorkingHoursSchema = new Schema(
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
    isOpen: { type: Boolean, default: true },
    openTime: { type: String, default: null }, // "09:00"
    closeTime: { type: String, default: null }, // "21:00"
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

const storeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    owner: {
      ownerUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      ownerFullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
      },
      ownerContactNumber: {
        type: String,
        required: true,
        trim: true,
      },
      ownerEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
      },
    },

    storeDetails: {
      storeName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      slug: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true,
      },

      storeLogo: {
        url: { type: String, default: null },
        fileId: { type: String, default: null },
      },

      storeImages: [mediaSchema],

      description: {
        type: String,
        trim: true,
        maxlength: 2500,
        default: null,
      },

      contactPersonName: {
        type: String,
        trim: true,
        default: null,
      },

      storeContactNumber: {
        type: String,
        trim: true,
        default: null,
      },

      storeContactEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
      },

      storeAlternateContactNumber: {
        type: String,
        trim: true,
        default: null,
      },
    },

    storeLocation: {
      addressLine1: {
        type: String,
        trim: true,
        required: true,
      },
      addressLine2: {
        type: String,
        trim: true,
        default: null,
      },
      landmark: {
        type: String,
        trim: true,
        default: null,
      },
      locality: {
        type: String,
        trim: true,
        default: null,
      },
      city: {
        type: String,
        trim: true,
        required: true,
        index: true,
      },
      state: {
        type: String,
        trim: true,
        required: true,
        index: true,
      },
      country: {
        type: String,
        trim: true,
        default: "India",
      },
      pincode: {
        type: String,
        trim: true,
        required: true,
      },

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

    storeClassification: {
      businessType: {
        type: String,
        enum: [
          "salon",
          "parlor",
          "spa",
          "nail_studio",
          "makeup_studio",
          "skin_clinic",
          "grooming_lounge",
          "other",
        ],
        required: true,
      },

      otherBusinessType: {
        type: String,
        trim: true,
        default: null,
      },

      serviceAudience: {
        type: String,
        enum: ["men", "women", "unisex"],
        default: "unisex",
      },

      categoryTags: [
        {
          type: String,
          trim: true,
        },
      ],
    },

    storeOperations: {
      weeklyWorkingHours: [weeklyWorkingHoursSchema],
      blockedDates: [blockedDateSchema],

      acceptWalkIn: {
        type: Boolean,
        default: true,
      },

      acceptOnlineBooking: {
        type: Boolean,
        default: true,
      },

      slotDurationDefault: {
        type: Number,
        min: 5,
        default: 30,
      },

      bufferBetweenAppointments: {
        type: Number,
        min: 0,
        default: 0,
      },

      maxConcurrentAppointments: {
        type: Number,
        min: 1,
        default: 1,
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

      cancellationPolicy: {
        allowCancellation: { type: Boolean, default: true },
        freeCancellationBeforeHours: { type: Number, min: 0, default: 2 },
        cancellationChargeType: {
          type: String,
          enum: ["none", "flat", "percent"],
          default: "none",
        },
        cancellationChargeValue: {
          type: Number,
          min: 0,
          default: 0,
        },
      },

      reschedulePolicy: {
        allowReschedule: { type: Boolean, default: true },
        rescheduleBeforeHours: { type: Number, min: 0, default: 2 },
      },

      lateArrivalPolicy: {
        gracePeriodMinutes: { type: Number, min: 0, default: 10 },
        autoCancelAfterMinutes: { type: Number, min: 0, default: 20 },
      },
    },

    storeServiceSummary: {
      serviceCategoriesOffered: [
        {
          type: String,
          trim: true,
        },
      ],

      startingPriceRange: {
        type: Number,
        min: 0,
        default: 0,
      },

      numberOfStaffs: {
        type: Number,
        min: 0,
        default: 0,
      },

      numberOfChairs: {
        type: Number,
        min: 0,
        default: 0,
      },

      numberOfBeds: {
        type: Number,
        min: 0,
        default: 0,
      },

      numberOfRooms: {
        type: Number,
        min: 0,
        default: 0,
      },

      offersHomeService: {
        type: Boolean,
        default: false,
      },

      homeServiceRadiusKm: {
        type: Number,
        min: 0,
        default: 0,
      },

      homeServiceAreas: [
        {
          type: String,
          trim: true,
        },
      ],

      homeServiceCharges: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    amenities: {
      airConditioned: { type: Boolean, default: false },
      wifiAvailable: { type: Boolean, default: false },
      parkingAvailable: { type: Boolean, default: false },
      cardPaymentAccepted: { type: Boolean, default: false },
      wheelchairAccessible: { type: Boolean, default: false },
      sanitizationAvailable: { type: Boolean, default: false },
      bridalRoomAvailable: { type: Boolean, default: false },
    },

    bankDetails: bankDetailsSchema,

    taxInfo: {
      gstNumber: { type: String, trim: true, default: null },
      panNumber: { type: String, trim: true, default: null, select: false },
      legalBusinessName: { type: String, trim: true, default: null },
    },

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
        min: 0,
        max: 5,
        default: 0,
      },
      ratingCount: {
        type: Number,
        min: 0,
        default: 0,
      },
      reviewCount: {
        type: Number,
        min: 0,
        default: 0,
      },
      totalBookings: {
        type: Number,
        min: 0,
        default: 0,
      },
      completedBookings: {
        type: Number,
        min: 0,
        default: 0,
      },
      cancelledBookings: {
        type: Number,
        min: 0,
        default: 0,
      },
      repeatCustomers: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    visibility: {
      isFeatured: { type: Boolean, default: false },
      isTopRated: { type: Boolean, default: false },
      isPublished: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true, index: true },
      isDeleted: { type: Boolean, default: false, index: true },
      deletedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

storeSchema.index({ user: 1 });
storeSchema.index({ "storeDetails.slug": 1 }, { unique: true, sparse: true });
storeSchema.index({ "storeLocation.city": 1, "storeLocation.state": 1 });
storeSchema.index({ "storeLocation.geo": "2dsphere" });
storeSchema.index({
  "storeClassification.businessType": 1,
  "storeClassification.serviceAudience": 1,
});
storeSchema.index({
  "verification.verificationStatus": 1,
  "visibility.isActive": 1,
  "visibility.isDeleted": 1,
});
storeSchema.index({ "marketplaceStats.ratingAverage": -1 });

const Store = mongoose.model("Store", storeSchema);

export default Store;