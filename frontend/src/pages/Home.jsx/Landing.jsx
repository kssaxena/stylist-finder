import React from 'react'
import HeroVdo from "../../assets/HeroVdo.mp4"
import Button from '../../components/Button';
import { useState } from 'react';

function Landing() {
    const [isOpen, setIsOpen] = useState(false);
    
      const [appointmentType, setAppointmentType] = useState("");
    
      const openSelfAppointment = () => {
        setAppointmentType("self");
        setIsOpen(true);
      };
    
      const openSomeoneAppointment = () => {
        setAppointmentType("someone");
        setIsOpen(true);
      };
    
      const closePopup = () => {
        setIsOpen(false);
      };
  return (
      <div className="w-full h-full">
     
        <video
          src={HeroVdo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className=" w-full h-full"
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute lg:top-44 top-34 lg:w-1/2 w-full lg:left-96 p-4 flex flex-col  gap-8 text-white items-center ">
          <p className="lg:text-lg text-sm p text-center">
            {" "}
            Luxury Beauty & Wellness Studio{" "}
          </p>
          <h1 className="lg:text-5xl text-3xl text-center p">
            Reveal Your Natural Beauty, <br /> Elevate{" "}
            <span className="font-bold ">Your Confidence.</span>
          </h1>
          <p className="text-wrap lg:text-lg tex-sm text-center ">
            Experience premium beauty treatments, expert makeup artistry, hair
            styling, skincare, and wellness services tailored to make you look
            and feel your absolute best.
          </p>

          <div className="flex gap-4">
            <Button
              LabelName="Book Appointment"
              onClick={openSelfAppointment}
            />
            <Button
              LabelName="Book Appointment for Someone"
              onClick={openSomeoneAppointment}
              variant="Secondary"
            />
          </div>
        </div>
      </div>
    
  );
}

export default Landing
