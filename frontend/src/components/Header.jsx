import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import Logo from "../assets/Logo.png";
import Button from "./Button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUser, setShowUser] =useState(false)

  return (
    <header className="w-full px-4 md:px-8 lg:px-12 py-4 bg-transparent fixed ">
      <div className="flex items-center justify-between ">
        {/* Logo */}
        <a href="/">
          <img src={Logo} alt="Logo" className="h-14" />
        </a>

        {/* Desktop Navigation */}
        <div className="flex items-center justify-between gap-4 bg-[#8B2954] rounded-full px-6 py-2 w-fit">
          <a
            href="/"
            className="text-white text-xs font-medium hover:text-pink-200 transition"
          >
            Home
          </a>
          <div className=" lg:w-16 flex  bg-white rounded-full px-2 py-1  items-center justify-between text-sm ">
            <span>
              {" "}
              <FaMapMarkerAlt className="lg:text-lg" />{" "}
            </span>
            <select className="outline-none bg-transparent"></select>
          </div>
          {showUser === false ? (
            <Button LabelName="Login/Register" variant="Secondary" />
          ) : (
            <FiUser className="cursor-pointer text-white text-lg" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
