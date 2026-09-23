import { useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCampground,
  FaCaretLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMarsStroke,
  FaServicestack,
  FaTimesCircle,
} from "react-icons/fa";
import {
  FaFemale,
  FaClock,
  FaTag,
  FaHome,
  FaUser,
  FaMapMarkerAlt,
  FaStopwatch,
  FaSearch,
} from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import { HiHeart, HiOutlineOfficeBuilding } from "react-icons/hi";
import ServiceDetailsSkeleton from "./CurrentServiceSkeleton";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../components/hooks/ToastContext";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdPricetag } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { BsChevronDown } from "react-icons/bs";
import CustomerServiceCard from "../../components/ui/CustomerServiceCard";

const AccordionCard = ({ description, isScrolled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const iconColor = isScrolled ? "text-gray-200" : "text-gray-500";

  return (
    <div className="w-full">
      <div className="w-full rounded-2xl backdrop-blur-3xl bg-neutral-100 overflow-hidden">
        {/* Header */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="
            w-full
            flex
            items-center
            justify-between
            gap-4
            px-5
            py-4
            text-left
            cursor-pointer
            hover:bg-neutral-200/60
            transition-colors
          "
        >
          <span className="font-semibold text-gray-800">Description</span>

          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0,
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className={iconColor}
          >
            <BsChevronDown className="text-lg" />
          </motion.div>
        </button>

        {/* Description */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                height: {
                  duration: 0.35,
                  ease: [0.4, 0, 0.2, 1],
                },
                opacity: {
                  duration: 0.2,
                },
              }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1">
                <p className="text-gray-600 leading-7 whitespace-pre-line">
                  {description || "No description available."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <FaSearch className="text-7xl text-neutral-300 mb-5" />

      <h2 className="heading text-3xl mb-2">No Services Found</h2>

      <p className="paragraph text-neutral-500 text-center max-w-lg">
        We couldn't find any services matching your filters. Try changing the
        search, category, or sorting options.
      </p>
    </div>
  );
};

const CurrentService = () => {
  const { serviceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState();
  const [popup, setPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;
  const navigate = useNavigate();
  const { alertInfo } = useToast();
  const [otherServices, setOtherServices] = useState([]);

  const ServiceInfo = [
    {
      title: "Category",
      value: services?.category?.title,
      icon: <FaTag />,
    },
    {
      title: "Booking Day",
      value: services?.bookingDays,
      icon: <FaCalendarAlt />,
    },
    {
      title: "Booking Time",
      value: `${services?.bookingAcceptingHours?.from} - ${services?.bookingAcceptingHours?.till}`,
      icon: <FaClock />,
    },
    {
      title: "Prep Time Included",
      value: services?.timeIncludingPrepTime ? "Yes" : "No",
      icon: <FaStopwatch />,
    },
  ];

  const sections = [
    {
      title: "Service Inclusion",
      icon: <FaCheckCircle />,
      data: services?.serviceInclusion || [],
      bg: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-700",
    },
    {
      title: "Service Exclusion",
      icon: <FaTimesCircle />,
      data: services?.serviceExclusion || [],
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-red-700",
    },
    {
      title: "Customer Requirements",
      icon: <FaExclamationTriangle />,
      data: services?.serviceRequirements || [],
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-700",
    },
  ];

  const getServiceById = async () => {
    try {
      setLoading(true);
      const response = await FetchData(
        `services/get/service/by-id/${serviceId}`,
        "get",
      );
      setServices(response.data.data.service);
      setOtherServices(response.data.data.otherServices);
    } catch (err) {
      // console.log(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServiceById();
  }, [serviceId]);

  return (
    <div className="space-y-6">
      {loading ? (
        <ServiceDetailsSkeleton />
      ) : services?.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="h-fit">
          <div className="bg-white rounded-3xl shadow-lg space-y-4 h-fit">
            <div className="grid lg:grid-cols-2 gap-6 p-6">
              <div>
                {/* Main Image */}
                <div className="relative group overflow-hidden rounded-xl">
                  {/* <div className="absolute top-4 left-4 bg-white/90 px-1 py-1 rounded-full text-sm font-semibold">
                    <HiHeart className="" />
                  </div> */}
                  <img
                    src={services?.coverImage?.[selectedImage]?.url}
                    alt={services?.name}
                    className="w-full h-[50vh] object-cover duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold">
                    {services?.coverImage?.length} Photos
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex  gap-4  overflow-x-auto pb-2">
                  {services?.coverImage?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`overflow-hidden rounded-xl transition-all duration-300
            ${
              selectedImage === index
                ? "ring-1 ring-purple-500 scale-105"
                : "opacity-70 hover:opacity-100"
            }`}
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="w-28 h-28 object-cover"
                      />
                    </button>
                  ))}
                </div>
                <div className=" flex flex-col items gap-6">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 mt-3 heading w-fit">
                      {services?.name}
                    </h1>

                    <div className="text-right">
                      <h3 className="heading text-2xl text-[#d65f92]">
                        {services?.price?.discount === 0 ? (
                          ""
                        ) : (
                          <div className="flex justify-center items-center gap-3">
                            <span className="line-through text-lg">
                              ₹ {services?.price?.mrp}
                            </span>
                            <span className="bg-green-300 text-xs text-green-800 rounded-full px-2 py-1">
                              {services?.price?.discount}%off
                            </span>
                          </div>
                        )}
                        {/* {services?.charges || services?.price?.sellingPrice}₹ */}
                        ₹{" "}
                        {Number(
                          services?.charges ||
                            services?.price?.sellingPrice ||
                            0,
                        ).toLocaleString("en-IN")}
                      </h3>

                      <Button
                        LabelName="Book now"
                        onClick={() => {
                          user
                            ? navigate(
                                `/services/book-service/${services?.name}/${services?._id}/${userId}`,
                              )
                            : alertInfo(
                                "Please login or register to continue !",
                              );
                          setPopup(true);
                          setTimeout(() => {
                            setPopup(false);
                          }, 5000);
                        }}
                      />
                    </div>
                  </div>

                  {/* Badges */}

                  <div className="grid grid-cols-2 place-items-center gap-2">
                    <div className="flex items-center gap-2 bg-white border border-neutral-100 rounded-xl px-2 py-1 shadow-sm">
                      <FaMarsStroke className="text-[#8B2954]" />
                      <span className="">{services?.category?.title}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-neutral-100 rounded-xl px-2 py-1 shadow-sm">
                      <FaFemale className="text-[#8B2954]" />
                      <span>{services?.serviceFor}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-neutral-100 rounded-xl px-2 py-1 shadow-sm">
                      <FaClock className="text-[#8B2954]" />
                      <span>{services?.duration} min</span>
                    </div>

                    {services?.isPrepTime && (
                      <div className="flex items-center gap-2 bg-white border border-neutral-100 rounded-xl px-2 py-1 shadow-sm">
                        <MdOutlineAccessTime className="text-[#8B2954]" />
                        <span>Prep : {services?.prepTime} min</span>
                      </div>
                    )}
                  </div>

                  {/* Service Highlights */}

                  <div className="grid md:grid-cols-2 grid-cols-2 place-items-center gap-2">
                    {/* <div className="bg-white w-28 h-fit rounded-2xl   flex flex-col items-center ">
                      <HiOutlineOfficeBuilding className="text-xl text-[#8B2954]" />
                      <p className="text-gray-500 text-sm mt-2">In House</p>
                      <span className="font-semibold text-green-600">
                        {services?.inHouse ? "Yes" : "No"}
                      </span>
                    </div> */}

                    <div className="bg-white w-28 h-fit rounded-2xl   flex flex-col items-center ">
                      <FaHome className="text-xl text-[#8B2954]" />
                      <p className="text-gray-500 text-sm mt-2">On Site</p>
                      <span className="font-semibold text-[#8B2954]">
                        {services?.onSite ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl w-28 h-fit   flex flex-col items-center ">
                      <FaMapMarkerAlt className="text-xl text-[#8B2954]" />
                      <p className="text-gray-500 text-sm mt-2">Service Area</p>
                      <span className="font-semibold">
                        {services?.serviceArea}
                      </span>
                    </div>
                  </div>
                  <AccordionCard description={services?.description} />
                </div>
              </div>
            </div>

            {/* products used  */}
            <div className="px-2 md:px-8 py-6 space-y-4 mx-8 rounded-lg border-neutral-200 md:border bg-neutral-100">
              <h2 className="text-2xl font-bold text-gray-800">
                Products used
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 w-full place-items-start gap-2">
                {services?.products?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-neutral-200 rounded-full flex  justify-center items-center gap-2 px-2 py-1 text-sm"
                  >
                    <p className="capitalize ">{item?.productType}</p> -
                    <h3 className="capitalize heading flex justify-center items-center gap-2">
                      <IoMdPricetag />
                      {item?.brand}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Information */}
            <div className="px-2 md:px-8 py-6 space-y-4 mx-8 rounded-lg border-neutral-200 md:border ">
              <h2 className="text-2xl font-bold text-gray-800">
                Service Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 w-full place-items-start">
                {ServiceInfo.map((item, index) => (
                  <div
                    key={index}
                    className=" flex justify-center items-start gap-6 py-2 md:py-6"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center text-xl">
                      {item.icon}
                    </div>

                    <div className="flex-col flex ">
                      <p className="text-gray-500 text-sm">{item.title}</p>

                      <h3 className="text-lg font-semibold text-gray-800 ">
                        {item.value}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Service Inclusion, exclusion and requirements */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-5 md:px-20">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className={`${section.bg} ${section.border} border rounded-3xl p-6 shadow-sm`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${section.iconBg} ${section.iconColor}`}
                    >
                      {section.icon}
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {section.title}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {section.data.length} Items
                      </p>
                    </div>
                  </div>

                  {/* List */}
                  <div className="space-y-4">
                    {section.data.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className={`mt-1 ${section.iconColor}`}>
                          {section.icon}
                        </span>

                        <p className="text-gray-700 leading-6">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-neutral-100 py-10 flex justify-center items-center flex-col">
              <h1 className="text-2xl heading ">
                Explore more services of this store
              </h1>
              <div className="flex flex-col md:flex-row justify-between items-center w-full pl-10">
                <div className="flex justify-center items-center lg:items-start flex-col">
                  <strong className="heading">Visit store: </strong>{" "}
                  <button
                    onClick={() =>
                      navigate(`/stores/${services?.store?._id}/current-store`)
                    }
                    className="hover:text-blue-500 hover:underline cursor-pointer"
                  >
                    {services?.store?.storeName}
                  </button>
                  {services?.executive ? (
                    <div className="flex justify-center items-center bg-neutral-200 p-2 rounded-xl gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img
                          src={services?.executive?.profileImage?.url}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h1 className="flex flex-col justify-center items-start heading">
                        <strong className="paragraph">
                          Executive details:{" "}
                        </strong>
                        <span>{services?.executive?.name}</span>
                        <span>
                          {services?.executive?.designation} |{" "}
                          {services?.executive?.experience}
                        </span>
                      </h1>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="w-full lg:w-[80vw] overflow-scroll flex p-5 gap-3">
                  {otherServices.map((service) => (
                    <div key={service._id} className="w-fit">
                      <CustomerServiceCard
                        service={service}
                        currentServicePage={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {popup && (
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen w-full flex justify-center items-center bg-white/90 z-50"
          >
            <div className="flex justify-center items-center flex-col gap-5 bg-neutral-200 shadow-2xl p-5 rounded-xl">
              <h1 className="flex justify-center items-center gap-2">
                Please login or register to continue
              </h1>
              <div className="flex justify-center items-center gap-5">
                <Button
                  LabelName={"Login"}
                  onClick={() => navigate(`/auth/${"login"}/${"customer"}`)}
                />
                <Button
                  LabelName={"Register"}
                  onClick={() => navigate(`/auth/${"register"}/${"customer"}`)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrentService;
