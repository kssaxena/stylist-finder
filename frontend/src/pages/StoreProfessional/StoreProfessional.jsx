import Button from "../../components/Button";
import { FetchData } from "../../utils/FetchFromApi";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../../components/hooks/ToastContext";
import CustomerServiceCard from "../../components/ui/CustomerServiceCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { VscVerifiedFilled } from "react-icons/vsc";
import { formatTimeString } from "../../utils/utility-functions";

const ImageSlider = ({ data }) => {
  const images = data?.images?.gallery || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
        No images available
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      {/* Images */}
      <div className="relative w-full">
        <img
          src={images[currentIndex]?.url}
          alt={`Gallery image ${currentIndex + 1}`}
          className=" h-56 w-full object-cover transition-all duration-500 sm:h-72 md:h-96 lg:h-[500px]"
        />

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={prevSlide}
            className=" absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60 sm:left-5 sm:p-3"
          >
            <IoIosArrowBack className="text-xl sm:text-2xl" />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={nextSlide}
            className=" absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60 sm:right-5 sm:p-3"
          >
            <IoIosArrowForward className="text-xl sm:text-2xl" />
          </button>
        )}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${currentIndex === index ? "w-6 bg-white" : "w-2 bg-white/60"}
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StoreProfessional = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [data, setData] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const { alertError } = useToast();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await FetchData(
        `store/get/store-by-id/store/${storeId}`,
        "get",
      );
      setData(response.data.data.store);
      setService(response.data.data.services);
      console.log(response.data.data);
    } catch (err) {
      console.log(err.response.data);
      alertError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [storeId]);

  return (
    <div className="p-5 lg:p-10 flex flex-col gap-2 lg:gap-5">
      <div>
        <ImageSlider data={data} />
      </div>
      <h1 className="text-3xl font-semibold heading capitalize flex items-center">
        {data?.isVerified === true ? (
          <span>
            <VscVerifiedFilled className="text-green-600" />
          </span>
        ) : (
          ""
        )}
        {data?.storeName}
      </h1>
      <h1>
        <strong className="heading">Contact Info: </strong>
        <span>{data?.storeEmail}</span> |{" "}
        <span>{data?.storeContactNumber}</span>
      </h1>
      {data?.storeTimings?.openFrom ? (
        <h1 className="flex items-center gap-3">
          <strong className="heading">Timings: </strong>
          <span>
            {formatTimeString(data?.storeTimings?.openFrom) ||
              "No data available"}
          </span>{" "}
          to
          <span>{formatTimeString(data?.storeTimings?.openTill) || ""}</span>
        </h1>
      ) : (
        ""
      )}

      <div className="w-full border-[0.1px] " />
      <div className="">
        <h1 className="text-xl font-semibold heading capitalize">
          Service listed by {data?.storeName}
        </h1>
        <div className="w-full overflow-scroll flex p-5 gap-3">
          {service?.map((service) => (
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
  );
};

export default StoreProfessional;
