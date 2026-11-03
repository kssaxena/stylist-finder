import { useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
// import Logo from "../assets/Logo.png";
import InputBox from "./Input";
import Button from "./Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/hooks/ToastContext";
import { customerRegistrationInputs } from "../constants/constants";
import { FetchData } from "../utils/FetchFromApi";
import OtpVerificationPopup from "../components/ui/OtpVerificationPopup";
import { useDispatch } from "react-redux";
import { addUser, clearUser } from "../redux/slice/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useParams("");
  const { alertSuccess, alertError, alertInfo } = useToast();
  const dispatch = useDispatch();
  const formRef = useRef();
  const [data, setData] = useState();
  const [otpPopup, setOtpPopup] = useState(false);
  const [otpNumber, setOTPNumber] = useState("");

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
      const result = response.data.data;
      if (result.otpStatus === true) {
        setOtpPopup(true);
        formRef.current.reset();
        setData(result);
        setOTPNumber(result.otp);
      } else if (result.tokens && result.user) {
        localStorage.setItem("accessToken", result.tokens.accessToken);
        localStorage.setItem("refreshToken", result.tokens.refreshToken);
        localStorage.setItem("role", result.user.role);
        dispatch(clearUser());
        dispatch(addUser(result.user));
        formRef.current.reset();
        navigate(location.state?.from?.pathname || "/dashboard");
        alertSuccess(response.data.message);
        return;
      }
      alertInfo(response.data.message);
    } catch (err) {
      alertError({ message: err.response.data });
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-neutral-100 shadow-xl p-8">
      {/* Back Button */}
      <button
        onClick={() => {
          navigate(`/auth/${"login"}/${"customer"}`, {
            state: location.state,
          });
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
                "https://ik.imagekit.io/cuteandglow/WhatsApp%20Image%202026-09-11%20at%208.26.34%20AM.jpeg"
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
              onClick={() =>
                navigate(`/auth/${"login"}/${userType}`, {
                  state: location.state,
                })
              }
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
              placeholder={data.placeholder}
              key={index}
              label={
                userType === "customer"
                  ? data.label
                  : userType === "store"
                    ? data.storeLabel
                    : userType === "professional"
                      ? data.label
                      : ""
              }
              type={data.type}
              name={data.name}
              required={data.required}
              onClick={() =>
                data.passwordIndication === true
                  ? alertInfo(
                      "Password should be of min 8 characters, it should include at-least 1 uppercase, 1 lowercase, 1 special character, 1 number",
                    )
                  : ""
              }
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
            onClick={() =>
              navigate(`/auth/${"login"}/${userType}`, {
                state: location.state,
              })
            }
            className="text-[#8B2954] font-semibold hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>

      <OtpVerificationPopup
        isOpen={otpPopup}
        userType={userType}
        onClose={() => setOtpPopup(false)}
        data={data}
        verificationType="registerVerification"
        otpNumber={otpNumber}
        redirectTo={location.state?.from?.pathname}
      />
    </div>
  );
};

export default Register;
