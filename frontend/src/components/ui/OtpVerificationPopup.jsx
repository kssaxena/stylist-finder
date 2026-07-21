import React, { useRef, useState } from "react";
import Popup from "./Popup"; // Update path if needed
import Button from "../Button";
import InputBox from "../Input";
import { FetchData } from "../../utils/FetchFromApi";
import { useToast } from "../hooks/ToastContext";
import { useDispatch } from "react-redux";
import { addUser, clearUser } from "../../redux/slice/authSlice";

function OtpVerificationPopup({
  isOpen,
  onClose,
  data,
  verificationType = "",
  userType,
}) {
  const [otp, setOtp] = useState("");
  const formRef = useRef();
  const { alertSuccess, alertError, alertInfo } = useToast();
  const dispatch = useDispatch();
  console.log(data);

  const verifyOtp = async (e) => {
    e.preventDefault();
    console.log("UI worked");
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `${userType}/otp/authentication/${verificationType}/${data?.user?._id}`,
        "post",
        formData,
      );
      console.log(response);
      const { user, tokens } = response.data.data;

      localStorage.setItem("AccessToken", tokens.accessToken);
      localStorage.setItem("RefreshToken", tokens.refreshToken);
      localStorage.setItem("role", user.role);

      dispatch(clearUser());
      dispatch(addUser(user));
      // openModelOTP(false);
      formRef.current.reset();
      onClose();
      alertSuccess(response.data.message || "Otp Verified successfully !");
    } catch (err) {
      console.log(err);
      alertError(err?.response?.data);
    }
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <form
        ref={formRef}
        onSubmit={verifyOtp}
        className="flex flex-col items-center gap-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>

          <p className="text-gray-500 mt-2">
            We've sent a verification code to
          </p>

          <p className="font-semibold text-[#8B2954] mt-1">
            {data?.user?.contactNumber}
          </p>
        </div>

        <div className="w-full">
          <InputBox
            label="OTP"
            placeholder="Enter 6-digit OTP"
            type="text"
            name="otp"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
          <input
            name="contactNumber"
            value={data?.user?.contactNumber}
            className="hidden"
          />
        </div>

        <div className="w-full">
          <Button LabelName="Verify OTP" type="submit" />
        </div>
      </form>
    </Popup>
  );
}

export default OtpVerificationPopup;
