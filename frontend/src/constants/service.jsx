
import { GoVerified } from "react-icons/go";
import { FaMapMarkerAlt, FaBookmark, FaHeart, FaStore, FaImages } from "react-icons/fa";
import { CiBank } from "react-icons/ci";
import { FaServicestack, FaUserCheck } from "react-icons/fa6";
import { PiFlowerLotusFill } from "react-icons/pi";

export const services = [
  {
    id: 1,
    gender: "Female",
    category: "packages",

    title: "Basic Makeup Package",

    price: 2200,

    duration: "1 hr 30 mins",

    image: `https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/makeup.png?updatedAt=1784349572544`,

    description: "Ideal for parties, office events and functions.",
  },

  {
    id: 2,

    gender: "Female",

    category: "packages",

    title: "HD Makeup Package",

    price: 4200,

    duration: "2 hrs",

    image: `https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/makeup.png?updatedAt=1784349572544`,

    description: "Premium HD bridal and party makeup.",
  },

  {
    id: 3,

    gender: "Female",

    category: "hair",

    title: "Hair Spa",

    price: 1200,

    duration: "60 mins",

    image: `https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/HairCare.png?updatedAt=1784349573394`,

    description: "Professional hair spa for silky smooth hair.",
  },

  {
    id: 4,

    gender: "Female",

    category: "saree",

    title: "Saree Draping",

    price: 800,

    duration: "45 mins",

    image: `https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/HairCare.png?updatedAt=1784349573394`,

    description: "Traditional and modern saree draping.",
  },

  {
    id: 5,

    gender: "male",

    category: "hair",

    title: "Hair Cut",

    price: 350,

    duration: "30 mins",

    image: `https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/MensHaircut.png?updatedAt=1784349573498`,

    description: "Professional haircut for men.",
  },

  {
    id: 6,

    gender: "male",

    category: "beard",

    title: "Beard Styling",

    price: 250,

    duration: "20 mins",

    image: `https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/BeardGrooming.png?updatedAt=1784349572974`,

    description: "Premium beard grooming.",
  },
];

export const categories = [
  {
    id: 1,
    name: "Packages",
  },

  {
    id: 2,
    name: "Hair Care",
  },

  {
    id: 3,
    name: "Body Care",
  },

  {
    id: 4,
    name: "Makeup",
  },

  {
    id: 5,
    name: "Beard Styling",
  },
];

export const CustomerArray = [
  {
    id: 1,
    label: "Overview",
    value: "overview",
    icon: <GoVerified />,
  },
  {
    id: 2,
    label: "Address",
    value: "address",
    icon: <FaMapMarkerAlt />,
  },
  {
    id: 3,
    label: "Banking Details",
    value: "banking_details",
    icon: <CiBank />,
  },
  {
    id: 3,
    label: "Bookings",
    value: "booking",
    icon: <FaBookmark />,
  },
  {
    id: 4,
    label: "Favorite Store ",
    value: "favorite_store",
    icon: <FaStore/>,
  },
  {
    id: 5,
    label: "Favorite Professional",
    value: "favorite_professional",
    icon: <FaHeart />,
  },

  {
    id: 6,
    label: "Quick Services",
    value: "quick_services",
    icon: <FaServicestack />,
  },
  {
    id: 7,
    label: "isProfile Complete ",
    value: "is_profile_complete",
    icon: <FaUserCheck />,
  },
  {
    id: 8,
    label: "Currently Under Booking",
    value: "currently_under_booking",
    icon: <PiFlowerLotusFill />,
  },
];

export const StoreArray = [
  {
    id: 1,
    label: "Overview",
    value: "store_overview",
    icon: <GoVerified />,
  },
  {
    id: 2,
    label: "Address",
    value: "address",
    icon: <FaMapMarkerAlt />,
  },
  {
    id: 3,
    label: "Store Bank Details",
    value: "store_bank_details",
    icon: <CiBank />,
  },
  {
    id: 3,
    label: "Store Staff",
    value: "store_staff",
    icon: <FaStore />,
  },

  {
    id: 4,
    label: "Services",
    value: "services",
    icon: <FaServicestack />,
  },
  {
    id: 5,
    label: " Bookings ",
    value: "bookings",
    icon: <FaBookmark />,
  },
  {
    id: 6,
    label: " Store timing ",
    value: "store_timing",
    icon: <FaBookmark />,
  },
  {
    id: 6,
    label: " Images ",
    value: "images",
    icon: <FaImages />,
  },
  {
    id: 6,
    label: " KYC Detail ",
    value: "kyc_details",
    icon: <FaBookmark />,
  },
  {
    id: 7,
    label: " Owner Details ",
    value: "owner_detail",
    icon: <FaBookmark />,
  },
];

export const ProfessionalArray = [
  {
    id: 1,
    label: "Overview",
    value: "overview",
    icon: "",
  },
  {
    id: 2,
    label: "Address",
    value: "address",
    icon: " ",
  },
  {
    id: 3,
    label: "Store Bank Details",
    value: "store_bank_details",
    icon: " ",
  },
  {
    id: 3,
    label: "Store Staff",
    value: "store_staff",
    icon: " ",
  },

  {
    id: 4,
    label: "Services",
    value: "services",
    icon: " ",
  },
  {
    id: 5,
    label: " Bookings ",
    value: "bookings",
    icon: " ",
  },
];