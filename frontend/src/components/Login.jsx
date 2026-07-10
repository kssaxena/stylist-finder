import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
import Logo from "../assets/Logo.png";
import InputBox from "./Input";
import Button from "./Button";

const Login = ({ onBack, onRegister, switchForm }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    console.log(formData);

    // TODO:
    // API Call
  };

  return (
    <div className="relative w-full max-w-xl bg-white border border-neutral-300 rounded-3xl shadow-xl p-8">
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
        <h1 className="text-4xl font-serif text-[#5B1933]">Welcome Back!</h1>

        <p className="text-gray-500 mt-2">
          Login to continue to Stylist Finder
        </p>
      </div>

      {/* Form */}

      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <InputBox
          label="Phone Number"
          Placeholder="Enter your phone number"
          Name="email"
          Value={formData.email}
          onChange={handleChange}
        />

        {/* <InputBox
          label="Password"
          Placeholder="Enter your password"
          Type="password"
          Name="password"
          Value={formData.password}
          onChange={handleChange}
        /> */}

     
        <Button type="submit" LabelName="Login" className="w-full" />
      </form>

      

      {/* Social Login */}

      {/* <div className="grid grid-cols-3 gap-4">
        <button className="border rounded-xl py-4 flex flex-col items-center gap-2 hover:shadow-md transition">
          <FcGoogle size={32} />
          <span>Google</span>
        </button>

        <button className="border rounded-xl py-4 flex flex-col items-center gap-2 hover:shadow-md transition">
          <FaFacebookF size={30} className="text-blue-600" />
          <span>Facebook</span>
        </button>

        <button className="border rounded-xl py-4 flex flex-col items-center gap-2 hover:shadow-md transition">
          <FaApple size={30} />
          <span>Apple</span>
        </button>
      </div> */}

      {/* Register */}

      <p className="text-center mt-8 text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={switchForm}
          className="text-[#8B2954] font-semibold hover:underline"
          
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;
