import React from "react";
import Landing from "./Landing";
import ServiceCard from "./ServiceCard";
import ChooseUs from "./ChooseUs";
import ServiceGrid from "../Services/ServiceGrid";
import { services } from "../../constants/service";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

function Home() {
  const demoService = services.slice(2, services.length);
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col gap-10 relative">
      <Landing />
      <ServiceCard />
      <ChooseUs />
      {/* remove this below section when not needed */}
      <div className="flex flex-col justify-center items-center gap-10">
        <h1 className="font-medium text-3xl w-full text-center">
          Explore Our Services
        </h1>
        <ServiceGrid services={demoService} className={"grid-cols-1 md:grid-cols-2"} />
        <Button
          LabelName="Explore More"
          onClick={() => navigate("/services/all")}
        />
      </div>
    </div>
  );
}

export default Home;
