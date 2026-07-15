// import React from "react";
// import InputBox from "../components/Input";
// import Button from "./Button";
// import { motion, AnimatePresence } from "framer-motion";

// const AppointmentForm = () => {
//   return (
//     <AnimatePresence>
//       <motion.div
//         // whileInView={{ opacity: 1, x: 0 }}
//         // initial={{ opacity: 0, x: -100 }}
//         // exit={{ opacity: 0, x: 100 }}
//         // transition={{ type: "keyframes", duration: 0.2, ease:"easeInOut" }}
//         className=""
//       >
//         <h2 className="text-2xl font-bold ">Your Location</h2>

//         <InputBox
//           type="text"
//           LabelName="State"
//           Placeholder="Enter your state name"
//           className=""
//         />

//         <InputBox
//           type="text"
//           LabelName="City"
//           Placeholder="Enter your city name"
//           className=""
//         />
//         <InputBox
//           type="text"
//           LabelName="Pin Code"
//           Placeholder="Enter your pin code"
//           className=""
//         />
//         <Button LabelName="Save & Continue" className="w-full mt-4" />
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default AppointmentForm;

import React, { useState } from "react";
import InputBox from "./Input";
import Button from "./Button";
import { IoArrowForward } from "react-icons/io5";
import popularCities from "../constants/PopularCity";
import { genderData } from "../constants/genderData";
import { femaleServices } from "../constants/femaleServices";
import { maleServices } from "../constants/maleServices";
import { FaArrowLeft, FaArrowRight, FaLeaf } from "react-icons/fa";


const AppointmentForm = ({ onClose }) => {
  // Step State
  const [step, setStep] = useState(1);

  // Location State
  const [location, setLocation] = useState({
    state: "",
    city: "",
    pincode: "",
  });

  // Gender State
  const [gender, setGender] = useState("");

  // Service State
  const [service, setService] = useState("");

  // Step 1
  const handleLocation = () => {
    // if (location?.pincode) {
    //   return setStep(2);
    // }
    // if (location?.city) {
    //   return setStep(2);
    // }

    setStep(2);
  };

  // Step 2
  const handleGender = () => {
    if (!gender) {
      alert("Please select gender");
      return;
    }

    setStep(3);
  };

  // Step 3
  const handleFinish = () => {
    if (!service) {
      alert("Please select a service");
      return;
    }

    const params = {
      location,
      gender,
      service,
    };

    localStorage.setItem("params", JSON.stringify(params));

    alert("Appointment data saved!");

    // const response = await FetchData(`get/${params?.location?.pincode}/${params?.gender}/${params?.service}`,"get")

    if (onClose) {
      onClose();
    }
  };
  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const services = gender === "Male" ? maleServices : femaleServices;

  // const {user} = useSelector((state)=>state.auth)

  // if(!user){return <Location/>}
  // if(user) {return <Gender/>}

  // 1. Location fetch (user: pincode, city, coordinates)
  // 2. Gender (user: male, female)
  // 3. Service Category ({male: hair, beard etc.}:{female: hair, beard, waxing etc.})

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
              className="flex-1 justify-between md:px-6 px-4 py-3 outline-none"
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

          <div className="grid md:grid-cols-4 grid-cols-3 gap-3 md:px-20">
            {popularCities.map((city) => {
              const Icon = city.icon;

              return (
                <div
                  key={city.id}
                  onClick={() => setLocation({ city: city?.name })}
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

          <Button
            LabelName="Save & Continue"
            className="w-full"
            onClick={handleLocation}
          />
          {/* <Button
            LabelName="Save & Continue"
            className="w-full"
            onClick={() => {
              handleLocation();

            }}
          /> */}
        </div>
      )}

      {/* ---------------- STEP 2 ---------------- */}

      {/* {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-center">Choose your Gender</h2>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              value="Male"
              checked={gender === "Male"}
              onChange={(e) => setGender(e.target.value)}
            />
            Male
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              value="Female"
              checked={gender === "Female"}
              onChange={(e) => setGender(e.target.value)}
            />
            Female
          </label>

          <Button
            LabelName="Continue"
            className="w-full"
            onClick={handleGender}
          />
        </div>
      )} */}
      {step === 2 && (
        <>
          <div className="text-center">
            <FaLeaf className="mx-auto text-[#8B2954] text-xl" />

            <h1 className="text-2xl  mt-4 text-[#4d1730]">
              Choose your Gender
            </h1>

            <div className="w-72 h-0.5 rounded-full bg-pink-200 mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-8 py-8 md:px-28 px-20">
            {genderData.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => setGender(item.name)}
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

                  <h2 className="text-xl">{item.name}</h2>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleGender}
            className=" bg-[#8B2954] text-white py-2 rounded-full w-2/3 mx-auto flex justify-center items-center gap-4 md:text-xl text-sm"
          >
            Continue
            <FaArrowRight className="text-xl" />
          </button>
        </>
      )}

      {/* ---------------- STEP 3 ---------------- */}

      {/* {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-center">Select Service</h2>

          {(gender === "Male" ? maleServices : femaleServices).map((item) => (
            <label key={item} className="flex items-center gap-3">
              <input
                type="radio"
                value={item}
                checked={service === item}
                onChange={(e) => setService(e.target.value)}
              />

              {item}
            </label>
          ))}

          <Button
            LabelName="Finish"
            className="w-full"
            onClick={handleFinish}
          />
        </div>
      )} */}
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
                  onClick={() => setService(item.title)}
                  className={`cursor-pointer rounded-xl border p-4 flex items-center gap-4 transition

                  ${
                    service === item.title
                      ? "border-[#8B2954]"
                      : "border-gray-300"
                  }`}
                >

                  <button
                    checked={service === item.title}
                    readOnly
                    className="w-10 h-10 rounded-full bg-pink-100 flex justify-center items-center"
                  >
                    <Icon className="text-[#8B2954] text-2xl" />
                  </button>

                  <p className="text-[13px]">{item.title}</p>
                </div>
              );
            })}
          </div>

          <button
            disabled={!service}
            onClick={handleFinish}
            className=" bg-[#8B2954] font-light text-white py-2 rounded-full w-2/3 mx-auto md:text-xl text-sm flex justify-center items-center gap-2"
          >
            Finish
            <FaArrowRight className="md:text-lg text-sm" />
          </button>
        </>
      )}
    </div>
  );
};

export default AppointmentForm;
