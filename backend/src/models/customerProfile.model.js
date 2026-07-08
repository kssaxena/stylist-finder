import mongoose, { Schema } from "mongoose";

const savedAddressSchema = new Schema(
  {
    label: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
    customLabel: {
      type: String,
      trim: true,
      default: null,
    },

    fullName: {
      type: String,
      trim: true,
      default: null,
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: null,
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true,
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

    city: {
      type: String,
      trim: true,
      required: true,
    },

    state: {
      type: String,
      trim: true,
      required: true,
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

    isDefault: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true, timestamps: true }
);

const favoriteStoreSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const favoriteProfessionalSchema = new Schema(
  {
    professional: {
      type: Schema.Types.ObjectId,
      ref: "ProfessionalProfile",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const favoriteServiceSchema = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "StoreService",
      required: true,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      default: null,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const customerProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    profileImage: {
      url: { type: String, default: null },
      fileId: { type: String, default: null },
    },

    preferences: {
      preferredLanguage: {
        type: String,
        trim: true,
        default: "English",
      },

      preferredProfessionalGender: {
        type: String,
        enum: ["male", "female", "other", "no_preference"],
        default: "no_preference",
      },

      servicePreference: {
        type: String,
        enum: ["in_store", "at_home", "both", "no_preference"],
        default: "no_preference",
      },

      beautyPreferences: {
        skinType: {
          type: String,
          enum: [
            "normal",
            "dry",
            "oily",
            "combination",
            "sensitive",
            "not_specified",
          ],
          default: "not_specified",
        },

        hairType: {
          type: String,
          enum: [
            "straight",
            "wavy",
            "curly",
            "coily",
            "thin",
            "thick",
            "not_specified",
          ],
          default: "not_specified",
        },

        groomingPreferences: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    },

    notes: {
      allergyNotes: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: null,
      },

      sensitivityNotes: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: null,
      },

      medicalCautionNotes: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: null,
      },

      notesForProfessionals: {
        type: String,
        trim: true,
        maxlength: 1500,
        default: null,
      },
    },

    savedAddresses: [savedAddressSchema],

    favorites: {
      stores: [favoriteStoreSchema],
      professionals: [favoriteProfessionalSchema],
      services: [favoriteServiceSchema],
    },

    wallet: {
      balance: {
        type: Number,
        default: 0,
        min: 0,
      },
      rewardPoints: {
        type: Number,
        default: 0,
        min: 0,
      },
      lifetimeRewardPoints: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    stats: {
      totalBookings: {
        type: Number,
        default: 0,
        min: 0,
      },
      completedBookings: {
        type: Number,
        default: 0,
        min: 0,
      },
      cancelledBookings: {
        type: Number,
        default: 0,
        min: 0,
      },
      noShowBookings: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalReviewsGiven: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalSavedStores: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalSavedProfessionals: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalSavedServices: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    lastBookingAt: {
      type: Date,
      default: null,
    },

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
  {
    timestamps: true,
  }
);

customerProfileSchema.index({ user: 1 }, { unique: true });
customerProfileSchema.index({ "savedAddresses.geo": "2dsphere" });
customerProfileSchema.index({ isActive: 1, isDeleted: 1 });

customerProfileSchema.pre("save", function (next) {
  if (!this.savedAddresses || !this.savedAddresses.length) return next();

  const defaultAddresses = this.savedAddresses.filter((addr) => addr.isDefault);

  if (defaultAddresses.length > 1) {
    let firstFound = false;
    this.savedAddresses = this.savedAddresses.map((addr) => {
      if (addr.isDefault && !firstFound) {
        firstFound = true;
        return addr;
      }
      if (addr.isDefault && firstFound) {
        addr.isDefault = false;
      }
      return addr;
    });
  }

  next();
});

const CustomerProfile = mongoose.model(
  "CustomerProfile",
  customerProfileSchema
);

export default CustomerProfile;