import React, { useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import Logo from "../assets/Logo.png";
import InputBox from "./Input";
import Button from "./Button";
import Login from "./Login";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ToastContext";
import { customerRegistrationInputs } from "../constants/constants";
import { FetchData } from "../utils/FetchFromApi";

const Register = ({ onBack, onLogin, switchForm }) => {
  const navigate = useNavigate();
  const userType = useParams();
  const { showToast } = useToast();
  const formRef = useRef();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `/${userType}/register`,
        "get",
        formData,
      );
      console.log(response);
      formRef.current.reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-neutral-100 shadow-xl p-8">
      {/* Back Button */}
      <button
        onClick={() => {
          navigate("/auth/login");
        }}
        className="w-12 h-12 rounded-full border flex items-center justify-center hover:bg-[#8B2954] hover:text-white transition"
      >
        <IoArrowBack size={22} />
      </button>

      <div className="flex flex-col md:flex-row justify-between items-center relative w-full">
        {" "}
        <div className="flex flex-col w-full md:w-1/2">
          {/* Logo */}
          <div className="flex justify-center">
            <img src={Logo} alt="Logo" className="w-24 h-24 object-contain" />
          </div>

          {/* Heading */}
          <div className="text-center mt-4">
            <h1 className="text-4xl font-serif text-[#5B1933]">
              Create Account
            </h1>
            <p className="text-gray-500 mt-2">
              Register to get started with Stylist Finder
            </p>
          </div>

          {/* Login */}
          <p className="text-center mt-8 text-gray-600 hidden md:block">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/auth/login")}
              className="text-[#8B2954] font-semibold hover:underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>
        {/* Form */}
        <form ref={formRef} onSubmit={handleRegister()}>
          {customerRegistrationInputs.map((data, index) => (
            <InputBox
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
            onClick={() => navigate("/auth/login")}
            className="text-[#8B2954] font-semibold hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
