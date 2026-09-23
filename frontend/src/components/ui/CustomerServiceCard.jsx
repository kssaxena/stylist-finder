import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaStar } from "react-icons/fa";
import Button from "../Button";
import { truncateString } from "../../utils/utility-functions";
import { useNavigate } from "react-router-dom";

const CustomerServiceCard = ({ service, currentServicePage = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div className="w-[90vw] lg:w-[30vw] group bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl duration-300 flex flex-col h-full">
        {/* IMAGE */}

        <div
          onClick={() => navigate(`/services/${service?._id}/current-service`)}
          className="relative h-56 overflow-hidden cursor-pointer"
        >
          <img
            src={service?.coverImage?.[0]?.url || "/images/placeholder.jpg"}
            alt={service?.name}
            className=" w-full h-full object-cover group-hover:scale-105 duration-500"
          />

          <div className="absolute top-4 right-4">
            <span className=" bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
              {service?.serviceFor || "Everyone"}
            </span>
          </div>
        </div>

        {/* BODY */}

        <div className="flex flex-col flex-1 p-5">
          {/* Name */}

          <h2
            onClick={() =>
              navigate(`/services/${service?._id}/current-service`)
            }
            className="heading text-xl mb-2 line-clamp-2 cursor-pointer"
          >
            {service?.name}{" "}
            {currentServicePage === false ? (
              <span className="paragraph text-[10px] ">
                by {service?.store?.storeName}
              </span>
            ) : (
              ""
            )}
          </h2>

          {/* Rating */}

          <div className="flex items-center gap-2 text-sm mb-4">
            <FaStar className="text-yellow-500" />

            <span>{service?.rating || 4.8}</span>

            <span className="text-neutral-500">
              ({service?.reviews || "500+"})
            </span>
          </div>

          {/* Price */}

          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-neutral-500">Starts From</p>

              <h3 className="heading text-2xl text-[#d65f92]">
                {service?.price?.discount === 0 ? (
                  ""
                ) : (
                  <div className="flex justify-center items-center gap-3">
                    <span className="line-through text-lg">
                      ₹ {service?.price?.mrp}
                    </span>
                    <span className="bg-green-300 text-xs text-green-800 rounded-full px-2 py-1">
                      {service?.price?.discount}%off
                    </span>
                  </div>
                )}
                {/* {service?.charges || service?.price?.sellingPrice}₹ */}₹{" "}
                {Number(
                  service?.charges || service?.price?.sellingPrice || 0,
                ).toLocaleString("en-IN")}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <FaClock />

              {service?.duration}
            </div>
          </div>

          {/* INCLUSIONS */}
          {service?.serviceInclusion?.length > 0 ? (
            <div className="mb-4">
              <h4 className="heading text-sm mb-2">Includes</h4>

              <ul className="space-y-1">
                {service?.serviceInclusion?.slice(0, 2).map((item, index) => (
                  <li key={index} className="text-sm text-neutral-600">
                    • {truncateString(item, 40)}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            ""
          )}

          {/* Spacer */}

          <div className="flex-1" />

          {/* Buttons */}

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              LabelName="quick view"
              variant="outline"
              onClick={() => setShowDetails(true)}
            />

            <Button
              LabelName="View full details"
              onClick={() =>
                navigate(`/services/${service?._id}/current-service`)
              }
            />
          </div>
        </div>
      </div>

      {/* MODAL */}

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 overflow-y-auto p-5 "
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className=" bg-white rounded-2xl max-w-5xl mx-auto overflow-hidden "
            >
              {/* Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3">
                {service?.coverImage?.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt=""
                    className=" h-48 w-full object-cover rounded-xl "
                  />
                ))}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="heading text-3xl">{service?.name}</h2>

                  <Button
                    LabelName="Close"
                    variant="secondary"
                    onClick={() => setShowDetails(false)}
                  />
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                  <div>
                    <h3 className="heading mb-3">Service Inclusions</h3>

                    <ul className="space-y-2">
                      {service?.serviceInclusion?.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="heading mb-3">Service Exclusions</h3>

                    <ul className="space-y-2">
                      {service?.serviceExclusion?.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    LabelName="Book Appointment"
                    className="w-full"
                    onClick={() =>
                      navigate(`/services/${service?._id}/current-service`)
                    }
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomerServiceCard;
