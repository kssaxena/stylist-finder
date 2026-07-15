import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Address } from "../models/address.model.js";
import { BankDetails } from "../models/bankDetails.model.js";
import { Professional } from "../models/professional.model.js";
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

const registerProfessional = asyncHandler(async (req, res) => {
  const { contactNumber, name, email } = req.body;

  // contact number validation
  if (!contactNumber) throw new ApiError(400, "Please enter contact number");
  if (!validatePhone(contactNumber))
    throw new ApiError(400, "Invalid contact number");

  // name validation
  if (!name) throw new ApiError(400, "Please enter your name");
  if (name.length > 50)
    throw new ApiError(400, "Name length is too long, please try short forms");

  const existingTempUser = await Professional.findOne({
    contactNumber: contactNumber,
    isTemporaryRegistered: true,
  });
  if (existingTempUser) {
    const deleteUser = await Professional.findOneAndDelete({
      contactNumber: contactNumber,
    });
  }
  const existingUser = await Professional.findOne({
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

  const newUser = await Professional.create({
    name: name,
    contactNumber: contactNumber,
    email: email,
    otp: otp,
    otpExpiry: expiresAt,
  });

  const user = await Professional.findOne({
    contactNumber: contactNumber,
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

  const user = await Professional.findOne({ contactNumber: contactNumber });
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
    const { customerId } = req.params;

    const user = await Customer.findById(customerId);
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

    return res
      .status(200)
      .json(new ApiResponse(200, user, "OTP verified successfully"));
  }

  if (verificationType === "loginVerification") {
    const { otp, contactNumber } = req.body;
    if (!otp || !contactNumber)
      throw new ApiError(400, "Please fill all the details");
    if (!validatePhone(contactNumber))
      throw new ApiError(400, "Invalid contact number");

    const user = await Professional.findOne(contactNumber);
    if (!user) throw new ApiError(401, "Unauthorized access");

    const now = new Date();
    if (now > user.otpExpiry)
      throw new ApiError(403, "OTP expired, please try again");

    const matchOTP = user.otp === otp;
    if (!matchOTP) throw new ApiError(403, "Invalid OTP");

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, user, "OTP verified successfully"));
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const { about, specialization, gender, serviceType, paymentOptions } =
    req.body;
  const { professionalId } = req.params;
  if (!professionalId || !about || !specialization)
    throw new ApiError(400, "Invalid request, please try again later");

  const user = await Professional.findById(professionalId);
  if (!user) throw new ApiError(404, "Invalid user");

  const specialServiceName = specialization
    ? specialization.split(",").map((s) => s.trim())
    : [];

  user.about = about;
  user.specialization = specialServiceName;
  user.gender = gender;
  user.serviceType = serviceType;
  user.paymentOptions = paymentOptions;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Updated successfully !"));
});

const addAddress = asyncHandler(async (req, res) => {
  const { professionalId } = req.params;
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
    professional: professionalId,
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
  const { professionalId, addressId } = req.params;
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
    professional: professionalId,
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
  const { professionalId } = req.params;
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
    professional: professionalId,
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

const addAlternateContactNumber = asyncHandler(async (req, res) => {
  const { professionalId } = req.params;
  const { contactNumber } = req.body;
  if (!contactNumber) throw new ApiError(403, "Something went wrong");
  if (!validatePhone(contactNumber))
    throw new ApiError(400, "Invalid contact number");

  const user = await Professional.findByIdAndUpdate(professionalId, {
    alternateContactNumber: contactNumber,
  });
  if (!user)
    throw new ApiError(
      400,
      "Unable to process the request at the moment, please try again",
    );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Updated successfully !"));
});

const addProfileImage = asyncHandler(async (req, res) => {
  const { professionalId } = req.params;

  const user = await Professional.findById(professionalId);
  if (!user) throw new ApiError(404, "Invalid request");

  const sanitize = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/\s+/g, "-");
  const safeName = sanitize(user.name);
  const safePhone = sanitize(user.contactNumber);

  let profileImage = {};
  if (req.files?.profileImage?.[0]) {
    const uploaded = await UploadImages(req.files.profileImage[0].filename, {
      folderStructure: `professional/profile-images/${safePhone}-${safeName}`,
    });
    profileImage = {
      url: uploaded.url,
      fileId: uploaded.fileId,
    };
  }

  user.images = { profileImage: profileImage };
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Updated successfully!"));
});

const addGalleryImages = asyncHandler(async (req, res) => {
  const { professionalId } = req.params;

  const user = await Professional.findById(professionalId);
  if (!user) throw new ApiError(404, "Invalid request");

  const sanitize = (str = "") =>
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/\s+/g, "-");
  const safeName = sanitize(user.name);
  const safePhone = sanitize(user.contactNumber);

  let galleryImages = [];
  if (req.files?.galleryImages?.length) {
    for (const doc of req.files.galleryImages) {
      const uploaded = await UploadImages(doc.filename, {
        folderStructure: `professional/gallery-images/${safeName}-${safePhone}`,
      });

      galleryImages.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
      });
    }
  }

  user.images = { gallery: galleryImages };
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Updated successfully!"));
});

const getProfessionalById = asyncHandler(async (req, res) => {
  const { professionalId } = req.params;
  if (!professionalId) throw new ApiError(400, "Invalid request");

  const user = await Professional.findById(professionalId);
  if (!user) throw new ApiError(404, "No data found");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Data fetched successfully !"));
});

const getAllProfessionals = asyncHandler(async (req, res) => {
  const users = await Professional.find({ isActive: true }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Data fetched successfully !"));
});

const dashboardData = asyncHandler(async (req, res) => {
  const { professionalId, query } = req.params;

  const professional = await Professional.findById(professionalId);
  if (!professional) throw new ApiError(401, "Invalid request !");

  if (!query || query === "overview") {
    const professional = await Professional.findById(professionalId).select(
      "name contactNumber email gender alternateContactNumber about specialization serviceType paymentOptions images",
    );
    if (!professional) throw new ApiError(400, "User not found");
    const defaultAddress = await Address.findOne({
      professional: professionalId,
      defaultAddress: true,
    });
    if (!defaultAddress) throw new ApiError(400, "No default address found");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { professional, defaultAddress },
          "Dashboard data fetched successfully !",
        ),
      );
  }
  if (query === "address") {
    const address = await Address.find({ professional: professionalId });
    if (!address) throw new ApiError(404, "No data found");

    return res
      .status(200)
      .json(new ApiResponse(200, address, "Data fetched successfully !"));
  }
  if (query === "bankDetails") {
    const bankDetails = await BankDetails.findOne({
      professional: professionalId,
    });
    if (!bankDetails) throw new ApiError(404, "No data found");

    return res
      .status(200)
      .json(new ApiResponse(200, bankDetails, "Data fetched successfully !"));
  }
  if (query === "service") {
    const services = await Services.find({
      professional: professionalId,
    });
    if (!services) throw new ApiError(404, "No data found");

    return res
      .status(200)
      .json(new ApiResponse(200, services, "Data fetched successfully !"));
  }
  if (query === "service-bookings") {
    const bookings = await ServiceBookings.find({
      professional: professionalId,
    });
    if (!bookings) throw new ApiError(404, "No data found");

    return res
      .status(200)
      .json(new ApiResponse(200, bookings, "Data fetched successfully !"));
  }
});

const submitKYCVerification = asyncHandler(async (req, res) => {
  const { aadharNumber, panNumber, gstNumber } = req.body;
  const { professionalId } = req.params;

  if (!professionalId) throw new ApiError(400, "Invalid request");
  if (!aadharNumber || !panNumber)
    throw new ApiError(400, "Aadhar and Pan numbers are required for KYC");

  //   validators
  if (validateAadhaar(aadharNumber) === !true)
    throw new ApiError(401, "Invalid AADHAR number");
  if (validatePAN(panNumber) === !true)
    throw new ApiError(401, "Invalid PAN number");
  if (gstNumber) {
    if (validateGST(gstNumber) === !true)
      throw new ApiError(401, "Invalid GST number");
  }

  const user = await Professional.findById(professionalId);
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

  user.kycDetails = {
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
    gst: {
      number: gstNumber,
      image: GST,
    },
  };
  user.kycSubmitted = true;
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

export {
  registerProfessional,
  loginProfessional,
  otpVerification,
  updateProfile,
  addAddress,
  updateAddress,
  addBankDetails,
  addAlternateContactNumber,
  addProfileImage,
  addGalleryImages,
  getProfessionalById,
  getAllProfessionals,
  submitKYCVerification,
  dashboardData,
};
