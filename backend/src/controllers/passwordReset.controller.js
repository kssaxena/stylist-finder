import { randomInt } from "node:crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sendEmail from "../services/mail.service.js";
import otpTemplate from "../template/otp.mail.template.js";
import { validatePassword } from "../validators/password.validator.js";

export const createPasswordResetHandlers = ({
  Model,
  identityFields,
  emailField,
  nameField,
}) => {
  const getIdentityQuery = (body) => {
    const query = {};

    for (const [inputField, modelField] of Object.entries(identityFields)) {
      const value = body[inputField]?.trim();
      if (!value) {
        throw new ApiError(400, "Please fill all the required identity fields");
      }

      if (inputField.toLowerCase().includes("email")) {
        const escapedEmail = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query[modelField] = new RegExp(`^${escapedEmail}$`, "i");
      } else {
        query[modelField] = inputField.toLowerCase().includes("employeeid")
          ? value.toUpperCase()
          : value;
      }
    }

    return query;
  };

  const requestPasswordReset = asyncHandler(async (req, res) => {
    const account = await Model.findOne(getIdentityQuery(req.body));

    if (account?.[emailField]) {
      const otp = randomInt(100000, 1000000).toString();
      account.otp = otp;
      account.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
      await account.save();

      await sendEmail({
        to: account[emailField],
        subject: "Password reset verification",
        html: otpTemplate(account[nameField], otp),
      });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "If the account details match, a password reset code has been sent to the registered email.",
        ),
      );
  });

  const confirmPasswordReset = asyncHandler(async (req, res) => {
    const { otp, newPassword, confirmPassword } = req.body;
    if (!otp || !newPassword || !confirmPassword) {
      throw new ApiError(
        400,
        "Please enter the reset code and both password fields",
      );
    }
    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }
    if (!validatePassword(newPassword)) {
      throw new ApiError(
        400,
        "Password must be 8-20 characters and include uppercase, lowercase, number, and special characters",
      );
    }

    const account = await Model.findOne(getIdentityQuery(req.body));
    if (!account || !account.otp || !account.otpExpiry) {
      throw new ApiError(400, "Invalid or expired reset code");
    }
    if (Date.now() > account.otpExpiry.getTime()) {
      throw new ApiError(400, "Reset code expired, please request a new one");
    }
    if (otp !== account.otp) {
      throw new ApiError(400, "Invalid reset code");
    }

    account.password = newPassword;
    account.otp = null;
    account.otpExpiry = null;
    await account.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "Password reset successfully. Please log in."),
      );
  });

  return { requestPasswordReset, confirmPasswordReset };
};
