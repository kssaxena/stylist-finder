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
  FaLocationArrow
 
} from "react-icons/fa";

const bankDetails = {
  accountHolder: "Akanksha Sinha",
  bankName: "State Bank of India",
  accountNumber: "XXXX XXXX 4589",
  ifsc: "SBIN0001234",
  branch: "Ranchi Main Branch",
  upi: "akanksha@oksbi",
};

const addresses = [
  {
    id: 1,
    type: "Home",
    icon: <FaHome />,
    name: "Akanksha Sinha",
    phone: "+91 7870908947",
    address: "H.No. 21, Harmu Housing Colony, Ranchi, Jharkhand - 834002",
    default: true,
  },
  {
    id: 2,
    type: "Work",
    icon: <FaBriefcase />,
    name: "Akanksha Sinha",
    phone: "+91 7870908947",
    address: "5th Floor, Business Park, Lalpur, Ranchi, Jharkhand - 834001",
    default: false,
  },
];
const bookings = [
  {
    id: 1,
    service: "Bridal Makeup",
    professional: "Priya Sharma",
    store: "Elite Beauty Salon",
    location: "Ranchi",
    date: "20 July 2025",
    time: "11:00 AM",
    amount: 4500,
    status: "Upcoming",
  },
 
];
const favouriteStores = [
  {
    id: 1,
    name: "Glow Beauty Studio",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600",
    rating: 4.8,
    reviews: "2.1k",
    location: "Harmu Road, Ranchi",
    timing: "9:00 AM - 8:00 PM",
  },
]
const favouriteProfessionals = [
  {
    id: 1,
    name: "Priya Sharma",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    specialization: "Bridal Makeup Artist",
    experience: "7 Years",
    rating: 4.9,
    reviews: "1.8k",
    store: "Glow Beauty Studio",
  },
]
const services = [
  {
    _id: 1,
    name: "Luxury Hair Spa",
    coverImage:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
    charges: 999,
    duration: "60 mins",
    serviceFor: "Female",
    onSite: true,
    inHouse: true,
    store: "Elite Salon",
    professional: "Priya Sharma",
    products: [
      {
        brand: "L'Oreal",
      },
      {
        brand: "Matrix",
      },
    ],
    serviceInclusion: [
      "Hair Wash",
      "Hair Spa",
      "Head Massage",
      "Blow Dry",
    ],
  },
]
const activeBookings = [
  {
    id: 1,
    service: "Luxury Hair Spa",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
    store: "Elite Beauty Salon",
    professional: "Priya Sharma",
    date: "28 July 2025",
    time: "11:30 AM",
    location: "Harmu Road, Ranchi",
    status: "Professional On The Way",
    phone: "+91 9876543210",
  },
]



export const Overview = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's a quick overview of your account.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-[#8B2954] text-white px-5 py-2 rounded-lg hover:bg-[#742247] transition">
          <FaUserEdit />
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src="https://i.pravatar.cc/250"
          alt="Profile"
          className="w-36 h-36 rounded-full object-cover "
        />

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Akanksha Sinha
            </h2>

            <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
              <FaCrown />
              Premium Member
            </span>
          </div>

          <p className="text-gray-500 mt-1">Customer since January 2025</p>

          <div className="grid md:grid-cols-2 gap-5 mt-6">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-[#8B2954]" />
              <span>akanksha@gmail.com</span>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-[#8B2954]" />
              <span>+91 7870908947</span>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-[#8B2954]" />
              <span>+91 9876543210</span>
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-[#8B2954]" />
              <span>Ranchi, Jharkhand</span>
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

              <h2 className="text-xl font-bold mt-2">32</h2>
            </div>

            <div className="w-14 h-14 rounded-full bg-pink-100 flex justify-center items-center">
              <FaCalendarCheck className="text-[#8B2954] text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Favourite Stores</p>

              <h2 className="text-xl font-bold mt-2">12</h2>
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

              <h2 className="text-xl font-bold mt-2">4</h2>
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

/* =========================
   Saved Address
========================= */

export const SavedAddress = () => {
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
        {addresses.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
          >
            {/* Top */}

            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex justify-center items-center text-[#8B2954] text-xl">
                  {item.icon}
                </div>

                <div>
                  <h2 className="font-semibold text-lg">{item.type}</h2>

                  {item.default && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </div>

              <FaMapMarkerAlt className="text-[#8B2954]" size={22} />
            </div>

            {/* Details */}

            <div className="mt-5 space-y-2">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>

              <p className="text-gray-500">{item.phone}</p>

              <p className="text-gray-600 leading-6">{item.address}</p>
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
        ))}
      </div>
    </div>
  );
};

/* =========================
   Banking Details
========================= */
export const BankingDetails = () => {
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
              <h2 className="text-xl font-semibold">{bankDetails.bankName}</h2>

              <p className="text-gray-500">{bankDetails.branch}</p>
            </div>
          </div>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            Verified
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div>
            <p className="text-sm text-gray-500">Account Holder</p>

            <h3 className="font-semibold">{bankDetails.accountHolder}</h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Account Number</p>

            <h3 className="font-semibold">{bankDetails.accountNumber}</h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">IFSC Code</p>

            <h3 className="font-semibold">{bankDetails.ifsc}</h3>
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

          <p className="text-gray-600">{bankDetails.upi}</p>
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
/* =========================
   Booking
========================= */


export const Booking = () => {
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

/* =========================
   Favorite Store
========================= */

export const FavouriteStore = () => {
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
        {favouriteStores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
          >
            {/* Image */}

            <img
              src={store.image}
              alt={store.name}
              className="w-full h-52 object-cover"
            />

            {/* Content */}

            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{store.name}</h2>

                  <div className="flex items-center gap-2 mt-2">
                    <FaStar className="text-yellow-400" />
                    <span>{store.rating}</span>
                    <span className="text-gray-500">
                      ({store.reviews} Reviews)
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
                  {store.location}
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <FaClock className="text-[#8B2954]" />
                  {store.timing}
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
        ))}
      </div>
    </div>
  );
};

/* =========================
   Favourite Professional
========================= */

export const FavouriteProfessional = () => {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Favourite Professionals
        </h1>

        <p className="text-gray-500 mt-1">
          Your trusted beauty experts, all in one place.
        </p>
      </div>

      {/* Professional Cards */}

      <div className="grid lg:grid-cols-2 gap-6">
        {favouriteProfessionals.map((professional) => (
          <div
            key={professional.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6"
          >
            <div className="flex gap-5">
              {/* Image */}

              <img
                src={professional.image}
                alt={professional.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-[#8B2954]"
              />

              {/* Details */}

              <div className="flex-1">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold">{professional.name}</h2>

                  <button className="text-red-500 hover:text-red-600">
                    <FaHeart size={22} />
                  </button>
                </div>

                <p className="text-[#8B2954] font-medium mt-1">
                  {professional.specialization}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <FaStar className="text-yellow-400" />
                  <span>{professional.rating}</span>

                  <span className="text-gray-500">
                    ({professional.reviews} Reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3 text-gray-600">
                  <FaBriefcase className="text-[#8B2954]" />
                  {professional.experience} Experience
                </div>

                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <FaStore className="text-[#8B2954]" />
                  {professional.store}
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
        ))}
      </div>
    </div>
  );
};

/* =========================
   Quick Services
========================= */

export const QuickServices = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quick Services</h1>

          <p className="text-gray-500">
            Book your favourite beauty service instantly.
          </p>
        </div>

        <input
          placeholder="Search Service..."
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <div className="space-y-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col lg:flex-row gap-6"
          >
            {/* Image */}

            <img
              src={service.coverImage}
              className="w-full lg:w-72 h-56 rounded-xl object-cover"
            />

            {/* Content */}

            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{service.name}</h2>

                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-2">
                      <FaClock />
                      {service.duration}
                    </span>

                    <span className="flex items-center gap-2">
                      {service.serviceFor === "Male" ? (
                        <FaMale />
                      ) : service.serviceFor === "Female" ? (
                        <FaFemale />
                      ) : (
                        <>
                          <FaMale />
                          <FaFemale />
                        </>
                      )}

                      {service.serviceFor}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-[#8B2954]">
                    ₹ {service.charges}
                  </h2>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-6">
                <p className="flex gap-2 items-center">
                  <FaStore />
                  {service.store}
                </p>

                <p className="flex gap-2 items-center">
                  <FaUserTie />
                  {service.professional}
                </p>

                <p>
                  {service.onSite && (
                    <span className="bg-green-100 px-3 py-1 rounded-full mr-2">
                      On Site
                    </span>
                  )}

                  {service.inHouse && (
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
                  {service.products.map((item, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {item.brand}
                    </span>
                  ))}
                </div>
              </div>

              {/* Inclusion */}

              <div className="mt-5">
                <h3 className="font-semibold mb-2">Service Includes</h3>

                <div className="grid md:grid-cols-2 gap-2">
                  {service.serviceInclusion.map((item, index) => (
                    <p key={index} className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <button className="mt-6 bg-[#8B2954] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#742247]">
                <FaCalendarCheck />
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================
   is profile complete
========================= */
export const IsProfileComplete = () => {
  return (
    <div>
      <h1>Is Profile Complete componenet </h1>
    </div>
  )
}

/* =========================
   Current Booking
========================= */

export const CurrentlyUnderBooking = () => {
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
