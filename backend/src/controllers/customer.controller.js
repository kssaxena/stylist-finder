import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Customer } from "../models/customer.model.js";
import { Address } from "../models/address.model.js";
import { BankDetails } from "../models/bankDetails.model.js";

const registerCustomer = asyncHandler(async (req, res) => {
  const { contactNumber, name, email } = req.body;
  if (!contactNumber) throw new ApiError(400, "Please enter contact number");
  if (!name) throw new ApiError(400, "Please enter your name");

  const existingTempUser = await Customer.findOne(contactNumber, {
    isTemporaryRegistered: true,
  });
  if (existingTempUser) {
    const deleteUser = await Customer.findOneAndDelete(contactNumber);
  }
  const existingUser = await Customer.findOne(contactNumber, {
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
  });

  newUser.otp = otp;
  newUser.otpExpiry = expiresAt;
  newUser.save();

  const user = await Customer.findOne(contactNumber).select(
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

  const user = await Customer.findOne(contactNumber);
  if (!user) throw new ApiError(400, "Invalid user");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  if (!otp) throw new ApiError(500, "Internal server error");
  const otpStatus = otp ? true : false;
  const currentDate = new Date();
  const fiveMinutes = 5 * 60 * 1000;
  const expiresAt = new Date(currentDate.getTime() + fiveMinutes);

  user.otp = otp;
  user.otpExpiry = expiresAt;
  user.save();

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

    user.otp = "";
    user.otpExpiry = null;
    user.isTemporaryRegistered = false;
    user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, user, "OTP verified successfully"));
  }

  if (verificationType === "loginVerification") {
    const { otp, contactNumber } = req.body;
    if (!otp || !contactNumber)
      throw new ApiError(400, "Please fill all the details");

    const user = await Customer.findOne(contactNumber);
    if (!user) throw new ApiError(401, "Unauthorized access");

    const now = new Date();
    if (now > user.otpExpiry)
      throw new ApiError(403, "OTP expired, please try again");

    const matchOTP = user.otp === otp;
    if (!matchOTP) throw new ApiError(403, "Invalid OTP");

    user.otp = "";
    user.otpExpiry = null;
    user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, user, "OTP verified successfully"));
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
  } = req.body;
  if (!street1 || !area || !city || !state || !country)
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
  } = req.body;
  if (!street1 || !area || !city || !state || !country)
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

const dashboardData = asyncHandler(async (req, res) => {
  const { customerId, query } = req.params;

  if (query === "overview") {
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
    const address = await Address.findOne({ customer: customerId });
    if (!address) throw new ApiError(400, "No data found");

    return res
      .status(200)
      .json(new ApiResponse(200, address, "Data fetched successfully !"));
  }
  if (query === "bankDetails") {
    const bankDetails = await BankDetails.findOne({ customer: customerId });
    if (!bankDetails) throw new ApiError(400, "No data found");

    return res
      .status(200)
      .json(new ApiResponse(200, bankDetails, "Data fetched successfully !"));
  }

  //   bookings
  //   favstore
  //   favprofessional
  //   quickservice
  //   wishlist
});

export {
  registerCustomer,
  otpVerification,
  loginCustomer,
  updateGender,
  addAlternateContactNumber,
  addAddress,
  markAddressDefault,
  updateAddress,
  deleteAddress,
  dashboardData,
};
