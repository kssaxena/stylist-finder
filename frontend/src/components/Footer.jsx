import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const quickLinks = [
    { name: "Female Services", path: "/services/location/female/category" },
    { name: "Male Services", path: "/services/location/male/category" },
    { name: "Admin", path: "/admin/login", css: "hidden lg:block" },
  ];
  const usefulLinks = [
    {
      name: "Studio / Parlor / Salon Registration",
      path: `/auth/${"login"}/${"store"}`,
    },
    {
      name: "Beauty Professional Registration",
      path: `/auth/${"login"}/${"professional"}`,
    },
  ];

  return (
    <footer className="bg-[#8B2954] text-white paragraph">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-around justify-between w-fit">
          {/* Logo & Description */}
          <div className="space-y-4 w-fit">
            <a href="/">
              <img
                src={`https://ik.imagekit.io/cuteandglow/WhatsApp%20Image%202026-09-11%20at%208.26.34%20AM.jpeg`}
                alt="Logo"
                className="h-16 object-contain"
              />
            </a>
            <h2>
              <p className="logo_style">Cute & Glow</p>
              <p className="text-sm text-pink-100 leading-6 max-w-sm flex flex-col items-start">
                <strong>Brand unit of</strong> CLEAR CRAFT PRIVATE LIMITED
              </p>
            </h2>

            <p className="text-sm text-pink-100 leading-6 max-w-sm">
              Any parlour near you, now at your fingertips.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col md:items-start w-fit">
            <h3 className="text-lg font-heading_bold mb-4 heading">
              Quick Links
            </h3>

            <nav className="flex flex-col gap-2">
              {quickLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className={`hover:text-pink-200 transition duration-300 ${item.css}`}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col md:items-start w-fit">
            <h3 className="text-lg font-semibold mb-4 heading">
              Store / Professionals
            </h3>

            <nav className="flex flex-col gap-2">
              {usefulLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="hover:text-pink-200 transition duration-300 hover:underline"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex flex-col md:items-end w-fit">
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
            <a href="/" className="hover:text-white">
              Home
            </a>
            <a href="#" className="hover:text-white">
              Contact Us
            </a>
            <a href="/policy" className="hover:text-white">
              Policy
            </a>

            <a href="/terms-and-conditions" className="hover:text-white">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
