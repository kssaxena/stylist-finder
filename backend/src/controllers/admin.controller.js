import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validatePhone } from "../validators/contactNumber.validator.js";
import { Admin } from "../models/admin.model.js";
import { Customer } from "../models/customer.model.js";
import { Store } from "../models/store.model.js";
import { Services } from "../models/service.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ServiceBookings } from "../models/serviceBooking.model.js";
import { PaymentTransaction } from "../models/paymentTransaction.models.js";
import jwt from "jsonwebtoken";
import { Category } from "../models/category.model.js";
import { Address } from "../models/address.model.js";
import mongoose from "mongoose";
import { validatePassword } from "../validators/password.validator.js";
import { UploadImages } from "../utils/imageKit.io.js";
import { Franchise } from "../models/franchise.model.js";

const createStoreWithServices = asyncHandler(async (req, res) => {
  if (!["admin", "subAdmin", "sales", "marketing"].includes(req.user?.role)) {
    throw new ApiError(403, "You are not authorized to create stores.");
  }

  const parseJsonField = (value, field) => {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch {
      throw new ApiError(400, `${field} must be valid JSON.`);
    }
  };
  const storeData = parseJsonField(req.body.store, "Store details");
  const address = parseJsonField(req.body.address, "Store address") || {};
  const services = parseJsonField(req.body.services, "Services");
  const { storeName, storeContactNumber, storeEmail, password } =
    storeData || {};
  const normalizedContactNumber = storeContactNumber?.trim();
  const normalizedEmail = storeEmail?.trim().toLowerCase() || "";

  if (!storeName?.trim() || !normalizedContactNumber || !password) {
    throw new ApiError(
      400,
      "Store name, contact number, and password are required.",
    );
  }
  if (storeName.trim().length > 50) {
    throw new ApiError(400, "Store name must be 50 characters or fewer.");
  }
  if (!validatePhone(normalizedContactNumber)) {
    throw new ApiError(400, "Invalid contact number.");
  }
  if (!validatePassword(password)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
    );
  }
  if (!Array.isArray(services) || services.length !== 2) {
    throw new ApiError(400, "Exactly two services are required.");
  }

  const duplicateQuery = [{ storeContactNumber: normalizedContactNumber }];
  if (normalizedEmail) duplicateQuery.push({ storeEmail: normalizedEmail });
  const existingStore = await Store.findOne({ $or: duplicateQuery });
  if (existingStore) {
    throw new ApiError(
      409,
      "A store with this contact number or email already exists.",
    );
  }

  const basePlan = await Subscription.findOne({
    planFor: "store",
    planName: "basic",
    isActive: true,
    "price.sellingPrice": 0,
  });
  if (!basePlan) {
    throw new ApiError(
      400,
      "An active complimentary basic store plan with a validity period must be configured first.",
    );
  }
  const serviceLimit = basePlan.serviceLimit?.count || 2;
  if (!basePlan.serviceLimit?.unlimited && serviceLimit < 2) {
    throw new ApiError(
      400,
      "The complimentary basic plan must allow at least two services.",
    );
  }

  for (const service of services) {
    if (
      !service?.name?.trim() ||
      !mongoose.Types.ObjectId.isValid(service.category) ||
      !mongoose.Types.ObjectId.isValid(service.subcategory) ||
      service.mrp === "" ||
      service.sellingPrice === "" ||
      !Number.isFinite(Number(service.mrp)) ||
      !Number.isFinite(Number(service.sellingPrice)) ||
      Number(service.mrp) < 0 ||
      Number(service.sellingPrice) < 0
    ) {
      throw new ApiError(
        400,
        "Each service needs a name, category, subcategory, and valid prices.",
      );
    }

    const category = await Category.findOne({
      _id: service.category,
      status: "Verified",
      isActive: true,
      subcategories: {
        $elemMatch: {
          _id: service.subcategory,
          status: "Verified",
          isActive: true,
        },
      },
    });
    if (!category) {
      throw new ApiError(
        400,
        "Each service must use an active, verified category and subcategory.",
      );
    }
  }

  const safeStoreName = storeName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/\s+/g, "-");
  const serviceCoverImages = await Promise.all(
    services.map(async (_service, index) => {
      const imageFile = req.files?.[`serviceImage${index}`]?.[0];
      if (!imageFile) return [];
      if (!imageFile.mimetype?.startsWith("image/")) {
        throw new ApiError(400, "Service images must be image files.");
      }

      const uploaded = await UploadImages(imageFile.filename, {
        folderStructure: `store/${safeStoreName}/serviceCoverImage`,
      });
      return [{ url: uploaded.url, fileId: uploaded.fileId }];
    }),
  );

  const addressText = (value) =>
    typeof value === "string" ? value.trim() || undefined : undefined;
  const latitude = Number(address.coordinates?.latitude);
  const longitude = Number(address.coordinates?.longitude);
  const hasCoordinates =
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180;

  const session = await mongoose.startSession();
  let createdStore;
  try {
    await session.withTransaction(async () => {
      const validity = new Date();
      validity.setMonth(validity.getMonth() + basePlan.validity.months);

      [createdStore] = await Store.create(
        [
          {
            storeName: storeName.trim(),
            storeContactNumber: normalizedContactNumber,
            storeEmail: normalizedEmail || undefined,
            password,
            isTemporaryRegistered: false,
            subscription: {
              subscriptionModel: basePlan._id,
              subscriptionPurchased: true,
              subscriptionValidity: validity,
            },
          },
        ],
        { session },
      );

      const [createdAddress] = await Address.create(
        [
          {
            flatNumber: addressText(address.flatNumber),
            floor: addressText(address.floor),
            street1: addressText(address.street1),
            street2: addressText(address.street2),
            area: addressText(address.area),
            locality: addressText(address.locality),
            pincode: addressText(address.pincode),
            city: addressText(address.city),
            state: addressText(address.state),
            country: addressText(address.country),
            ...(hasCoordinates && {
              location: {
                type: "Point",
                coordinates: [latitude, longitude],
              },
            }),
            store: createdStore._id,
            defaultAddress: true,
            addressType: address.addressType || "Home",
          },
        ],
        { session },
      );
      createdStore.address = [createdAddress._id];

      const createdServices = await Services.create(
        services.map((service, index) => ({
          name: service.name.trim(),
          store: createdStore._id,
          category: service.category,
          subcategory: service.subcategory,
          duration: Number(service.duration) || 30,
          serviceFor: service.serviceFor || "Both",
          bookingDays: service.bookingDays || "Whole week",
          bookingAcceptingHours: {
            from: service.bookingFrom || "",
            till: service.bookingTill || "",
          },
          onSite: Boolean(service.onSite),
          inHouse: Boolean(service.inHouse),
          serviceArea: service.serviceArea || "Inside city",
          price: {
            mrp: Number(service.mrp),
            discount: Number(service.discount) || 0,
            sellingPrice: Number(service.sellingPrice),
          },
          description: service.description || "",
          coverImage: serviceCoverImages[index],
        })),
        { session, ordered: true },
      );
      createdStore.services = createdServices.map((service) => service._id);
      await createdStore.save({ session });
    });
  } finally {
    await session.endSession();
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdStore,
        "Store and services created successfully with the basic plan.",
      ),
    );
});

const createAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const {
    name,
    contactNumber,
    email,
    password,
    employeeId,
    role,
    sectionList = [],
  } = req.body;

  // // Verify creator admin exists
  // const creatorAdmin = await Admin.findById(adminId);
  // if (!creatorAdmin) throw new ApiError(404, "Admin not found.");

  // Required fields
  if (!name || !contactNumber || !email || !password || !employeeId || !role) {
    throw new ApiError(400, "Fill the required details.");
  }

  // Validations
  if (!validatePhone(contactNumber))
    throw new ApiError(400, "Invalid contact number.");

  if (name.length > 50) throw new ApiError(400, "Name is too long.");

  // Duplicate check
  const existingAdmin = await Admin.findOne({
    $or: [
      { contactNumber },
      { email: email.toLowerCase() },
      { employeeId: employeeId.toUpperCase() },
    ],
  });

  if (existingAdmin) {
    if (existingAdmin.contactNumber === contactNumber)
      throw new ApiError(400, "Contact number already exists.");

    if (existingAdmin.email === email.toLowerCase())
      throw new ApiError(400, "Email already exists.");

    if (existingAdmin.employeeId === employeeId.toUpperCase())
      throw new ApiError(400, "Employee ID already exists.");
  }

  const isAdmin = role.toLowerCase() === "admin";

  const newAdmin = await Admin.create({
    name,
    contactNumber,
    email: email.toLowerCase(),
    password,
    employeeId: employeeId.toUpperCase(),
    role,
    sectionList: isAdmin ? [] : sectionList, // Only restricted roles store permissions
    restrictedAccess: !isAdmin, // Admin = false, Others = true
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newAdmin, "Admin created successfully."));
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await Admin.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

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
});

const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find().select(
    "name contactNumber isVerified isActive role",
  );
  if (!admins) throw new ApiError(400, "Admins not found");

  return res
    .status(200)
    .json(new ApiResponse(200, admins, "Admins fetched successfully !"));
});

const getAdminById = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  if (!adminId) throw new ApiError(400, "Invalid request");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new ApiError(400, "Admin not found");

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "Data fetched successfully !"));
});

const markAsActiveVerified = asyncHandler(async (req, res) => {
  const { adminId, adminId2, operation } = req.params;
  if (!adminId2) throw new ApiError(400, "Invalid admin");
  if (!adminId) throw new ApiError(400, "Invalid request");

  const sourceAdmin = await Admin.findById(adminId2);
  if (!sourceAdmin) throw new ApiError(400, "Invalid admin request");
  if (sourceAdmin.role === "subAdmin") {
    const admin = await Admin.findByIdAndUpdate(adminId, { isActive: true });
    if (!admin) throw new ApiError(400, "Admin not found");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Your request has been submitted successfully, will get reviewed.",
        ),
      );
  }
  if (sourceAdmin.role === "admin") {
    switch (operation) {
      case "active": {
        const admin = await Admin.findByIdAndUpdate(adminId, {
          isActive: true,
        });
        if (!admin) throw new ApiError(400, "Unable to find admin");

        return res
          .status(200)
          .json(new ApiResponse(200, {}, "Operation successful"));
      }
      case "verify": {
        const admin = await Admin.findByIdAndUpdate(adminId, {
          isVerified: true,
        });
        if (!admin) throw new ApiError(400, "Unable to find admin");

        return res
          .status(200)
          .json(new ApiResponse(200, {}, "Operation successful"));
      }
      case "activeAndVerify": {
        const admin = await Admin.findByIdAndUpdate(adminId, {
          isVerified: true,
          isActive: true,
        });
        if (!admin) throw new ApiError(400, "Unable to find admin");

        return res
          .status(200)
          .json(new ApiResponse(200, {}, "Operation successful"));
      }
      default:
        throw new ApiError(
          400,
          "Unable to resole request right now please try again later",
        );
    }
  }
});

const reLoginToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken;
  if (!token) throw new ApiError(401, "Unauthorized request");

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await Admin.findById(decoded._id);
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
  const { query } = req.params;
  // const { sanitizedQuery } = query.toLowercase();

  switch (query) {
    // case "overview": {
    //   const totalVisits = await Visitor.countDocuments();
    //   const today = new Date().toISOString().slice(0, 10);
    //   const todayVisits = await Visitor.countDocuments({
    //     visitDate: today,
    //   });
    //   const uniqueVisitors = await Visitor.aggregate([
    //     {
    //       $group: {
    //         _id: "$ip",
    //       },
    //     },
    //     {
    //       $count: "uniqueVisitors",
    //     },
    //   ]);
    //   const placeOverview = await Place.find().select("name category");
    //   return res.status(200).json(
    //     new ApiResponse(
    //       200,
    //       {
    //         totalVisits,
    //         todayVisits,
    //         uniqueVisitors: uniqueVisitors[0]?.uniqueVisitors || 0,
    //         placeOverview,
    //       },
    //       "Data fetched successfully",
    //     ),
    //   );
    // }

    case "customer": {
      const customer = await Customer.find()
        .select("name contactNumber email gender")
        .sort({
          createdAt: -1,
        });
      return res
        .status(200)
        .json(new ApiResponse(200, customer, "Data fetched successfully"));
    }

    case "categories": {
      const categories = await Category.find()
        // .select("storeName storeContactNumber storeEmail")
        .sort({
          createdAt: -1,
        });
      return res
        .status(200)
        .json(new ApiResponse(200, categories, "Data fetched successfully"));
    }

    case "store": {
      const store = await Store.find()
        .select("storeName storeContactNumber storeEmail")
        .sort({
          createdAt: -1,
        });
      return res
        .status(200)
        .json(new ApiResponse(200, store, "Data fetched successfully"));
    }

    case "inactive_services": {
      const services = await Services.find({ isActive: false })
        .select("category serviceFor inHouse")
        .populate({ path: "store", select: "name" })
        .populate({ path: "category", select: "title" })
        .sort({
          createdAt: -1,
        });
      return res
        .status(200)
        .json(new ApiResponse(200, services, "Data fetched successfully"));
    }

    case "active_services": {
      const services = await Services.find({ isActive: true })
        .populate({ path: "store", select: "storeName" })
        .populate({ path: "category", select: "title" })
        .select("category serviceFor inHouse")
        .sort({
          createdAt: -1,
        });
      return res
        .status(200)
        .json(new ApiResponse(200, services, "Data fetched successfully"));
    }

    case "subscription": {
      const subscription = await Subscription.find()
        .select("planName planFor customModelFor customModel price isActive")
        .sort({
          createdAt: -1,
        });
      return res
        .status(200)
        .json(new ApiResponse(200, subscription, "Data fetched successfully"));
    }

    case "bookings": {
      const bookings = await ServiceBookings.find()
        .select("dateForBooking payment bookingAmount")
        .populate({ path: "service", select: "name" })
        .populate({ path: "service", select: "name" })
        .sort({
          createdAt: -1,
        });
      return res
        .status(200)
        .json(new ApiResponse(200, bookings, "Data fetched successfully"));
    }

    case "payments": {
      const payments = await PaymentTransaction.find()
        .sort({ createdAt: -1 })
        .lean();

      return res
        .status(200)
        .json(new ApiResponse(200, payments, "Payments fetched successfully"));
    }

    case "adminsQuery": {
      const admin = await Admin.find()
        .populate("creatorAdmin")
        .sort({ createdAt: -1 });
      if (!admin) throw new ApiError(400, "No admins found");

      return res
        .status(200)
        .json(new ApiResponse(200, admin, "Data fetched successfully !"));
    }

    case "franchise": {
      const franchise = await Franchise.find()
        .populate({ path: "store", select: "storeName storeContactNumber" })
        .select("name store")
        .sort({ createdAt: -1 });
      if (!franchise) throw new ApiError(400, "No data found");

      return res
        .status(200)
        .json(new ApiResponse(200, franchise, "Data fetched successfully !"));
    }

    default:
      throw new ApiError(400, "Invalid session or query");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, employeeId, contactNumber, password, confirmPassword } =
    req.body;
  if (!email || !employeeId || !contactNumber || !password || !confirmPassword)
    throw new ApiError(400, "Fill all the details");

  const user = await Admin.findOne({
    email: email.toLowerCase(),
    employeeId: employeeId.toUpperCase(),
    contactNumber: contactNumber,
  });
  if (user) {
    user.password = confirmPassword;
    await user.save();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "Otp has been sent to your contact number and email",
      ),
    );
});

const getCurrentRequestData = asyncHandler(async (req, res) => {
  const { query, keyId, adminId } = req.params;
  if (!query || !keyId || !adminId) throw new ApiError(400, "Invalid request");

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(400, "Invalid admin");
    return;
  }

  switch (query) {
    case "customer": {
      const customer = await Customer.findById(keyId).populate("address");
      if (!customer) throw new ApiError(400, "Unable to fetch data");

      return res
        .status(200)
        .json(new ApiResponse(200, customer, "Data fetched successfully !"));
    }

    case "store": {
      const store = await Store.findById(keyId)
        .populate("address storeStaffs services bookings")
        .populate({
          path: "subscription.subscriptionModel",
          select: "planName price serviceLimit ",
        });
      if (!store) throw new ApiError(400, "Unable to fetch data");

      return res
        .status(200)
        .json(new ApiResponse(200, store, "Data fetched successfully !"));
    }

    case "service": {
      const service = await Services.findById(keyId)
        .populate({
          path: "store",
          select: "storeName storeContactNumber storeContactNumber owner",
        })
        .populate({
          path: "executive",
          select: "name contactNumber email specialization",
        })
        .populate({
          path: "professional",
          select: "name contactNumber email gender",
        });
      if (!service) throw new ApiError(400, "Unable to fetch data");

      return res
        .status(200)
        .json(new ApiResponse(200, service, "Data fetched successfully !"));
    }

    case "subscription": {
      const subscription = await Subscription.findById(keyId).populate("admin");
      if (!subscription) throw new ApiError(400, "Unable to fetch data");

      return res
        .status(200)
        .json(
          new ApiResponse(200, subscription, "Data fetched successfully !"),
        );
    }

    case "admin": {
      const admin = await Admin.findById(keyId)
        .populate("creatorAdmin")
        .select("-password");
      if (!admin) throw new ApiError(400, "Unable to fetch data");

      return res
        .status(200)
        .json(new ApiResponse(200, admin, "Data fetched successfully !"));
    }

    case "booking": {
      const booking = await ServiceBookings.findById(keyId).populate(
        "service customer address",
      );
      if (!booking) throw new ApiError(400, "Unable to fetch data");

      return res
        .status(200)
        .json(new ApiResponse(200, booking, "Data fetched successfully !"));
    }

    case "category": {
      const category = await Category.findById(keyId).populate({
        path: "createdBy",
        select: "name employeeId role",
      });
      // .populate({ path: "subcategories", select: "title" });
      if (!category) throw new ApiError(400, "Unable to fetch data");

      return res
        .status(200)
        .json(new ApiResponse(200, category, "Data fetched successfully !"));
    }

    case "franchise": {
      const franchise = await Franchise.findById(keyId)
        .populate({
          path: "admin",
          select: "name employeeId role",
        })
        .populate({
          path: "store",
          select: "storeName storeContactNumber",
        });
      if (!franchise) throw new ApiError(400, "Unable to fetch data");

      return res
        .status(200)
        .json(new ApiResponse(200, franchise, "Data fetched successfully !"));
    }

    default:
      throw new ApiError(400, "Invalid session or query");
  }
});

export {
  createStoreWithServices,
  createAdmin,
  getAllAdmins,
  getAdminById,
  markAsActiveVerified,
  reLoginToken,
  dashboardData,
  adminLogin,
  getCurrentRequestData,
};
