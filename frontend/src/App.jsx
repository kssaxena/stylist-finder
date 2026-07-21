import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Button from "./components/Button";
import InputBox from "./components/Input";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Authentication from "./pages/Auth/Authentication";
import Service from "./pages/Services/Service";
import Dashboard from "./pages/Dashboard/Dashboard";
import ScrollToTop from "./components/hooks/ScrollToTop";

function App() {
  const location = useLocation();

  const hideFooter = location.pathname === "/dashboard";

  return (
    <div className="">
      <Header />
      <ScrollToTop />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/:type/:userType" element={<Authentication />} />
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
      {!hideFooter && <Footer />}
    </div>
  );
}
export default App;
