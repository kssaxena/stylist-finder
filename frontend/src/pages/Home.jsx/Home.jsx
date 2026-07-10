import React from "react";
import Landing from "./Landing";
import ServiceCard from "./ServiceCard";
import ChooseUs from "./ChooseUs";

function Home() {
  return (
    <div className="h-full flex flex-col gap-10 relative">
      <Landing />
      <ServiceCard />
      <ChooseUs />
    </div>
  );
}

export default Home;
