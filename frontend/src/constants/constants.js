import { GiHairStrands, GiLipstick, GiBodyBalance } from "react-icons/gi";

import { FaSpa } from "react-icons/fa";

import { MdFaceRetouchingNatural } from "react-icons/md";
import { FaFemale, FaMale } from "react-icons/fa";

import { FaCut, FaUserTie } from "react-icons/fa";

import { GiBeard } from "react-icons/gi";

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
    placeholder: "Enter your name",
    name: "name",
    type: "text",
  },
  {
    label: "Contact Number",
    placeholder: "Enter your contact number",
    name: "contactNumber",
    type: "text",
  },
  {
    label: "Email",
    placeholder: "Enter your email",
    name: "email",
    type: "email",
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