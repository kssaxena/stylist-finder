import React from "react";
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
} from "react-icons/fa";
import { FaCloudUploadAlt, FaImage, FaCamera } from "react-icons/fa";
import { useState } from "react";
import { bookings, activeBookings } from "../../constants/constants";

const Overview = ({ data, role }) => {
  return (
    <div className="space-y-6 w-full">
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
        <button className="hidden md:flex items-center gap-2 bg-[#8B2954] text-white px-5 py-3 rounded-xl hover:bg-[#742247] transition duration-300">
          <FaUserEdit />
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-36 h-36">
          <img
            src="https://i.pravatar.cc/250"
            alt="Profile"
            className="w-full h-full rounded-full object-cover "
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {data?.name || "Akanksha Kumari"}
            </h2>

            {role === "user" || "USER" || "User" ? (
              <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                <FaCrown />
                Premium Member
              </span>
            ) : (
              ""
            )}
          </div>

          <p className="text-gray-500 mt-1 text-sm">
            Joined since January 2025
          </p>

          <div className="grid md:grid-cols-2 gap-5 mt-6">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-[#8B2954]" />
              <span>{data?.email || "akankshasinha906@gmail.com"}</span>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-[#8B2954]" />
              <span>{data?.number || "7870908947"}</span>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-[#8B2954]" />
              <span>{data?.alternateNumber || "+91 9876543210"}</span>
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-[#8B2954]" />
              <span>{data?.address || "Ranchi, Jharkhand"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>

              <h2 className="text-xl font-bold mt-2">
                {data?.totalBooking || "32"}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-full bg-pink-100 flex justify-center items-center">
              <FaCalendarCheck className="text-[#8B2954] text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Favorite Stores</p>

              <h2 className="text-xl font-bold mt-2">
                {data?.favStore || "12"}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-full bg-pink-100 flex justify-center items-center">
              <FaHeart className="text-[#8B2954] text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Saved Addresses</p>

              <h2 className="text-xl font-bold mt-2">
                {data?.savedAddress || "4"}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-full bg-pink-100 flex justify-center items-center">
              <FaHome className="text-[#8B2954] text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}

      <div className="bg-white rounded-2xl shadow-md p-6">
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

          {/* <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-medium">Hair Spa Booking</h3>

              <p className="text-gray-500 text-sm">Glow Salon • 22 June 2025</p>
            </div>

            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
              Upcoming
            </span>
          </div> */}

          {/* <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Saree Draping</h3>

              <p className="text-gray-500 text-sm">
                Elite Beauty Studio • 25 June 2025
              </p>
            </div>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              Confirmed
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

const SavedAddress = (data, role) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Saved Addresses</h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage your delivery and service locations.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-[#8B2954] text-white px-5 py-2 rounded-lg hover:bg-[#732247] transition">
          <FaPlus />
          Add Address
        </button>
      </div>

      {/* Address List */}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
          {/* Top */}

          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex justify-center items-center text-[#8B2954] text-xl">
                {data?.icon || <FaUser />}
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  {data?.type || "Home"}
                </h2>

                {data?.default && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
            </div>

            <FaMapMarkerAlt className="text-[#8B2954] text-xl" />
          </div>

          {/* Details */}

          <div className="mt-5 space-y-2">
            <h3 className="font-semibold text-gray-800">
              {data?.name || "Akanksha Sinha"}
            </h3>

            <p className="text-gray-500">{data?.phone || "9878675643"}</p>

            <p className="text-gray-600 leading-6">
              {data?.address || "Harmu Road"}
            </p>
          </div>

          {/* Actions */}

          <div className="flex justify-end gap-3 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
              <FaEdit />
              Edit
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
              <FaTrash />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BankingDetails = (data, role) => {
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

        <button className="flex items-center gap-2 bg-[#8B2954] text-white px-5 py-2 rounded-lg hover:bg-[#742247] transition">
          <FaPlus />
          Add Bank
        </button>
      </div>

      {/* Bank Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-[#8B2954]">
              <FaUniversity size={28} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {data?.bankName || "State Bank of India"}
              </h2>

              <p className="text-gray-500">
                {data?.branch || "Personal Banking Branch"}
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

            <h3 className="font-semibold">
              {data?.accountHolder || "Akanksha Sinha"}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Account Number</p>

            <h3 className="font-semibold">
              {data?.accountNumber || "2345678908"}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">IFSC Code</p>

            <h3 className="font-semibold">{data?.ifsc || "SBIN0003"}</h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Preferred Payment</p>

            <div className="flex items-center gap-2">
              <FaCreditCard className="text-[#8B2954]" />
              Debit Card
            </div>
          </div>
        </div>

        {/* UPI */}

        <div className="mt-8 border-t pt-6">
          <div className="flex items-center gap-3 mb-2">
            <FaMobileAlt className="text-[#8B2954]" />

            <h3 className="font-semibold text-lg">UPI Details</h3>
          </div>

          <p className="text-gray-600">{data?.upi || "akanksha@oksbi"}</p>
        </div>

        {/* Actions */}

        <div className="flex justify-end gap-3 mt-8">
          <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
            <FaEdit />
            Edit
          </button>

          <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
            <FaTrash />
            Delete
          </button>
        </div>
      </div>

      {/* Payment Summary */}
    </div>
  );
};

const Booking = (data, role) => {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>

        <p className="text-gray-500 mt-1">
          View and manage all your beauty service bookings.
        </p>
      </div>

      {/* Cards */}

      <div className="space-y-5">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-200"
          >
            {/* Top */}

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">{booking.service}</h2>

                <p className="text-gray-500">{booking.store}</p>
              </div>

              <span
                className={`px-4 py-1 rounded-full text-sm font-medium
                  ${
                    booking.status === "Upcoming"
                      ? "bg-yellow-100 text-yellow-700"
                      : booking.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                  }`}
              >
                {booking.status}
              </span>
            </div>

            {/* Details */}

            <div className="grid md:grid-cols-2 gap-5 mt-6">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-[#8B2954]" />
                {booking.date}
              </div>

              <div className="flex items-center gap-3">
                <FaClock className="text-[#8B2954]" />
                {booking.time}
              </div>

              <div className="flex items-center gap-3">
                <FaUserTie className="text-[#8B2954]" />
                {booking.professional}
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#8B2954]" />
                {booking.location}
              </div>

              <div className="flex items-center gap-3">
                <FaRupeeSign className="text-[#8B2954]" />₹ {booking.amount}
              </div>
            </div>

            {/* Buttons */}

            <div className="flex flex-wrap gap-3 mt-8">
              <button className="flex items-center gap-2 bg-[#8B2954] text-white px-5 py-2 rounded-lg hover:bg-[#742247]">
                <FaEye />
                View Details
              </button>

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
    </div>
  );
};

const FavoriteStore = (data, role) => {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">Favourite Stores</h1>

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

const FavoriteProfessional = (data, role) => {
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

const Services = (data, role) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quick Services</h1>

          <p className="text-gray-500">
            Book your favorite beauty service instantly.
          </p>
        </div>

        <input
          placeholder="Search Service..."
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col lg:flex-row gap-6">
          {/* Image */}

          <img
            src={
              data?.coverImage ||
              `"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500`
            }
            className="w-full lg:w-72 h-56 rounded-xl object-cover"
          />

          {/* Content */}

          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  {data?.name || "Luxury Hair Spa"}
                </h2>

                <div className="flex gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-2">
                    <FaClock />
                    {data?.duration || "60 mins"}
                  </span>

                  <span className="flex items-center gap-2">
                    {data?.serviceFor === "Male" ? (
                      <FaMale />
                    ) : data?.serviceFor === "Female" ? (
                      <FaFemale />
                    ) : (
                      <>
                        <FaMarsDouble />
                        <FaFemale />
                      </>
                    )}

                    {data?.serviceFor}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#8B2954]">
                  ₹ {data?.charges || "999"}
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mt-6">
              <p className="flex gap-2 items-center">
                <FaStore />
                {data?.store || "Elite Salon"}
              </p>

              <p className="flex gap-2 items-center">
                <FaUserTie />
                {data?.professional || "Priya Sharma"}
              </p>

              <p>
                {data?.onSite && (
                  <span className="bg-green-100 px-3 py-1 rounded-full mr-2">
                    On Site
                  </span>
                )}

                {data?.inHouse && (
                  <span className="bg-blue-100 px-3 py-1 rounded-full">
                    In House
                  </span>
                )}
              </p>
            </div>

            {/* Products */}

            <div className="mt-5">
              <h3 className="font-semibold">Products Used</h3>

              <div className="flex gap-3 mt-2 flex-wrap">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {data?.brand}
                </span>
              </div>
            </div>

            {/* Inclusion */}

            <div className="mt-5">
              <h3 className="font-semibold mb-2">Service Includes</h3>

              <div className="grid md:grid-cols-2 gap-2">
                <p className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IsProfileComplete = (data, role) => {
  return (
    <div>
      <h1>Is Profile Complete componenet </h1>
    </div>
  );
};

const CurrentlyUnderBooking = (data, role) => {
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
    </div>
  );
};

const Images = (data, role) => {
  const [coverImage] = useState(
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200",
  );

  const [gallery] = useState([
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500",
    "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=500",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500",
  ]);

  return (
    <div className="space-y-6 w-full">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Images</h1>

          <p className="text-gray-500 mt-2">
            Manage your gallery and showcase your work.
          </p>
        </div>

        <button className="bg-[#8B2954] text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-[#742247] transition">
          <FaCloudUploadAlt />
          Upload Images
        </button>
      </div>

      {/* Cover Image */}

      <div className="bg-white rounded-2xl shadow">
        <div className="relative">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-52 md:h-72 object-cover rounded-t-2xl"
          />

          <button className="absolute bottom-4 right-4 bg-white shadow px-4 py-2 rounded-lg flex items-center gap-2">
            <FaCamera />
            Change Cover
          </button>
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
        {gallery.map((image, index) => (
          <div
            key={index}
            className="relative group rounded-xl overflow-hidden bg-white shadow"
          >
            <img
              src={image}
              alt=""
              className="w-full h-48 object-cover group-hover:scale-105 duration-300"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex justify-center items-center">
              <button className="bg-red-500 text-white p-3 rounded-full">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {/* Upload Card */}

        <label className="border-2 border-dashed border-[#8B2954] rounded-xl h-48 flex flex-col justify-center items-center cursor-pointer hover:bg-pink-50 transition">
          <FaImage className="text-4xl text-[#8B2954]" />

          <p className="mt-3 font-medium">Add Images</p>

          <input type="file" multiple className="hidden" />
        </label>
      </div>
    </div>
  );
};

const KycDetails = (data, role) => {
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

        <button className="bg-[#8B2954] text-white px-5 py-3 rounded-xl hover:bg-[#742247] transition flex items-center gap-2">
          <FaUpload />
          Update Documents
        </button>
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

          <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full flex items-center gap-2 w-fit">
            <FaCheckCircle />
            {data?.status || "Verified"}
          </span>
        </div>
      </div>

      {/* Information Cards */}
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

              <h3 className="font-semibold">
                {data?.businessName || "Urban Beauty Salon"}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">GST Number</p>

              <h3 className="font-semibold">
                {data?.gst || "20ABCDE1234F1Z5"}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Business License</p>

              <h3 className="font-semibold">
                {data?.businessLicense || "License #UBS-2025-001"}
              </h3>
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
                {data?.ownerName || "Akanksha Sinha"}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Aadhaar Number</p>

              <h3 className="font-semibold">{data?.aadhaar || "123456789"}</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">PAN Number</p>

              <h3 className="font-semibold">{data?.pan || "ABCDE1234F"}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Uploaded Documents</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            "Aadhaar Card",
            "PAN Card",
            "GST Certificate",
            "Business License",
          ].map((doc) => (
            <div
              key={doc}
              className="border rounded-xl p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <FaFilePdf className="text-red-500 text-3xl" />

                <div>
                  <h3 className="font-semibold">{doc}</h3>

                  <p className="text-xs text-gray-500">PDF Uploaded</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 border border-[#8B2954] text-[#8B2954] py-2 rounded-lg hover:bg-pink-50 transition">
                  View
                </button>

                <button className="flex-1 bg-[#8B2954] text-white py-2 rounded-lg hover:bg-[#742247] transition">
                  Replace
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export {
  Overview,
  SavedAddress,
  BankingDetails,
  Booking,
  FavoriteStore,
  FavoriteProfessional,
  Services,
  IsProfileComplete,
  CurrentlyUnderBooking,
  Images,
  KycDetails,
};
