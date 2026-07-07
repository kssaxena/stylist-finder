import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Logo from "../assets/Logo.png";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "#" },
    { name: "Media Coverage", path: "#" },
    { name: "Contact", path: "#" },
  ];

  return (
    <footer className="bg-[#8B2954] text-white p text-xs">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Logo & Description */}
          <div className="space-y-4">
            <a href="/">
              <img src={Logo} alt="Logo" className="h-16" />
            </a>

            <p className="text-sm text-pink-100 leading-6 max-w-sm">
              Experience luxury beauty and wellness services designed to
              rejuvenate your mind, body, and confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col md:items-center">
            <h3 className="text-lg font-semibold mb-4 h1">Quick Links</h3>

            <nav className="flex flex-col gap-3">
              {quickLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="hover:text-pink-200 transition duration-300"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex flex-col md:items-end">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>

            <div className="flex gap-4">
              <a
                href="#"
                className="bg-white text-[#8B2954] p-3 rounded-full hover:bg-pink-200 transition duration-300"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="#"
                className="bg-white text-[#8B2954] p-3 rounded-full hover:bg-pink-200 transition duration-300"
              >
                <FaFacebookF size={20} />
              </a>

              <a
                href="#"
                className="bg-white text-[#8B2954] p-3 rounded-full hover:bg-pink-200 transition duration-300"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-pink-300 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-pink-100 gap-3">
          <p>
            © {new Date().getFullYear()} Luxury Beauty & Wellness Studio. All
            Rights Reserved.
          </p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-white">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
