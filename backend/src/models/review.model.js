import mongoose, { Schema } from "mongoose";

const mediaSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    fileId: {
      type: String,
      default: null,
      trim: true,
    },
    thumbnail: {
      type: String,
      default: null,
      trim: true,
    },
    caption: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { _id: true, timestamps: true }
);

const ratingBreakdownSchema = new Schema(
  {
    overall: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    serviceQuality: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    staffBehavior: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    professionalism: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    punctuality: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    hygiene: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    ambience: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    valueForMoney: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    homeServiceExperience: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  { _id: false }
);

const targetSnapshotSchema = new Schema(
  {
    storeName: {
      type: String,
      default: null,
      trim: true,
    },

    serviceName: {
      type: String,
      default: null,
      trim: true,
    },

    bookingCode: {
      type: String,
      default: null,
      trim: true,
      uppercase: true,
    },

    staffNames: [
      {
        type: String,
        trim: true,
      },
    ],

    bookingMode: {
      type: String,
      enum: ["in_store", "at_home", null],
      default: null,
    },

    serviceDate: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const replySchema = new Schema(
  {
    repliedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    repliedByRole: {
      type: String,
      enum: ["store", "admin", "super_admin"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    repliedAt: {
      type: Date,
      default: Date.now,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true, timestamps: true }
);

const moderationSchema = new Schema(
  {
    isFlagged: {
      type: Boolean,
      default: false,
      index: true,
    },

    flagReason: {
      type: String,
      default: null,
      trim: true,
    },

    isHidden: {
      type: Boolean,
      default: false,
      index: true,
    },

    hiddenReason: {
      type: String,
      default: null,
      trim: true,
    },

    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    moderatedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const reviewSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      required: true,
      index: true,
    },

    service: {
      type: Schema.Types.ObjectId,
      ref: "StoreService",
      required: true,
      index: true,
    },

    staff: [
      {
        type: Schema.Types.ObjectId,
        ref: "StoreStaff",
      },
    ],

    targetSnapshot: {
      type: targetSnapshotSchema,
      default: () => ({}),
    },

    rating: {
      type: ratingBreakdownSchema,
      required: true,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 150,
      default: null,
    },

    reviewText: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: null,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    media: [mediaSchema],

    isAnonymous: {
      type: Boolean,
      default: false,
    },

    customerConsentForDisplay: {
      type: Boolean,
      default: true,
    },

    storeReply: {
      type: replySchema,
      default: null,
    },

    adminReply: {
      type: replySchema,
      default: null,
    },

    helpfulStats: {
      helpfulCount: {
        type: Number,
        min: 0,
        default: 0,
      },
      reportCount: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    moderation: {
      type: moderationSchema,
      default: () => ({}),
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    visibility: {
      isPublished: {
        type: Boolean,
        default: true,
        index: true,
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
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ booking: 1 }, { unique: true });

reviewSchema.index({
  store: 1,
  "visibility.isPublished": 1,
  "visibility.isDeleted": 1,
  createdAt: -1,
});

reviewSchema.index({
  service: 1,
  "visibility.isPublished": 1,
  "visibility.isDeleted": 1,
  createdAt: -1,
});

reviewSchema.index({
  staff: 1,
  "visibility.isPublished": 1,
  "visibility.isDeleted": 1,
  createdAt: -1,
});

reviewSchema.index({
  customer: 1,
  createdAt: -1,
});

reviewSchema.index({
  "rating.overall": -1,
});

reviewSchema.index({
  "moderation.isFlagged": 1,
  "moderation.isHidden": 1,
});

reviewSchema.pre("validate", function (next) {
  const hasText = !!(this.reviewText && this.reviewText.trim());
  const hasMedia = Array.isArray(this.media) && this.media.length > 0;

  if (!this.rating || !this.rating.overall) {
    return next(new Error("Overall rating is required."));
  }

  if (!hasText && !hasMedia) {
    return next(
      new Error("A review should contain either review text or media.")
    );
  }

  next();
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;