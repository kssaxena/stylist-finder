import { FetchData } from "../../utils/FetchFromApi";
import Button from "../../components/Button";
import InputBox from "../../components/Input";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingUI from "../../components/ui/LoadingUI";
import { useToast } from "../../components/hooks/ToastContext";
import { FaMapMarkerAlt, FaUser } from "react-icons/fa";
import CustomerProfileCard from "../../components/ui/CustomerProfileCard";

const ServiceBooking = ({ startLoading, stopLoading }) => {
  const { serviceName, serviceId, userId } = useParams();
  const { alertInfo, alertSuccess, alertError } = useToast();
  const [customer, setCustomer] = useState({});
  const [customerAddress, setCustomerAddress] = useState({});
  const [customerDefaultAddress, setCustomerDefaultAddress] = useState({});
  const [service, setService] = useState({});
  const formRef = useRef();
  const navigate = useNavigate();
  const storeId = service?.store?._id;

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (customerDefaultAddress?.length === 0) {
      alertInfo("Please add an address first to proceed !");
      return;
    }
    try {
      startLoading();

      const formData = new FormData(formRef.current);

      const response = await FetchData(
        `service-booking/add/create/new-appointment/${userId}/${serviceId}/${storeId}`,
        "post",
        formData,
      );

      // console.log(response);
      navigate("/dashboard");
      alertSuccess("Appointment booked successfully !");
    } catch (err) {
      // console.log(err.response.data);
      alertError(err.response.data);
    } finally {
      stopLoading();
    }
  };

  const getCustomerById = async () => {
    try {
      startLoading();

      const response = await FetchData(
        `customer/get/customer/data/${userId}`,
        "get",
      );

      setCustomer(response.data.data.customer);
      setCustomerDefaultAddress(response.data.data.customer.address);
      setCustomerAddress(response.data.data.address);
    } catch (err) {
    } finally {
      stopLoading();
    }
  };

  const getServiceById = async () => {
    try {
      startLoading();

      const response = await FetchData(
        `services/get/service/by-id/${serviceId}`,
        "get",
      );

      setService(response.data.data.service);
    } catch (err) {
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    getServiceById();
    getCustomerById();
  }, [userId, serviceId]);

  const handleMarkAddressAsDefault = async ({ addressId }) => {
    try {
      startLoading();
      const response = await FetchData(
        `customer/update/add-address/${userId}/${addressId}`,
        "post",
      );
      getServiceById();
      getCustomerById();
    } catch (err) {
      // console.log(err);
    } finally {
      stopLoading();
    }
  };

  const displayServiceData = [
    { label: "name", value: service?.name },
    {
      label: "Booking",
      value: (
        <span>
          {" "}
          {service?.bookingAcceptingHours?.from} -
          {service?.bookingAcceptingHours?.till},
        </span>
      ),
    },
    { label: "Booking Day/s allowed", value: service?.bookingDays },
    { label: "Category", value: service?.category?.title },
    { label: "Duration (mins)", value: service?.duration },
    {
      label: "Requirements from customer-end",
      value: (
        <span className="flex flex-col justify-start items-start">
          {service?.serviceRequirements?.map((i, index) => (
            <span key={index}>
              {index + 1}. {i}
            </span>
          ))}
        </span>
      ),
    },
    {
      label: "Service offered by",
      value: service?.store?.storeName || service?.professional?.name || "--",
    },
  ];

  const displayChargesData = [
    { label: "Amount", value: service?.price?.sellingPrice },
    // { label: "Surge Fee", value: 110 },
    // { label: "Platform fee", value: 20 },
    {
      label: "Grand Total",
      value: service?.price?.sellingPrice,
      // value: 110 + 20 + service?.price?.sellingPrice,
    },
  ];

  return (
    <div
      className=" flex flex-col lg:flex-row justify-center items-start w-full gap-5 lg:gap-10 px-3 sm:px-5 py-3 lg:py-10 relative
      "
    >
      <div
        className=" w-full lg:w-[40%] bg-neutral-100 flex flex-col justify-center items-center rounded-xl py-4 lg:py-5 gap-5 lg:gap-6 static lg:sticky lg:top-24 lg:left-0 order-2 lg:order-1
        "
      >
        <h1 className="heading text-2xl sm:text-3xl text-[#8B2954] text-center">
          Service & Billing details
        </h1>

        {/* Service Details */}
        <div className="flex justify-start items-start flex-col w-full px-4 sm:px-5 gap-2">
          <h1 className="heading text-lg sm:text-xl">Service Details</h1>

          <div className="flex justify-start items-start flex-col w-full text-sm sm:text-base">
            {displayServiceData?.map((i, index) => (
              <h1 key={index} className="w-full">
                <strong className="heading capitalize">{i.label}: </strong>
                {i.value}
              </h1>
            ))}
          </div>
        </div>

        <div className="w-[90%] border border-[#8B2954]" />

        {/* Billing Details */}
        <div className="flex justify-start items-start flex-col w-full px-4 sm:px-5 gap-2">
          <h1 className="heading text-lg sm:text-xl">Billing Details</h1>

          <div className="flex justify-start items-start flex-col w-full text-sm sm:text-base">
            {displayChargesData?.map((i, index) => (
              <h1
                key={index}
                className="w-full flex justify-between items-center"
              >
                <strong className="heading capitalize">{i.label}: </strong>

                <span className="underline decoration-dashed underline-offset-2">
                  {i.value}
                </span>
              </h1>
            ))}
          </div>

          <div className="w-full border-[0.5px] border-[#8B2954]" />

          {/* <p className="text-xs flex justify-start items-center">
            <span className="heading">Platform fee:</span>
            This small fee helps us pay bills so that we can keep Cute & Glow
            running.
          </p> */}
        </div>

        {/* Booking Form */}
        <form
          onSubmit={handleBookAppointment}
          ref={formRef}
          className="
            flex flex-col
            justify-center items-center
            w-full
            px-4 sm:px-5
            gap-1
          "
        >
          <InputBox
            type="date"
            label="Date for booking"
            name="dateForBooking"
          />

          <InputBox
            type="text"
            label="Mode of payment"
            name="modeOfPayment"
            value={"Cash Payment"}
          />

          <InputBox
            type="number"
            name="bookingAmount"
            value={service?.price?.sellingPrice}
            className="hidden"
            required={false}
          />

          <InputBox
            type="text"
            name="address"
            value={customerDefaultAddress[0]?._id}
            className="hidden"
            required={customerDefaultAddress?.length === 0 ? false : true}
          />

          <Button
            className="w-full"
            LabelName="Book Appointment"
            type="submit"
          />
        </form>
      </div>

      {/* =========================================================
          CUSTOMER DETAILS
          Desktop: RIGHT
          Mobile: TOP
      ========================================================= */}
      <div
        className=" w-full lg:w-[60%] flex flex-col justify-start items-start gap-4 lg:gap-5 order-1 lg:order-2 min-w-0
        "
      >
        <h1 className="heading text-2xl sm:text-3xl text-[#8B2954]">
          Your details
        </h1>

        {/* =====================================================
            ADDRESS CARDS
        ===================================================== */}
        <div className=" w-full overflow-x-auto overflow-y-hidden flex snap-x snap-mandatory scroll-smooth pb-2 scrollbar-thin">
          {/* Default Address */}
          {customerDefaultAddress?.length === 0 ? (
            <Button
              LabelName="add address"
              onClick={() => navigate("/dashboard")}
            />
          ) : (
            <div className=" gap-1 mx-1 flex-shrink-0 w-[85vw] sm:w-64 text-xs select-none cursor-pointer snap-start">
              <div className="bg-neutral-200 rounded-2xl  shadow-md  border border-gray-200  p-3  hover:shadow-lg  transition  w-full  min-h-[180px]">
                {/* Top */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1 min-w-0">
                    <div className=" w-8 h-8 flex-shrink-0 rounded-full bg-pink-100 flex justify-center items-center text-[#8B2954]text-xl">
                      {customerDefaultAddress?.[0]?.icon || <FaUser />}
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-semibold text-lg truncate">
                        {customerDefaultAddress?.[0]?.addressType || "Na"}
                      </h2>

                      {customerDefaultAddress?.[0]?.defaultAddress && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>

                  <FaMapMarkerAlt className="text-xl flex-shrink-0" />
                </div>

                {/* Details */}
                <div className="mt-2 space-y-2">
                  <h3 className="font-semibold truncate">
                    {customerDefaultAddress?.[0]?.contactDetails?.name} |{" "}
                    {customerDefaultAddress?.[0]?.contactDetails?.contact}
                  </h3>

                  <p className="text-gray-500 heading">Your Address:</p>
                </div>

                <p className="leading-4 line-clamp-5">
                  {customerDefaultAddress?.[0]?.flatNumber}{" "}
                  {customerDefaultAddress?.[0]?.floor}{" "}
                  {customerDefaultAddress?.[0]?.block},{" "}
                  {customerDefaultAddress?.[0]?.societyName} <br />{" "}
                  {customerDefaultAddress?.[0]?.street1}{" "}
                  {customerDefaultAddress?.[0]?.street2
                    ? customerDefaultAddress?.[0]?.street2
                    : ""}{" "}
                  <br />
                  {customerDefaultAddress?.[0]?.area}, near{" "}
                  {customerDefaultAddress?.[0]?.locality} <br />{" "}
                  {customerDefaultAddress?.[0]?.sector ? (
                    <span>Sector: {customerDefaultAddress?.[0]?.sector}</span>
                  ) : (
                    ""
                  )}{" "}
                  <br />
                  {customerDefaultAddress?.[0]?.city},{" "}
                  {customerDefaultAddress?.[0]?.state}
                  <br />{" "}
                  <span className="heading">
                    {customerDefaultAddress?.[0]?.country}
                    {customerDefaultAddress?.[0]?.pincode
                      ? `-${customerDefaultAddress?.[0]?.pincode}`
                      : ""}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Other Address */}
          {customer?.address?.length === 0 ? (
            ""
          ) : Array.isArray(customer?.address) ? (
            <div className="flex text-xs select-none cursor-pointer">
              {customerAddress?.map((d, index) => (
                <div
                  onClick={() =>
                    handleMarkAddressAsDefault({
                      addressId: d?._id,
                    })
                  }
                  key={index}
                  className="
                    gap-1
                    mx-1
                    flex-shrink-0
                    w-[85vw] sm:w-64
                    snap-start
                  "
                >
                  <div
                    className="
                      bg-white
                      rounded-2xl
                      shadow-md
                      border border-gray-200
                      p-3
                      hover:shadow-lg
                      transition
                      w-full
                      min-h-[180px]
                    "
                  >
                    {/* Top */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1 min-w-0">
                        <div
                          className="
                            w-8 h-8
                            flex-shrink-0
                            rounded-full
                            bg-pink-100
                            flex justify-center items-center
                            text-[#8B2954]
                            text-xl
                          "
                        >
                          {d?.icon || <FaUser />}
                        </div>

                        <div className="min-w-0">
                          <h2 className="font-semibold text-lg truncate">
                            {d?.addressType || "Na"}
                          </h2>

                          {d?.defaultAddress && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                      </div>

                      <FaMapMarkerAlt className="text-[#8B2954] text-xl flex-shrink-0" />
                    </div>

                    {/* Details */}
                    <div className="mt-2 space-y-2">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {d?.contactDetails?.name} | {d?.contactDetails?.contact}
                      </h3>

                      <p className="text-gray-500 heading">Your Address:</p>
                    </div>

                    <p className="text-gray-600 leading-4 line-clamp-5">
                      {d?.flatNumber} {d?.floor} {d?.block}, {d?.societyName}
                      <br />
                      {d?.street1} {d?.street2 ? d?.street2 : ""}
                      <br />
                      {d?.area}, near {d?.locality}
                      <br /> {d?.sector ? (
                        <span>Sector: {d?.sector}</span>
                      ) : (
                        ""
                      )}{" "}
                      <br />
                      {d?.city}, {d?.state}
                      <br />{" "}
                      <span className="heading">
                        {d?.country}
                        {d?.pincode ? `-${d?.pincode}` : ""}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>

        {/* Customer Profile */}
        <div className="w-full">
          <CustomerProfileCard
            customer={customer}
            customerId={customer?._id}
            reload={() => {
              getCustomerById();
              getServiceById();
            }}
          />
        </div>
      </div>

      {/* Existing divider - desktop only */}
      <div className="hidden lg:block h-full bg-neutral-900 w-[0.5px]" />
    </div>
  );
};

export default LoadingUI(ServiceBooking);
