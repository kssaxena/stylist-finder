import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { FaHome, FaBars } from "react-icons/fa";
import {
  Overview,
  SavedAddress,
  BankingDetails,
  Booking,
  PaymentDetails,
  FavoriteStore,
  FavoriteProfessional,
  Services,
  Images,
  KycDetails,
  StoreStaffs,
} from "./DashboardComponents";
import { FetchData } from "../../utils/FetchFromApi";
import Button from "../../components/Button";
import { DashboardSectionList } from "../../constants/Constants.jsx";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/slice/authSlice.js";
import { useToast } from "../../components/hooks/ToastContext.jsx";
import Popup from "../../components/ui/Popup.jsx";
import InputBox from "../../components/Input.jsx";
import { useRef } from "react";

function Dashboard() {
  const role = localStorage.getItem("role");
  const formRef = useRef();
  const [activeSection, setActiveSection] = useState(
    () => localStorage.getItem("activeSection") || "overview",
  );
  const [data, setData] = useState([]);
  const subscriptionId =
    data?.store?.subscription?.subscriptionModel ||
    sessionStorage.getItem("subscriptionId");
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { alertSuccess, alertInfo } = useToast();

  const fetchDashboardData = async ({ query }) => {
    try {
      const userRole = role.toLowerCase();
      const response = await FetchData(
        `${userRole}/get/dashboard/data/${userId}/${query}`,
        "get",
      );
      setData(response.data.data);
      if (!sessionStorage.getItem("subscriptionId")) {
        sessionStorage.setItem(
          "subscriptionId",
          response.data?.data?.store?.subscription?.subscriptionModel,
        );
      }
    } catch (err) {
      // console.log(err.response);
    }
  };

  const getSubscriptionDetails = async () => {
    try {
      const response = await FetchData(
        `subscription/get/subscription/details/by-id/${subscriptionId}`,
        "get",
      );
      setSubscriptionDetails(response.data.data);
    } catch (err) {
      // console.log(err.response.data);
    }
  };

  useEffect(() => {
    getSubscriptionDetails();
  }, [subscriptionId]);

  const mobileNavItems = DashboardSectionList.filter((item) =>
    item.roles.includes(role),
  ).slice(0, 4);

  const moreNavItems = DashboardSectionList.filter((item) =>
    item.roles.includes(role),
  ).slice(4);

  const logout = () => {
    localStorage.clear();
    dispatch(clearUser());
    alertInfo("You are logged out successfully");
    navigate("/");
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  useEffect(() => {
    const password = user?.password;
    if (!password && password?.length === 0) {
      setShowPasswordModal(true);
    }
  }, [user]);

  const updatePassword = async () => {
    try {
      const userRole = role.toLowerCase();
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `${userRole}/update/password/${userId}`,
        "post",
        formData,
      );
      formRef.current.reset();
      // console.log(response);
      alertSuccess(response.data.message);
      setShowPasswordModal(false);
    } catch (err) {
      // console.log(err.response.data);
      setShowPasswordModal(false);
    }
  };

  return user ? (
    <div className={`relative p-2 flex w-full items-start h-[90vh] `}>
      <aside className="hidden md:flex sticky w-[25vw] h-full bg-[#8B2954] rounded-xl flex-col items-start justify-between text-white py-6 px-5">
        <div className="flex flex-col gap-2">
          {DashboardSectionList.map((d, index) => (
            <ul key={index} className="w-full">
              {d.roles.includes(role) ? (
                <li
                  className={`cursor-pointer h-fit hover:bg-white/50 duration-300 ease-in-out hover:text-black rounded-lg px-3 py-2 w-full ${activeSection === d.query ? "bg-white text-black hover:bg-white" : ""}`}
                  onClick={() => {
                    localStorage.setItem("activeSection", d.query);
                    fetchDashboardData({ query: d.query });
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
        <div className="flex flex-col gap-2 w-full">
          <div className=" w-full border-b-[0.2px] rounded-full " />
          <button
            onClick={() => navigate("/")}
            className="bg-white text-neutral-800 flex justify-start items-center rounded-lg py-2 gap-2 px-10 w-full cursor-pointer"
          >
            <FaHome />
            Home
          </button>
          <button
            onClick={() => logout()}
            className="bg-white text-neutral-800 flex justify-start items-center rounded-lg py-2 gap-2 px-10 w-full cursor-pointer"
          >
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
            onClick={() => {
              setActiveSection(item.query);
              fetchDashboardData({ query: item.query });
              localStorage.setItem("activeSection", item.query);
            }}
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
        <div className="h-fit">
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setShowMoreMenu(false)}
          />

          <div className="fixed bottom-16 left-0 w-full bg-white rounded-t-3xl p-5 z-50 md:hidden">
            <div className="w-14 h-1 rounded-full bg-gray-300 mx-auto mb-5"></div>

            <div className="grid grid-cols-2 gap-4 h-fit">
              <button
                onClick={() => logout()}
                className="bg-white text-neutral-800 flex justify-start items-center rounded-lg py-2 gap-2 px-10 w-full cursor-pointer"
              >
                <IoLogOut />
                Logout
              </button>
              {moreNavItems.map((item) => (
                <button
                  key={item.query}
                  onClick={() => {
                    setActiveSection(item.query);
                    setShowMoreMenu(false);
                    fetchDashboardData({ query: item.query });
                    localStorage.setItem("activeSection", item.query);
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100"
                >
                  <span className="text-2xl text-[#8B2954]">{item.icon}</span>

                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="overflow-scroll h-full w-full">
        <main className="w-full h-full p-1 lg:p-5">
          {activeSection === "overview" && (
            <Overview
              activeServices={() => {
                setActiveSection("services");
              }}
              data={data}
              role={localStorage.role}
              userId={userId}
              callData={() => fetchDashboardData({ query: "overview" })}
              // userId={userId}
              // handleReload={() => fetchDashboardData({ query: "address" })}
            />
          )}
          {activeSection === "bookings" && (
            <Booking
              callData={() => fetchDashboardData({ query: "bookings" })}
              data={data}
              role={localStorage.role}
              userId={userId}
              handleReload={() => fetchDashboardData({ query: "bookings" })}
            />
          )}
          {activeSection === "address" && (
            <SavedAddress
              callData={() => fetchDashboardData({ query: "address" })}
              data={data}
              role={localStorage.role}
              userId={userId}
              handleReload={() => fetchDashboardData({ query: "address" })}
            />
          )}
          {activeSection === "bankDetails" && (
            <BankingDetails
              callData={() => fetchDashboardData({ query: "bankDetails" })}
              data={data}
              role={localStorage.role}
              userId={userId}
              handleReload={() => fetchDashboardData({ query: "bankDetails" })}
            />
          )}
          {activeSection === "payments" && (
            <PaymentDetails
              callData={() => fetchDashboardData({ query: "payments" })}
              data={data}
              role={localStorage.role}
              userId={userId}
              handleReload={() => fetchDashboardData({ query: "payments" })}
            />
          )}
          {activeSection === "storeStaff" && (
            <StoreStaffs
              callData={() => fetchDashboardData({ query: "storeStaff" })}
              data={data}
              role={localStorage.role}
              userId={userId}
              handleReload={() => fetchDashboardData({ query: "storeStaff" })}
            />
          )}
          {activeSection === "fav_store" && (
            <FavoriteStore data={data} role={localStorage.role} />
          )}{" "}
          {activeSection === "fav_professional" && (
            <FavoriteProfessional data={data} role={localStorage.role} />
          )}
          {activeSection === "services" && (
            <Services
              showPlan={() => {
                alertInfo("Please scroll down for browsing the plan");
                setActiveSection("overview");
              }}
              callData={() => fetchDashboardData({ query: "services" })}
              data={data}
              role={localStorage.role}
              userId={userId}
              handleReload={() => fetchDashboardData({ query: "services" })}
            />
          )}
          {activeSection === "images" && (
            <Images
              callData={() => fetchDashboardData({ query: "images" })}
              data={data}
              role={localStorage.role}
              userId={userId}
              subscription={subscriptionDetails}
              handleReload={() => fetchDashboardData({ query: "images" })}
            />
          )}
          {activeSection === "kyc" && (
            <KycDetails
              callData={() => fetchDashboardData({ query: "kyc" })}
              data={data}
              role={localStorage.role}
              storeId={userId}
              handleReload={() => fetchDashboardData({ query: "kyc" })}
            />
          )}
        </main>
      </div>
      <div>
        {showPasswordModal && (
          <div>
            <Popup center={true} onClose={() => setShowPasswordModal(false)}>
              <form
                ref={formRef}
                onSubmit={updatePassword}
                className="w-full md:w-1/2 h-fit flex flex-col justify-center items-center p-4 border rounded-xl gap-5"
              >
                <h1>Update Password</h1>
                <InputBox
                  type="password"
                  label="Update password"
                  name="password"
                />
                <Button LabelName="update password" type="submit" />
              </form>
            </Popup>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="h-[80vh] flex flex-col justify-center items-center w-full ">
      <h1 className="heading capitalize">Please Login to view dashboard</h1>
      <Button
        onClick={() => navigate("/")}
        className="w-[70vw] md:w-[40vw]"
        LabelName={
          <h1 className="flex justify-center items-center gap-2 w-full">
            <FaHome />
            Home
          </h1>
        }
      />
    </div>
  );
}

export default Dashboard;
