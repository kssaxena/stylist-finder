import { FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { truncateString } from "../../utils/utility-functions";
import SkinCare from "../../assets/Service/SkinCare.png";
import HairCare from "../../assets/Service/HairCare.png";
import Threading from "../../assets/Service/Threading.png";

const services = [
  {
    id: 1,
    image: SkinCare,
    title: "Facial Services",
    description:
      "Rejuvenate your skin with personalized facials, deep cleansing, hydration, and advanced skincare treatments for a healthy, radiant glow.",
  },
  {
    id: 2,
    image: HairCare,
    title: "Hair Spa",
    description:
      "Transform your hair with professional haircuts, styling, spa treatments, smoothening, coloring, and nourishing hair therapies.",
  },

  {
    id: 5,
    image: Threading,
    title: "Threading & Waxing",
    description:
      "Experience precise eyebrow threading and smooth waxing services for silky, hair-free skin with long-lasting results.",
  },
]




const ServiceCard = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <div className="">
        <h1 className="text-2xl uppercase font-semibold text-[#8B2954]">
          Services we offer
        </h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 justify-center items-center w-fit gap-10">
        {services.map((service) => (
          <div
            key={service.id}
            className="h-fit pb-2 w-72 border rounded-xl  overflow-hidden flex flex-col justify-between items-center shadow-md border-[#F6D6DA]"
          >
            <div className="flex flex-col gap-4">
              {" "}
              <div className="h-36 ">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-1">
                <h3 className="text-lg text-center font-bold text-[#8B2954] h1">
                  {service.title}
                </h3>

                <p className=" text-center text-gray-600 p  leading-6 text-[10px]">
                  {service.description}
                  {/* {truncateString(service.description, 50)} */}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCard;
