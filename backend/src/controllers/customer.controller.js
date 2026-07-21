import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Customer } from "../models/customer.model.js";
import { Address } from "../models/address.model.js";
import { BankDetails } from "../models/bankDetails.model.js";
import { ServiceBookings } from "../models/serviceBooking.model.js";
import { validatePhone } from "../validators/contactNumber.validator.js";

const registerCustomer = asyncHandler(async (req, res) => {
  const { contactNumber, name, email } = req.body;

  // contact number validation
  if (!contactNumber) throw new ApiError(400, "Please enter contact number");
  if (!validatePhone(contactNumber))
    throw new ApiError(400, "Invalid contact number");

  // name validation
  if (!name) throw new ApiError(400, "Please enter your name");
  if (name.length > 50)
    throw new ApiError(400, "Name length is too long, please try short forms");

  const existingTempUser = await Customer.findOne({
    contactNumber,
    isTemporaryRegistered: true,
  });
  if (existingTempUser) {
    const deleteUser = await Customer.findOneAndDelete({
      contactNumber: contactNumber,
      isTemporaryRegistered: true,
    });
  }
  const existingUser = await Customer.findOne({
    contactNumber,
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

  const newUser = await Customer.create({
    name: name,
    contactNumber: contactNumber,
    email: email,
    otp: otp,
    otpExpiry: expiresAt,
  });

  const user = await Customer.findOne({ contactNumber: contactNumber }).select(
    "name contactNumber email",
  );
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

const loginCustomer = asyncHandler(async (req, res) => {
  const { contactNumber } = req.body;
  if (!contactNumber) throw new ApiError(400, "Invalid request");
  if (!validatePhone(contactNumber))
    throw new ApiError(400, "Invalid contact number");

  const user = await Customer.findOne({ contactNumber: contactNumber });
  if (!user) throw new ApiError(400, "Invalid user");

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
    const { customerId } = req.params;

    const user = await Customer.findById(customerId);
    if (!user) throw new ApiError(401, "Unauthorized access");
    if (!user.otp || !user.otpExpiry)
      throw new ApiError(400, "Please restart the registration process again");

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

    const user = await Customer.findOne({ contactNumber: contactNumber });
    if (!user) throw new ApiError(401, "Unauthorized access");

    const now = new Date();
    if (now > user.otpExpiry)
      throw new ApiError(403, "OTP expired, please try again");
    console.log(otp, user.otp);
    console.log(user);

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

const updateGender = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { gender } = req.body;
  if (!gender) throw new ApiError(403, "Something went wrong");

  const user = await Customer.findByIdAndUpdate(customerId, { gender: gender });
  if (!user)
    throw new ApiError(
      400,
      "Unable to process the request at the moment, please try again",
    );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Updated successfully !"));
});

const addAlternateContactNumber = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { contactNumber } = req.body;
  if (!contactNumber) throw new ApiError(403, "Something went wrong");
  if (!validatePhone(contactNumber))
    throw new ApiError(400, "Invalid contact number");

  const user = await Customer.findByIdAndUpdate(customerId, {
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

const updateAlternateNumber = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { contactNumber } = req.body;
  if (!contactNumber)
    throw new ApiError(403, "Unable to get the new contact number");
  if (!validatePhone(contactNumber))
    throw new ApiError(400, "Invalid contact number");

  const user = await Customer.findById(customerId);
  if (!user)
    throw new ApiError(
      400,
      "Unable to process the request at the moment, please try again",
    );

  if (user.alternateContactNumber === contactNumber)
    throw new ApiError(
      400,
      "Contact number which you are providing is already in alternate contact, please try another number",
    );

  user.alternateContactNumber = "";
  user.alternateContactNumber = contactNumber;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Updated successfully !"));
});

const addAddress = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
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
    addressType,
    otherAddressType,
    name,
    contact,
  } = req.body;
  if (!street1 || !area || !city || !state || !country || !name || !contact)
    throw new ApiError(400, "Please fill the required inputs");

  const newAddress = await Address.create({
    customer: customerId,
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
    addressType,
    otherAddressType,
    contactDetails: { name: name, contact: contact },
  });
  if (!newAddress)
    throw new ApiError(400, "Something went wrong, please try again later");

  return res
    .status(200)
    .json(new ApiResponse(200, newAddress, "Added successfully !"));
});

const markAddressDefault = asyncHandler(async (req, res) => {
  const { addressId, customerId } = req.params;
  if (!addressId || !customerId)
    throw new ApiError(400, "Something went wrong please try again later");

  const removeDefault = await Address.find({ customer: customerId });
  removeDefault.defaultAddress = false;
  await removeDefault.save();

  const address = await Address.findByIdAndUpdate(addressId, {
    defaultAddress: true,
  });

  return res.status(200).json(new ApiResponse(200, {}, "Marked as default"));
});

const updateAddress = asyncHandler(async (req, res) => {
  const { customerId, addressId } = req.params;
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
    addressType,
    otherAddressType,
    name,
    contact,
  } = req.body;
  if (!street1 || !area || !city || !state || !country || !name || !contact)
    throw new ApiError(400, "Please fill the required inputs");

  const updatedAddress = await Address.findByIdAndUpdate(addressId, {
    customer: customerId,
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
    addressType,
    otherAddressType,
    contactDetails: { name: name, contact: contact },
  });
  if (!updatedAddress)
    throw new ApiError(400, "Something went wrong, please try again later");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAddress, "Added successfully !"));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId, customerId } = req.params;
  if (!addressId || !customerId)
    throw new ApiError(400, "Something went wrong");

  const address = await Address.findOneAndDelete({ customer: customerId });
  if (!address) throw new ApiError(400, "Unable to process the request");

  return res.status(200).json(new ApiResponse(200, {}, "Deleted successfully"));
});

const addBankDetails = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
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
    customer: customerId,
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

const addUPIid = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { upiID } = req.body;

  const addUPI = await BankDetails.create({ upiID: upiID });
  if (addUPI)
    throw new ApiError(403, "Something went wrong, please try again later");

  return res.status(200).json(new ApiResponse(200, {}, "Added successfully !"));
});

const dashboardData = asyncHandler(async (req, res) => {
  const { customerId, query } = req.params;

  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(401, "Invalid request !");

  if (!query || query === "overview") {
    const customer = await Customer.findById(customerId).select(
      "name contactNumber email gender alternateContactNumber",
    );
    if (!customer) throw new ApiError(400, "User not found");
    const defaultAddress = await Address.findOne({
      customer: customerId,
      defaultAddress: true,
    });
    if (!defaultAddress) throw new ApiError(400, "No default address found");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { customer, defaultAddress },
          "Dashboard data fetched successfully !",
        ),
      );
  }
  if (query === "address") {
    const address = await Address.find({ customer: customerId });
    if (!address) throw new ApiError(404, "No data found");

    return res
      .status(200)
      .json(new ApiResponse(200, address, "Data fetched successfully !"));
  }
  if (query === "bankDetails") {
    const bankDetails = await BankDetails.findOne({ customer: customerId });
    if (!bankDetails) throw new ApiError(404, "No data found");

    return res
      .status(200)
      .json(new ApiResponse(200, bankDetails, "Data fetched successfully !"));
  }
  if (query === "service-bookings") {
    const bookings = await ServiceBookings.find({ customer: customerId });
    if (!bookings) throw new ApiError(404, "No data found");

    return res
      .status(200)
      .json(new ApiResponse(200, bookings, "Data fetched successfully !"));
  }
  if (query === "fav-store") {
    const favStore = customer.favStore.populate({
      path: "favStore",
      select: "storeName logo address storeContactNumber",
    });
    if (!favStore) throw new ApiError(404, "No data found");

    return res
      .status(200)
      .json(new ApiResponse(200, favStore, "Data fetched successfully !"));
  }
  if (query === "fav-professional") {
    const favProfessional = customer.favProfessional.populate({
      path: "favProfessional",
      select: "name contactNumber images isVerified",
    });
    if (!favProfessional) throw new ApiError(404, "No data found");

    return res
      .status(200)
      .json(
        new ApiResponse(200, favProfessional, "Data fetched successfully !"),
      );
  }
  if (query === "quick-services") {
    const quickService = customer.quickServices.populate({
      path: "quickServices",
      select: "name coverImage charges serviceFor",
    });
    if (!quickService) throw new ApiError(404, "No data found");

    return res
      .status(200)
      .json(new ApiResponse(200, quickService, "Data fetched successfully !"));
  }
  if (query === "wishlist") {
    const wishlist = customer.wishListServices.populate({
      path: "wishListServices",
      select: "name coverImage charges serviceFor",
    });
    if (!wishlist) throw new ApiError(404, "No data found");

    return res
      .status(200)
      .json(new ApiResponse(200, wishlist, "Data fetched successfully !"));
  }
});

export {
  registerCustomer,
  loginCustomer,
  otpVerification,
  updateGender,
  addAlternateContactNumber,
  updateAlternateNumber,
  addAddress,
  markAddressDefault,
  updateAddress,
  deleteAddress,
  addBankDetails,
  addUPIid,
  dashboardData,
};
