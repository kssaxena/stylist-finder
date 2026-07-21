import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearUser, stopAuthLoading } from "./redux/slice/authSlice";
import { FetchData } from "./utils/FetchFromApi";

function App() {
  const location = useLocation();
  const hideFooter = location.pathname === "/dashboard";
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const isHome = location.pathname === "/";
  /* ================= AUTO LOGIN ================= */

  useEffect(() => {
    const refreshToken = localStorage.getItem("RefreshToken");
    if (!refreshToken) {
      dispatch(stopAuthLoading());
      return;
    }
    const reLogin = async () => {
      try {
        const role = localStorage.getItem("role");
        const refreshToken = localStorage.getItem("RefreshToken");
        if (!role || !refreshToken) {
          throw new Error("Missing auth data");
        }

        const endpointMap = {
          Customer: "customer/auth/re-login",
          Store: "store/auth/re-login",
          Professional: "professional/auth/re-login",
        };
        const endpoint = endpointMap[role];
        if (!endpoint) {
          throw new Error("Invalid role");
        }

        const res = await FetchData(endpoint, "post", {
          refreshToken,
        });
        const { user, tokens } = res.data.data;
        localStorage.setItem("AccessToken", tokens.accessToken);
        localStorage.setItem("RefreshToken", tokens.refreshToken);
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
