import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { Store } from "../models/store.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const VerifyStore = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await Store.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
