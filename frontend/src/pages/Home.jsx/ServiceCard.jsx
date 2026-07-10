import { FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import services from "../../constants/service";
import { truncateString } from "../../utils/utility-functions";

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
