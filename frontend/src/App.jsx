import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Button from "./components/Button";
import InputBox from "./components/Input";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Authentication from "./pages/Authentication";
import Service from "./pages/Services/Service";
import Dashboard from "./pages/Dashboard/Dashboard";


function App() {
  return (
    <div className="">
      <Header />
      <div className="pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/:type" element={<Authentication />} />
          <Route
            path={"/services/:location/:gender/:category"}
            element={<Service />}
          />
          <Route
            path="/services/location/female/category"
            element={<Service />}
          />
          <Route path="/services/all" element={<Service />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
export default App;
