import React, { useEffect, useRef, useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUserEdit,
  FaCalendarCheck,
  FaHeart,
  FaHome,
  FaCrown,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBriefcase,
  FaUniversity,
  FaCreditCard,
  FaMobileAlt,
  FaClock,
  FaUserTie,
  FaRupeeSign,
  FaEye,
  FaStar,
  FaTimesCircle,
  FaStore,
  FaFemale,
  FaCheckCircle,
  FaCalendarAlt,
  FaLocationArrow,
  FaUpload,
  FaBuilding,
  FaFilePdf,
  FaUser,
  FaDatabase,
  FaMale,
  FaMarsDouble,
  FaRegUser,
  FaTimes,
  FaCamera,
  FaCloudUploadAlt,
  FaImage,
} from "react-icons/fa";
import { bookings, activeBookings } from "../../constants/constants";
import NonGenderSvg from "../../assets/non-gender-user.svg";
import { FetchData } from "../../utils/FetchFromApi";
import { useToast } from "../../components/hooks/ToastContext";
import InputBox from "../../components/Input";
import Button from "../../components/Button";
import Popup from "../../components/ui/Popup";
import {
  formatAccountNumberDisplay,
  formatDateString,
  formatEmailDisplay,
} from "../../utils/utility-functions";
import AddressMap from "../../components/ui/AddressMap";
import { MdOutlineVerified } from "react-icons/md";
import StoreServiceCard from "../../components/ui/StoreServiceCard";

const Overview = ({ data, role, userId, callData }) => {
  const [subscription, setSubscription] = useState([]);
  const [currentSubscriptionModel, setCurrentSubscriptionModel] =
    useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [purchasingPlanId, setPurchasingPlanId] = useState(null);
  const { alertSuccess, alertError } = useToast();
  const subscriptionId = data?.store?.subscription?.subscriptionModel;

  const getSubscription = async () => {
    try {
      const response = await FetchData(
        `subscription/get/subscription/${role}`,
        "get",
      );
      setSubscription(response.data.data);
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    callData();
    getSubscription();
  }, []);

  const displayData =
    role === "Customer"
      ? data?.customer
      : role === "Store"
        ? data?.store
        : data?.professional;

  const openProfilePopup = () => {
    if (role === "Customer") {
      setProfileForm({
        name: displayData?.name || "",
        contactNumber: displayData?.contactNumber || "",
        email: displayData?.email || "",
        gender: displayData?.gender || "Prefer not to say",
        alternateContactNumber: displayData?.alternateContactNumber || "",
      });
    }

    if (role === "Store") {
      setProfileForm({
        storeName: displayData?.storeName || "",
        storeContactNumber: displayData?.storeContactNumber || "",
        storeEmail: displayData?.storeEmail || "",
        serviceType: displayData?.serviceType || "Both (In house and On site)",
        inStorePayment: displayData?.paymentOptions?.inStore || "",
        onSitePayment: displayData?.paymentOptions?.onSite || "",
        openFrom: displayData?.storeTimings?.openFrom
          ? new Date(displayData.storeTimings.openFrom)
              .toISOString()
              .slice(11, 16)
          : "",
        openTill: displayData?.storeTimings?.openTill
          ? new Date(displayData.storeTimings.openTill)
              .toISOString()
              .slice(11, 16)
          : "",
      });
    }

    if (role === "Professional") {
      setProfileForm({
        name: displayData?.name || "",
        contactNumber: displayData?.contactNumber || "",
        email: displayData?.email || "",
        gender: displayData?.gender || "Prefer not to say",
        alternateContactNumber: displayData?.alternateContactNumber || "",
        about: displayData?.about || "",
        specialization: displayData?.specialization?.join(", ") || "",
        serviceType: displayData?.serviceType || "Both (In house and On Site)",
        paymentOptions: displayData?.paymentOptions || "Both",
      });
    }

    setShowProfilePopup(true);
  };

  const saveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const payload =
        role === "Customer"
          ? profileForm
          : role === "Store"
            ? {
                storeName: profileForm.storeName,
                storeContactNumber: profileForm.storeContactNumber,
                storeEmail: profileForm.storeEmail,
                serviceType: profileForm.serviceType,
                paymentOptions: {
                  inStore: profileForm.inStorePayment || undefined,
                  onSite: profileForm.onSitePayment || undefined,
                },
                storeTimings: {
                  openFrom: profileForm.openFrom,
                  openTill: profileForm.openTill,
                },
              }
            : profileForm;
      const response = await FetchData(
        `${role.toLowerCase()}/update/profile/${userId}`,
        "post",
        payload,
      );
      alertSuccess(response.data.message);
      setShowProfilePopup(false);
      await callData();
    } catch (err) {
      alertError(err.response?.data?.message || "Unable to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const purchasePlan = async (plan) => {
    if (!window.Razorpay || role !== "Store") {
      alertError(
        "Subscription payments are currently available for stores only",
      );
      return;
    }

    setPurchasingPlanId(plan._id);
    try {
      const response = await FetchData("payment/create", "post", {
        module: "Subscription",
        moduleId: plan._id,
        user: userId,
        amount: plan.price.sellingPrice,
      });
      const { transaction, razorpay } = response.data.data;
      const checkout = new window.Razorpay({
        key: razorpay.key,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "Cute & Glow",
        description: `${plan.planName} subscription`,
        order_id: razorpay.orderId,
        handler: async (paymentResponse) => {
          try {
            await FetchData("payment/verify", "post", {
              transactionId: transaction._id,
              ...paymentResponse,
            });
            alertSuccess("Subscription purchased successfully");
            await callData();
          } catch (err) {
            alertError(
              err.response?.data?.message || "Payment verification failed",
            );
          } finally {
            setPurchasingPlanId(null);
          }
        },
        modal: { ondismiss: () => setPurchasingPlanId(null) },
        theme: { color: "#8B2954" },
      });
      checkout.open();
    } catch (err) {
      setPurchasingPlanId(null);
      alertError(err.response?.data?.message || "Unable to start payment");
    }
  };

  return (
    <div className="space-y-6 w-full pb-40 md:pb-20 lg:pb-0">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's a quick overview of your account.
          </p>
        </div>
        <button
          onClick={openProfilePopup}
          className="flex justify-center items-center gap-2 bg-[#8B2954] text-white px-5 py-3 rounded-xl hover:bg-[#742247] transition duration-300"
        >
          <FaUserEdit />
          Update Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white text-neutral-950 rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-36 h-36">
          <img
            src={displayData?.profileImage?.url || NonGenderSvg}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center gap-3">
            <h2 className="capitalize text-xl flex justify-center items-center gap-2 font-semibold text-neutral-950 heading">
              {displayData?.name || displayData?.storeName || "NA"}{" "}
              <span className="bg-yellow-300 text-sm heading px-2 py-1 rounded-2xl">
                {displayData?.gender === "Prefer not to say"
                  ? ""
                  : displayData?.gender}
              </span>
            </h2>

            {/* {role === "user" || "USER" || "User" ? (
              <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                <FaCrown />
                Premium Member
              </span>
            ) : (
              ""
            )} */}
          </div>

          <p className="text-gray-500 mt-1 text-sm">
            Joined since {formatDateString(displayData?.createdAt)}
          </p>

          <div className="grid md:grid-cols-2 gap-2">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-[#8B2954]" />
              <span>
                {formatEmailDisplay(displayData?.email) ||
                  formatEmailDisplay(displayData?.storeEmail) ||
                  "Na"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-[#8B2954]" />
              <span>
                +91{" "}
                {displayData?.contactNumber ||
                  displayData?.storeContactNumber ||
                  "Na"}
              </span>
            </div>
            {displayData?.alternateContactNumber ? (
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-[#8B2954]" />
                <span>
                  +91 {displayData?.alternateContactNumber || "9876543210"}{" "}
                  <span className="bg-neutral-200 p-1 rounded-full font-semibold text-[13px]">
                    Alternate
                  </span>
                </span>
              </div>
            ) : (
              ""
            )}
            {data?.defaultAddress ? (
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#8B2954]" />
                <span>{displayData?.address || "Ranchi, Jharkhand"}</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      {role === "Customer" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>

                <h2 className="text-xl font-bold mt-2">
                  {displayData?.bookings?.length || "No bookings yet"}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-full bg-pink-100 flex justify-center items-center">
                <FaCalendarCheck className="text-[#8B2954] text-2xl" />
              </div>
            </div>
          </div>

          {data?.defaultAddress ? (
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Saved Addresses</p>

                  <h2 className="text-xl font-bold mt-2">
                    {displayData?.savedAddress || "No address added"}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-full bg-pink-100 flex justify-center items-center">
                  <FaHome className="text-[#8B2954] text-xl" />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      {/* Recent Activity */}

      {/* <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-5">Recent Activity</h2>

        <div className="space-y-5">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-medium">Bridal Makeup Appointment</h3>

              <p className="text-gray-500 text-sm">
                Urban Beauty Salon • 10 June 2025
              </p>
            </div>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              Completed
            </span>
          </div>

          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-medium">Hair Spa Booking</h3>

              <p className="text-gray-500 text-sm">Glow Salon • 22 June 2025</p>
            </div>

            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
              Upcoming
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Saree Draping</h3>

              <p className="text-gray-500 text-sm">
                Elite Beauty Studio • 25 June 2025
              </p>
            </div>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              Confirmed
            </span>
          </div>
        </div>
      </div> */}
      {/* Update Profile Popup */}
      {showProfilePopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-5">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Popup Header */}
            <div className="bg-[#8B2954] text-white px-5 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Update Profile
                </h2>

                <p className="text-white/80 text-sm mt-1">
                  Update your {role?.toLowerCase()} details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProfilePopup(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex justify-center items-center transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Popup Body */}
            <div className="overflow-y-auto p-5 sm:p-6">
              {/* =====================================================
            CUSTOMER
        ===================================================== */}
              {role === "Customer" && (
                <div className="space-y-5">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={displayData?.profileImage?.url || NonGenderSvg}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-pink-100"
                      />

                      <button
                        type="button"
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#8B2954] text-white flex justify-center items-center"
                      >
                        <FaCamera className="text-sm" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">Profile image</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>

                      <input
                        type="text"
                        value={profileForm.name || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>

                    {/* Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>

                      <input
                        type="tel"
                        value={profileForm.contactNumber || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            contactNumber: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>

                      <input
                        type="email"
                        value={profileForm.email || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>

                      <select
                        value={profileForm.gender || "Prefer not to say"}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            gender: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954] bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>

                    {/* Alternate Contact */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternate Contact Number
                      </label>

                      <input
                        type="tel"
                        value={profileForm.alternateContactNumber || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            alternateContactNumber: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* =====================================================
            STORE
        ===================================================== */}
              {role === "Store" && (
                <div className="space-y-5">
                  {/* Logo */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={displayData?.images?.logo?.url || NonGenderSvg}
                        alt="Store Logo"
                        className="w-24 h-24 rounded-full object-cover border-4 border-pink-100"
                      />

                      <button
                        type="button"
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#8B2954] text-white flex justify-center items-center"
                      >
                        <FaCamera className="text-sm" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">Store logo</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Store Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Name
                      </label>

                      <input
                        type="text"
                        value={profileForm.storeName || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            storeName: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>

                    {/* Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>

                      <input
                        type="tel"
                        value={profileForm.storeContactNumber || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            storeContactNumber: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Email
                      </label>

                      <input
                        type="email"
                        value={profileForm.storeEmail || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            storeEmail: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>

                    {/* Service Type */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Type
                      </label>

                      <select
                        value={profileForm.serviceType || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            serviceType: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954] bg-white"
                      >
                        <option value="In House">In House</option>

                        <option value="On Site">On Site</option>

                        <option value="Both (In house and On site)">
                          Both (In house and On site)
                        </option>
                      </select>
                    </div>

                    {/* In Store Payment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        In-Store Payment
                      </label>

                      <select
                        value={profileForm.inStorePayment || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            inStorePayment: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954] bg-white"
                      >
                        <option value="">Select payment option</option>

                        <option value="Online (Cards / UPI)">
                          Online (Cards / UPI)
                        </option>

                        <option value="Cash">Cash</option>

                        <option value="Both">Both</option>
                      </select>
                    </div>

                    {/* On Site Payment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        On-Site Payment
                      </label>

                      <select
                        value={profileForm.onSitePayment || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            onSitePayment: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954] bg-white"
                      >
                        <option value="">Select payment option</option>

                        <option value="UPI">UPI</option>

                        <option value="Cash">Cash</option>

                        <option value="Both">Both</option>
                      </select>
                    </div>

                    {/* Opening */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opening Time
                      </label>

                      <input
                        type="time"
                        value={profileForm.openFrom || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            openFrom: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>

                    {/* Closing */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Closing Time
                      </label>

                      <input
                        type="time"
                        value={profileForm.openTill || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            openTill: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* =====================================================
            PROFESSIONAL
        ===================================================== */}
              {role === "Professional" && (
                <div className="space-y-5">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={
                          displayData?.images?.profileImage?.url || NonGenderSvg
                        }
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-pink-100"
                      />

                      <button
                        type="button"
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#8B2954] text-white flex justify-center items-center"
                      >
                        <FaCamera className="text-sm" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">Profile image</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>

                      <input
                        type="text"
                        value={profileForm.name || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>

                    {/* Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>

                      <input
                        type="tel"
                        value={profileForm.contactNumber || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            contactNumber: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>

                      <input
                        type="email"
                        value={profileForm.email || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>

                      <select
                        value={profileForm.gender || "Prefer not to say"}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            gender: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954] bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>

                    {/* Alternate Contact */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternate Contact Number
                      </label>

                      <input
                        type="tel"
                        value={profileForm.alternateContactNumber || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            alternateContactNumber: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />
                    </div>

                    {/* About */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        About
                      </label>

                      <textarea
                        rows={4}
                        value={profileForm.about || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            about: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954] resize-none"
                        placeholder="Tell customers about yourself..."
                      />
                    </div>

                    {/* Specialization */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization
                      </label>

                      <input
                        type="text"
                        value={profileForm.specialization || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            specialization: e.target.value,
                          })
                        }
                        placeholder="Hair Coloring, Bridal Makeup, Facial"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954]"
                      />

                      <p className="text-xs text-gray-400 mt-1">
                        Separate multiple specializations with commas.
                      </p>
                    </div>

                    {/* Service Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Type
                      </label>

                      <select
                        value={profileForm.serviceType || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            serviceType: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954] bg-white"
                      >
                        <option value="In House">In House</option>

                        <option value="On Site">On Site</option>

                        <option value="Both (In house and On site)">
                          Both (In house and On site)
                        </option>
                      </select>
                    </div>

                    {/* Payment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Options
                      </label>

                      <select
                        value={profileForm.paymentOptions || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            paymentOptions: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#8B2954] bg-white"
                      >
                        <option value="Cash">Cash</option>

                        <option value="Online (UPI)">Online (UPI)</option>

                        <option value="Both">Both</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Popup Footer */}
            <div className="border-t border-gray-200 px-5 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowProfilePopup(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveProfile}
                disabled={isSavingProfile}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#8B2954] text-white hover:bg-[#742247] transition"
              >
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Statistics */}
      {role === "Customer" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>

                <h2 className="text-xl font-bold mt-2">
                  {displayData?.bookings?.length || "No bookings yet"}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-full bg-pink-100 flex justify-center items-center">
                <FaCalendarCheck className="text-[#8B2954] text-2xl" />
              </div>
            </div>
          </div>

          {data?.defaultAddress ? (
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Saved Addresses</p>

                  <h2 className="text-xl font-bold mt-2">
                    {displayData?.savedAddress || "No address added"}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-full bg-pink-100 flex justify-center items-center">
                  <FaHome className="text-[#8B2954] text-xl" />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      {role === "Customer" ? (
        ""
      ) : (
        <div>
          {data?.store?.subscription?.subscriptionPurchased === false ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-stretch gap-4 px-5">
              {subscription?.map((i, index) => (
                <div
                  key={i?._id || index}
                  className="flex flex-col border border-[#8B2954] rounded-xl overflow-hidden w-full bg-white shadow-sm hover:shadow-lg transition"
                >
                  {/* ================= HEADER ================= */}
                  <div className="bg-[#8B2954] w-full text-center px-4 py-6 text-white">
                    <h1 className="text-3xl uppercase font-semibold">
                      {i?.planName}
                    </h1>

                    <p className="font-light text-sm mt-1">{i?.tagline}</p>

                    <span className="inline-block mt-3 bg-white/20 px-3 py-1 rounded-full text-xs uppercase">
                      {i?.planFor}
                    </span>
                  </div>

                  {/* ================= BODY ================= */}
                  <div className="px-5 py-6 flex flex-col w-full gap-6">
                    {/* ================= PRICE ================= */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex justify-center items-center flex-col gap-2">
                        <div className="flex justify-center items-center gap-3">
                          {i?.price?.discount > 0 && (
                            <span className="text-sm line-through text-gray-400 flex items-center">
                              <FaRupeeSign />
                              {i?.price?.mrp}
                            </span>
                          )}

                          {i?.price?.discount > 0 && (
                            <span className="bg-[#8B2954] text-white px-2 py-1 rounded text-xs">
                              {i?.price?.discount}% OFF
                            </span>
                          )}
                        </div>
                        <span className="text-3xl font-semibold flex justify-center items-center gap-1 italic">
                          <FaRupeeSign />
                          {i?.price?.sellingPrice}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500">
                        ₹{i?.price?.sellingPrice} / month
                      </p>

                      {i?.validity?.months === 0 ? (
                        ""
                      ) : (
                        <p className="text-sm font-semibold text-[#8B2954]">
                          Valid for {i?.validity?.months} months
                        </p>
                      )}

                      <p className="text-xs text-gray-500 capitalize">
                        Renewal: {i?.validity?.renewalType}
                      </p>
                    </div>

                    {/* ================= FEATURES ================= */}
                    <div>
                      <h2 className="font-semibold text-lg mb-2">
                        Plan Features
                      </h2>

                      <div className="space-y-1 text-sm">
                        {i?.features?.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-start gap-2"
                          >
                            <span className="text-[#8B2954] font-bold">✓</span>

                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ================= BOOKING ================= */}
                    <div className="border-t pt-4">
                      <h2 className="font-semibold mb-2">Booking</h2>

                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Status:</strong>{" "}
                          {i?.booking?.enabled ? "Enabled" : "Disabled"}
                        </p>

                        <p>
                          <strong>Advanced Booking:</strong>{" "}
                          {i?.booking?.advancedBooking
                            ? "Available"
                            : "Not Available"}
                        </p>
                      </div>
                    </div>

                    {/* ================= MANAGEMENT TOOLS ================= */}
                    <div className="border-t pt-4">
                      <h2 className="font-semibold mb-2">Management Tools</h2>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <span
                          className={
                            i?.managementTools?.analytics
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ● Analytics
                        </span>

                        <span
                          className={
                            i?.managementTools?.inventory
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ● Inventory
                        </span>

                        <span
                          className={
                            i?.managementTools?.staffAttendance
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ● Staff Attendance
                        </span>

                        <span
                          className={
                            i?.managementTools?.commissionTracking
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ● Commission Tracking
                        </span>
                      </div>
                    </div>

                    {/* ================= MARKETING ================= */}
                    <div className="border-t pt-4">
                      <h2 className="font-semibold mb-2">Marketing</h2>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <span
                          className={
                            i?.marketing?.couponManager
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ● Coupon Manager
                        </span>

                        <span
                          className={
                            i?.marketing?.reviews
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ● Reviews
                        </span>

                        <span
                          className={
                            i?.marketing?.smsWhatsapp
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ● SMS / WhatsApp
                        </span>

                        <span
                          className={
                            i?.marketing?.socialPromotion
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ● Social Promotion
                        </span>
                      </div>
                    </div>

                    {/* ================= MEDIA LIMIT ================= */}
                    <div className="border-t pt-4">
                      <h2 className="font-semibold mb-2">Media Limits</h2>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p>
                          <strong>Photos:</strong>{" "}
                          {i?.mediaLimit?.unlimitedPhotos
                            ? "Unlimited"
                            : i?.mediaLimit?.photos}
                        </p>

                        <p>
                          <strong>Videos:</strong>{" "}
                          {i?.mediaLimit?.unlimitedVideos
                            ? "Unlimited"
                            : i?.mediaLimit?.videos}
                        </p>
                      </div>
                    </div>

                    {/* ================= FRANCHISE ================= */}
                    <div className="border-t pt-4">
                      <h2 className="font-semibold mb-2">Franchise</h2>

                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Enabled:</strong>{" "}
                          {i?.franchise?.enabled ? "Yes" : "No"}
                        </p>

                        <p>
                          <strong>Enquiry Button:</strong>{" "}
                          {i?.franchise?.enquiryButton ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>

                    {/* ================= VISIBILITY ================= */}
                    <div className="border-t pt-4">
                      <h2 className="font-semibold mb-2">Visibility</h2>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <span
                          className={
                            i?.visibility?.featured
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ● Featured
                        </span>

                        <span
                          className={
                            i?.visibility?.verifiedBadge
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          ● Verified Badge
                        </span>
                      </div>
                    </div>

                    {/* ================= SUPPORT ================= */}
                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="font-semibold">Support</span>

                      <span className="capitalize bg-gray-100 px-3 py-1 rounded-full text-xs">
                        {i?.support}
                      </span>
                    </div>

                    {/* ================= FAQ ================= */}
                    <div className="border-t pt-4">
                      <h2 className="font-semibold text-lg mb-3">FAQs</h2>

                      <div className="space-y-3">
                        {i?.faqs?.map((faq, faqIndex) => (
                          <div key={faq?._id || faqIndex} className="text-xs">
                            <p className="font-semibold">
                              {faqIndex + 1}. {faq?.question}
                            </p>

                            <p className="text-gray-600 mt-1">{faq?.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ================= FOOTER ================= */}
                  <div className="bg-[#8B2954] w-full flex flex-col justify-center items-center p-4 gap-3 mt-auto">
                    <div className="text-white text-sm text-center">
                      {i?.validity?.months === 0
                        ? ""
                        : `${i?.validity?.months} months`}
                      {" • "}
                      {i?.validity?.renewalType === "oneTime"
                        ? "One Time Purchase"
                        : i?.validity?.renewalType === "monthly"
                          ? "Monthly Plan"
                          : i?.validity?.renewalType === "yearly"
                            ? "Yearly"
                            : ""}
                    </div>

                    <Button
                      variant="secondary"
                      className="w-full"
                      LabelName={
                        purchasingPlanId === i?._id
                          ? "Opening payment..."
                          : "Get Plan"
                      }
                      onClick={() => purchasePlan(i)}
                      disabled={purchasingPlanId !== null}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col border border-[#8B2954] rounded-xl overflow-hidden w-full bg-white shadow-sm hover:shadow-lg transition">
              {/* ================= HEADER ================= */}
              <div className="bg-[#8B2954] w-full text-center px-4 py-6 text-white">
                <h1 className="text-3xl uppercase font-semibold">
                  {data?.subscription?.planName}{" "}
                  <span className="capitalize bg-green-300 p-2 text-green-700 rounded-full text-xs">
                    Purchased
                  </span>
                </h1>

                <p className="font-light text-sm mt-1">
                  {data?.subscription?.tagline}
                </p>

                <span className="inline-block mt-3 bg-white/20 px-3 py-1 rounded-full text-xs uppercase">
                  {data?.subscription?.planFor}
                </span>
              </div>

              {/* ================= BODY ================= */}
              <div className="px-5 py-6 flex flex-col w-full gap-6">
                {/* ================= PRICE ================= */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex justify-center items-center flex-col gap-2">
                    <div className="flex justify-center items-center gap-3">
                      {data?.subscription?.price?.discount > 0 && (
                        <span className="text-sm line-through text-gray-400 flex items-center">
                          <FaRupeeSign />
                          {data?.subscription?.price?.mrp}
                        </span>
                      )}

                      {data?.subscription?.price?.discount > 0 && (
                        <span className="bg-[#8B2954] text-white px-2 py-1 rounded text-xs">
                          {data?.subscription?.price?.discount}% OFF
                        </span>
                      )}
                    </div>
                    <span className="text-3xl font-semibold flex justify-center items-center gap-1 italic">
                      <FaRupeeSign />
                      {data?.subscription?.price?.sellingPrice}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    ₹{data?.subscription?.price?.sellingPrice} / month
                  </p>

                  {data?.subscription?.validity?.months === 0 ? (
                    ""
                  ) : (
                    <p className="text-sm font-semibold text-[#8B2954]">
                      Valid for {data?.subscription?.validity?.months} months
                    </p>
                  )}

                  <p className="text-xs text-gray-500 capitalize">
                    Renewal: {data?.subscription?.validity?.renewalType}
                  </p>
                </div>

                {/* ================= FEATURES ================= */}
                <div>
                  <h2 className="font-semibold text-lg mb-2">Plan Features</h2>

                  <div className="space-y-1 text-sm">
                    {data?.subscription?.features?.map(
                      (feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-2"
                        >
                          <span className="text-[#8B2954] font-bold">✓</span>

                          <span>{feature}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* ================= BOOKING ================= */}
                <div className="border-t pt-4">
                  <h2 className="font-semibold mb-2">Booking</h2>

                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Status:</strong>{" "}
                      {data?.subscription?.booking?.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </p>

                    <p>
                      <strong>Advanced Booking:</strong>{" "}
                      {data?.subscription?.booking?.advancedBooking
                        ? "Available"
                        : "Not Available"}
                    </p>
                  </div>
                </div>

                {/* ================= MANAGEMENT TOOLS ================= */}
                <div className="border-t pt-4">
                  <h2 className="font-semibold mb-2">Management Tools</h2>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span
                      className={
                        data?.subscription?.managementTools?.analytics
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ● Analytics
                    </span>

                    <span
                      className={
                        data?.subscription?.managementTools?.inventory
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ● Inventory
                    </span>

                    <span
                      className={
                        data?.subscription?.managementTools?.staffAttendance
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ● Staff Attendance
                    </span>

                    <span
                      className={
                        data?.subscription?.managementTools?.commissionTracking
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ● Commission Tracking
                    </span>
                  </div>
                </div>

                {/* ================= MARKETING ================= */}
                <div className="border-t pt-4">
                  <h2 className="font-semibold mb-2">Marketing</h2>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span
                      className={
                        data?.subscription?.marketing?.couponManager
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ● Coupon Manager
                    </span>

                    <span
                      className={
                        data?.subscription?.marketing?.reviews
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ● Reviews
                    </span>

                    <span
                      className={
                        data?.subscription?.marketing?.smsWhatsapp
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ● SMS / WhatsApp
                    </span>

                    <span
                      className={
                        data?.subscription?.marketing?.socialPromotion
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ● Social Promotion
                    </span>
                  </div>
                </div>

                {/* ================= MEDIA LIMIT ================= */}
                <div className="border-t pt-4">
                  <h2 className="font-semibold mb-2">Media Limits</h2>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>
                      <strong>Photos:</strong>{" "}
                      {data?.subscription?.mediaLimit?.unlimitedPhotos
                        ? "Unlimited"
                        : data?.subscription?.mediaLimit?.photos}
                    </p>

                    <p>
                      <strong>Videos:</strong>{" "}
                      {data?.subscription?.mediaLimit?.unlimitedVideos
                        ? "Unlimited"
                        : data?.subscription?.mediaLimit?.videos}
                    </p>
                  </div>
                </div>

                {/* ================= FRANCHISE ================= */}
                <div className="border-t pt-4">
                  <h2 className="font-semibold mb-2">Franchise</h2>

                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Enabled:</strong>{" "}
                      {data?.subscription?.franchise?.enabled ? "Yes" : "No"}
                    </p>

                    <p>
                      <strong>Enquiry Button:</strong>{" "}
                      {data?.subscription?.franchise?.enquiryButton
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>
                </div>

                {/* ================= VISIBILITY ================= */}
                <div className="border-t pt-4">
                  <h2 className="font-semibold mb-2">Visibility</h2>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span
                      className={
                        data?.subscription?.visibility?.featured
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ● Featured
                    </span>

                    <span
                      className={
                        data?.subscription?.visibility?.verifiedBadge
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ● Verified Badge
                    </span>
                  </div>
                </div>

                {/* ================= SUPPORT ================= */}
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-semibold">Support</span>

                  <span className="capitalize bg-gray-100 px-3 py-1 rounded-full text-xs">
                    {data?.subscription?.support}
                  </span>
                </div>

                {/* ================= FAQ ================= */}
                <div className="border-t pt-4">
                  <h2 className="font-semibold text-lg mb-3">FAQs</h2>

                  <div className="space-y-3">
                    {data?.subscription?.faqs?.map((faq, faqIndex) => (
                      <div key={faq?._id || faqIndex} className="text-xs">
                        <p className="font-semibold">
                          {faqIndex + 1}. {faq?.question}
                        </p>

                        <p className="text-gray-600 mt-1">{faq?.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ================= FOOTER ================= */}
              <div className="bg-[#8B2954] w-full flex flex-col justify-center items-center p-4 gap-3 mt-auto">
                <div className="text-white text-sm text-center">
                  {data?.subscription?.validity?.months === 0
                    ? ""
                    : `${data?.subscription?.validity?.months} months`}
                  {" • "}
                  {data?.subscription?.validity?.renewalType === "oneTime"
                    ? "One Time Purchase"
                    : data?.subscription?.validity?.renewalType === "monthly"
                      ? "Monthly Plan"
                      : data?.subscription?.validity?.renewalType === "yearly"
                        ? "Yearly"
                        : ""}
                </div>

                {/* <Button
              variant="secondary"
              className="w-full"
              LabelName={
                purchasingPlanId === data?.subscription?._id
                  ? "Opening payment..."
                  : "Get Plan"
              }
              onClick={() => purchasePlan(i)}
              disabled={purchasingPlanId !== null}
            /> */}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SavedAddress = ({ data, role, userId, handleReload, callData }) => {
  const formRef = useRef();
  const [showForm, setShowForm] = useState(false);
  const { alertInfo, alertSuccess, alertError } = useToast();
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    callData();
  }, []);

  const addNewAddress = async (e) => {
    e.preventDefault();
    if (coordinates.longitude === null || coordinates.latitude === null) {
      alertError("Unable to fetch location, please try again !");
      return;
    }
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `${role}/update/add-address/${userId}`,
        "post",
        formData,
      );
      setShowForm(false);
      formRef.current.reset();
      alertSuccess(response.data.message);
      setCoordinates({ latitude: null, longitude: null });
      handleReload();
    } catch (err) {
      alertError(err.response.data);
    }
  };

  const deleteCurrentAddress = async ({ addressId }) => {
    try {
      const response = await FetchData(
        `${role}/update/delete-address/${addressId}/${userId}`,
        "delete",
      );
      alertSuccess(response.data.message);
      handleReload();
    } catch (err) {
      alertError(err.response.data);
    }
  };

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Saved Addresses</h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage your delivery and service locations.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#8B2954] text-white px-5 py-2 rounded-lg hover:bg-[#732247] transition"
        >
          <FaPlus />
          Add Address
        </button>
      </div>

      {Array.isArray(data) ? (
        <div className="grid lg:grid-cols-3 gap-5 pb-40 md:pb-20 lg:pb-0">
          {data?.map((d, index) => (
            <div key={index} className="">
              <div className="h-full bg-white rounded-2xl shadow-md border border-gray-200 p-3 hover:shadow-lg transition w-full md:text-xs">
                {/* Top */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex justify-center items-center text-[#8B2954] text-xl">
                      {d?.icon || <FaUser />}
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">
                        {d?.addressType || "Na"}
                      </h2>
                      {d?.defaultAddress && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <FaMapMarkerAlt className="text-[#8B2954] text-xl" />
                </div>
                {/* Details */}
                <div className="mt-5">
                  <h3 className="font-semibold text-gray-800">
                    {d?.contactDetails?.name} | {d?.contactDetails?.contact}
                  </h3>
                  <p className="text-gray-500 heading">Your Address: </p>
                </div>
                <p className="text-gray-600 leading-5">
                  {d?.flatNumber} {d?.floor} {d?.block}, {d?.societyName} <br />{" "}
                  {d?.street1} {d?.street2 ? d?.street2 : ""} <br />
                  {d?.area}, near {d.locality} <br />{" "}
                  {d?.sector ? <span>Sector: {d?.sector}</span> : ""} <br />
                  {d?.city}, {d?.state}
                  <br />{" "}
                  <span className="heading">
                    {d?.country}
                    {d?.pincode ? -d?.pincode : ""}
                  </span>
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => deleteCurrentAddress({ addressId: d?._id })}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}

      <Popup isOpen={showForm} onClose={() => setShowForm(false)}>
        <form
          ref={formRef}
          onSubmit={addNewAddress}
          className="flex-col flex justify-start items-start w-full md:w-[90vw] md:h-[90vh] overflow-scroll pb-20"
        >
          <h1 className="heading text-3xl">Add address</h1>
          <div className="flex flex-col lg:flex-row justify-center items-start w-full h-full relative gap-5">
            <div className="w-full lg:w-1/2 h-[30vh] lg:h-full sticky top-0 left-0">
              <AddressMap setCoordinates={setCoordinates} />
            </div>
            {/* {coordinates.latitude === "" && coordinates.longitude === "" ? } */}
            <div className="w-full lg:w-1/2 h-full">
              <div className="grid md:grid-cols-2 gap-1 w-full">
                <InputBox label="Flat / House Number" name="flatNumber" />
                <InputBox label="floor" name="floor" required={false} />
                <InputBox label="block" name="block" required={false} />
                <InputBox
                  label="society name"
                  name="societyName"
                  required={false}
                />
                <InputBox label="street 1" name="street1" />
                <InputBox label="street 2" name="street2" required={false} />
                <InputBox label="area" name="area" />
                <InputBox label="landmark" name="locality" />
                <InputBox label="sector" name="sector" required={false} />
                <InputBox label="city" name="city" />
                <InputBox label="state" name="state" />
                <InputBox label="country" name="country" />
                <InputBox label="pincode" name="pincode" />
                <InputBox
                  label="country"
                  name="lng"
                  value={coordinates?.longitude}
                  className="hidden"
                  labelClassName="hidden"
                />
                <InputBox
                  label="country"
                  name="lat"
                  value={coordinates?.latitude}
                  className="hidden"
                  labelClassName="hidden"
                />
                <div
                  className={`w-full border h-0 col-span-2 border-neutral-200 ${role === "customer" || "Customer" ? "block" : "hidden"}`}
                />
                <InputBox
                  required={false}
                  label="name"
                  name="name"
                  labelClassName={`${role === "Customer" ? "block" : "hidden"}`}
                  className={`${role === "Customer" ? "block" : "hidden"}`}
                />
                <InputBox
                  required={false}
                  label="contact"
                  name="contact"
                  labelClassName={`${role === "Customer" ? "block" : "hidden"}`}
                  className={`${role === "Customer" ? "block" : "hidden"}`}
                />
                <div
                  className={`w-full py-3 ${role === "customer" || "Customer" ? "block" : "hidden"}`}
                >
                  <label
                    htmlFor={name}
                    className={`block text-sm font-medium text-gray-700 mb-2 capitalize`}
                  >
                    Address type<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="addressType"
                    // value={}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-neutral-50 text-gray-700 outline-none focus:ring-1 focus:ring-[#8B2954] focus:border-[#8B2954] transition hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  >
                    <option value="">Select</option>
                    {role === "Customer"
                      ? ["Home", "Friend's", "Others"].map((i, index) => (
                          <option key={index} value={i}>
                            {index + 1}. {i}
                          </option>
                        ))
                      : ["Address 1", "Address 2", "Address 3", "Others"].map(
                          (i, index) => (
                            <option key={index} value={i}>
                              {index + 1}. {i}
                            </option>
                          ),
                        )}
                  </select>
                </div>
              </div>
              <div className="flex justify-center items-center gap-10 ">
                <Button LabelName="Submit" type="submit" />
              </div>
            </div>
          </div>
        </form>
      </Popup>
    </div>
  );
};

const BankingDetails = ({ data, role, userId, handleReload, callData }) => {
  const [showForm, setShowForm] = useState(false);
  const { alertInfo, alertSuccess, alertError } = useToast();
  const formRef = useRef();
  const bankId = data?._id;

  useEffect(() => {
    callData();
  }, []);

  const addBank = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `${role}/update/add-bank-details/${userId}`,
        "post",
        formData,
      );
      alertSuccess(response.data.message);
      setShowForm(false);
      formRef.current.reset();
      handleReload();
    } catch (err) {
      alertError(err.response.data);
    }
  };

  const deleteBankDetails = async () => {
    try {
      const response = await FetchData(
        `${role}/update/delete-bank-details/${bankId}/${userId}`,
        "delete",
      );
      alertSuccess(response.data.message);
      handleReload();
    } catch (err) {
      alertError(err.response.data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Banking Details</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your bank account and payment methods.
          </p>
        </div>

        {data ? (
          ""
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#8B2954] text-white px-5 py-2 rounded-lg hover:bg-[#742247] transition"
          >
            <FaPlus />
            Add Bank
          </button>
        )}
      </div>

      {data ? (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-[#8B2954]">
                <FaUniversity size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold capitalize">
                  {data?.accountDetails?.bankName || "State Bank of India"}
                </h2>
                <p className="text-gray-500 capitalize">
                  {data?.accountDetails?.branchName ||
                    "Personal Banking Branch"}
                </p>
              </div>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              Verified
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <p className="text-sm text-gray-500">Account Holder</p>
              <h3 className="font-semibold capitalize">
                {data?.accountDetails?.accountHolderName || "Na"}
              </h3>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Number</p>
              <h3 className="font-semibold capitalize">
                {/* {data?.accountDetails?.accountNumber || "Na"} */}
                {formatAccountNumberDisplay(
                  data?.accountDetails?.accountNumber,
                ) || "Na"}
              </h3>
            </div>
            <div>
              <p className="text-sm text-gray-500">IFSC Code</p>
              <h3 className="font-semibold uppercase">
                {data?.accountDetails?.ifscCode || "Na"}
              </h3>
            </div>
          </div>

          {/* UPI */}
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center gap-3 mb-2">
              <FaMobileAlt className="text-[#8B2954]" />

              <h3 className="font-semibold text-lg">UPI Details</h3>
            </div>

            <p className="text-gray-600">{data?.accountDetails?.upi || "Na"}</p>
          </div>
          {/* Actions */}
          <div className="flex justify-end ">
            <button
              onClick={() => deleteBankDetails()}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
            >
              <FaTrash />
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1>No data found please add bank account</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#8B2954] text-white px-5 py-2 rounded-lg hover:bg-[#742247] transition"
          >
            <FaPlus />
            Add Bank
          </button>
        </div>
      )}
      <Popup isOpen={showForm} onClose={() => setShowForm(false)}>
        <form
          ref={formRef}
          onSubmit={addBank}
          className="flex-col flex justify-center items-center w-full md:w-[70vw] pb-20"
        >
          <h1 className="heading text-3xl">Add bank account</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <InputBox label="Bank name" name="bankName" />
            <InputBox label="Branch name" name="branchName" />
            <InputBox label="Account holder name" name="accountHolderName" />
            <InputBox label="Account number" name="accountNumber" />
            <InputBox
              label="confirm account number"
              name="confirmAccountNumber"
            />
            <InputBox label="ifsc code" name="ifscCode" />
            <InputBox label="UPI Id" name="upiID" />
          </div>
          <div className="flex justify-center items-center gap-10 ">
            <Button LabelName="Submit" type="submit" />
          </div>
        </form>
      </Popup>
      {/* {showForm && (
        <div>
          <form className="flex-col flex justify-center items-center w-full md:w-[70vw]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputBox label="Bank name" name="bankName" />
              <InputBox label="Branch name" name="branchName" />
              <InputBox label="Account holder name" name="accountHolderName" />
              <InputBox label="Account number" name="accountNumber" />
              <InputBox
                label="confirm account number"
                name="confirmAccountNumber"
              />
              <InputBox label="ifsc code" name="ifscCode" />
            </div>
            <div className="flex justify-center items-center gap-10 ">
              <Button LabelName="Cancel" variant="Secondary" />
              <Button LabelName="Submit" />
            </div>
          </form>
        </div>
      )} */}
    </div>
  );
};

const StoreStaffs = ({ data, role, userId, handleReload, callData }) => {
  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const { alertInfo, alertSuccess, alertError } = useToast();
  const formRef = useRef();
  const bankId = data?._id;

  useEffect(() => {
    callData();
  }, []);

  const addBank = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `${role}/update/add-store-staff/${userId}`,
        "post",
        formData,
        true,
      );
      alertSuccess(response.data.message);
      setShowForm(false);
      formRef.current.reset();
      handleReload();
    } catch (err) {
      alertError(err.response.data);
    }
  };

  const deleteBankDetails = async () => {
    try {
      const response = await FetchData(
        `${role}/update/delete-bank-details/${bankId}/${userId}`,
        "delete",
      );
      alertSuccess(response.data.message);
      handleReload();
    } catch (err) {
      alertError(err.response.data);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Store Staffs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your Store Staffs here.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#8B2954] text-white px-5 py-2 rounded-lg hover:bg-[#742247] transition"
          >
            <FaPlus />
            Add Staff
          </button>
        </div>
      </div>

      {Array.isArray(data) ? (
        <div>
          {data?.map((data, index) => (
            <div className="w-full bg-white rounded-xl flex  md:flex-row flex-col justify-between items-center shadow-md md:px-6 py-4 border border-gray-200 ">
              <div className="md:w-[52vw] flex  md:flex-row md:justify-center md:items-center md:gap-8 gap-6">
                {/* images */}
                <div className="md:w-40 md:h-38 h-16 w-22 rounded-full overflow-hidden border border-gray-300">
                  <img
                    src={data?.profileImage?.url || NonGenderSvg}
                    alt={data?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Store staff details */}
                <div className="md:w-[40vw] w-full grid md:grid-cols-2 grid-cols-1 md:gap-20 gap-2 ">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">{data?.name || "Na"}</h2>

                    <p className="text-gray-500">{data?.role}</p>

                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-[#8B2954] " />
                      <span>{data?.email || "na"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaMobileAlt className="text-[#8B2954]" />
                      <span>{data?.contactNumber || "na"}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <FaUserTie className="text-[#8B2954]" />
                      <span>{data?.designation || "na"}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaStar className="text-[#8B2954]" />
                      <span>{data?.specialization || " na"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaBriefcase className="text-[#8B2954]" />
                      <span>{data?.experience || "na"}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* buttons status */}
              <div className="w-full h-full flex flex-col  items-center justify-center gap-4 mt-6 p-4 lg:mt-0">
                <button
                  className={` md:w-40 md:h-8 w-full h-full px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2
              ${data?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  <MdOutlineVerified />
                  {data?.isActive ? "Active" : "Inactive"}
                </button>

                <button
                  className={`md:w-40 md:h-8 w-full h-full px-4 py-2 rounded-full text-sm font-medium
                ${data?.isVerified ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
                >
                  {data?.isVerified ? "Verified" : "Not Verified"}
                </button>

                <button
                  className={`md:w-40 md:h-8 h-full w-full px-4 py-2 rounded-full text-sm font-medium
              ${
                data?.kycComplete
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
                >
                  {data?.kycComplete ? "KYC Complete" : "KYC Pending"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h1>No data found please add staffs</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#8B2954] text-white px-5 py-2 rounded-lg hover:bg-[#742247] transition"
          >
            <FaPlus />
            Add Staff
          </button>
        </div>
      )}
      <Popup isOpen={showForm} onClose={() => setShowForm(false)}>
        <div className="flex justify-start items-start h-screen w-full overflow-scroll">
          {" "}
          <form
            ref={formRef}
            onSubmit={addBank}
            className="flex-col flex justify-start items-start w-full md:w-[90vw] md:h-[90vh] overflow-scroll"
          >
            <h1 className="heading text-3xl">Add Store Staff</h1>
            <div className="flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              <InputBox label="name" name="name" type="text" required={false} />
              <InputBox
                label="contact number"
                required={false}
                name="contactNumber"
                type="text"
              />
              <InputBox
                label="email"
                name="email"
                type="text"
                required={false}
              />
              <InputBox
                label="designation"
                name="designation"
                type="text"
                required={false}
              />
              <InputBox
                label="experience"
                name="experience"
                type="text"
                required={false}
              />
              <InputBox
                required={false}
                label="specialization"
                name="specialization"
                type="text"
                placeholder="Mention the best work of your staff."
              />
              <div className="col-span-2 w-full h-1 bg-neutral-200" />
              <InputBox
                required={false}
                label="Profile Picture"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg"
                />
              )}
              <div className="col-span-2 w-full h-1 bg-neutral-200" />
              <div className="col-span-2 lg:grid lg:grid-cols-4 gap-2">
                <h1 className="col-span-4 capitalize">address</h1>
                <InputBox
                  label="Flat / House Number"
                  name="flatNumber"
                  required={false}
                />
                <InputBox label="floor" name="floor" required={false} />
                <InputBox label="block" name="block" required={false} />
                <InputBox
                  label="society name"
                  name="societyName"
                  required={false}
                />
                <InputBox label="street 1" name="street1" required={false} />
                <InputBox label="street 2" name="street2" required={false} />
                <InputBox label="area" name="area" required={false} />
                <InputBox label="landmark" name="locality" required={false} />
                <InputBox label="sector" name="sector" required={false} />
                <InputBox label="city" name="city" required={false} />
                <InputBox label="state" name="state" required={false} />
                <InputBox label="country" name="country" required={false} />
                <InputBox label="pincode" name="pincode" required={false} />
              </div>
            </div>
            <div className="flex justify-center items-center gap-10 ">
              <Button LabelName="Submit" type="submit" />
            </div>
          </form>
        </div>
      </Popup>
    </div>
  );
};

const PaymentDetails = ({ data, role, userId, handleReload, callData }) => {
  const paymentList = Array.isArray(data) ? data : [];

  useEffect(() => {
    callData();
  }, []);

  return (
    <div className="space-y-5 w-full pb-40 md:pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Payment Details
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            All successful and pending payment activity for your account.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-5 py-3 font-medium">Transaction ID</th>
                <th className="px-5 py-3 font-medium">Module</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {paymentList.length ? (
                paymentList.map((payment) => (
                  <tr key={payment._id} className="border-b last:border-b-0">
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {payment.transactionNumber || "-"}
                    </td>
                    <td className="px-5 py-3 capitalize">
                      {payment.module || "-"}
                    </td>
                    <td className="px-5 py-3">
                      ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          payment.paymentStatus === "Captured"
                            ? "bg-green-100 text-green-700"
                            : payment.paymentStatus === "Failed"
                              ? "bg-red-100 text-red-700"
                              : payment.paymentStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {payment.paymentStatus || "-"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleString("en-IN")
                        : "-"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {payment.remarks || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    No payment details found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Booking = ({ data, role, userId, handleReload, callData }) => {
  useEffect(() => {
    callData();
  }, []);

  return (
    <div className="space-y-6 h-full">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>

        <p className="text-gray-500 mt-1">
          View and manage all your beauty service bookings.
        </p>
      </div>
      {/* Cards */}
      {Array.isArray(data) ? (
        <div className="space-y-5 pb-40 md:pb-20 lg:pb-0">
          {data?.map((booking, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-200"
            >
              {/* Top */}

              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {booking?.service?.name}
                  </h2>

                  <p className="text-gray-500">{booking?.store?.storeName}</p>
                </div>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium
                  ${
                    booking?.dateForBooking < Date.now()
                      ? "bg-yellow-100 text-yellow-700"
                      : booking.dateForBooking === Date.now()
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-yellow-600"
                  }
                  `}
                >
                  {booking?.dateForBooking > Date.now() ? "Today" : "Upcoming"}
                </span>
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-5 mt-6">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-[#8B2954]" />
                  {formatDateString(booking?.dateForBooking)}
                </div>

                <div className="flex items-center gap-3">
                  <FaClock className="text-[#8B2954]" />
                  {booking?.service?.duration || "--"} min
                </div>

                {/* <div className="flex items-center gap-3">
                  <FaUserTie className="text-[#8B2954]" />
                  {booking.professional}
                </div> */}

                <div className="flex items-center gap-3 heading">
                  <FaMapMarkerAlt className="text-[#8B2954]" />
                  {booking?.address?.city}, {booking?.address?.state}
                </div>

                <div className="flex items-center gap-3 heading">
                  <FaRupeeSign className="text-[#8B2954]" />{" "}
                  {booking?.bookingAmount || "--"}
                </div>
              </div>

              {/* Buttons */}

              <div className="flex flex-wrap gap-3 mt-8">
                {booking.status === "Upcoming" && (
                  <button className="flex items-center gap-2 bg-red-100 text-red-600 px-5 py-2 rounded-lg hover:bg-red-200">
                    <FaTimesCircle />
                    Cancel Booking
                  </button>
                )}

                {booking.status === "Completed" && (
                  <button className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-5 py-2 rounded-lg hover:bg-yellow-200">
                    <FaStar />
                    Rate & Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const FavoriteStore = ({ data, role }) => {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">Favorite Stores</h1>

        <p className="text-gray-500 mt-1">
          Your saved salons and beauty studios.
        </p>
      </div>

      {/* Store List */}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
          {/* Image */}

          <img
            src={`https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500`}
            className="w-full h-52 object-cover"
          />

          {/* Content */}

          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">
                  {data?.name || "Glow Beauty Studio"}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <FaStar className="text-yellow-400" />
                  <span>{data?.rating || "2.1k"}</span>
                  <span className="text-gray-500">
                    ({data?.reviews || "4.5"} Reviews)
                  </span>
                </div>
              </div>

              <button className="text-red-500 hover:text-red-600">
                <FaHeart size={22} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <FaMapMarkerAlt className="text-[#8B2954]" />
                {data?.location || "Ranchi"}
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <FaClock className="text-[#8B2954]" />
                {data?.timing || "4:00"}
              </div>
            </div>

            {/* Buttons */}

            <div className="flex gap-3 mt-6">
              <button className="flex-1 flex items-center justify-center gap-2 border border-[#8B2954] text-[#8B2954] py-2 rounded-lg hover:bg-[#8B2954] hover:text-white transition">
                <FaEye />
                View
              </button>

              <button className="flex-1 flex items-center justify-center gap-2 bg-[#8B2954] text-white py-2 rounded-lg hover:bg-[#742247] transition">
                <FaCalendarCheck />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FavoriteProfessional = ({ data, role }) => {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Favorite Professionals
        </h1>

        <p className="text-gray-500 mt-1">
          Your trusted beauty experts, all in one place.
        </p>
      </div>

      {/* Professional Cards */}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6">
          <div className="flex gap-5">
            {/* Image */}

            <img
              src={
                data?.image ||
                `https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500`
              }
              className="w-28 h-28 rounded-full object-cover "
            />

            {/* Details */}

            <div className="flex-1">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">
                  {data?.name || "Prachi Sharma"}
                </h2>

                <button className="text-red-500 hover:text-red-600">
                  <FaHeart size={22} />
                </button>
              </div>

              <p className="text-[#8B2954] font-medium mt-1">
                {data?.specialization || "Bridal Makeup Artist"}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <FaStar className="text-yellow-400" />
                <span>{data?.rating || "4.9"}</span>

                <span className="text-gray-500">
                  ({data?.reviews || "1.8k"} Reviews)
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3 text-gray-600">
                <FaBriefcase className="text-[#8B2954]" />
                {data?.experience || "7 years"} Experience
              </div>

              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <FaDatabase className="text-[#8B2954]" />
                {data?.store || "Glow Beauty Studio"}
              </div>
            </div>
          </div>

          {/* Buttons */}

          <div className="flex gap-3 mt-6">
            <button className="flex-1 flex items-center justify-center gap-2 border border-[#8B2954] text-[#8B2954] py-2 rounded-lg hover:bg-[#8B2954] hover:text-white transition">
              <FaEye />
              View Profile
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 bg-[#8B2954] text-white py-2 rounded-lg hover:bg-[#742247] transition">
              <FaCalendarCheck />
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Services = ({ data, role, userId, handleReload, callData }) => {
  const normalizedRole = (role || "").toLowerCase();
  const isCustomer = normalizedRole === "customer";
  const isStore = normalizedRole === "store";

  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [storeStaffList, setStoreStaffList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [priceData, setPriceData] = useState({
    mrp: "",
    discount: "",
    sellingPrice: "",
  });
  const [products, setProducts] = useState([
    {
      productType: "",
      brand: "",
    },
  ]);
  const [serviceInclusion, setServiceInclusion] = useState([""]);
  const [serviceExclusion, setServiceExclusion] = useState([""]);
  const [serviceRequirements, setServiceRequirements] = useState([""]);
  const [editingService, setEditingService] = useState(null);
  const { alertInfo, alertSuccess, alertError } = useToast();
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const resetServiceForm = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setPriceData({ mrp: "", discount: "", sellingPrice: "" });
    setProducts([{ productType: "", brand: "" }]);
    setServiceInclusion([""]);
    setServiceExclusion([""]);
    setServiceRequirements([""]);
    setImage(null);
    setImagePreview([]);
    setEditingService(null);
    formRef.current?.reset();
  };

  const populateServiceForm = (service) => {
    if (!service || !formRef.current) return;

    const form = formRef.current;
    const setFieldValue = (name, value) => {
      const input = form.querySelector(`[name="${name}"]`);
      if (input) input.value = value ?? "";
    };

    setFieldValue("name", service?.name || "");
    setFieldValue("duration", service?.duration || "");
    setFieldValue("prepTime", service?.prepTime || "");
    setFieldValue("bookingFrom", service?.bookingAcceptingHours?.from || "");
    setFieldValue("bookingTill", service?.bookingAcceptingHours?.till || "");
    setFieldValue("serviceFor", service?.serviceFor || "Both");
    setFieldValue(
      "bookingDays",
      service?.bookingDays || "Whole week (All 7 days)",
    );
    setFieldValue("serviceArea", service?.serviceArea || "Inside city");

    setSelectedCategory(service?.category?._id || service?.category || "");
    setSelectedSubcategory(service?.subcategory || "");
    setPriceData({
      mrp: service?.price?.mrp ?? "",
      discount: service?.price?.discount ?? "",
      sellingPrice: service?.price?.sellingPrice ?? "",
    });
    setProducts(
      Array.isArray(service?.products) && service.products.length
        ? service.products
        : [{ productType: "", brand: "" }],
    );
    setServiceInclusion(
      Array.isArray(service?.serviceInclusion) &&
        service.serviceInclusion.length
        ? service.serviceInclusion
        : [""],
    );
    setServiceExclusion(
      Array.isArray(service?.serviceExclusion) &&
        service.serviceExclusion.length
        ? service.serviceExclusion
        : [""],
    );
    setServiceRequirements(
      Array.isArray(service?.serviceRequirements) &&
        service.serviceRequirements.length
        ? service.serviceRequirements
        : [""],
    );

    if (form.querySelector('input[name="onSite"]')) {
      form.querySelector('input[name="onSite"]').checked = !!service?.onSite;
    }
    if (form.querySelector('input[name="inHouse"]')) {
      form.querySelector('input[name="inHouse"]').checked = !!service?.inHouse;
    }
    if (form.querySelector('input[name="isPrepTime"]')) {
      form.querySelector('input[name="isPrepTime"]').checked =
        !!service?.isPrepTime;
    }
    if (form.querySelector('input[name="timeIncludingPrepTime"]')) {
      form.querySelector('input[name="timeIncludingPrepTime"]').checked =
        !!service?.timeIncludingPrepTime;
    }
    if (form.querySelector('select[name="executive"]')) {
      form.querySelector('select[name="executive"]').value =
        service?.executive?._id || service?.executive || "";
    }
  };

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        productType: "",
        brand: "",
      },
    ]);
  };

  const removeProduct = (index) => {
    if (products.length === 1) return;

    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  useEffect(() => {
    callData();
  }, []);

  const addInclusion = () => {
    setServiceInclusion((prev) => [...prev, ""]);
  };

  const addExclusion = () => {
    setServiceExclusion((prev) => [...prev, ""]);
  };

  const addRequirement = () => {
    setServiceRequirements((prev) => [...prev, ""]);
  };

  const handleRequirement = (index, value) => {
    const updated = [...serviceRequirements];
    updated[index] = value;
    setServiceRequirements(updated);
  };

  const handleExclusion = (index, value) => {
    const updated = [...serviceExclusion];
    updated[index] = value;
    setServiceExclusion(updated);
  };

  const handleInclusion = (index, value) => {
    const updated = [...serviceInclusion];
    updated[index] = value;
    setServiceInclusion(updated);
  };

  const removeInclusion = (index) => {
    if (serviceInclusion.length === 1) return;

    setServiceInclusion((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExclusion = (index) => {
    if (serviceExclusion.length === 1) return;

    setServiceExclusion((prev) => prev.filter((_, i) => i !== index));
  };

  const removeRequirement = (index) => {
    if (serviceRequirements.length === 1) return;

    setServiceRequirements((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const getAllStoreStaff = async () => {
      try {
        const response = await FetchData(
          `${normalizedRole}/get/staff-for-service/store-staff/${userId}`,
          "get",
        );
        setStoreStaffList(response.data.data);
      } catch (err) {}
    };

    const getAllCategories = async () => {
      try {
        const response = await FetchData(
          "category-subcategory/get/categories/all",
          "get",
        );

        setCategories(response.data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        alertError(
          err?.response?.data?.message || "Unable to fetch categories",
        );
      }
    };

    getAllStoreStaff();
    getAllCategories();
  }, []);

  const addService = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(formRef.current);
      formData.append(
        "serviceData",
        JSON.stringify({
          products,
          serviceInclusion: serviceInclusion.filter((i) => i.trim()),
          serviceExclusion: serviceExclusion.filter((i) => i.trim()),
          serviceRequirements: serviceRequirements.filter((i) => i.trim()),
        }),
      );

      const endpoint = editingService
        ? `services/update/service/${editingService._id}`
        : `services/add/service/${normalizedRole}/${userId}`;

      const response = await FetchData(endpoint, "post", formData, true);
      alertSuccess(response.data.message);
      setShowForm(false);
      resetServiceForm();
      handleReload();
    } catch (err) {
      alertError(err.response?.data?.message || "Unable to save service");
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (service) => {
    if (!service?._id) return;

    try {
      const response = await FetchData(
        `services/delete/service/${service._id}`,
        "delete",
      );
      alertSuccess(response.data.message);
      handleReload();
    } catch (err) {
      alertError(err.response?.data?.message || "Unable to delete service");
    }
  };

  const handleEditService = (service) => {
    if (!service?._id) return;

    setEditingService(service);
    setShowForm(true);

    setTimeout(() => {
      populateServiceForm(service);
    }, 0);
  };

  const handleImage = (e) => {
    const fileList = e?.target?.files;
    if (!fileList || !fileList.length) return;

    const file = Array.from(fileList);
    if (file.length > 5) {
      alert("Maximum 5 images allowed");
      e.target.value = "";
      return;
    }

    setImage(file);
    setImagePreview(file?.map((f) => URL.createObjectURL(f)));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
      ...priceData,
      [name]: value,
    };

    const mrp = parseFloat(updatedData.mrp) || 0;
    const discount = parseFloat(updatedData.discount) || 0;

    if (mrp > 0 && discount >= 0) {
      updatedData.sellingPrice = (mrp - (mrp * discount) / 100).toFixed(2);
    } else {
      updatedData.sellingPrice = "";
    }

    setPriceData(updatedData);
  };

  return (
    <div className="space-y-6 w-full h-full overflow-scroll relative">
      {isCustomer ? (
        <div className="flex flex-col md:flex-row justify-between items-start gap-2 md:items-center sticky top-0 left-0 z-10 bg-white">
          <h1 className="text-3xl font-bold">
            Services <span className="text-sm">({data?.service?.length})</span>
          </h1>
          <input
            placeholder="Search Service..."
            className="border rounded-lg px-4 py-2"
          />
        </div>
      ) : (
        <div>
          {isStore &&
          data?.store?.subscription?.subscriptionPurchased === true ? (
            <div className="flex flex-col md:flex-row justify-between items-start gap-2 md:items-center sticky top-0 left-0 z-10 bg-white">
              <h1 className="text-3xl font-bold">
                Services{" "}
                <span className="text-sm">({data?.service?.length})</span>
              </h1>
              <Button
                LabelName="Add New Service"
                onClick={() => setShowForm(true)}
              />
              <input
                placeholder="Search Service..."
                className="border rounded-lg px-4 py-2"
              />
            </div>
          ) : (
            "Please select a plan to add services"
          )}
        </div>
      )}

      <div className="w-full">
        {Array.isArray(data?.service) ? (
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2 w-full place-items-center">
            {data.service.filter(Boolean).map((service, index) => (
              <StoreServiceCard
                key={service?._id || index}
                service={service}
                onEdit={handleEditService}
                onDelete={deleteService}
              />
            ))}
          </div>
        ) : (
          <span>No service listed kindly list service</span>
        )}
      </div>
      <Popup
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          resetServiceForm();
        }}
      >
        <div className="flex justify-start items-start h-screen w-full overflow-scroll pb-40">
          {" "}
          <form
            ref={formRef}
            onSubmit={addService}
            className="flex-col flex justify-start items-start w-full md:w-[90vw] md:h-[90vh] overflow-scroll no-scrollbar"
          >
            <h1 className="heading text-3xl">
              {editingService ? "Edit Service" : "Add Service"}
            </h1>
            <div className="flex flex-col gap-4 w-full">
              <div>
                <h2 className="text-2xl font-semibold text-[#8B2954] mb-5">
                  Basic Details
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <InputBox label="Service Name" name="name" />

                  {/* <InputBox
                    label=""
                    name="charges"
                    type="number"
                  /> */}
                  <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-5">
                    <InputBox
                      name="mrp"
                      type="number"
                      label="Charges"
                      onChange={handlePriceChange}
                      value={priceData.mrp}
                    />
                    <InputBox
                      name="discount"
                      type="number"
                      label="Discount (in %)"
                      onChange={handlePriceChange}
                      value={priceData.discount}
                      required={false}
                    />
                    <InputBox
                      name="sellingPrice"
                      type="number"
                      label="Discounted Price"
                      value={priceData.sellingPrice}
                      // Disabled={true}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Category
                        <span className="text-red-500">*</span>
                      </label>

                      <select
                        name="category"
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);

                          // Whenever category changes,
                          // remove previously selected subcategory.
                          setSelectedSubcategory("");
                        }}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-neutral-50 text-gray-700 outline-none focus:ring-1 focus:ring-[#8B2954] focus:border-[#8B2954] transition hover:shadow-md"
                      >
                        <option value="">Select Category</option>

                        {categories
                          ?.filter(
                            (category) =>
                              category.status === "Verified" &&
                              category.isActive === true,
                          )
                          ?.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.title}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Subcategory
                        <span className="text-red-500">*</span>
                      </label>

                      <select
                        name="subcategory"
                        value={selectedSubcategory}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                        required
                        disabled={!selectedCategory}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-neutral-50 text-gray-700 outline-none focus:ring-1 focus:ring-[#8B2954] focus:border-[#8B2954] transition hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {!selectedCategory
                            ? "Select category first"
                            : "Select Subcategory"}
                        </option>

                        {categories
                          ?.find(
                            (category) => category._id === selectedCategory,
                          )
                          ?.subcategories?.filter(
                            (subcategory) =>
                              subcategory.status === "Verified" &&
                              subcategory.isActive === true,
                          )
                          ?.map((subcategory) => (
                            <option
                              key={subcategory._id}
                              value={subcategory._id}
                            >
                              {subcategory.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <InputBox
                    required={false}
                    label="Duration (Minutes)"
                    name="duration"
                    type="number"
                  />
                </div>
              </div>
              <InputBox
                name="description"
                label="Service description"
                textarea={true}
                required={false}
              />
              <div className="w-full justify-center items-center flex uppercase text-sm text-red-700 font-semibold">
                Or fill the below details
              </div>
              <div className="w-full col-span-2 bg-neutral-200 h-1 rounded-full" />
              {isStore && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#8B2954] mb-5">
                    Service Provider{" "}
                    <span className="text-base text-black">(Optional)</span>
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-medium">
                        Executive
                      </label>

                      <select
                        name="executive"
                        className="w-full border rounded-lg px-4 py-2"
                        required={false}
                      >
                        <option value="">Select Staff</option>
                        {storeStaffList?.map((item) => (
                          <option key={item._id} value={item._id}>
                            <>
                              Name: {item.name} ({item.designation})
                              (Specialization: {item.specialization})
                            </>
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              <div className="w-full col-span-2 bg-neutral-200 h-1 rounded-full" />
              <div>
                <h2 className="text-2xl font-semibold text-[#8B2954] mb-5">
                  Service Timing{" "}
                  <span className="text-base text-black">(Optional)</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <InputBox
                    required={false}
                    label="Preparation Time (Minutes)"
                    name="prepTime"
                    type="number"
                  />

                  <div className="flex flex-col justify-end gap-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="isPrepTime"
                        defaultChecked
                        required={false}
                      />
                      Preparation Required
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="timeIncludingPrepTime"
                        required={false}
                      />
                      Duration Includes Preparation
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-full col-span-2 bg-neutral-200 h-1 rounded-full" />
              <div>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-semibold text-[#8B2954]">
                    Products Used{" "}
                    <span className="text-base text-black">(Optional)</span>
                  </h2>

                  <button
                    type="button"
                    onClick={addProduct}
                    className="px-4 py-2 rounded bg-[#8B2954] text-white"
                  >
                    Add Product
                  </button>
                </div>

                {products.map((item, index) => (
                  <div key={index} className="grid md:grid-cols-3 gap-4 mb-4">
                    <InputBox
                      required={false}
                      label="Product"
                      name={`productType-${index}`}
                      value={item.productType}
                      onChange={(e) =>
                        handleProductChange(
                          index,
                          "productType",
                          e.target.value,
                        )
                      }
                    />

                    <InputBox
                      required={false}
                      label="Brand"
                      name={`brand-${index}`}
                      value={item.brand}
                      onChange={(e) =>
                        handleProductChange(index, "brand", e.target.value)
                      }
                    />

                    <button
                      type="button"
                      disabled={products.length === 1}
                      onClick={() => removeProduct(index)}
                      className={`h-11 mt-9 rounded-lg text-white transition ${
                        products.length === 1
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-full col-span-2 bg-neutral-200 h-1 rounded-full" />
              <div>
                <div className="flex justify-between mb-5">
                  <h2 className="text-2xl font-semibold text-[#8B2954]">
                    Service Inclusion{" "}
                    <span className="text-base text-black">(Optional)</span>
                  </h2>

                  <button
                    type="button"
                    onClick={addInclusion}
                    className="px-4 py-2 bg-[#8B2954] text-white rounded"
                  >
                    Add
                  </button>
                </div>

                {serviceInclusion.map((item, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <InputBox
                      required={false}
                      label={`Point ${index + 1}`}
                      name={`serviceInclusion-${index}`}
                      value={item}
                      onChange={(e) => handleInclusion(index, e.target.value)}
                    />

                    <button
                      type="button"
                      disabled={serviceInclusion.length === 1}
                      onClick={() => removeInclusion(index)}
                      className={`h-11 mt-9 px-4 rounded text-white transition ${
                        serviceInclusion.length === 1
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-full col-span-2 bg-neutral-200 h-1 rounded-full" />
              <div>
                <div className="flex justify-between mb-5">
                  <h2 className="text-2xl font-semibold text-[#8B2954]">
                    Service Exclusion{" "}
                    <span className="text-base text-black">(Optional)</span>
                  </h2>

                  <button
                    type="button"
                    onClick={addExclusion}
                    className="px-4 py-2 bg-[#8B2954] text-white rounded"
                  >
                    Add
                  </button>
                </div>

                {serviceExclusion.map((item, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <InputBox
                      required={false}
                      label={`Point ${index + 1}`}
                      value={item}
                      onChange={(e) => handleExclusion(index, e.target.value)}
                    />

                    <button
                      type="button"
                      disabled={serviceExclusion.length === 1}
                      onClick={() => removeExclusion(index)}
                      className={`h-11 mt-9 px-4 rounded text-white transition ${
                        serviceExclusion.length === 1
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-full col-span-2 bg-neutral-200 h-1 rounded-full" />
              <div>
                <div className="flex justify-between mb-5">
                  <h2 className="text-2xl font-semibold text-[#8B2954]">
                    Customer Requirements{" "}
                    <span className="text-base text-black">(Optional)</span>
                  </h2>

                  <button
                    type="button"
                    onClick={addRequirement}
                    className="px-4 py-2 bg-[#8B2954] text-white rounded"
                  >
                    Add
                  </button>
                </div>

                {serviceRequirements.map((item, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <InputBox
                      required={false}
                      label={`Requirement ${index + 1}`}
                      value={item}
                      onChange={(e) => handleRequirement(index, e.target.value)}
                    />

                    <button
                      type="button"
                      disabled={serviceRequirements.length === 1}
                      onClick={() => removeRequirement(index)}
                      className={`h-11 mt-9 px-4 rounded text-white transition ${
                        serviceRequirements.length === 1
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-full col-span-2 bg-neutral-200 h-1 rounded-full" />
              <div>
                <h2 className="text-2xl font-semibold text-[#8B2954] mb-5">
                  Booking{" "}
                  <span className="text-base text-black">(Optional)</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Service For</label>

                    <select
                      required={false}
                      name="serviceFor"
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      <option>Female</option>
                      <option>Male</option>
                      <option>Both</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2">Booking accepting days</label>

                    <select
                      required={false}
                      name="bookingDays"
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      <option>Whole week (All 7 days)</option>
                      <option>Monday to Saturday</option>
                      <option>Monday to Friday</option>
                      <option>Only on Tuesday, Thursday, Saturday</option>
                      <option>Only on Monday, Wednesday, Friday</option>
                      <option>Only on Sunday</option>
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </select>
                  </div>

                  <InputBox
                    required={false}
                    label="Booking From"
                    type="time"
                    name="bookingFrom"
                  />

                  <InputBox
                    required={false}
                    label="Booking Till"
                    type="time"
                    name="bookingTill"
                  />
                </div>
              </div>
              <div className="w-full col-span-2 bg-neutral-200 h-1 rounded-full" />
              <div>
                <h2 className="text-2xl font-semibold text-[#8B2954] mb-5">
                  Service Availability{" "}
                  <span className="text-base text-black">(Optional)</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3">
                    <input
                      required={false}
                      type="checkbox"
                      name="onSite"
                      defaultChecked
                    />
                    On Site
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      required={false}
                      type="checkbox"
                      name="inHouse"
                      defaultChecked
                    />
                    In House
                  </label>

                  <div>
                    <label className="block mb-2">Service Area</label>

                    <select
                      required={false}
                      name="serviceArea"
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      <option>Inside city</option>
                      <option>Outside city</option>
                      <option>Both</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="w-full col-span-2 bg-neutral-200 h-1 rounded-full" />

              <div>
                <h2 className="text-2xl font-semibold text-[#8B2954] mb-5">
                  Cover Images{" "}
                  <span className="text-base text-black">(Optional)</span>
                </h2>

                <input
                  required={false}
                  type="file"
                  name="coverImage"
                  multiple
                  accept="image/*"
                  onChange={handleImage}
                  className="w-full"
                />

                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                    {imagePreview?.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt=""
                        className="w-full h-40 object-cover rounded-xl"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center items-center gap-10 ">
              <Button
                LabelName={
                  loading ? "Saving..." : editingService ? "Update" : "Submit"
                }
                type="submit"
              />
            </div>
          </form>
        </div>
      </Popup>
    </div>
  );
};

const IsProfileComplete = ({ data, role }) => {
  return (
    <div>
      <h1>Is Profile Complete componenet </h1>
    </div>
  );
};

const CurrentlyUnderBooking = ({ data, role }) => {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Currently Under Booking
        </h1>

        <p className="text-gray-500 mt-1">
          Track your active and upcoming beauty appointments.
        </p>
      </div>

      {/* Booking Cards */}
      {data ? (
        <div className="space-y-6">
          {activeBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Service Image */}

                <img
                  src={booking.image}
                  alt={booking.service}
                  className="w-full lg:w-72 h-60 object-cover"
                />

                {/* Content */}

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">{booking.service}</h2>

                      <p className="text-gray-500 mt-1">{booking.store}</p>
                    </div>

                    <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
                      {booking.status}
                    </span>
                  </div>

                  {/* Details */}

                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-3">
                      <FaStore className="text-[#8B2954]" />
                      {booking.store}
                    </div>

                    <div className="flex items-center gap-3">
                      <FaUserTie className="text-[#8B2954]" />
                      {booking.professional}
                    </div>

                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-[#8B2954]" />
                      {booking.date}
                    </div>

                    <div className="flex items-center gap-3">
                      <FaClock className="text-[#8B2954]" />
                      {booking.time}
                    </div>

                    <div className="flex items-center gap-3 md:col-span-2">
                      <FaMapMarkerAlt className="text-[#8B2954]" />
                      {booking.location}
                    </div>
                  </div>

                  {/* Status Timeline */}

                  <div className="mt-8">
                    <h3 className="font-semibold mb-4">Booking Progress</h3>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <p className="text-xs mt-2">Booked</p>
                      </div>

                      <div className="flex-1 h-1 bg-green-500 mx-2"></div>

                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <p className="text-xs mt-2">Confirmed</p>
                      </div>

                      <div className="flex-1 h-1 bg-green-500 mx-2"></div>

                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                        <p className="text-xs mt-2">On The Way</p>
                      </div>

                      <div className="flex-1 h-1 bg-gray-300 mx-2"></div>

                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                        <p className="text-xs mt-2">Completed</p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}

                  <div className="flex flex-wrap gap-4 mt-8">
                    <button className="flex items-center gap-2 bg-[#8B2954] text-white px-5 py-3 rounded-lg hover:bg-[#742247] transition">
                      <FaPhoneAlt />
                      Call Professional
                    </button>

                    <button className="flex items-center gap-2 border border-[#8B2954] text-[#8B2954] px-5 py-3 rounded-lg hover:bg-[#8B2954] hover:text-white transition">
                      <FaLocationArrow />
                      Track Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const Images = ({ data, role, userId, subscription }) => {
  const storeImages = data?.images || {};
  const coverImage = storeImages.logo || {};
  const [gallery, setGallery] = useState(storeImages.gallery || []);

  const [uploading, setUploading] = useState(false);
  const { alertSuccess, alertError } = useToast();

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (!subscription?.mediaLimit?.unlimitedPhotos) {
      const availableSlots = Math.max(
        (subscription?.mediaLimit?.photos || 0) - gallery.length,
        0,
      );
      if (files.length > availableSlots) {
        alertError(
          `You can upload ${availableSlots} more image(s) on your plan`,
        );
        e.target.value = "";
        return;
      }
    }

    try {
      setUploading(true);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
      const response = await FetchData(
        `store/update/add-gallery-images/${userId}`,
        "post",
        formData,
        true,
      );
      setGallery(response.data.data.gallery || []);
      alertSuccess(response.data.message);
    } catch (err) {
      alertError(err.response?.data?.message || "Unable to upload images");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const deleteImage = async ({ ImgId }) => {
    try {
      const response = await FetchData(
        `store/update/delete-gallery-image/${userId}/${ImgId}`,
        "delete",
      );

      alertSuccess(response.data.message);
      setGallery(response.data.data.gallery || []);
    } catch (err) {
      alertError(err.response?.data?.message || "Unable to delete image");
    }
  };

  return subscription ? (
    <div className="space-y-6 w-full">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Images</h1>

          <p className="text-gray-500 mt-2">
            Manage your gallery and showcase your work.
          </p>
        </div>
      </div>

      {/* Cover Image */}

      <div className="bg-white rounded-2xl shadow">
        <div className="relative">
          <img
            src={coverImage?.url}
            alt="Cover"
            className="w-full h-52 md:h-72 object-cover rounded-t-2xl"
          />

          <div className="absolute bottom-4 right-4 bg-white/90 shadow px-4 py-2 rounded-lg flex items-center gap-2 text-gray-600">
            <FaCamera />
            Cover image
          </div>
        </div>
      </div>

      {/* Gallery Header */}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gallery</h2>

        <span className="bg-pink-100 text-[#8B2954] px-4 py-2 rounded-full text-sm">
          {gallery.length} Images
        </span>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {gallery.map((image) => (
          <div
            key={image.fileId}
            className="relative group rounded-xl overflow-hidden bg-white shadow"
          >
            <img
              src={image.url}
              alt=""
              className="w-full h-48 object-cover group-hover:scale-105 duration-300"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex justify-center items-center">
              <button
                onClick={() => deleteImage({ ImgId: image.fileId })}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {/* Upload Card */}
        {!subscription?.mediaLimit?.unlimitedPhotos &&
        subscription?.mediaLimit?.photos <= gallery?.length ? (
          "Your have uploaded the number of images which comes under your plan,Please upgrade your plan to add more."
        ) : (
          <label className="border-2 border-dashed border-[#8B2954] rounded-xl h-48 flex flex-col justify-center items-center cursor-pointer hover:bg-pink-50 transition">
            <FaImage className="text-4xl text-[#8B2954]" />
            <p className="mt-3 font-medium">
              {uploading ? "Uploading..." : "Add Images"}
            </p>
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleGalleryUpload}
            />
          </label>
        )}
      </div>
    </div>
  ) : (
    "Please purchase a subscription for gallery benefits"
  );
};

const KycDetails = ({ data, role, storeId, handleReload, callData }) => {
  useEffect(() => {
    callData();
  }, []);
  const formRef = useRef();
  const { alertSuccess, alertError } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imagePreview2, setImagePreview2] = useState("");
  const [imagePreview3, setImagePreview3] = useState("");
  const [imagePreview4, setImagePreview4] = useState("");
  const [imagePreview5, setImagePreview5] = useState("");
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const handleImage2 = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage2(file);
    setImagePreview2(URL.createObjectURL(file));
  };
  const handleImage3 = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage3(file);
    setImagePreview3(URL.createObjectURL(file));
  };
  const handleImage4 = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage4(file);
    setImagePreview4(URL.createObjectURL(file));
  };
  const handleImage5 = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage5(file);
    setImagePreview5(URL.createObjectURL(file));
  };

  const handleSubmitKYC = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `${role.toLowerCase()}/update/submit-kyc/${storeId}`,
        "post",
        formData,
        true,
      );
      console.log(response);
      formRef.current.reset();
      setImagePreview(null);
      setImagePreview2(null);
      setImagePreview3(null);
      setImagePreview4(null);
      setImagePreview5(null);
      setImage(null);
      setImage2(null);
      setImage3(null);
      setImage4(null);
      setImage5(null);
      alertSuccess(response.data.message);
      setShowForm(false);
      handleReload();
    } catch (err) {
      alertError(err.response?.data?.message || "Unable to submit KYC details");
    }
  };

  console.log(data);
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">KYC Details</h1>

          <p className="text-gray-500 mt-2">
            Manage your verification documents and business information.
          </p>
        </div>
        {data?.storeKycSubmitted === false ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#8B2954] text-white px-5 py-3 rounded-xl hover:bg-[#742247] transition flex items-center gap-2"
          >
            <FaUpload />
            Upload KYC
          </button>
        ) : (
          ""
        )}
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">Verification Status</h2>

            <p className="text-gray-500 mt-1">
              Your account verification status.
            </p>
          </div>

          <span
            className={`${data?.storeKycComplete === true ? "bg-green-100 text-green-700 px-5 py-2 rounded-full flex items-center gap-2 w-fit" : "bg-red-100 text-red-700 px-5 py-2 rounded-full flex items-center gap-2 w-fit"} `}
          >
            {data?.storeKycComplete === true ? "KYC Verified" : "Pending"}
          </span>
        </div>
      </div>

      {/* Information Cards */}
      {data?.storeKycSubmitted === true ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Details */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaBuilding className="text-[#8B2954] text-2xl" />
              <h2 className="text-xl font-semibold">Business Details</h2>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Business Name</p>

                <h3 className="font-semibold">{data?.storeName || "Na"}</h3>
              </div>

              <div>
                <p className="text-sm text-gray-500">GST Number</p>

                <p className="font-semibold">
                  {data?.gst?.number || "20ABCDE1234F1Z5"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Store Pan Number</p>

                <p className="font-semibold">
                  {data?.pan?.number || "License #UBS-2025-001"}
                </p>
              </div>
              <div className="w-full h-96 md:w-96 md:h-96 overflow-hidden border-[0.1px] border-neutral-200">
                <img
                  src={data?.pan?.image?.url}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="w-full h-96 md:w-96 md:h-96 overflow-hidden border-[0.1px] border-neutral-200">
                <img
                  src={data?.gst?.image?.url}
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          </div>

          {/* Owner Details */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaUserTie className="text-[#8B2954] text-2xl" />
              <h2 className="text-xl font-semibold">Owner Details</h2>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Owner Name</p>

                <h3 className="font-semibold">
                  {data?.owner?.ownerName || "Na"}
                </h3>
              </div>

              <div>
                <p className="text-sm text-gray-500">Contact Number</p>

                <p className="font-semibold">
                  {data?.owner?.ownerContact || "123456789"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>

                <p className="font-semibold">
                  {data?.owner?.ownerEmail || "ABCDE1234F"}
                </p>
              </div>
              <div className="w-full h-96 md:w-96 md:h-96 overflow-hidden border-[0.1px] border-neutral-200">
                <img
                  src={data?.owner?.pan?.image?.url}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="w-full h-96 md:w-96 md:h-96 overflow-hidden border-[0.1px] border-neutral-200">
                <img
                  src={data?.owner?.aadhar?.image?.front?.url}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="w-full h-96 md:w-96 md:h-96 overflow-hidden border-[0.1px] border-neutral-200">
                <img
                  src={data?.owner?.aadhar?.image?.back?.url}
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <Popup isOpen={showForm} onClose={() => setShowForm(false)}>
        <div className="flex justify-start items-start h-screen w-full overflow-scroll">
          {" "}
          <form
            ref={formRef}
            onSubmit={handleSubmitKYC}
            className="flex-col flex justify-start items-start w-full md:w-[90vw] md:h-[90vh] overflow-scroll pb-20"
          >
            <h1 className="heading text-3xl">Add KYC form</h1>
            <div className="flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              {role === "Store" && (
                <div className="grid grid-cols-1 col-span-2 bg-neutral-200 p-4 rounded-xl ">
                  <InputBox
                    required={false}
                    label="Firm pan number"
                    name="storePan"
                    type="text"
                  />
                  <InputBox
                    required={false}
                    label="Firm card image"
                    name="StorePAN"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg"
                    />
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 col-span-2 bg-neutral-200 p-4 rounded-xl ">
                <InputBox
                  label="GST number"
                  name="gstNumber"
                  type="text"
                  required={false}
                />
                <InputBox
                  required={false}
                  label="GST certificate image"
                  name="GST"
                  type="file"
                  accept="image/*"
                  onChange={handleImage2}
                />
                {imagePreview2 && (
                  <img
                    src={imagePreview2}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="col-span-2 w-full h-1 bg-neutral-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 col-span-2 gap-4">
                <InputBox
                  label="owner name"
                  name="ownerName"
                  required={false}
                  type="text"
                />
                <InputBox
                  label="owner contact numner"
                  name="ownerContact"
                  required={false}
                  type="text"
                />
                <InputBox
                  label="owner email"
                  name="ownerEmail"
                  required={false}
                  type="text"
                />
                <InputBox
                  label="write your full address"
                  name="ownerAddress"
                  required={false}
                  type="text"
                />
              </div>
              <div className="col-span-2 w-full h-1 bg-neutral-200" />
              <div className="grid grid-cols-1 col-span-2 bg-neutral-200 p-4 rounded-xl ">
                <InputBox
                  required={false}
                  label="aadhar number"
                  name="aadharNumber"
                  type="text"
                />
                <InputBox
                  required={false}
                  label="aadhar card image (Front)"
                  name="aadharFront"
                  type="file"
                  accept="image/*"
                  onChange={handleImage3}
                />
                {imagePreview3 && (
                  <img
                    src={imagePreview3}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="grid grid-cols-1 col-span-2 bg-neutral-200 p-4 rounded-xl ">
                <InputBox
                  required={false}
                  label="aadhar card image (Back)"
                  name="aadharBack"
                  type="file"
                  accept="image/*"
                  onChange={handleImage4}
                />
                {imagePreview4 && (
                  <img
                    src={imagePreview4}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="grid grid-cols-1 col-span-2 bg-neutral-200 p-4 rounded-xl ">
                <InputBox
                  required={false}
                  label="pan number"
                  name="panNumber"
                  type="text"
                />
                <InputBox
                  required={false}
                  label="pan card image"
                  name="PAN"
                  type="file"
                  accept="image/*"
                  onChange={handleImage5}
                />
                {imagePreview5 && (
                  <img
                    src={imagePreview5}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-center items-center gap-10 ">
              <Button LabelName="Submit" type="submit" />
            </div>
          </form>
        </div>
      </Popup>
    </div>
  );
};

export {
  Overview, // in working condition
  SavedAddress,
  BankingDetails, // in working condition
  StoreStaffs,
  Booking,
  FavoriteStore,
  FavoriteProfessional,
  Services,
  IsProfileComplete,
  CurrentlyUnderBooking,
  Images,
  KycDetails,
  PaymentDetails,
};
