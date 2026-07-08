import mongoose, { Schema } from "mongoose";

const geoLocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [],
      validate: {
        validator: function (value) {
          return !value || value.length === 0 || value.length === 2;
        },
        message: "Coordinates must be [lng, lat].",
      },
    },
  },
  { _id: false }
);

const addressSchema = new Schema(
  {
    ownerType: {
      type: String,
      enum: ["customer", "store", "professional", "admin", "super_admin"],
      required: true,
      index: true,
    },

    ownerUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
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
      default: null,
      index: true,
    },

    professionalProfile: {
      type: Schema.Types.ObjectId,
      ref: "ProfessionalProfile",
      default: null,
      index: true,
    },

    label: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "Home",
    },

    addressType: {
      type: String,
      enum: [
        "home",
        "work",
        "store",
        "salon",
        "billing",
        "service_location",
        "other",
      ],
      default: "home",
      index: true,
    },

    fullName: {
      type: String,
      trim: true,
      maxlength: 120,
      default: null,
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: null,
    },

    alternatePhoneNumber: {
      type: String,
      trim: true,
      default: null,
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    addressLine2: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },

    landmark: {
      type: String,
      trim: true,
      maxlength: 150,
      default: null,
    },

    area: {
      type: String,
      trim: true,
      maxlength: 120,
      default: null,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: "India",
      index: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
      index: true,
    },

    geoLocation: {
      type: geoLocationSchema,
      default: () => ({
        type: "Point",
        coordinates: [],
      }),
    },

    mapAddressText: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    deliveryInstructions: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },

    isServiceableForHomeBooking: {
      type: Boolean,
      default: true,
      index: true,
    },

    serviceabilityMeta: {
      checkedAt: {
        type: Date,
        default: null,
      },

      checkedByStore: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        default: null,
      },

      serviceableStores: [
        {
          type: Schema.Types.ObjectId,
          ref: "Store",
        },
      ],

      rejectedByStores: [
        {
          type: Schema.Types.ObjectId,
          ref: "Store",
        },
      ],
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

addressSchema.index({ ownerType: 1, ownerUser: 1, isDefault: 1 });

addressSchema.index({ customerProfile: 1, isDefault: 1 });

addressSchema.index({ store: 1 });

addressSchema.index({ professionalProfile: 1 });

addressSchema.index({
  city: 1,
  state: 1,
  postalCode: 1,
});

addressSchema.index({
  geoLocation: "2dsphere",
});

addressSchema.pre("validate", function (next) {
  if (this.ownerType === "customer" && !this.customerProfile && !this.ownerUser) {
    return next(
      new Error("Customer address must reference customerProfile or ownerUser.")
    );
  }

  if (this.ownerType === "store" && !this.store) {
    return next(new Error("Store address must reference store."));
  }

  if (this.ownerType === "professional" && !this.professionalProfile) {
    return next(new Error("Professional address must reference professionalProfile."));
  }

  const coords = this.geoLocation?.coordinates || [];
  if (coords.length === 2) {
    const [lng, lat] = coords;

    if (lng < -180 || lng > 180) {
      return next(new Error("Longitude must be between -180 and 180."));
    }

    if (lat < -90 || lat > 90) {
      return next(new Error("Latitude must be between -90 and 90."));
    }
  }

  next();
});

const Address = mongoose.model("Address", addressSchema);

export default Address;