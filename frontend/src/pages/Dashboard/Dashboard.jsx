import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { IoLogOut } from "react-icons/io5";
import {
  CustomerArray,
  StoreArray,
  ProfessionalArray,
} from "../../constants/service";
import { FaHome, FaLongArrowAltUp, FaBars } from "react-icons/fa";
import {
  Overview,
  SavedAddress,
  BankingDetails,
  Booking,
  FavouriteStore,
  FavouriteProfessional,
  QuickServices,
  IsProfileComplete,
  CurrentlyUnderBooking,
} from "./Customer";

function Dashboard() {
  const [asideData, setAsideData] = useState("customer");

  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const componentMap = {
    overview: <Overview />,
    address: <SavedAddress />,
    banking_details: <BankingDetails />,
    booking: <Booking />,
    favorite_store: <FavouriteStore />,
    favorite_professional: <FavouriteProfessional />,
    quick_services: <QuickServices />,
    is_profile_complete: <IsProfileComplete />,
    currently_under_booking: <CurrentlyUnderBooking />,
  };

  return (
    <div className="relative w-full  flex  px-6 py-2   gap-2 items-start h-screen  p">
      <div className="md:hidden ">
        <button onClick={() => setSidebarOpen(true)}>
          <FaBars className="text-xl" />
        </button>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex justify-between h-screen gap-10 pb-10 ">
        <aside
          className={`fixed md:sticky top-0 md:top-24 left-0 z-50 h-full  md:h-[calc(100vh-6rem) w-72 md:w-[260px] bg-[#8B2954] text-white flex flex-col justify-between py-6  transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          {/* Quick Action */}
          {asideData === "customer" ? (
            <ul className="flex flex-col gap-2 px-8">
              {CustomerArray.map((customer) => (
                <li
                  key={customer.value}
                  onClick={() => {
                    setActiveSection(customer.value);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
                ${
                  activeSection === customer.value
                    ? "bg-white text-[#8B2954]"
                    : "hover:bg-white hover:text-[#8B2954]"
                }
              `}
                >
                  {customer.icon}
                  {customer.label}
                </li>
              ))}
            </ul>
          ) : asideData === "store" ? (
            <div className="flex flex-col gap-2 px-8">
              {StoreArray.map((store) => (
                <h1 className="flex gap-2 items-center hover:border hover:bg-white hover:text-black p-2 rounded-lg cursor-pointer text-[16px] hover:border-neutral-400 ">
                  <span>{store.icon}</span>
                  {store.label}
                </h1>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-8">
              {ProfessionalArray.map((professional) => (
                <h1>{professional.label}</h1>
              ))}
            </div>
          )}

          <div className="w-full gap-4 flex flex-col px-10 ">
            <button
            onClick={() => navigate("/")}
            className="h-fit  bg-white flex gap-2 justify-center items-center text-black rounded-lg p-2">
              <FaHome />
              Home
            </button>
            <button className="h-fit  bg-white flex gap-2 justify-center items-center text-black rounded-lg p-2">
              <IoLogOut />
              Logout
            </button>
          </div>
        </aside>
      </div>
      <main className="flex-1 bg-gray-100 rounded-lg p-6">
        {componentMap[activeSection] || <Overview />}
      </main>
    </div>
  );
}

export default Dashboard;
