import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import Logo from "../assets/Logo.png";
import InputBox from "./Input";
import Button from "./Button";
import { useNavigate, useParams } from "react-router-dom";
import LoginSvg from "../assets/Login.svg";
import { FetchData } from "../utils/FetchFromApi";
import { useRef } from "react";

const Login = ({ onRegister }) => {
  const navigate = useNavigate();
  const formRef = useRef();
  const { userType } = useParams("");
  console.log(userType)

  const [formData, setFormData] = useState({
    number: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    // e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(`/customer/login`, "get", formData);

      console.log(response);
      formRef.current.reset();
    } catch (error) {
      
    }
  };
  

  return (
    <div className="w-full  rounded-3xl flex justify-center items-center lg:px-10 px-2">
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
              <img src={Logo} alt="Logo" className="w-24 h-24 object-contain" />
            </div>
            {/* Heading */}
            <div className="text-center mt-4">
              <h1 className="text-4xl font-serif text-[#5B1933]">
                Welcome Back!
              </h1>

              <p className="text-gray-500 mt-2">
                Login to continue to Stylist Finder
              </p>
            </div>
            {/* Form */}
            <form
              ref={formRef}
              onClick={handleLogin}
              className="mt-8 space-y-4"
            >
              <InputBox
                label="contact Number"
                placeholder="Enter your contact number"
                name="contactNumber"
                type="text"
                onChange={() => console.log("Input worked")}
                onKeyDown={() => console.log("Input worked")}
                onClick={() => console.log("Input worked")}
                Value={formData.number}
                onChange={handleChange}
              />
              <Button type="submit" LabelName="Login" className="w-full" />
            </form>
            {/* Register */}
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
    </div>
  );
};

export default Login;
