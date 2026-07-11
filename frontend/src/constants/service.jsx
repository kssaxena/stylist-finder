import SkinCare from "../assets/Service/SkinCare.png";
import BodyCare from "../assets/Service/BodyCare.png";
import HairCare from "../assets/Service/HairCare.png";
import Makeup from "../assets/Service/makeup.png";
import Nail from "../assets/Service/Nail.png";
import Threading from "../assets/Service/Threading.png";
import Bridal from "../assets/Service/Bridal.png";
import MensHaircut from "../assets/Service/MensHaircut.png";
import BeardGrooming from "../assets/Service/BeardGrooming.png";

export const services = [
  {
    id: 1,
    gender: "Female",
    category: "packages",

    title: "Basic Makeup Package",

    price: 2200,

    duration: "1 hr 30 mins",

    image: Makeup,

    description: "Ideal for parties, office events and functions.",
  },

  {
    id: 2,

    gender: "Female",

    category: "packages",

    title: "HD Makeup Package",

    price: 4200,

    duration: "2 hrs",

    image: Makeup,

    description: "Premium HD bridal and party makeup.",
  },

  {
    id: 3,

    gender: "Female",

    category: "hair",

    title: "Hair Spa",

    price: 1200,

    duration: "60 mins",

    image: HairCare,

    description: "Professional hair spa for silky smooth hair.",
  },

  {
    id: 4,

    gender: "Female",

    category: "saree",

    title: "Saree Draping",

    price: 800,

    duration: "45 mins",

    // image: Saree,

    description: "Traditional and modern saree draping.",
  },

  {
    id: 5,

    gender: "male",

    category: "hair",

    title: "Hair Cut",

    price: 350,

    duration: "30 mins",

    image: HairCare,

    description: "Professional haircut for men.",
  },

  {
    id: 6,

    gender: "male",

    category: "beard",

    title: "Beard Styling",

    price: 250,

    duration: "20 mins",

    image: BeardGrooming,

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
