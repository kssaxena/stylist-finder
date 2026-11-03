import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaShieldAlt,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import Button from "../Button";
import { TiWarning } from "react-icons/ti";
import { FetchData } from "../../utils/FetchFromApi";
import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Popup from "./Popup";
import LoadingUI from "./LoadingUI";

const CustomerProfileCard = ({
  customer,
  startLoading,
  stopLoading,
  reload,
  customerId,
}) => {
  const [popup, setPopup] = useState(false);
  const formRef = useRef();

  const updateGender = async (e) => {
    e.preventDefault();

    try {
      startLoading();
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `customer/update/gender/${customerId}`,
        "post",
        formData,
      );
      reload();
    } catch (err) {
      // console.log(err);
    } finally {
      stopLoading();
    }
  };
  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden ">
      {/* Header */}
      <div className="bg-[#8B2954] px-8 py-8 text-white">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-3xl font-bold">
            {customer?.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{customer?.name}</h2>
            <span
              className={`inline-flex mt-3 px-3 py-1 rounded-full text-sm font-medium ${
                customer?.isActive
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {customer?.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}

      <div className="grid md:grid-cols-2 gap-2 p-4">
        <InfoCard
          icon={<FaUser size={18} />}
          title="Gender"
          value={
            customer?.gender === "Prefer not to say" ? (
              <div>
                <h1 className="flex justify-start items-center gap-1 ">
                  <TiWarning />
                  {customer?.gender}
                </h1>
                <Button
                  LabelName="update gender"
                  onClick={() => setPopup(true)}
                />
              </div>
            ) : (
              customer?.gender
            )
          }
        />

        <InfoCard
          icon={<FaPhoneAlt size={18} />}
          title="Phone"
          value={customer?.contactNumber}
        />

        <InfoCard
          icon={<FaEnvelope size={18} />}
          title="Email"
          value={customer?.email}
        />

        <InfoCard
          icon={<FaCheckCircle size={18} />}
          title="Profile Completion"
          value={customer?.isProfileComplete ? "Completed" : "Incomplete"}
        />

        <InfoCard
          icon={<FaCalendarAlt size={18} />}
          title="Member since"
          value={new Date(customer?.createdAt).toLocaleDateString()}
        />
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-8 pb-8">
        <StatCard title="Addresses" value={customer?.address?.length || 0} />

        <StatCard title="Bookings" value={customer?.bookings?.length || 0} />

        <StatCard
          title="Favourite Stores"
          value={customer?.favStore?.length || 0}
        />

        <StatCard
          title="Favourite Pros"
          value={customer?.favProfessional?.length || 0}
        />
      </div>
      <Popup isOpen={popup} onClose={() => setPopup(false)} center={true}>
        <form
          ref={formRef}
          onSubmit={updateGender}
          className=" md:w-96 w-full flex justify-center items-center gap-5 flex-col"
        >
          <div className="w-full hidden lg:flex justify-center items-center">
            <img
              src={"https://ik.imagekit.io/cuteandglow/Gender%20Equality.svg"}
              alt="Login"
              className="w-[70%]"
            />
          </div>
          <h1 className="heading">Update your gender </h1>
          <select
            name="gender"
            // value={}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-neutral-50 text-gray-700 outline-none focus:ring-1 focus:ring-[#8B2954] focus:border-[#8B2954] transition hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed`}
          >
            <option value="">Select</option>
            {["Male", "Female"].map((i, index) => (
              <option key={index} value={i}>
                {i}
              </option>
            ))}
          </select>
          <Button LabelName="confirm" type="submit" />
        </form>
      </Popup>
    </div>
  );
};

export default LoadingUI(CustomerProfileCard);

const InfoCard = ({ icon, title, value }) => (
  <div className="border-neutral-100 border rounded-2xl p-3 bg-gray-50">
    <div className="flex items-center gap-3 text-gray-500 mb-2">
      {icon}
      <span className="text-sm">{title}</span>
    </div>

    <p className="font-semibold break-words">{value || "--"}</p>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="rounded-2xl bg-gray-100 p-2 text-center">
    <h3 className="text-xl font-bold">{value}</h3>

    <p className="text-gray-500 mt-1">{title}</p>
  </div>
);
