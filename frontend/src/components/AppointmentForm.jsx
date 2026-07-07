import React from "react";
import InputBox from "../components/Input";
import Button from "./Button";
import { motion, AnimatePresence } from "framer-motion";

const AppointmentForm = () => {
  return (
    <AnimatePresence>
      <motion.div
        // whileInView={{ opacity: 1, x: 0 }}
        // initial={{ opacity: 0, x: -100 }}
        // exit={{ opacity: 0, x: 100 }}
        // transition={{ type: "keyframes", duration: 0.2, ease:"easeInOut" }}
        className=""
      >
        <h2 className="text-2xl font-bold ">Your Location</h2>

        <InputBox
          type="text"
          LabelName="State"
          Placeholder="Enter your state name"
          className=""
        />

        <InputBox
          type="text"
          LabelName="City"
          Placeholder="Enter your city name"
          className=""
        />
        <InputBox
          type="text"
          LabelName="Pin Code"
          Placeholder="Enter your pin code"
          className=""
        />
        <Button LabelName="Save & Continue" className="w-full mt-4" />
      </motion.div>
    </AnimatePresence>
  );
};

export default AppointmentForm;
