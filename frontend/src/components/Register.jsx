import React, { useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
// import Logo from "../assets/Logo.png";
import InputBox from "./Input";
import Button from "./Button";
import Login from "./Login";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/hooks/ToastContext";
import { customerRegistrationInputs } from "../constants/constants";
import { FetchData } from "../utils/FetchFromApi";
import { parseErrorMessage } from "../utils/parseErrorMessage";
import OtpVerificationPopup from "../components/ui/OtpVerificationPopup";

const Register = () => {
  const navigate = useNavigate();
  const { userType } = useParams("");
  const { alertSuccess, alertError, alertInfo } = useToast();
  const formRef = useRef();
  const [data, setData] = useState();
  const [otpPopup, setOtpPopup] = useState(false);

  const registerContent = {
    customer: {
      heading: "Create Your Account",
      subHeading:
        "Join Stylist Finder to discover the best salons, parlours, and beauty professionals near you.",
    },

    store: {
      heading: "Register Your Salon or Parlour",
      subHeading:
        "Create your business profile, showcase your services, and connect with customers looking for beauty services.",
    },

    professional: {
      heading: "Join as a Beauty Professional",
      subHeading:
        "Build your professional profile, showcase your expertise, and grow your client base with Stylist Finder.",
    },
  };
  const content = registerContent[userType];

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `${userType}/register`,
        "post",
        formData,
      );
      console.log(response);
      if (response.data.data.otpStatus === true) {
        setOtpPopup(true);
        formRef.current.reset();
        setData(response.data.data);
      }
      alertInfo(response.data.message);
    } catch (err) {
      console.log(err);
      alertError({ message: err.response.data });
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-neutral-100 shadow-xl p-8">
      {/* Back Button */}
      <button
        onClick={() => {
          navigate(`/auth/${"login"}/${"customer"}`);
        }}
        className="w-12 h-12 rounded-full border flex items-center justify-center hover:bg-[#8B2954] hover:text-white transition"
      >
        <IoArrowBack size={22} />
      </button>

      <div className="flex flex-col md:flex-row justify-center gap-20 bg-white shadow-lg p-4 items-center relative w-full">
        {" "}
        <div className="flex flex-col w-full md:w-1/2">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src={
                "https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/Logo.png?updatedAt=1784349570750"
              }
              alt="Logo"
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="text-center mt-4">
            <h1 className="text-4xl font-serif text-[#5B1933]">
              {content?.heading}
            </h1>
            <p className="text-gray-500 mt-2">{content?.subHeading}</p>
          </div>

          {/* Login */}
          <p className="text-center mt-8 text-gray-600 hidden md:block">
            Already have an account?{" "}
            <button
              onClick={() => navigate(`/auth/${"login"}/${userType}`)}
              className="text-[#8B2954] font-semibold hover:underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>
        {/* Form */}
        <form ref={formRef} onSubmit={handleRegister}>
          {customerRegistrationInputs.map((data, index) => (
            <InputBox
              key={index}
              placeholder={data.placeholder}
              label={data.label}
              type={data.type}
              name={data.name}
            />
          ))}
          <div className="flex items-start gap-3 py-4">
            <input
              type="checkbox"
              name="agree"
              className="mt-1 accent-[#8B2954]"
            />

            <p className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="text-[#8B2954] cursor-pointer hover:underline">
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="text-[#8B2954] cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p>
          </div>

          <Button type="submit" LabelName="Register" className="w-full" />
        </form>
        <p className="text-center mt-8 text-gray-600 block md:hidden">
          Already have an account?{" "}
          <button
            onClick={() => navigate(`/auth/${"login"}/${userType}`)}
            className="text-[#8B2954] font-semibold hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
      {/* {console.log(data)} */}

      <OtpVerificationPopup
        isOpen={otpPopup}
        userType={userType}
        onClose={() => setOtpPopup(false)}
        data={data}
        verificationType="registerVerification"
      />
    </div>
  );
};

export default Register;
