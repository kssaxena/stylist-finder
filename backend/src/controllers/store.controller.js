import jwt from "jsonwebtoken";
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
    storeContactNumber: contactNumber,
    isTemporaryRegistered: true,
  });
  if (existingTempUser) {
    const deleteUser = await Store.findOneAndDelete({
      storeContactNumber: contactNumber,
    });
  }
  const existingUser = await Store.findOne({
    storeContactNumber: contactNumber,
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

const loginStore = asyncHandler(async (req, res) => {
  const { contactNumber } = req.body;

  if (!contactNumber) throw new ApiError(400, "Invalid request");
  if (!validatePhone(contactNumber))
    throw new ApiError(400, "Invalid contact number");

  const storeUser = await Store.findOne({
    storeContactNumber: contactNumber,
    isTemporaryRegistered: false,
  });
  if (!storeUser) throw new ApiError(404, "Invalid storeUser");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  if (!otp) throw new ApiError(500, "Internal server error");
  const otpStatus = otp ? true : false;
  const currentDate = new Date();
  const fiveMinutes = 5 * 60 * 1000;
  const expiresAt = new Date(currentDate.getTime() + fiveMinutes);

  storeUser.otp = otp;
  storeUser.otpExpiry = expiresAt;
  await storeUser.save();

  // const user = contactNumber,
  //   storeName;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: { contactNumber }, otpStatus, otp },
        "OTP sent successfully !",
      ),
    );
});

const otpVerification = asyncHandler(async (req, res) => {
  const { verificationType } = req.params;

  if (verificationType === "registerVerification") {
    const { otp } = req.body;
    console.log(otp);
    const { storeId } = req.params;

    const user = await Store.findById(storeId);
    if (!user) throw new ApiError(401, "Unauthorized access");

    const now = new Date();
    if (now > user.otpExpiry)
      throw new ApiError(403, "OTP expired, please try again");
    if (otp != user.otp) throw new ApiError(400, "Invalid OTP");

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

    const user = await Store.findOne({ storeContactNumber: contactNumber });
    if (!user) throw new ApiError(401, "Unauthorized access");

    const now = new Date();
    if (now > user.otpExpiry)
      throw new ApiError(403, "OTP expired, please try again");

    if (otp != user.otp) throw new ApiError(400, "Invalid OTP");

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

const addAddress = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const {
    flatNumber,
    floor,
    block,
    societyName,
    street1,
    street2,
    area,
    locality,
    sector,
    city,
    state,
    country,
    lat,
    lng,
  } = req.body;
  if (!street1 || !area || !city || !state || !country)
    throw new ApiError(400, "Please fill the required inputs");

  const newAddress = await Address.create({
    store: storeId,
    flatNumber,
    floor,
    block,
    societyName,
    street1,
    street2,
    area,
    locality,
    sector,
    city,
    state,
    country,
    location: { coordinates: [lat, lng] },
  });
  if (!newAddress)
    throw new ApiError(400, "Something went wrong, please try again later");

  return res
    .status(200)
    .json(new ApiResponse(200, newAddress, "Added successfully !"));
});

const updateAddress = asyncHandler(async (req, res) => {
  const { storeId, addressId } = req.params;
  const {
    flatNumber,
    floor,
    block,
    societyName,
    street1,
    street2,
    area,
    locality,
    sector,
    city,
    state,
    country,
    lat,
    lng,
  } = req.body;
  if (!street1 || !area || !city || !state || !country)
    throw new ApiError(400, "Please fill the required inputs");

  const updatedAddress = await Address.findByIdAndUpdate(addressId, {
    store: storeId,
    flatNumber,
    floor,
    block,
    societyName,
    street1,
    street2,
    area,
    locality,
    sector,
    city,
    state,
    country,
    location: { coordinates: [lat, lng] },
  });
  if (!updatedAddress)
    throw new ApiError(400, "Something went wrong, please try again later");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAddress, "Added successfully !"));
});

const addBankDetails = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const {
    bankName,
    branchName,
    accountHolderName,
    accountNumber,
    confirmAccountNumber,
    ifscCode,
    upiID,
  } = req.body;

  if (
    !bankName ||
    !branchName ||
    !accountHolderName ||
    !accountNumber ||
    !confirmAccountNumber ||
    !ifscCode
  )
    throw new ApiError(400, "All details are required");

  const bankValidation = validateBankDetails(
    bankName,
    branchName,
    accountHolderName,
    accountNumber,
    confirmAccountNumber,
    ifscCode,
  );
  if (!bankValidation.valid) {
    throw new ApiError(403, bankValidation.message);
  }

  // add upi validator here.. in future

  const bank = await BankDetails.create({
    store: storeId,
    accountDetails: {
      bankName,
      branchName,
      accountHolderName,
      accountNumber,
      confirmAccountNumber,
      ifscCode,
    },
    upiID,
  });
  if (!bank)
    throw new ApiError(403, "Something went wrong, please try again later !");
  await bank.save();

  return res.status(200).json(new ApiResponse(200, {}, "Added successfully !"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const {
    serviceType,
    paymentOptions,
    storeTimings,
    ownerName,
    ownerContact,
    ownerEmail,
    ownerAddress,
  } = req.body;

  if (!validatePhone(ownerContact))
    throw new ApiError(403, "Invalid contact number");
  if (ownerName.length > 100)
    throw new ApiError(400, "Name length is too long.");

  const store = await Store.findByIdAndUpdate(storeId, {
    serviceType,
    paymentOptions,
    storeTimings,
    owner: { ownerName, ownerContact, ownerEmail, ownerAddress },
  });
  if (!store)
    throw new ApiError(400, "Something went wrong, please try again later");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Updated Successfully !"));
});

const submitKYCVerification = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { aadharNumber, panNumber, storePan, gstNumber } = req.body;

  if (!storeId) throw new ApiError(400, "Invalid request");
  if (!aadharNumber || !panNumber)
    throw new ApiError(400, "Aadhar and Pan numbers are required for KYC");

  //   validators
  if (validateAadhaar(aadharNumber) === !true)
    throw new ApiError(401, "Invalid AADHAR number");
  if (validatePAN(panNumber) === !true)
    throw new ApiError(401, "Invalid PAN number");
  if (validatePAN(storePan) === !true)
    throw new ApiError(401, "Invalid PAN number");
  if (gstNumber) {
    if (validateGST(gstNumber) === !true)
      throw new ApiError(401, "Invalid GST number");
  }

  const user = await Store.findById(storeId);
  if (!user) throw new ApiError(404, "No user found");

  const sanitize = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/\s+/g, "-");
  const safeName = sanitize(user.name);
  const safePhone = sanitize(user.contactNumber);

  let aadharFront = {};
  let aadharBack = {};
  let PAN = {};
  let StorePAN = {};
  let GST = {};

  if (req.files?.aadharFront?.[0]) {
    const uploaded = await UploadImages(req.files.aadharFront[0].filename, {
      folderStructure: `professional/kyc-images/${safePhone}-${safeName}`,
    });
    aadharFront = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }
  if (req.files?.aadharBack?.[0]) {
    const uploaded = await UploadImages(req.files.aadharBack[0].filename, {
      folderStructure: `professional/kyc-images/${safePhone}-${safeName}`,
    });
    aadharBack = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }
  if (req.files?.StorePAN?.[0]) {
    const uploaded = await UploadImages(req.files.StorePAN[0].filename, {
      folderStructure: `professional/kyc-images/${safePhone}-${safeName}`,
    });
    StorePAN = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }
  if (req.files?.PAN?.[0]) {
    const uploaded = await UploadImages(req.files.PAN[0].filename, {
      folderStructure: `professional/kyc-images/${safePhone}-${safeName}`,
    });
    PAN = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }
  if (req.files?.GST?.[0]) {
    const uploaded = await UploadImages(req.files.GST[0].filename, {
      folderStructure: `professional/kyc-images/${safePhone}-${safeName}`,
    });
    GST = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }

  user.owner = {
    aadhar: {
      number: aadharNumber,
      image: {
        front: aadharFront,
        back: aadharBack,
      },
    },
    pan: {
      number: panNumber,
      image: PAN,
    },
  };
  user.pan = { number: storePan, image: { StorePAN } };
  user.gst = { number: gstNumber, image: { GST } };
  user.owner.ownerKycSubmitted = true;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "KYC details are submitted we will verify it soon, please feel free to contact our representative.",
      ),
    );
});

const reLoginToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken;
  if (!token) throw new ApiError(401, "Unauthorized request");

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await Store.findById(decoded._id);
  if (!user) throw new ApiError(401, "Invalid refresh token");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return res.status(200).json(
    new ApiResponse(200, {
      user,
      tokens: { accessToken, refreshToken },
    }),
  );
});

export {
  registerStore,
  loginStore,
  otpVerification,
  addAddress,
  updateAddress,
  addBankDetails,
  updateProfile,
  submitKYCVerification,
  reLoginToken,
};
