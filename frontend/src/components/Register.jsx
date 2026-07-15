import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import Logo from "../assets/Logo.png";
import InputBox from "./Input";
import Button from "./Button";
import Login from "./Login";
import { useNavigate } from "react-router-dom";

const Register = ({ onBack, onLogin, switchForm }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!formData.agree) {
      alert("Please accept Terms & Conditions");
      return;
    }

    console.log(formData);

    // TODO:
    // Register API
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
        <form onSubmit={handleRegister} className="w-full md:w-1/2">
          <div className="grid md:grid-cols-2 gap-3">
            <InputBox
              label="Full Name"
              placeholder="Enter your full name"
              Name="fullName"
              Value={formData.fullName}
              onChange={handleChange}
            />

            <InputBox
              label="Phone Number"
              placeholder="Enter your phone number"
              Name="phone"
              Value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <InputBox
            label="Email Address"
            placeholder="Enter your email address"
            Name="email"
            Value={formData.email}
            onChange={handleChange}
          />

          <InputBox
            label="Password"
            placeholder="Create Password"
            Type="password"
            Name="password"
            Value={formData.password}
            onChange={handleChange}
            PasswordIndication={true}
          />

          <InputBox
            label="Confirm Password"
            placeholder="Confirm Password"
            Type="password"
            Name="confirmPassword"
            Value={formData.confirmPassword}
            onChange={handleChange}
          />

          {/* Terms */}

          <div className="flex items-start gap-3 py-4">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
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
