import React, { useRef, useState } from "react";
import Popup from "./Popup"; // Update path if needed
import Button from "../Button";
import InputBox from "../Input";

function OtpVerificationPopup({
  isOpen,
  onClose,
  data,
  verificationType = "",
}) {
  const [otp, setOtp] = useState("");
  const formRef = useRef();

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `customer/otp/authentication/${verificationType}/${data?.user?._id}`,
        "post",
        formData,
      );
      if (response.status === 200) {
        alert("Success", "OTP Verified");

        setOtpPopup(false);

        navigate("/dashboard");
      }
    } catch (error) {
      alert("Error", "Invalid OTP");
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
        </div>

        <div className="w-full">
          <Button LabelName="Verify OTP" onClick={verifyOtp} />
        </div>
      </form>
    </Popup>
  );
}

export default OtpVerificationPopup;
