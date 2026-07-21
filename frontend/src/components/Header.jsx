import React, { useEffect, useState } from "react";
import { HiHome, HiMenu, HiX } from "react-icons/hi";
// import Logo from "../assets/Logo.png";
import Button from "./Button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  // const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerBgClass = isScrolled
    ? "bg-black/30 backdrop-blur-3xl transition duration-300 ease-in-out"
    : "bg-black/10";

  // accordion card
  const AccordionCard = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="w-fit">
        <div className="rounded-full overflow-hidden backdrop-blur-3xl flex flex-row-reverse p-2 h-16 justify-center items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full cursor-pointer"
          >
            {isOpen ? (
              <IoClose
                className={`text-lg  ${isScrolled ? "text-gray-200" : "text-gray-500"}`}
              />
            ) : (
              <FiMenu
                className={`text-lg  ${isScrolled ? "text-gray-200" : "text-gray-500"}`}
              />
            )}
          </button>

          {/* Content */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="content"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden backdrop-blur-3xl rounded-full "
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <header
      className={`w-full px-4 md:px-8 lg:px-12 py-2 fixed z-40 ${headerBgClass} h-20 `}
    >
      <div className="flex items-center justify-between ">
        {/* Logo */}
        <a href="/" className="md:h-14 md:w-14 h-10 w-10">
          <img
            src={
              "https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/Logo.png?updatedAt=1784349570750"
            }
            alt="Logo"
            className="h-full w-full"
          />
        </a>

        <AccordionCard
          children={
            <div className="flex items-center justify-between md:gap-4 gap-2 bg-[#8B2954] rounded-full h-11 px-2 w-fit">
              <a href="/" className="text-white hover:text-pink-200 transition">
                <HiHome />
              </a>
              <div className=" lg:w-16 flex  bg-white rounded-full px-2 py-1  items-center justify-between text-sm ">
                <span>
                  <FaMapMarkerAlt className="lg:text-lg" />
                </span>
                <select className="outline-none bg-transparent"></select>
              </div>
              {showUser === false ? (
                <Button
                  className="truncate"
                  LabelName="Login / Register"
                  variant="Secondary"
                  onClick={() => {
                    navigate(`/auth/${"login"}/${"customer"}`);
                  }}
                />
              ) : (
                <FiUser className="cursor-pointer text-white text-lg" />
              )}
            </div>
          }
        />
      </div>
    </header>
  );
};

export default Header;
