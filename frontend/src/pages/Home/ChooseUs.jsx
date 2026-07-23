import React from "react";
import { FaAward } from "react-icons/fa6";
import { RiTeamFill, RiFlowerFill } from "react-icons/ri";
import { IoIosHappy } from "react-icons/io";
import { ChooseUs as Data } from "../../constants/Constants.jsx";

const ChooseUs = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <div>
        <h1 className="text-2xl uppercase font-semibold text-[#8B2954] heading">
          Why choose us
        </h1>
      </div>
      <div className="paragraph grid md:grid-cols-2 lg:grid-cols-4 grid-cols-1 items-center justify-between px-4 py-8 rounded-lg border-neutral-100 gap-10 border mb-8 shadow-lg lg:mx-20">
        {Data.map((item, index) => (
          <div key={index} className="flex justify-center items-center h-full">
            <div
              key={index}
              className={`flex flex-col justify-center items-center gap-4 border-neutral-400 py-4 px-6 h-[20vh]`}
            >
              <div className="text-5xl text-[#8B2954] h-1/2 w-full justify-center items-center flex">
                {item.icon}
              </div>
              <div className="h-1/2 justify-center items-center flex flex-col text-center truncate gap-2">
                <h1 className="font-semibold">{item.name}</h1>
                <p className="text-[#2D2D2D]">{item.description}</p>
              </div>
            </div>
            <div
              className={`${index === Data.length - 1 ? "" : "border-[#8B2954] border h-full hidden lg:block"}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseUs;
