import mongoose, { Schema } from "mongoose";

const uploadedFileSchema = new Schema(
  {
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
    fileName: {
      type: String,
      default: null,
      trim: true,
    },
    mimeType: {
      type: String,
      default: null,
      trim: true,
    },
    sizeInBytes: {
      type: Number,
      min: 0,
      default: null,
    },
    side: {
      type: String,
      enum: ["front", "back", "single", "supporting"],
      default: "single",
    },
  },
  { _id: true, timestamps: true }
);

const reviewActionSchema = new Schema(
  {
    action: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "resubmitted",
        "expired",
        "cancelled",
      ],
      required: true,
    },

    note: {
      type: String,
      trim: true,
      default: null,
    },

    actedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    actedByRole: {
      type: String,
      enum: ["store", "professional", "staff", "admin", "super_admin", null],
      default: null,
    },

    actedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const verificationDocumentSchema = new Schema(
  {
    entityType: {
      type: String,
      enum: ["store", "professional", "staff"],
      required: true,
      index: true,
    },

    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      default: null,
      index: true,
    },

    professional: {
      type: Schema.Types.ObjectId,
      ref: "ProfessionalProfile",
      default: null,
      index: true,
    },

    staff: {
      type: Schema.Types.ObjectId,
      ref: "StoreStaff",
      default: null,
      index: true,
    },

    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    documentCategory: {
      type: String,
      enum: [
        "identity_proof",
        "address_proof",
        "business_proof",
        "tax_proof",
        "bank_proof",
        "license",
        "certificate",
        "other",
      ],
      required: true,
      index: true,
    },

    documentType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    documentNumber: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    holderName: {
      type: String,
      trim: true,
      default: null,
    },

    issuedBy: {
      type: String,
      trim: true,
      default: null,
    },

    issueDate: {
      type: Date,
      default: null,
    },

    expiryDate: {
      type: Date,
      default: null,
      index: true,
    },

    files: {
      type: [uploadedFileSchema],
      default: [],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one verification document file is required.",
      },
    },

    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "expired",
        "cancelled",
      ],
      default: "draft",
      index: true,
    },

    reviewMeta: {
      reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      reviewedAt: {
        type: Date,
        default: null,
      },

      approvalNote: {
        type: String,
        trim: true,
        default: null,
      },

      rejectionReason: {
        type: String,
        trim: true,
        default: null,
      },

      rejectionCode: {
        type: String,
        trim: true,
        default: null,
      },

      canResubmit: {
        type: Boolean,
        default: true,
      },
    },

    verificationFlags: {
      isPrimaryDocument: {
        type: Boolean,
        default: false,
      },

      isMandatory: {
        type: Boolean,
        default: true,
      },

      isExpired: {
        type: Boolean,
        default: false,
        index: true,
      },

      isVerified: {
        type: Boolean,
        default: false,
        index: true,
      },
    },

    resubmissionMeta: {
      resubmissionCount: {
        type: Number,
        min: 0,
        default: 0,
      },

      previousDocument: {
        type: Schema.Types.ObjectId,
        ref: "VerificationDocument",
        default: null,
      },

      replacedBy: {
        type: Schema.Types.ObjectId,
        ref: "VerificationDocument",
        default: null,
      },

      lastResubmittedAt: {
        type: Date,
        default: null,
      },
    },

    auditTrail: [reviewActionSchema],

    notes: {
      submitterNote: {
        type: String,
        trim: true,
        maxlength: 1500,
        default: null,
      },

      internalNote: {
        type: String,
        trim: true,
        maxlength: 1500,
        default: null,
      },
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
  },
  {
    timestamps: true,
  }
);

verificationDocumentSchema.index({
  entityType: 1,
  store: 1,
  professional: 1,
  staff: 1,
  documentCategory: 1,
  documentType: 1,
});

verificationDocumentSchema.index({
  submittedBy: 1,
  createdAt: -1,
});

verificationDocumentSchema.index({
  status: 1,
  "verificationFlags.isVerified": 1,
  "verificationFlags.isExpired": 1,
});

verificationDocumentSchema.index({
  expiryDate: 1,
});

verificationDocumentSchema.index({
  documentNumber: 1,
});

verificationDocumentSchema.index({
  "visibility.isActive": 1,
  "visibility.isDeleted": 1,
});

verificationDocumentSchema.pre("save", function (next) {
  if (this.expiryDate) {
    this.verificationFlags.isExpired = this.expiryDate < new Date();
  }

  if (this.status === "approved") {
    this.verificationFlags.isVerified = true;
  } else if (this.status === "rejected" || this.status === "expired") {
    this.verificationFlags.isVerified = false;
  }

  if (this.isNew && (!this.auditTrail || this.auditTrail.length === 0)) {
    this.auditTrail = [
      {
        action: this.status === "draft" ? "submitted" : this.status,
        actedBy: this.submittedBy,
        actedByRole:
          this.entityType === "store"
            ? "store"
            : this.entityType === "professional"
            ? "professional"
            : "staff",
        actedAt: new Date(),
      },
    ];
  }

  next();
});

const VerificationDocument = mongoose.model(
  "VerificationDocument",
  verificationDocumentSchema
);

export default VerificationDocument;