import {
  FaClock,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaUserTie,
  FaBoxOpen,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Button from "../Button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Popup from "./Popup";

const StoreServiceCard = ({ service, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const role = localStorage.getItem("role")?.toLowerCase();
  const isStoreRole = role === "store";

  if (!service || !service._id) return null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow hover:shadow-xl transition-all duration-300 w-full md:w-[50vw] lg:w-[30vw]">
      {/* Cover Image */}
      <div className="relative h-52">
        <img
          src={
            service?.coverImage?.[0]?.url ||
            "https://placehold.co/600x400?text=Service"
          }
          alt={service?.name}
          className="w-full h-full object-cover"
        />

        <span
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${
            service?.isActive ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {service?.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{service?.name}</h2>

          <p className="text-sm text-[#8B2954] font-medium">
            {service?.category?.title}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Charges</p>
              <p className="font-semibold">
                ₹ {service?.charges || service?.price?.sellingPrice}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-[#8B2954]" />
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-semibold">{service?.duration} mins</p>
            </div>
          </div>
        </div>

        {isStoreRole && (
          <div className="flex gap-2 w-full justify-between">
            <Button
              variant="secondary"
              className="flex-1"
              LabelName={
                <span className="flex items-center justify-center gap-2">
                  <FaEdit />
                  Edit
                </span>
              }
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(service);
              }}
            />

            <Button
              className="flex-1 bg-red-600 text-white border border-red-600"
              LabelName={
                <span className="flex items-center justify-center gap-2">
                  <FaTrash />
                  Delete
                </span>
              }
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(service);
              }}
            />
          </div>
        )}
      </div>
      <Popup isOpen={showDetails} onClose={() => setShowDetails(false)}>
        <div className="bg-white flex md:justify-between justify-evenly items-start flex-col h-fit py-5 px-5 rounded-xl">
          {service?.isPrepTime && (
            <div className="bg-[#FFF6FA] rounded-lg p-3">
              <p className="font-medium text-[#8B2954]">Preparation Time</p>

              <p className="text-gray-600">{service?.prepTime} Minutes</p>

              <p className="text-xs text-gray-500 mt-1">
                {service?.timeIncludingPrepTime
                  ? "Included in total duration"
                  : "Additional to service duration"}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm">
              {service?.serviceFor}
            </span>

            {service?.onSite && (
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                On Site
              </span>
            )}

            {service?.inHouse && (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                In House
              </span>
            )}
          </div>
          <div className="text-sm">
            <p>
              <span className="font-semibold">Booking:</span>{" "}
              {service?.bookingDays}
            </p>

            <p>
              <span className="font-semibold">Hours:</span>{" "}
              {service?.bookingAcceptingHours?.from} -{" "}
              {service?.bookingAcceptingHours?.till}
            </p>
          </div>
          {service?.executive && (
            <div className="flex items-center gap-2">
              <FaUserTie className="text-[#8B2954]" />

              <div>
                <p className="text-xs text-gray-500">Executive</p>

                <p className="font-medium">{service?.executive?.name}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />

            <span>{service?.serviceArea}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaBoxOpen />

              <p className="font-semibold">Products Used</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {service?.products?.map((item, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                >
                  {item.productType} • {item.brand}
                </span>
              ))}
            </div>
          </div>
          {service?.serviceInclusion?.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Includes</p>

              <ul className="space-y-1">
                {service.serviceInclusion.slice(0, 3).map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <FaCheckCircle className="text-green-600 text-xs" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {service?.serviceExclusion?.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Excludes</p>

              <ul className="space-y-1">
                {service.serviceExclusion.slice(0, 2).map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <FaTimesCircle className="text-red-500 text-xs" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Popup>
      {/* <AnimatePresence>
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-screen bg-black/90 w-full flex justify-center items-center"
        >
          
        </motion.div>
      </AnimatePresence> */}
    </div>
  );
};

export default StoreServiceCard;
