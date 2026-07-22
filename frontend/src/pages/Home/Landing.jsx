import React from "react";
import Button from "../../components/Button";
import { useState } from "react";
import Popup from "../../components/ui/Popup";
import ExploreServices from "../../components/ExploreServices";

function Landing() {
  const [isOpen, setIsOpen] = useState(false);
  const [appointmentType, setAppointmentType] = useState("");

  const openSelfAppointment = () => {
    setAppointmentType("self");
    setIsOpen(true);
  };

  const openExploreServices = () => {
    setAppointmentType("services");
    setIsOpen(true);
  };

  const closePopup = () => {
    https: setIsOpen(false);
  };
  return (
    <div className="w-full h-[100vh] relative">
      <div className="h-full w-full absolute -top-24 left-0">
        <video
          src={`https://ik.imagekit.io/parikrama/media-library-export-18-7-2026-10-8-9-690%20(1)/HeroVdo.mp4?updatedAt=1784349572125`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center gap-5 text-white/80">
        <p className="lg:text-lg text-sm text-center heading">
          Luxury Beauty & Wellness Studio{" "}
        </p>
        <h1 className="lg:text-5xl text-3xl text-center heading">
          Reveal Your Natural Beauty, <br /> Elevate{" "}
          <span className="font-bold ">Your Confidence.</span>
        </h1>
        <p className="text-wrap paragraph text-center">
          Experience premium beauty treatments, expert makeup artistry, hair
          styling, skincare, and wellness services <br /> Tailored to make you
          look and feel your absolute best.
        </p>

        <div className="flex gap-4">
          <Button
            LabelName="Book Appointment"
            onClick={() => {
              // openSelfAppointment();
              openExploreServices();
            }}
          />
          <Button
            LabelName="Explore Services"
            onClick={() => {
              openExploreServices();
            }}
          />
        </div>
      </div>
      <Popup isOpen={isOpen} onClose={closePopup}>
        {appointmentType === "self" ? <AppointmentForm /> : <ExploreServices />}
      </Popup>
    </div>
  );
}

export default Landing;
