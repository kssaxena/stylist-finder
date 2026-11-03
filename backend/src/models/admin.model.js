import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    // initial details
    creatorAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },

    employeeId: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "subAdmin", "sales", "marketing"],
      default: "subAdmin",
      required: true,
    },
    restrictedAccess: { type: Boolean, default: true },
    sectionList: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
  },
  { timestamps: true },
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: "Admin" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" },
  );
};

adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, role: "Admin" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};

export const Admin = mongoose.model("Admin", adminSchema);
