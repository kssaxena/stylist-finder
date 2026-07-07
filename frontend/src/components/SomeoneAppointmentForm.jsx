import React from "react";
import InputBox from "./Input";
import Button from "./Button";

const SomeoneAppointmentForm = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold ">Your Location</h2>

      <div className="grid grid-cols-2 gap-4">
        <InputBox
          type="text"
          LabelName="State"
          Placeholder="Enter your state name"
        />

        <InputBox
          type="text"
          LabelName="City"
          Placeholder="Enter your city name"
        />
        <InputBox
          type="text"
          LabelName="Pin code"
          Placeholder="Enter your pin code"
        />
        <InputBox
          type="text"
          LabelName="Recipient name"
          Placeholder="Enter recipient name"
        />
        <InputBox
          type="text"
          LabelName="Recipient number"
          Placeholder="Enter recipient number"
        />
      </div>

      <Button LabelName="Save & Continue" className="w-full" />
    </div>
  );
};

export default SomeoneAppointmentForm;
