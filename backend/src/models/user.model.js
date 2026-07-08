import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
      index: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      default: null,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "store", "professional", "admin", "super_admin"],
      required: true,
      index: true,
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

    dob: {
      type: Date,
      default: null,
    },

    location: {
      city: { type: String, trim: true, default: null, index: true },
      state: { type: String, trim: true, default: null, index: true },
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

    authProviders: {
      local: {
        enabled: { type: Boolean, default: true },
      },
      google: {
        enabled: { type: Boolean, default: false },
        googleId: { type: String, default: null, index: true },
      },
      apple: {
        enabled: { type: Boolean, default: false },
        appleId: { type: String, default: null, index: true },
      },
    },

    verification: {
      isPhoneVerified: { type: Boolean, default: false, index: true },
      isEmailVerified: { type: Boolean, default: false, index: true },

      phoneOtp: {
        code: { type: String, default: null, select: false },
        expiresAt: { type: Date, default: null, select: false },
        attempts: { type: Number, default: 0, select: false },
      },

      emailOtp: {
        code: { type: String, default: null, select: false },
        expiresAt: { type: Date, default: null, select: false },
        attempts: { type: Number, default: 0, select: false },
      },
    },

    accountStatus: {
      type: String,
      enum: [
        "pending_verification",
        "active",
        "inactive",
        "suspended",
        "rejected",
        "deleted",
      ],
      default: "pending_verification",
      index: true,
    },

    onboarding: {
      profileCompleted: { type: Boolean, default: false },
      profileCompletionStep: { type: Number, default: 0 },
      acceptedTerms: { type: Boolean, default: false },
      acceptedTermsAt: { type: Date, default: null },
    },

    permissions: [
      {
        type: String,
        trim: true,
      },
    ],

    favoritesSummary: {
      totalFavoriteStores: { type: Number, default: 0 },
      totalFavoriteProfessionals: { type: Number, default: 0 },
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    lastActiveAt: {
      type: Date,
      default: null,
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

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $type: "string" } },
  }
);

userSchema.index({ phoneNumber: 1 }, { unique: true });
userSchema.index({ role: 1, accountStatus: 1 });
userSchema.index({ "location.geo": "2dsphere" });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (!this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  if (!this.password) return false;
  return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;