import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import Logo from "../assets/Logo.png";
import InputBox from "./Input";
import Button from "./Button";

const Register = ({ onBack, onLogin, switchForm }) => {
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
    <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-neutral-400 shadow-xl p-8">
      {/* Back Button */}

      <button
        onClick={onBack}
        className="absolute left-6 top-6 w-12 h-12 rounded-full border flex items-center justify-center hover:bg-[#8B2954] hover:text-white transition"
      >
        <IoArrowBack size={22} />
      </button>

      {/* Logo */}

      <div className="flex justify-center">
        <img src={Logo} alt="Logo" className="w-24 h-24 object-contain" />
      </div>

      {/* Heading */}

      <div className="text-center mt-4">
        <h1 className="text-4xl font-serif text-[#5B1933]">Create Account</h1>

        <p className="text-gray-500 mt-2">
          Register to get started with Stylist Finder
        </p>
      </div>

      {/* Form */}

      <form onSubmit={handleRegister} className="mt-8 ">
        <div className="grid md:grid-cols-2 gap-3">
          <InputBox
            label="Full Name"
            Placeholder="Enter your full name"
            Name="fullName"
            Value={formData.fullName}
            onChange={handleChange}
          />

          <InputBox
            label="Phone Number"
            Placeholder="Enter your phone number"
            Name="phone"
            Value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <InputBox
          label="Email Address"
          Placeholder="Enter your email address"
          Name="email"
          Value={formData.email}
          onChange={handleChange}
        />

        <InputBox
          label="Password"
          Placeholder="Create Password"
          Type="password"
          Name="password"
          Value={formData.password}
          onChange={handleChange}
          PasswordIndication={true}
        />

        <InputBox
          label="Confirm Password"
          Placeholder="Confirm Password"
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

      {/* Login */}

      <p className="text-center mt-8 text-gray-600">
        Already have an account?{" "}
        <button
          onClick={switchForm}
          className="text-[#8B2954] font-semibold hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
