import bcrypt from "bcrypt";
import { randomInt } from "node:crypto";
import { Enquiry } from "../models/enquiry.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sendEmail from "../services/mail.service.js";
import otpTemplate from "../template/otp.mail.template.js";

const sendEnquiryOtp = asyncHandler(async (req, res) => {
  const {
    type,
    name,
    email,
    contactNumber,
    interest,
    message = "",
    details = {},
  } = req.body;

  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const normalizedName = String(name || "").trim();
  const normalizedContact = String(contactNumber || "").trim();
  const normalizedInterest = String(interest || "").trim();
  const phoneDigits = normalizedContact.replace(/\D/g, "");

  if (!normalizedName || normalizedName.length > 100)
    throw new ApiError(400, "Enter a valid name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
    throw new ApiError(400, "Enter a valid email address");
  if (phoneDigits.length < 7 || phoneDigits.length > 15)
    throw new ApiError(400, "Enter a valid contact number");
  if (!["course", "franchise", "general"].includes(type))
    throw new ApiError(400, "Select a valid enquiry type");
  if (!normalizedInterest || normalizedInterest.length > 150)
    throw new ApiError(400, "Enter what you are enquiring about");
  if (typeof message !== "string" || message.length > 2000)
    throw new ApiError(400, "Message must be 2000 characters or fewer");
  if (!details || typeof details !== "object" || Array.isArray(details))
    throw new ApiError(400, "Invalid enquiry details");
  if (JSON.stringify(details).length > 5000)
    throw new ApiError(400, "Enquiry details are too large");

  const otp = randomInt(100000, 1000000).toString();
  const enquiry = await Enquiry.create({
    type,
    name: normalizedName,
    email: normalizedEmail,
    contactNumber: normalizedContact,
    interest: normalizedInterest,
    message: message.trim(),
    details,
    otpHash: await bcrypt.hash(otp, 10),
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
  });

  try {
    await sendEmail({
      to: normalizedEmail,
      subject: "Verify your enquiry",
      html: otpTemplate(normalizedName, otp),
    });
  } catch (error) {
    await Enquiry.findByIdAndDelete(enquiry._id);
    throw error;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { enquiryId: enquiry._id },
        "A verification code has been sent to your email.",
      ),
    );
});

const verifyEnquiryOtp = asyncHandler(async (req, res) => {
  const { enquiryId, otp } = req.body;
  if (!enquiryId || !/^\d{6}$/.test(String(otp || "")))
    throw new ApiError(400, "Enter the 6-digit verification code");

  const enquiry = await Enquiry.findOne({
    _id: enquiryId,
    emailVerified: false,
    otpExpiry: { $gt: new Date() },
  }).select("+otpHash");

  if (!enquiry || !enquiry.otpHash)
    throw new ApiError(400, "Verification code expired or enquiry not found");
  if (!(await bcrypt.compare(String(otp), enquiry.otpHash)))
    throw new ApiError(400, "Invalid verification code");

  const verifiedEnquiry = await Enquiry.findOneAndUpdate(
    {
      _id: enquiryId,
      emailVerified: false,
      otpExpiry: { $gt: new Date() },
    },
    {
      $set: { emailVerified: true },
      $unset: { otpHash: 1, otpExpiry: 1 },
    },
    { new: true },
  ).select("_id");

  if (!verifiedEnquiry)
    throw new ApiError(400, "Verification code expired or already used");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Your enquiry has been submitted."));
});

const listVerifiedEnquiries = asyncHandler(async (req, res) => {
  if (
    req.user.restrictedAccess &&
    !req.user.sectionList?.includes("Enquiries")
  ) {
    throw new ApiError(403, "You do not have access to enquiries");
  }

  const enquiries = await Enquiry.find({ emailVerified: true })
    .select("-otpHash -otpExpiry")
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, enquiries, "Enquiries fetched successfully."));
});

export { sendEnquiryOtp, verifyEnquiryOtp, listVerifiedEnquiries };
