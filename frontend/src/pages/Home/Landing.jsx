import React from "react";
import Button from "../../components/Button";
import { useState } from "react";
import Popup from "../../components/ui/Popup";
import ExploreServices from "../../components/ExploreServices";
import { useNavigate } from "react-router-dom";

function Landing() {
  const [isOpen, setIsOpen] = useState(false);
  const [appointmentType, setAppointmentType] = useState("");
  const navigate = useNavigate();

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

        <div className="flex justify-center items-center flex-col w-full gap-5">
          <div className="flex justify-center items-center gap-5 w-full py-5 px-10">
            <Button
              LabelName="Avail franchise"
              onClick={() => navigate("/franchise/franchise-info")}
            />

            <Button
              LabelName="beauty course"
              onClick={() => navigate("/course/course-info")}
            />
          </div>
          <p>or</p>
          <div className="flex justify-center items-center gap-5">
            <Button
              LabelName="Register Parlor / Stores"
              onClick={() => navigate("/auth/register/store")}
            />
            <Button
              LabelName="Explore services"
              onClick={() => navigate("/services/all")}
            />
          </div>
        </div>
      </div>
      <Popup isOpen={isOpen} onClose={closePopup} center={true}>
        {appointmentType === "self" ? <AppointmentForm /> : <ExploreServices />}
      </Popup>
    </div>
  );
}

export default Landing;
