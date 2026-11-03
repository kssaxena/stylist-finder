import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const VerifyAdmin = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.AccessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await Admin.findById(decodedToken?._id);
  if (!user) {
    throw new ApiError(401, "Invalid Access Token");
  }
  req.user = user;
  next();
});

export const VerifyAdminSection = (sectionLabel) =>
  asyncHandler(async (req, _, next) => {
    const admin = req.user;
    if (
      admin?.role !== "admin" &&
      admin?.restrictedAccess === true &&
      !admin.sectionList?.includes(sectionLabel)
    ) {
      throw new ApiError(403, "You are not authorized to access this admin section.");
    }
    next();
  });
