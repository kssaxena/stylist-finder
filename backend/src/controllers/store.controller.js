import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Address } from "../models/address.model.js";
import { BankDetails } from "../models/bankDetails.model.js";
import { validatePhone } from "../validators/contactNumber.validator.js";
import { UploadImages } from "../utils/imageKit.io.js";
import { ServiceBookings } from "../models/serviceBooking.model.js";
import { Services } from "../models/service.model.js";
import {
  validateAadhaar,
  validateGST,
  validatePAN,
} from "../validators/KYC.validator.js";
import { validateBankDetails } from "../validators/bankDetails.validator.js";
import { Store } from "../models/store.model.js";

const registerStore = asyncHandler(async (req, res) => {
  const { name, contactNumber, email } = req.body;
  // contact number validation
  if (!contactNumber) throw new ApiError(400, "Please enter contact number");
  if (!validatePhone(contactNumber))
    throw new ApiError(400, "Invalid contact number");

  // name validation
  if (!name) throw new ApiError(400, "Please enter your name");
  if (name.length > 50)
    throw new ApiError(400, "Name length is too long, please try short forms");

  const existingTempUser = await Store.findOne({
    contactNumber: contactNumber,
    isTemporaryRegistered: true,
  });
  if (existingTempUser) {
    const deleteUser = await Store.findOneAndDelete({
      contactNumber: contactNumber,
    });
  }
  const existingUser = await Store.findOne({
    contactNumber: contactNumber,
    isTemporaryRegistered: false,
  });
  if (existingUser)
    throw new ApiError(403, "You are already registered please login");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  if (!otp) throw new ApiError(500, "Internal server error");
  const otpStatus = otp ? true : false;
  const currentDate = new Date();
  const fiveMinutes = 5 * 60 * 1000;
  const expiresAt = new Date(currentDate.getTime() + fiveMinutes);

  const newUser = await Store.create({
    storeName: name,
    storeContactNumber: contactNumber,
    storeEmail: email,
    otp: otp,
    otpExpiry: expiresAt,
  });

  const user = await Store.findOne({
    storeContactNumber: contactNumber,
  }).select("name contactNumber email");
  if (!user)
    throw new ApiError(400, "Registration incomplete. Please try again later");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, otpStatus, otp },
        "Otp has been sent to your contact number",
      ),
    );
});

const loginProfessional = asyncHandler(async (req, res) => {
  const { contactNumber } = req.body;
  if (!contactNumber) throw new ApiError(400, "Invalid request");
  if (!validatePhone(contactNumber))
    throw new ApiError(400, "Invalid contact number");

  const user = await Store.findOne({ storeContactNumber: contactNumber });
  if (!user) throw new ApiError(404, "Invalid user");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  if (!otp) throw new ApiError(500, "Internal server error");
  const otpStatus = otp ? true : false;
  const currentDate = new Date();
  const fiveMinutes = 5 * 60 * 1000;
  const expiresAt = new Date(currentDate.getTime() + fiveMinutes);

  user.otp = otp;
  user.otpExpiry = expiresAt;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { otpStatus, otp }, "OTP sent successfully !"));
});

const otpVerification = asyncHandler(async (req, res) => {
  const { verificationType } = req.params;

  if (verificationType === "registerVerification") {
    const { otp } = req.body;
    const { storeId } = req.params;

    const user = await Store.findById(storeId);
    if (!user) throw new ApiError(401, "Unauthorized access");

    const now = new Date();
    if (now > user.otpExpiry)
      throw new ApiError(403, "OTP expired, please try again");

    const matchOTP = user.otp === otp ? true : false;
    if (!matchOTP === false) throw new ApiError(403, "Invalid OTP");

    user.otp = null;
    user.otpExpiry = null;
    user.isTemporaryRegistered = false;
    await user.save();

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user, tokens: { accessToken, refreshToken } },
          "OTP verified successfully",
        ),
      );
  }

  if (verificationType === "loginVerification") {
    const { otp, contactNumber } = req.body;
    if (!otp || !contactNumber)
      throw new ApiError(400, "Please fill all the details");
    if (!validatePhone(contactNumber))
      throw new ApiError(400, "Invalid contact number");

    const user = await Store.findOne({ contactNumber });
    if (!user) throw new ApiError(401, "Unauthorized access");

    const now = new Date();
    if (now > user.otpExpiry)
      throw new ApiError(403, "OTP expired, please try again");

    const matchOTP = user.otp === otp;
    if (!matchOTP) throw new ApiError(403, "Invalid OTP");

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user, tokens: { accessToken, refreshToken } },
          "OTP verified successfully",
        ),
      );
  }
});



export { registerStore, loginProfessional, otpVerification };
