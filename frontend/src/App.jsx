import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Button from "./components/Button";
import InputBox from "./components/Input";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Authentication from "./pages/Auth/Authentication";
import Dashboard from "./pages/Dashboard/Dashboard";
import ScrollToTop from "./components/hooks/ScrollToTop";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearUser, stopAuthLoading } from "./redux/slice/authSlice";
import { FetchData } from "./utils/FetchFromApi";
import Service from "./pages/Services/Service";
import CurrentService from "./pages/CurrentService/CurrentService";
import StoreProfessional from "./pages/StoreProfessional/StoreProfessional";
import ServiceBooking from "./pages/ServiceBooking/ServiceBooking";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import TermsAndConditions from "./pages/CMS/TermsAndConditions";
import Policy from "./pages/CMS/Policy";
import AdminAuth from "./pages/Auth/AdminAuth";
import CurrentDataShowcase from "./pages/AdminCurrentDataShowcase/page";

function App() {
  const location = useLocation();
  const hideFooterRoutes = ["/dashboard", "/admin/dashboard"];
  const hideFooter = hideFooterRoutes.includes(location.pathname);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const isHome = location.pathname === "/";
  /* ================= AUTO LOGIN ================= */

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      dispatch(stopAuthLoading());
      return;
    }
    const reLogin = async () => {
      try {
        const role = localStorage.getItem("role");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!role || !refreshToken) {
          throw new Error("Missing auth data");
        }
        const endpointMap = {
          Customer: "customer/auth/re-login",
          Store: "store/auth/re-login",
          Professional: "professional/auth/re-login",
          admin: "admin/auth/re-login",
          subAdmin: "admin/auth/re-login",
          sales: "admin/auth/re-login",
          marketing: "admin/auth/re-login",
        };
        const endpoint = endpointMap[role];
        if (!endpoint) {
          throw new Error("Invalid role");
        }

        const res = await FetchData(endpoint, "post", {
          refreshToken,
        });
        const { user, tokens } = res.data.data;
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        dispatch(addUser(user));
      } catch (error) {
        console.log("Re-login failed:", error?.message);
        localStorage.clear();
        dispatch(clearUser());
      } finally {
        dispatch(stopAuthLoading());
      }
    };

    reLogin();
  }, []);

  return (
    <div className="font-para_regular">
      <Header />
      <ScrollToTop />
      <div className="pt-20">
        {/* <CurrentServices/> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/:type/:userType" element={<Authentication />} />
          <Route path="/services/all" element={<Service />} />
          <Route
            path="/services/:serviceId/current-service"
            element={<CurrentService />}
          />
          <Route
            path="/stores/:storeId/current-store"
            element={<StoreProfessional />}
          />
          <Route
            path="/services/book-service/:serviceName/:serviceId/:userId"
            element={<ServiceBooking />}
          />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/policy" element={<Policy />} />

          {/* =========================ADMIN ================================== */}
          <Route path="/admin/login" element={<AdminAuth />} />
          <Route
            path="/admin/current/:currentDataQuery/:keyId"
            element={<CurrentDataShowcase />}
          />
          <Route
            path="/admin/reset/password"
            element={<AdminAuth resetPassword={true} />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
}
export default App;
