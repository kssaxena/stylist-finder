import React from "react";
import { FaStar, FaClock } from "react-icons/fa";
import Button from "../../components/Button";
import { truncateString } from "../../utils/utility-functions";

const ServiceCard = ({ service }) => {
  return (
    <div className="flex flex-col justify-between items-start h-[58vh] md:h-fit lg:h-fit group w-full md:w-[60vw] lg:w-[50vw]  border-[0.1px] rounded-lg border-neutral-100 shadow">
      <div className="flex justify-center items-center flex-col rounded-t-lg overflow-hidden h-1/2 lg:h-[40vh]">
        <img
          src={service.image}
          alt={service.title}
          className="group-hover:scale-105 duration-500 ease-in-out"
        />
      </div>
      <div className="h-1/2 flex flex-col justify-between items-start w-full px-5 py-5">
        <div className="w-full flex flex-row justify-between items-start border-b border-neutral-300 pt-5 border-dashed">
          <div className="flex flex-col justify-start items-start">
            <h2 className="heading text-2xl leading-10">{service.title}</h2>
            <div className="flex justify-center items-center w-fit gap-2 paragraph text-xs border-b border-dashed">
              <FaStar className="text-[#d65f92] drop-shadow-2xl" />
              <span>{service.rating || "4.8"}</span>
              <span>({service.reviews || "500+"} Reviews)</span>
            </div>
            <div className="flex justify-center items-center w-fit gap-5 py-2">
              <span className="heading">
                Starts at <span className="text-2xl">₹ {service.price}</span>
              </span>{" "}
              <span className="w-2 h-2 rounded-full bg-black" />
              <span className="flex justify-center items-center gap-2">
                <FaClock />
                <span>{service.duration}</span>
              </span>
            </div>
          </div>
          <Button LabelName="Book now" variant="secondary" />
        </div>
        <div>
          {service?.description
            ?.slice(1, service.description.length)
            .map((item, index) => (
              <ul key={index}>
                <li>
                  {index + 1}. {truncateString(item, 50)}
                </li>
              </ul>
            ))}
        </div>
        <button className="heading hover:underline text-[#d65f92] duration-300 ease-in-out">
          View Details
        </button>
        <div className="w-full h-[4px] bg-neutral-100 rounded-full" />
      </div>
    </div>
  );
};

export default ServiceCard;
