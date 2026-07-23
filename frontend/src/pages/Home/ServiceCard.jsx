import { FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { truncateString } from "../../utils/utility-functions";
import { AllServices } from "../../constants/constants";

const ServiceCard = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <div className="">
        <h1 className="heading text-2xl uppercase font-semibold text-[#8B2954]">
          Services we offer
        </h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 justify-center items-center w-fit gap-10">
        {AllServices.map((service) => (
          <div
            key={service.id}
            className="md:h-[40vh] h-[35vh] pb-2 md:w-72 w-[90vw] border rounded-xl  overflow-hidden flex flex-col justify-between items-center shadow-md border-[#F6D6DA]"
          >
            <div className="flex flex-col gap-4 h-full">
              {" "}
              <div className="md:h-1/2 h-[60%]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-1 h-1/2 flex flex-col justify-start items-center gap-3">
                <h3 className="text-lg text-center font-bold text-[#8B2954] heading">
                  {service.title}
                </h3>

                <p className="text-gray-600 paragraph text-center track">
                  {service.description}
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
