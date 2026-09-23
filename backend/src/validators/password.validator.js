import { ApiError } from "../utils/ApiError.js";

// Must be at least 8 characters, contain 1 uppercase, 1 lowercase, 1 digit, and 1 special character
export const validatePassword = (password) => {
  if (password.length > 20) return ApiError(400, "Password length is too long");
  !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
    password,
  );
};
