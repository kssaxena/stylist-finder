import { BsBank2 } from "react-icons/bs";
import {
  FaAward,
  FaHeart,
  FaImages,
  FaMapMarkerAlt,
  FaServicestack,
  FaUser,
} from "react-icons/fa";
import { GoVerified } from "react-icons/go";
import { IoIosHappy } from "react-icons/io";
import { IoStorefrontSharp } from "react-icons/io5";
import { MdDomainVerification } from "react-icons/md";
import { RiFlowerFill, RiTeamFill } from "react-icons/ri";

export const ChooseUs = [
  {
    icon: <FaAward />,
    name: "Premium care",
    description: "Top Quality product for the best result",
  },
  {
    icon: <RiTeamFill />,
    name: "Expert Team",
    description: "Certified professional you can trust us",
  },
  {
    icon: <RiFlowerFill />,
    name: "Personalized Solution",
    description: "Customized  treatment just for you.",
  },
  {
    icon: <IoIosHappy />,
    name: "Relax And Rejuvanate",
    description: "Wellness therapies for mind & body ",
  },
];

export const DashboardSectionList = [
  {
    label: "Overview",
    icon: <GoVerified />,
    query: "overview",
    roles: ["Customer", "Store", "Professional"],
  },
  {
    label: "Address",
    icon: <FaMapMarkerAlt />,
    query: "address",
    roles: ["Customer", "Store", "Professional"],
  },
  {
    label: "Bank Details",
    icon: <BsBank2 />,
    query: "bankDetails",
    roles: ["Customer", "Store", "Professional"],
  },
  {
    label: "Favorite Store",
    icon: <IoStorefrontSharp />,
    query: "fav_store",
    roles: ["Customer"],
  },
  {
    label: "Favorite Professional",
    icon: <FaHeart />,
    query: "fav_professional",
    roles: ["Customer"],
  },
  {
    label: "Wishlist Services",
    icon: <FaServicestack />,
    query: "wishlist_services",
    roles: ["Customer"],
  },
  {
    label: "Store Staff",
    icon: <FaUser />,
    query: "store_staff",
    roles: ["Store"],
  },
  {
    label: "Own Services ",
    icon: <FaUser />,
    query: "own_services",
    roles: ["Store", "Professional"],
  },
  {
    label: "Images",
    icon: <FaImages />,
    query: "images",
    roles: ["Store", "Professional"],
  },
  {
    label: "KYC",
    icon: <MdDomainVerification />,
    query: "kyc",
    roles: ["Store", "Professional"],
  },
];
