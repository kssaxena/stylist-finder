import React from "react";
import { FaStar, FaClock } from "react-icons/fa";
import Button from "../../components/Button";

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
      {/* Service Image */}
      <div className="md:w-72 w-full h-60 md:h-auto">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <h1></h1>
      </div>

      {/* Service Details */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        {/* Top Section */}
        <div>
          {/* Service Name */}
          <h2 className="text-2xl font-bold text-gray-800">{service.title}</h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <FaStar className="text-yellow-400" />

            <span className="font-medium">{service.rating || "4.8"}</span>

            <span className="text-sm text-gray-500">
              ({service.reviews || "500+"} Reviews)
            </span>
          </div>

          {/* Price & Duration */}
          <div className="flex items-center gap-6 mt-4">
            <h3 className="text-2xl font-bold text-[#8B2954]">
              ₹ {service.price}
            </h3>

            <div className="flex items-center gap-2 text-gray-600">
              <FaClock />
              <span>{service.duration}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mt-4 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <Button LabelName="Book Now" variant="primary" />

          <Button LabelName="View Details" variant="secondary" />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
