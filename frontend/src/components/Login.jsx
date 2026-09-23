import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
// import Logo from "../assets/Logo.png";
import InputBox from "./Input";
import Button from "./Button";
import { useNavigate, useParams } from "react-router-dom";
import LoginSvg from "../assets/Login.svg";
import { FetchData } from "../utils/FetchFromApi";
import { useRef } from "react";
import { useToast } from "./hooks/ToastContext";
import { parseErrorMessage } from "../utils/parseErrorMessage";
import OtpVerificationPopup from "./ui/OtpVerificationPopup";
import { useDispatch } from "react-redux";
import { addUser, clearUser } from "../redux/slice/authSlice";

const Login = ({ onRegister }) => {
  const navigate = useNavigate();
  const formRef = useRef();
  const { userType } = useParams("");
  const { alertSuccess, alertError, alertInfo } = useToast({});
  const [data, setData] = useState();
  const [otpPopup, setOtpPopup] = useState(false);
  const [otpNumber, setOTPNumber] = useState("");
  const [loginWithPassword, setLoginWithPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLoginWithOtp = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(`${userType}/login`, "post", formData);
      if (response.data.data.otpStatus === true) {
        setOtpPopup(true);
        formRef.current.reset();
        setData(response.data.data);
        setOTPNumber(response.data.data.otp);
      }
      alertInfo(response.data.message);
    } catch (err) {
      alertError(err?.response?.data);
    }
  };

  const handleLoginWithPassword = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `${userType}/login/via/password`,
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
      navigate(`/dashboard`);
      alertInfo(response.data.message);
    } catch (err) {
      alertError(err?.response?.data);
    }
  };

  const handleChangePassword = async (e) => {
    try {
      setLoading(true);
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `${userType}/update/change-password`,
        "post",
        formData,
      );
      console.log(response.data.data);
      alertSuccess(response.data.message);
      navigate("/");
      formRef.current.reset();
    } catch (err) {
      console.log(err.response.data);
      alertError(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full  rounded-3xl flex justify-center items-center lg:px-10 px-2 h-[90vh]">
      <div className="shadow-xl border border-neutral-100 rounded-3xl h-full w-full flex flex-row justify-center items-center lg:p-10 p-2">
        {" "}
        <div className="w-1/2 h-full hidden lg:flex justify-center items-center">
          <img src={LoginSvg} alt="Login" className="w-[70%]" />
        </div>
        <div className="lg:w-1/2 w-full lg:border border-neutral-100 lg:shadow-xl rounded-xl py-4 justify-center items-center flex">
          <div className="w-full lg:w-fit">
            {" "}
            {/* Logo */}
            <div className="flex justify-center">
              <img
                src={
                  "https://ik.imagekit.io/cuteandglow/WhatsApp%20Image%202026-09-11%20at%208.26.34%20AM.jpeg"
                }
                // src={
                //   "https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/Logo.png?updatedAt=1784349570750"
                // }
                alt="Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
            {/* Heading */}
            <div className="text-center mt-4">
              <h1 className="text-4xl font-serif text-[#5B1933]">
                Welcome Back!
              </h1>

              <p className="text-gray-500 mt-2">
                Login as{" "}
                <span className="capitalize font-semibold text-black">
                  {userType}
                </span>{" "}
                & continue to Stylist Finder
              </p>
            </div>
            {/* Form */}
            <form
              ref={formRef}
              onSubmit={
                loginWithPassword === true
                  ? handleLoginWithPassword
                  : handleLoginWithOtp
              }
              className="mt-8"
            >
              <InputBox
                label="contact Number"
                placeholder="Enter your contact number"
                name="contactNumber"
                type="text"
              />
              {loginWithPassword === true ? (
                <InputBox
                  required={loginWithPassword === true ? true : false}
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Password"
                />
              ) : (
                ""
              )}

              <Button type="submit" LabelName="Login" className="w-full" />
            </form>
            {loginWithPassword === true ? (
              <p className="text-center mt-8 text-gray-600 space-x-6">
                <button
                  onClick={() => setPopup(true)}
                  className="text-[#8B2954] font-semibold hover:underline cursor-pointer"
                >
                  Forgot password ?
                </button>
                <button
                  onClick={() => setLoginWithPassword(false)}
                  className="text-[#8B2954] font-semibold hover:underline cursor-pointer"
                >
                  Login with OTP
                </button>
              </p>
            ) : (
              <p className="text-center mt-8 text-gray-600">
                <button
                  onClick={() => setLoginWithPassword(true)}
                  className="text-[#8B2954] font-semibold hover:underline cursor-pointer"
                >
                  Login with password
                </button>
              </p>
            )}
            <p className="text-center mt-8 text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate(`/auth/${"register"}/${userType}`)}
                className="text-[#8B2954] font-semibold hover:underline cursor-pointer"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
      {popup && (
        <div className="w-full h-screen z-50 bg-black/80 flex justify-center items-center absolute top-0 left-0">
          <form
            ref={formRef}
            onSubmit={handleChangePassword}
            className="bg-white rounded-xl p-5 w-[85vw] lg:w-96"
          >
            <h1>Forget password</h1>
            <InputBox label="contact number" name="contactNumber" type="text" />
            <InputBox label="email" name="email" type="email" />
            <InputBox label="new password" name="password" type="password" />
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="secondary"
                LabelName="cancel"
                onClick={() => {
                  formRef.current.reset();
                  setPopup(false);
                }}
              />
              <Button
                LabelName={loading ? "Please wait" : "Reset"}
                type="submit"
              />
            </div>
          </form>
        </div>
      )}
      <OtpVerificationPopup
        isOpen={otpPopup}
        userType={userType}
        onClose={() => setOtpPopup(false)}
        data={data}
        verificationType="loginVerification"
        otpNumber={otpNumber}
      />
    </div>
  );
};

export default Login;
