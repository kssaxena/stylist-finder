import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoLogOut, IoStorefrontSharp } from "react-icons/io5";
import {
  CustomerArray,
  StoreArray,
  ProfessionalArray,
} from "../../constants/service";
import {
  FaHome,
  FaArrowUp,
  FaUserEdit,
  FaUser,
  FaMapMarkerAlt,
  FaStore,
  FaServicestack,
  FaHeart,
  FaBars,
  FaImages,
} from "react-icons/fa";
import { GoVerified } from "react-icons/go";
import { MdDomainVerification } from "react-icons/md";
import { BsBank2 } from "react-icons/bs";


import {
  Overview,
  SavedAddress,
  BankingDetails,
  Booking,
  IsProfileComplete,
  CurrentlyUnderBooking,
  FavoriteStore,
  FavoriteProfessional,
  Services,
  Images,
  KycDetails,
} from "./Customer";

import { FetchData } from "../../utils/FetchFromApi";
import Button from "../../components/Button";
import { CiBank } from "react-icons/ci";

function Dashboard() {
  const setUserRole = localStorage.setItem("role", "user");
  const role = localStorage.getItem("role");
  const [activeSection, setActiveSection] = useState("overview");
  const [data, setData] = useState([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const dashboardSectionList = [
    {
      label: "Overview",
      icon: <GoVerified />,
      query: "overview",
      roles: ["user", "store", "professional"],
    },
    {
      label: "Address",
      icon: <FaMapMarkerAlt />,
      query: "address",
      roles: ["user", "store", "professional"],
    },
    {
      label: "Bank Details",
      icon: <BsBank2 />,
      query: "bankDetails",
      roles: ["user", "store", "professional"],
    },
    {
      label: "Favorite Store",
      icon: <IoStorefrontSharp />,
      query: "fav_store",
      roles: ["user"],
    },
    {
      label: "Favorite Professional",
      icon: <FaHeart />,
      query: "fav_professional",
      roles: ["user"],
    },
    {
      label: "Wishlist Services",
      icon: <FaServicestack />,
      query: "wishlist_services",
      roles: ["user"],
    },
    {
      label: "Store Staff",
      icon: <FaUser />,
      query: "store_staff",
      roles: ["store"],
    },
    {
      label: "Own Services ",
      icon: <FaUser />,
      query: "own_services",
      roles: ["store", "professional"],
    },
    {
      label: "Images",
      icon: <FaImages />,
      query: "images",
      roles: ["store", "professional"],
    },
    {
      label: "KYC",
      icon: <MdDomainVerification />,
      query: "kyc",
      roles: ["store", "professional"],
    },
  ];

  const fetchDashboardData = async ({ query }) => {
    try {
      console.log(query);
      const response = await FetchData(`get/data/dashboard/${query}`, "get");
      console.log(response);
      setData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const mobileNavItems = dashboardSectionList
    .filter((item) => item.roles.includes(role))
    .slice(0, 4);

  const moreNavItems = dashboardSectionList
    .filter((item) => item.roles.includes(role))
    .slice(4);

  return (
    <div className="relative p-2 flex w-full gap-10 items-start h-[80vh]">
      <aside className="hidden md:flex sticky w-[25vw] h-full bg-[#8B2954] rounded-xl flex-col items-start justify-between text-white py-6 px-5">
        <div className="flex flex-col gap-2">
          {dashboardSectionList.map((d, index) => (
            <ul key={index} className="w-full">
              {d.roles.includes(role) ? (
                <li
                  className={`cursor-pointer h-fit hover:bg-white/50 duration-300 ease-in-out hover:text-black rounded-lg px-3 py-2 w-full ${activeSection === d.query ? "bg-white text-black hover:bg-white" : ""}`}
                  onClick={() => {
                    // fetchDashboardData({ query: d.query });
                    setActiveSection(d.query);
                    // data display
                    // close pop up
                  }}
                >
                  <div className="flex gap-2 justify-start items-center">
                    <span>{d.icon}</span>
                    <span>{d.label}</span>
                  </div>
                </li>
              ) : (
                ""
              )}
            </ul>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {/* <Button LabelName="Home" variant="secondary" /> */}
          <button className="flex items-center  bg-white text-black w-66 py-2 px-10 rounded-lg gap-2 ">
            <FaHome />
            Home
          </button>
          <button className="flex items-center  bg-white text-black w-66 py-2 px-10 rounded-lg gap-2 ">
            <IoLogOut />
            Logout
          </button>
        </div>
      </aside>
      {/* Mobile Bottom Navigation */}

      <div className="fixed bottom-0 left-0 w-full h-16 bg-white border-t shadow-lg flex justify-around items-center md:hidden z-50">
        {mobileNavItems.map((item) => (
          <button
            key={item.query}
            onClick={() => setActiveSection(item.query)}
            className={`flex flex-col items-center justify-center transition ${activeSection === item.query ? "text-[#8B2954]" : "text-gray-500"}`}
          >
            <span className="text-xl">{item.icon}</span>
          </button>
        ))}

        <button
          onClick={() => setShowMoreMenu(true)}
          className="flex flex-col items-center justify-center text-gray-500"
        >
          <FaBars className="text-xl" />
        </button>
      </div>
      {/* More Menu */}

      {showMoreMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setShowMoreMenu(false)}
          />

          <div className="fixed bottom-16 left-0 w-full bg-white rounded-t-3xl p-5 z-50 md:hidden">
            <div className="w-14 h-1 rounded-full bg-gray-300 mx-auto mb-5"></div>

            <div className="grid grid-cols-2 gap-4">
              {moreNavItems.map((item) => (
                <button
                  key={item.query}
                  onClick={() => {
                    setActiveSection(item.query);
                    setShowMoreMenu(false);
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100"
                >
                  <span className="text-2xl text-[#8B2954]">{item.icon}</span>

                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="h-full w-full">
        <main className="w-full md:w-[75vw] h-full pb-20 md:pb-0">
          {activeSection === "overview" && <Overview />}
          {activeSection === "address" && <SavedAddress />}
          {activeSection === "bankDetails" && <BankingDetails />}
          {activeSection === "fav_store" && <FavoriteStore />}{" "}
          {activeSection === "fav_professional" && <FavoriteProfessional />}{" "}
          {activeSection === "wishlist_services" && <Services />}
          {activeSection === "own_services" && <Services />}
          {activeSection === "images" && <Images />}
          {activeSection === "kyc" && <KycDetails />}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
