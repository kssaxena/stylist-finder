import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      url: {
        type: String,
        default: "",
      },
      fileId: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: ["Verified", "Under-review", "Inactive"],
      default: "Under-review",
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const categorySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      url: {
        type: String,
        default: "",
      },
      fileId: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: ["Verified", "Under-review", "Inactive"],
      default: "Under-review",
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    subcategories: {
      type: [subCategorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Category = mongoose.model("Category", categorySchema);
