import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Address } from "../models/address.model.js";
import { BankDetails } from "../models/bankDetails.model.js";
import { validatePhone } from "../validators/contactNumber.validator.js";
import { DeleteImage, UploadImages } from "../utils/imageKit.io.js";
import { ServiceBookings } from "../models/serviceBooking.model.js";
import { Services } from "../models/service.model.js";
import {
  validateAadhaar,
  validateGST,
  validatePAN,
} from "../validators/KYC.validator.js";
import { validateBankDetails } from "../validators/bankDetails.validator.js";
import { Store } from "../models/store.model.js";
import { StoreStaff } from "../models/storeStaff.model.js";
import { Subscription } from "../models/subscription.model.js";
import { PaymentTransaction } from "../models/paymentTransaction.models.js";
import sendEmail from "../services/mail.service.js";
import otpTemplate from "../template/otp.mail.template.js";
import welcomeTemplate from "../template/welcome.mail.template.js";
import { validatePassword } from "../validators/password.validator.js";

const registerStore = asyncHandler(async (req, res) => {
  const { name, contactNumber, email, password } = req.body;
  // contact number validation
  if (!contactNumber) throw new ApiError(400, "Please enter contact number");
  if (!validatePhone(contactNumber))
    throw new ApiError(400, "Invalid contact number");

  // password validation
  if (!validatePassword(password)) {
    throw new ApiError(
      400,
      "Invalid password, Must be at least 8 characters, contain 1 uppercase, 1 lowercase, 1 digit, and 1 special character",
    );
    return ApiError(400, "Invalid request");
  }

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
    password: password,
    storeContactNumber: contactNumber,
    storeEmail: email,
    otp: otp,
    otpExpiry: expiresAt,
  });

  await sendEmail({
    to: newUser?.storeEmail,
    subject: "OTP Verification",
    html: otpTemplate(newUser?.storeName, otp),
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
        { user, otpStatus },
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
  if (!storeUser)
    throw new ApiError(404, "Invalid credentials, please register.");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  if (!otp) throw new ApiError(500, "Internal server error");
  const otpStatus = otp ? true : false;
  const currentDate = new Date();
  const fiveMinutes = 5 * 60 * 1000;
  const expiresAt = new Date(currentDate.getTime() + fiveMinutes);

  storeUser.otp = otp;
  storeUser.otpExpiry = expiresAt;
  await storeUser.save();

  await sendEmail({
    to: storeUser?.storeEmail,
    subject: "OTP Verification",
    html: otpTemplate(storeUser?.storeName, otp),
  });
  console.log(otp);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: { contactNumber }, otpStatus },
        "OTP sent successfully !",
      ),
    );
});

const updatePassword = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  if (!userId || !password)
    throw new ApiError(400, "Please fill the correct value");

  const user = await Store.findById(userId);
  const userPassword = user.password;
  if (!userPassword) {
    user.password = password;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password saved successfully !"));
  }
  if (userPassword || user.password.length <= 1) {
    user.password = password;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password updated successfully !"));
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { contactNumber, email, password } = req.body;
  if (!contactNumber || !email || !password)
    throw new ApiError(400, "Please fill all the required fields");

  // const isPasswordValid = validatePassword(password);
  // if (!isPasswordValid) {
  //   throw new ApiError(400, "Invalid password");
  // }

  const user = await Store.findOne({
    storeContactNumber: contactNumber,
    // storeEmail: email,
  });
  if (!user)
    throw new ApiError(
      400,
      "Unable process this request at the moment please try again later",
    );

  user.password = password;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Password changed successfully !, please login"),
    );
});

const passwordLogin = asyncHandler(async (req, res) => {
  const { contactNumber, email, password } = req.body;
  if (!contactNumber) throw new ApiError(400, "Invalid request ");

  if (contactNumber) {
    const user = await Store.findOne({ storeContactNumber: contactNumber });
    if (!user) throw new ApiError(401, "Invalid credentials");

    const isValid = await user.comparePassword(password);
    if (!isValid) throw new ApiError(401, "Incorrect Password !");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user, tokens: { accessToken, refreshToken } },
          "Logged in successful !",
        ),
      );
  }
  if (email) {
    const user = await Store.findOne({ email });
    if (!user) throw new ApiError(401, "Invalid credentials");

    const isValid = await user.comparePassword(password);
    if (!isValid) throw new ApiError(401, "Incorrect Password !");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user, tokens: { accessToken, refreshToken } },
          "Logged in successful !",
        ),
      );
  }
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

    await sendEmail({
      to: user?.storeEmail,
      subject: "Welcome",
      html: welcomeTemplate(user?.storeName),
    });

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
    pincode,
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
    pincode,
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
    pincode,
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
    pincode,
    location: { coordinates: [lat, lng] },
  });
  if (!updatedAddress)
    throw new ApiError(400, "Something went wrong, please try again later");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAddress, "Added successfully !"));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId, storeId } = req.params;

  const store = await Store.findById(storeId);
  if (!store)
    throw new ApiError(400, "Invalid request, please try again later");

  const address = await Address.findByIdAndDelete(addressId);
  // if (!address) throw new ApiError(400, "Unable to delete address");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Deleted successfully !"));
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
    storeName,
    storeContactNumber,
    storeEmail,
    serviceType,
    paymentOptions,
    storeTimings,
  } = req.body;

  if (!storeName || !storeContactNumber || !storeEmail)
    throw new ApiError(
      400,
      "Store name, contact number and email are required",
    );
  if (!validatePhone(storeContactNumber))
    throw new ApiError(403, "Invalid contact number");
  if (storeName.length > 100)
    throw new ApiError(400, "Name length is too long.");

  const store = await Store.findByIdAndUpdate(
    storeId,
    {
      storeName,
      storeContactNumber,
      storeEmail,
      serviceType,
      paymentOptions,
      storeTimings: {
        openFrom: storeTimings?.openFrom
          ? new Date(`1970-01-01T${storeTimings.openFrom}:00`)
          : undefined,
        openTill: storeTimings?.openTill
          ? new Date(`1970-01-01T${storeTimings.openTill}:00`)
          : undefined,
      },
    },
    { new: true, runValidators: true },
  );
  if (!store)
    throw new ApiError(400, "Something went wrong, please try again later");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Updated Successfully !"));
});

const submitKYCVerification = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const {
    aadharNumber,
    panNumber,
    storePan,
    gstNumber,
    ownerName,
    ownerContact,
    ownerEmail,
    ownerAddress,
  } = req.body;

  if (!storeId) throw new ApiError(400, "Invalid request");
  if (!aadharNumber || !panNumber)
    throw new ApiError(400, "Aadhar and Pan numbers are required for KYC");

  if (!validateAadhaar(aadharNumber).valid)
    throw new ApiError(401, "Invalid AADHAR number");
  if (!validatePAN(panNumber).valid)
    throw new ApiError(401, "Invalid PAN number");
  if (storePan && !validatePAN(storePan).valid)
    throw new ApiError(401, "Invalid store PAN number");
  if (gstNumber && !validateGST(gstNumber).valid)
    throw new ApiError(401, "Invalid GST number");

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
    ownerName,
    ownerContact,
    ownerEmail,
    ownerAddress,
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
  user.pan = { number: storePan, image: StorePAN };
  user.gst = { number: gstNumber, image: GST };
  user.owner.ownerKycSubmitted = true;
  user.ownerKycSubmitted = true;
  user.storeKycSubmitted = true;
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

const dashboardData = asyncHandler(async (req, res) => {
  const { storeId, query = "overview" } = req.params;

  const store = await Store.findById(storeId);

  if (!store) {
    throw new ApiError(404, "store not found");
  }

  switch (query) {
    case "overview": {
      const storeInfo = await Store.findById(storeId).select(
        "storeName storeContactNumber storeEmail createdAt bookings isRegistrationFeePaid serviceType paymentOptions storeTimings images subscription",
      );

      const subscription = await Subscription.findById(
        storeInfo?.subscription?.subscriptionModel,
      );

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            store: storeInfo,
            subscription,
          },
          "Dashboard data fetched successfully",
        ),
      );
    }

    case "address": {
      const addresses = await Address.find({ store: storeId });

      return res
        .status(200)
        .json(
          new ApiResponse(200, addresses, "Addresses fetched successfully"),
        );
    }

    case "bankDetails": {
      const bankDetails = await BankDetails.findOne({
        store: storeId,
      });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            bankDetails,
            "Bank details fetched successfully",
          ),
        );
    }

    case "payments": {
      const payments = await PaymentTransaction.find({ user: storeId })
        .sort({ createdAt: -1 })
        .lean();

      return res
        .status(200)
        .json(new ApiResponse(200, payments, "Payments fetched successfully"));
    }

    case "storeStaff": {
      const storeStaff = await StoreStaff.find({
        store: storeId,
      });

      return res
        .status(200)
        .json(
          new ApiResponse(200, storeStaff, "Bank details fetched successfully"),
        );
    }

    case "images": {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            store.images || {},
            "Images fetched successfully",
          ),
        );
    }

    case "services": {
      const store = await Store.findById(storeId).select("subscription");
      const service = await Services.find({
        store: storeId,
      })
        .populate({ path: "executive", select: "name" })
        .populate({ path: "category", select: "title" })
        .sort({ createdAt: -1 });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { service, store },
            "Details fetched successfully",
          ),
        );
    }

    case "bookings": {
      const bookings = await ServiceBookings.find({
        store: storeId,
      })
        .populate({ path: "address", select: "city state" })
        .populate({ path: "customer", select: "name contactNumber" })
        .populate({ path: "store", select: "storeName storeContactNumber" })
        .populate({ path: "service", select: "name duration executive" })
        .sort({ createdAt: -1 });

      return res
        .status(200)
        .json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
    }

    case "kyc": {
      const kyc = await Store.findById(storeId).select(
        "storeName owner pan gst ownerKycSubmitted ownerKycComplete storeKycSubmitted storeKycComplete ",
      );

      return res
        .status(200)
        .json(new ApiResponse(200, kyc, "Data fetched successfully"));
    }

    default:
      throw new ApiError(400, "Invalid dashboard query");
  }
});

const addStoreStaff = asyncHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    email,
    designation,
    experience,
    specialization,
    otherServices,
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
    pincode,
  } = req.body;

  const { storeId } = req.params;

  const store = await Store.findById(storeId).populate("address");
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  const plan = await Subscription.findById(
    store.subscription?.subscriptionModel,
  );
  if (
    !store.subscription?.subscriptionPurchased ||
    !store.subscription?.subscriptionValidity ||
    store.subscription.subscriptionValidity <= new Date() ||
    !plan?.isActive
  ) {
    throw new ApiError(403, "Purchase an active subscription to add staff");
  }

  // if (!name?.trim()) throw new ApiError(400, "Please enter staff name");
  // if (name.length > 50)
  //   throw new ApiError(
  //     400,
  //     "Name length is too long, please use a shorter name",
  //   );

  // if (!contactNumber) throw new ApiError(400, "Contact number is required");
  // if (!validatePhone(contactNumber))
  //   throw new ApiError(400, "Invalid contact number");

  // if (!email) throw new ApiError(400, "Email is required");
  // if (!validateEmail(email)) throw new ApiError(400, "Invalid email address");

  const alreadyExists = await StoreStaff.findOne({
    $or: [{ contactNumber }, { email: email.toLowerCase() }],
  });

  if (alreadyExists) {
    throw new ApiError(
      409,
      "A staff member already exists with this contact number or email",
    );
  }
  const storeAddress = await Address.findOne({ store: storeId });
  const storeLongitude = storeAddress.location.coordinates[1];
  const storeLatitude = storeAddress.location.coordinates[0];

  const address = await Address.create({
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
    pincode,
    location: { coordinates: [storeLatitude, storeLongitude] },
  });

  let profileImage = {};

  if (req.file) {
    const uploadedImage = await UploadImages(req.file.filename, {
      folderStructure: "storeStaff/profilePicture",
    });

    profileImage = {
      url: uploadedImage.url,
      fileId: uploadedImage.fileId,
    };
  }

  const staff = await StoreStaff.create({
    store: storeId,
    name: name.trim(),
    contactNumber,
    email: email.toLowerCase(),
    designation,
    experience,
    specialization,
    otherServices: otherServices
      ? Array.isArray(otherServices)
        ? otherServices
        : otherServices.split(",").map((s) => s.trim())
      : [],
    address: address._id,
    profileImage,
  });

  address.storeStaff = staff;
  store.storeStaffs.push(staff._id);
  await address.save();
  await store.save();

  return res
    .status(201)
    .json(new ApiResponse(201, staff, "Store staff added successfully."));
});

const getStaffForService = asyncHandler(async (req, res) => {
  const { storeId } = req.params;

  const staffs = await StoreStaff.find({
    store: storeId,
    isActive: true,
  }).select("name specialization designation");
  if (!staffs) throw new ApiError(400, "No data found");

  return res
    .status(200)
    .json(new ApiResponse(200, staffs, "Data fetched successfully !"));
});

const registrationFeePaid = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const store = await Store.findByIdAndUpdate(storeId, {
    isRegistrationFeePaid: true,
  });
  if (!store) throw new ApiError(400, "Something went wrong");

  return res
    .status(200)
    .json(new ApiResponse(200, store, "Data updated successfully !"));
});

const addGalleryImages = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const store = await Store.findById(storeId);
  if (!store) throw new ApiError(404, "Store not found");

  const plan = await Subscription.findById(
    store.subscription?.subscriptionModel,
  );
  if (
    !store.subscription?.subscriptionPurchased ||
    !store.subscription?.subscriptionValidity ||
    store.subscription.subscriptionValidity <= new Date() ||
    !plan?.isActive
  ) {
    throw new ApiError(403, "Purchase an active subscription to upload images");
  }

  const files = req.files || [];
  if (!files.length)
    throw new ApiError(400, "Please select at least one image");

  const currentGallery = store.images?.gallery || [];
  const photoLimit = plan.mediaLimit?.photos || 0;
  if (
    !plan.mediaLimit?.unlimitedPhotos &&
    currentGallery.length + files.length > photoLimit
  ) {
    throw new ApiError(
      403,
      `This plan allows ${photoLimit} gallery image${photoLimit === 1 ? "" : "s"}`,
    );
  }

  const safeName = store.storeName.toLowerCase().replace(/[^a-z0-9-_]+/g, "-");
  const uploadedImages = [];
  for (const file of files) {
    const uploaded = await UploadImages(file.filename, {
      folderStructure: `store/gallery-images/${safeName}-${storeId}`,
    });
    uploadedImages.push({ url: uploaded.url, fileId: uploaded.fileId });
  }

  store.images = {
    ...(store.images?.toObject?.() || store.images || {}),
    gallery: [...currentGallery, ...uploadedImages],
  };
  await store.save();

  return res
    .status(200)
    .json(new ApiResponse(200, store.images, "Gallery updated successfully"));
});

const deleteGalleryImage = asyncHandler(async (req, res) => {
  const { storeId, fileId } = req.params;
  const store = await Store.findById(storeId);
  if (!store) throw new ApiError(404, "Store not found");

  const imageExists = (store.images?.gallery || []).some(
    (image) => image.fileId === fileId,
  );
  if (!imageExists) throw new ApiError(404, "Gallery image not found");

  await DeleteImage(fileId);
  store.images.gallery = store.images.gallery.filter(
    (image) => image.fileId !== fileId,
  );
  await store.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, store.images, "Gallery image deleted successfully"),
    );
});

const getStoreById = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  if (!storeId) throw new ApiError(400, "Invalid request");

  const store = await Store.findById(storeId)
    .select(
      "storeName storeContactNumber storeEmail storeTimings images isVerified services",
    )
    .populate("address services");
  if (!store) throw new ApiError(400, "Store not found ");

  const services = await Services.find({ store: storeId }).sort({
    createdAt: -1,
  });
  if (!services)
    throw new ApiError(400, "Unable to get services of this store");

  return res
    .status(200)
    .json(
      new ApiResponse(200, { store, services }, "Data fetched successfully !"),
    );
});

export {
  registerStore,
  loginStore,
  updatePassword,
  passwordLogin,
  otpVerification,
  addAddress,
  updateAddress,
  deleteAddress,
  addBankDetails,
  updateProfile,
  submitKYCVerification,
  reLoginToken,
  addStoreStaff,
  addGalleryImages,
  deleteGalleryImage,
  getStaffForService,
  registrationFeePaid,
  changePassword,
  getStoreById,
  dashboardData,
};
