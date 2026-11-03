import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Authentication from "./pages/Auth/Authentication";
import Dashboard from "./pages/Dashboard/Dashboard";
import ScrollToTop from "./components/hooks/ScrollToTop";
import { useDispatch } from "react-redux";
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
import BeautyAcademy from "./pages/BeautyCourse/BeautyAcademy";
import FranchiseModels from "./pages/Franchise/FranchiseModels";
import BottomNavigation from "./components/BottomNavigator";
import Cart from "./pages/Cart";
import FavoriteServices from "./pages/FavoriteServices";
import CartCheckout from "./pages/CartCheckout";
import { clearAuthStorage } from "./utils/utility-functions";
import EcomHome from "./pages/E-Com/pages/home/EcomHome";
import ProductDetails from "./pages/E-Com/pages/ProductDetails";
import ProductOrders from "./pages/E-Com/pages/ProductOrders";

function App() {
  const location = useLocation();
  const hideFooterRoutes = ["/dashboard", "/admin/dashboard"];
  const hideFooter = hideFooterRoutes.includes(location.pathname);
  const dispatch = useDispatch();
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
        clearAuthStorage();
        dispatch(clearUser());
      } finally {
        dispatch(stopAuthLoading());
      }
    };

    reLogin();
  }, [dispatch]);

  return (
    <div className="font-para_regular">
      <Header />
      <ScrollToTop />
      <div className="pt-20">
        {/* <CurrentServices/> */}

        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/franchise/franchise-info"
            element={<FranchiseModels />}
          />
          <Route path="/course/course-info" element={<BeautyAcademy />} />

          <Route path="/auth/:type/:userType" element={<Authentication />} />
          <Route path="/services/all" element={<Service />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart/checkout" element={<CartCheckout />} />
          <Route path="/cart/secure-checkout" element={<Cart />} />
          <Route path="/customer/favorite" element={<FavoriteServices />} />
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

          {/* ========================= E-COM ================================== */}

          <Route path="/e-commerce" element={<EcomHome />} />
          <Route
            path="/e-commerce/products/:productId"
            element={<ProductDetails />}
          />
          <Route path="/e-commerce/orders" element={<ProductOrders />} />
          <Route path="/e-com/home" element={<Navigate to="/e-commerce" replace />} />
          <Route
            path="/e-com/current-product/:productId"
            element={<ProductDetails />}
          />
          <Route path="/e-com" element={<Navigate to="/e-commerce" replace />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
      <BottomNavigation />
    </div>
  );
}
export default App;
