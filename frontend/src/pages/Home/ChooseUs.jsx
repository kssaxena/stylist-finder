import React from "react";
import { FaAward } from "react-icons/fa6";
import { RiTeamFill, RiFlowerFill } from "react-icons/ri";
import { IoIosHappy } from "react-icons/io";

const ChooseUs = () => {
  const chooseUs = [
    {
      icon: <FaAward />,
      name: "Premium care",
      description: "Top Quality product for the best result",
    },
    {
      icon: <RiTeamFill />,
      name: "Expert Team",
      description: "Certified professional you can trust us",
    },
    {
      icon: <RiFlowerFill />,
      name: "Personalized Solution",
      description: "Customized  treatment just for you.",
    },
    {
      icon: <IoIosHappy />,
      name: "Relax And Rejuvanate",
      description: "Wellness therapies for mind & body ",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <div>
        <h1 className="text-2xl uppercase font-semibold text-[#8B2954]">
          Why choose us
        </h1>
      </div>
      <div className="p grid md:grid-cols-2 lg:grid-cols-4 grid-cols-1 items-center justify-center px-4 py-8 rounded-lg border-neutral-100 gap-10 border mb-8 shadow-lg lg:mx-20">
        {chooseUs.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col justify-center items-center gap-4 border-neutral-400 py-4 px-6 ${index === chooseUs.length - 1 ? "" : "lg:border-r"}`}
          >
            <div className="text-5xl text-[#8B2954]">{item.icon}</div>
            <h1 className="text-sm font-semibold">{item.name}</h1>
            <p className="text-xs text-[#2D2D2D]">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseUs;
