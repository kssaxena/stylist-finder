import React, { useEffect, useRef, useState } from "react";
import Popup from "./Popup"; // Update path if needed
import Button from "../Button";
import InputBox from "../Input";
import { FetchData } from "../../utils/FetchFromApi";
import { useToast } from "../hooks/ToastContext";
import { useDispatch } from "react-redux";
import { addUser, clearUser } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { formatAccountNumberDisplay } from "../../utils/utility-functions";

function OtpVerificationPopup({
  isOpen,
  onClose,
  data,
  verificationType = "",
  userType,
  otpNumber, // delete this input when the sms config is complete
  redirectTo,
}) {
  const [otp, setOtp] = useState("");
  const formRef = useRef();
  const { alertSuccess, alertError, alertInfo } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);

  const Countdown = ({ duration = 5, onComplete, resendOTP = false }) => {
    const [timeLeft, setTimeLeft] = useState(duration * 60);

    useEffect(() => {
      if (timeLeft <= 0) {
        onComplete?.();
        return;
      }

      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }, [timeLeft, onComplete]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
      <span className="heading text-red-700 flex justify-center items-center ">
        {showButton === true ? (
          ""
        ) : (
          <span className="heading text-red-700 flex justify-center items-center ">
            Time Left:
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </span>
        )}
        {showButton && <Button LabelName="Resend OTP" />}
      </span>
    );
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `${userType}/otp/authentication/${verificationType}/${data?.user?._id}`,
        "post",
        formData,
      );
      const { user, tokens } = response.data.data;

      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem("role", user.role);

      dispatch(clearUser());
      dispatch(addUser(user));
      formRef.current.reset();
      onClose();
      navigate(redirectTo || "/dashboard");
      alertSuccess(response.data.message || "Otp Verified successfully !");
    } catch (err) {
      alertError(err?.response?.data);
    }
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} center={true} fit={true}>
      <div className="w-full md:w-[50vw]">
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
              {formatAccountNumberDisplay(data?.user?.contactNumber)} and on
              your email
              {/* <span className="px-5">Paste this OTP:{otpNumber}</span> */}
            </p>
            <Countdown
              duration={1}
              onComplete={() => {
                // resendOTP();
                setShowButton(true);
              }}
            />
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
      </div>
    </Popup>
  );
}

export default OtpVerificationPopup;
