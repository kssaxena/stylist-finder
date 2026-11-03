import { GiHairStrands, GiLipstick, GiBodyBalance } from "react-icons/gi";
import { FaSpa } from "react-icons/fa";
import { MdFaceRetouchingNatural } from "react-icons/md";
import { FaFemale, FaMale } from "react-icons/fa";
import { FaCut, FaUserTie } from "react-icons/fa";
import { GiBeard } from "react-icons/gi";
import { FaUserAlt } from "react-icons/fa";

export const femaleServices = [
  {
    id: 1,
    title: "Hair Care",
    icon: GiHairStrands,
  },
  {
    id: 2,
    title: "Skin Care",
    icon: MdFaceRetouchingNatural,
  },
  {
    id: 3,
    title: "Body Care",
    icon: GiBodyBalance,
  },
  {
    id: 4,
    title: "Makeup",
    icon: GiLipstick,
  },
  {
    id: 5,
    title: "Nail Extension",
    icon: FaSpa,
  },
  {
    id: 6,
    title: "Threading & Waxing",
    icon: MdFaceRetouchingNatural,
  },
];

export const maleServices = [
  {
    id: 1,
    title: "Hair Cut",
    value: "hairCut",
    icon: FaCut,
  },
  {
    id: 2,
    title: "Beard Styling",
    value: "beardStyling",
    icon: GiBeard,
  },
  {
    id: 3,
    title: "Hair Spa",
    value: "hairSpa",
    icon: FaCut,
  },
  {
    id: 4,
    title: "Facial",
    value: "facial",
    icon: FaUserTie,
  },
  {
    id: 5,
    title: "Hair Color",
    value: "hairColor",
    icon: FaCut,
  },
  {
    id: 6,
    title: "Head Massage",
    value: "headMassage",
    icon: FaUserTie,
  },
];

export const customerRegistrationInputs = [
  {
    label: "Name",
    storeLabel: "Store Name",
    placeholder: "Enter name",
    name: "name",
    type: "text",
  },
  {
    label: "Contact Number",
    storeLabel: "Store Contact Number",
    placeholder: "Enter contact number",
    name: "contactNumber",
    type: "text",
  },
  {
    label: "Email",
    storeLabel: "Store Email",
    placeholder: "Enter email",
    name: "email",
    type: "email",
    // required: false,
  },
  {
    label: "Password",
    storeLabel: "Password",
    placeholder: "",
    name: "password",
    type: "password",
    passwordIndication: true,
    placeholder: "Eg: Abcd@123",
  },
];

export const genderData = [
  {
    id: 1,
    name: "Male",
    icon: FaMale,
  },
  {
    id: 2,
    name: "Female",
    icon: FaFemale,
  },
];

export const AllServices = [
  {
    id: 1,
    image: `https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/SkinCare.png?updatedAt=1784349572669`,
    title: "Facial Services",
    description:
      "Rejuvenate your skin with personalized facials, deep cleansing, hydration, and advanced skincare treatments for a healthy, radiant glow.",
  },
  {
    id: 2,
    image: `https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/HairCare.png?updatedAt=1784349573394`,
    title: "Hair Spa",
    description:
      "Transform your hair with professional haircuts, styling, spa treatments, smoothening, coloring, and nourishing hair therapies.",
  },

  {
    id: 5,
    image: `https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/Threading.png?updatedAt=1784349573029`,
    title: "Threading & Waxing",
    description:
      "Experience precise eyebrow threading and smooth waxing services for silky, hair-free skin with long-lasting results.",
  },
];

export const bookings = [
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

export const activeBookings = [
  {
    id: 1,
    service: "Luxury Hair Spa",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
    store: "Elite Beauty Salon",
    professional: "Priya Sharma",
    date: "28 July 2025",
    time: "11:30 AM",
    location: "Harmu Road, Ranchi",
    status: "Professional On The Way",
    phone: "+91 9876543210",
  },
];

export const adminDashboardSection = [
  {
    query: "enquiries",
    label: "Enquiries",
    count: 0,
  },
  {
    query: "customer",
    label: "Customer",
    count: 0,
    icon: FaUserAlt,
  },
  {
    query: "store",
    label: "Store",
    icon: FaUserAlt,
    count: 0,
  },
  {
    query: "professional",
    label: "Professional",
    icon: FaUserAlt,
    count: 0,
  },
  {
    query: "categories",
    label: "Categories",
    count: 0,
  },
  {
    query: "active_services",
    label: "Active Service",
    count: 0,
  },
  {
    query: "inactive_services",
    label: "In Active Service",
    count: 0,
  },
  {
    query: "subscription",
    label: "Subscriptions",
    count: 0,
  },
  {
    query: "bookings",
    label: "Booking",
    count: 0,
  },
  {
    query: "payments",
    label: "Payments",
    count: 0,
  },
  {
    query: "adminsQuery",
    label: "Admins",
    count: 0,
  },
  {
    query: "franchise",
    label: "Franchise",
    count: 0,
  },
  {
    query: "products",
    label: "E-commerce products & stock",
    count: 0,
  },
  {
    query: "product_orders",
    label: "E-commerce orders",
    count: 0,
  },
];

export const homeBanners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600",
    title: "50% OFF on First Visit",
    subtitle: "Limited Time Offer",
    description: "Book your first salon appointment and save instantly.",
    link: "/services/all?offer=first-visit",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1600",
    title: "Bridal Makeup Packages",
    subtitle: "Wedding Special",
    description: "Premium bridal artists with HD and Airbrush makeup.",
    link: "/services/all?category=Bridal%20%26%20Event%20Makeup",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600",
    title: "Luxury Hair Spa",
    subtitle: "Hair Care",
    description: "Professional hair spa treatments starting at ₹499.",
    link: "/services/all?category=Hair%20Styling%20%26%20Treatments",
  },
];

export const formInputs = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
    placeholder: "Enter franchise name",
  },
  {
    label: "Subtitle name",
    name: "subtitle",
    type: "text",
    required: false,
    placeholder: "Eg: Efficient & Compact",
  },
  {
    label: "Total budget",
    name: "budget",
    type: "text",
    required: false,
    placeholder: "Eg: ₹10 Lakhs - ₹15 Lakhs",
  },
  {
    label: "Franchise fee",
    name: "franchiseFee",
    type: "text",
    required: false,
    placeholder: "Eg: ₹2L - ₹3L",
  },
  {
    label: "interior cost",
    name: "interior",
    type: "text",
    required: false,
    placeholder: "Eg: ₹4L - ₹5L",
  },
  {
    label: "equipment provided",
    name: "equipment",
    type: "text",
    required: false,
    placeholder: "Eg: ₹2.5L - ₹3L",
  },
  {
    label: "stock provided",
    name: "stock",
    type: "text",
    required: false,
    placeholder: "Eg: ₹1L - ₹1.5L",
  },
  {
    label: "marketing expenses",
    name: "marketing",
    type: "text",
    required: false,
    placeholder: "Eg: ₹50,000",
  },
  {
    label: "working Capital",
    name: "workingCapital",
    type: "text",
    required: false,
    placeholder: "Eg: ₹1,00,000",
  },
  {
    label: "space required",
    name: "space",
    type: "text",
    required: false,
    placeholder: "Eg: 300-500 Sq Ft",
  },
  {
    label: "staff requirement",
    name: "staff",
    type: "text",
    required: false,
    placeholder: "Eg: 2-3",
  },
  {
    label: "ROI",
    name: "roi",
    type: "text",
    required: false,
    placeholder: "Eg: 14-18 Months",
  },
  {
    label: "location ",
    name: "location",
    type: "text",
    required: false,
    placeholder:
      "Eg: Semi-urban areas, small towns (Tier-2/3 cities), or residential societies.",
  },
  {
    label: "services provided",
    name: "services",
    type: "text",
    required: false,
    placeholder:
      "Eg: Basic hair styling, threading, waxing, standard facials, manicures and pedicures.",
  },
  {
    label: "advantage",
    name: "advantage",
    type: "text",
    required: false,
    placeholder: "Explain all the advantage you are providing",
  },
];
