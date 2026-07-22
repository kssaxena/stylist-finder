import React, { useState } from "react";
import InputBox from "./Input";
import Button from "./Button";
import { IoArrowForward } from "react-icons/io5";
import popularCities from "../constants/PopularCity";
import { genderData } from "../constants/constants";
import { femaleServices } from "../constants/constants";
import { maleServices } from "../constants/constants";
import { FaArrowLeft, FaArrowRight, FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ExploreServices = ({ onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState("");
  const [service, setService] = useState("");
  const [location, setLocation] = useState({
    city: "",
    pincode: "",
  });

  // Step 1
  const handleLocation = () => {
    setStep(2);
  };

  // Step 2
  const handleGender = () => {
    setStep(3);
  };

  // Step 3
  const handleFinish = () => {
    const city = location.city;
    const genderData = gender;
    const category = service;
    // if (!city || !genderData || !category) {
    //   navigate("/services/all");
    // }
    navigate("/services/all");

    // navigate(`/services/${city}/${genderData}/${category}`);
    // const response = await FetchData(`get/${params?.location?.pincode}/${params?.gender}/${params?.service}`,"get")

    if (onClose) {
      onClose();
      setLocation("");
      setGender("");
      setService("");
    }
  };
  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
    setLocation("");
    setGender("");
    setService("");
  };

  const services = gender === "Male" ? maleServices : femaleServices;
  return (
    <div className="space-y-6">
      <button onClick={handleBack}>
        <FaArrowLeft className="text-gray-600" />
      </button>
      {/* ---------------- STEP 1 ---------------- */}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Select Location</h2>

          <div className="mt-8 flex border border-neutral-200 hover:border-[#8B2954] rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Enter your Pincode"
              // value={pincode}
              // onChange={(e) => setPincode(e.target.value)}
              className="flex-1 md:px-6 px-4 justify-between py-3 outline-none"
            />

            <button
              // onClick={handlePincodeSearch}
              className="px-8 text-[#8B2954] text-3xl"
            >
              <IoArrowForward />
            </button>
          </div>

          <div className="my-10 flex items-center gap-5">
            <div className="flex-1 border"></div>

            <h3 className="text-xl">Or Select Your City</h3>

            <div className="flex-1 border"></div>
          </div>

          <div className="grid md:grid-cols-4 grid-cols-3 gap-3 md:px-20 ">
            {popularCities.map((city) => {
              const Icon = city.icon;

              return (
                <div
                  key={city.id}
                  onClick={() => {
                    setLocation({ city: city?.name });
                    handleLocation();
                  }}
                  className="cursor-pointer flex flex-col items-center group"
                >
                  <div className="w-16 h-16 rounded-xl bg-pink-50 flex items-center justify-center group-hover:bg-[#8B2954] transition">
                    <Icon className="text-2xl text-pink-900 group-hover:text-white transition" />
                  </div>

                  <p className="mt-3 text-sm">{city.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- STEP 2 ---------------- */}
      {step === 2 && (
        <>
          <div className="text-center">
            <FaLeaf className="mx-auto text-[#8B2954] text-xl" />

            <h1 className="text-2xl  mt-4 text-[#4d1730]">
              Choose your Gender
            </h1>

            <div className="w-72 h-0.5 rounded-full bg-pink-200 mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 py-8 md:px-28 px-20">
            {genderData.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setGender(item.name);
                    handleGender();
                  }}
                  className={`cursor-pointer rounded-xl border py-4 px-2 flex items-center gap-4 transition

                  ${
                    gender === item.name
                      ? "border-[#8B2954]"
                      : "border-gray-300"
                  }`}
                >
                  <button
                    checked={gender === item.name}
                    readOnly
                    className="w-10 h-10 rounded-full bg-pink-100 flex justify-center items-center"
                  >
                    <Icon className="text-[#8B2954] text-xl" />
                  </button>

                  <h2 className="md:text-xl text-sm">{item.name}</h2>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ---------------- STEP 3 ---------------- */}
      {step === 3 && (
        <>
          <div className="text-center ">
            <FaLeaf className="mx-auto text-[#8B2954] text-xl" />

            <h1 className="text-2xl font-serif text-[#4d1730] p-2">
              Select Service
            </h1>

            <div className="w-72 h-0.5 rounded-full bg-pink-200 mx-auto " />
          </div>

          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {services.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setService(item.value);
                    handleFinish();
                  }}
                  className={`cursor-pointer rounded-xl border p-4 flex items-center gap-4 transition

                  ${
                    service === item.title
                      ? "border-[#8B2954]"
                      : "border-gray-300"
                  }`}
                >
                  <button
                    // checked={service === item.title}
                    // readOnly
                    className="w-10 h-10 rounded-full bg-pink-100 flex justify-center items-center"
                  >
                    <Icon className="text-[#8B2954] text-xl" />
                  </button>

                  <p className="text-[13px]">{item.title}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ExploreServices;
