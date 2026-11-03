import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { AnimatePresence, motion, px } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "./hooks/ToastContext";
import { BsGeoAlt } from "react-icons/bs";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import InputBox from "./Input";
import { saveCoordinates } from "../utils/location-service";

const AccordionCard = ({ children, isScrolled }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-fit">
      <div className="rounded-full backdrop-blur-3xl flex flex-row-reverse p-2 h-16 justify-center items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full cursor-pointer"
        >
          {isOpen ? (
            <IoClose
              className={`text-lg  ${isScrolled ? "text-gray-200" : "text-gray-500"}`}
            />
          ) : (
            <FiMenu
              className={`text-lg  ${isScrolled ? "text-gray-200" : "text-gray-500"}`}
            />
          )}
        </button>

        {/* Content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="overflow- backdrop-blur-3xl rounded-full "
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) => state.shopping.cartItems.length);
  const userRole = user?.role.toLowerCase();
  const { alertInfo } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  // const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [city, setCity] = useState(sessionStorage.getItem("userCity") || "");
  const [locationMessage, setLocationMessage] = useState(
    "Detecting location...",
  );
  const [showManualInput, setShowManualInput] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [manualCity, setManualCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const saveLocation = (cityName, lat, lng) => {
    sessionStorage.setItem("userCity", cityName);
    sessionStorage.setItem("userLat", lat);
    sessionStorage.setItem("userLng", lng);

    setCity(cityName);
    setManualCity("");
    setSuggestions([]);
    setShowManualInput(false);
    setShowCityPicker(false);
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      const data = await res.json();

      const cityName =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.county;

      if (cityName) {
        saveLocation(cityName, lat, lng);
      } else {
        setLocationMessage("Couldn't detect city.");
        setShowManualInput(true);
      }
    } catch (err) {
      setLocationMessage("Couldn't fetch location.");
      setShowManualInput(true);
    }
  };

  const detectLocation = () => {
    if (sessionStorage.getItem("userCity")) return;

    if (!navigator.geolocation) {
      setLocationMessage("Your browser doesn't support location.");
      setShowManualInput(true);
      return;
    }

    setLocationMessage("Allow location access to detect your city.");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        saveCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        reverseGeocode(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationMessage(
              "Location permission denied. Enter your city manually.",
            );
            break;

          case error.POSITION_UNAVAILABLE:
            setLocationMessage("Turn on your device's location services.");
            break;

          case error.TIMEOUT:
            setLocationMessage("Location request timed out.");
            break;

          default:
            setLocationMessage("Couldn't detect location.");
        }

        setShowManualInput(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      },
    );
  };

  useEffect(() => {
    if (!sessionStorage.getItem("userCity")) {
      detectLocation();
    }
  }, []);

  useEffect(() => {
    if (manualCity.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
            manualCity,
          )}`,
        );

        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [manualCity]);

  const headerBgClass = isScrolled
    ? "bg-black/30 backdrop-blur-3xl transition duration-300 ease-in-out"
    : "bg-black/10";

  return (
    <header
      className={`w-full px-4 md:px-8 lg:px-12 py-2 fixed z-40 ${headerBgClass} h-20 `}
    >
      <div className="flex items-center justify-between ">
        {/* Logo */}
        <a href="/" className="h-full flex justify-center items-center gap-2">
          <img
            src={
              "https://ik.imagekit.io/cuteandglow/WhatsApp%20Image%202026-09-11%20at%208.26.34%20AM.jpeg"
            }
            alt="Logo"
            className="h-16 w-16 object-contain"
          />
          <span
            className={`logo_style ${isScrolled ? " text-[#F3DB8F]" : "text-black"}`}
          >
            Cute & Glow
          </span>
        </a>
        <AccordionCard isScrolled={isScrolled}>
          <div className="flex items-center justify-between md:gap-4 gap-2 bg-[#8B2954] rounded-full h-11 px-1 w-fit">
            <a href="/" className="text-white hover:text-pink-200 transition">
              <HiHome />
            </a>
            {/* <button
              type="button"
              aria-label="Favorite services"
              onClick={() => navigate("/customer/favorite")}
              className="relative text-white hover:text-pink-200 transition"
            >
              <FaHeart />
            </button> */}
            <button
              type="button"
              aria-label="Cart"
              onClick={() => navigate("/cart")}
              className="relative text-white hover:text-pink-200 transition"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] leading-4">
                  {cartCount}
                </span>
              )}
            </button>
            <div
              className={`${city ? "" : "absolute top-0 right-0"} hidden bg-white w-[20vw] rounded-xl p-1 lg:block`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BsGeoAlt className="text-[#8B2954]" />
                  <span className="font-medium text-gray-800 text-xs">
                    {city || locationMessage}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowCityPicker((prev) => !prev);
                    setShowManualInput(true);
                  }}
                  className="text-sm text-[#8B2954] font-medium"
                >
                  {city ? "Change" : "Select"}
                </button>
              </div>

              {!city && (
                <button
                  onClick={detectLocation}
                  className="text-xs text-[#8B2954] mt-1 underline"
                >
                  Use Current Location
                </button>
              )}

              {(showManualInput || showCityPicker) && (
                <div className="relative ">
                  <InputBox
                    className="text-xs"
                    type="text"
                    placeholder="Search by pincode, city..."
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                  />

                  {suggestions.length > 0 && (
                    <div className="absolute z-20 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-52 overflow-auto">
                      {suggestions.map((item) => (
                        <button
                          key={item.place_id}
                          onClick={() =>
                            saveLocation(
                              item.address?.city ||
                                item.address?.town ||
                                item.address?.village ||
                                item.display_name.split(",")[0],
                              item.lat,
                              item.lon,
                            )
                          }
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        >
                          {item.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {user ? (
              <button
                onClick={() => {
                  navigate(
                    userRole === "admin" ? "/admin/dashboard" : "/dashboard",
                  );
                }}
                className="flex justify-center items-start rounded-full py-1 px-3 bg-white text-black cursor-pointer"
              >
                <FiUser /> <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate(`/auth/${"login"}/${"customer"}`);
                }}
                className=" bg-white text-black border border-[#8B2954] shadow-md heading capitalize text-wrap text-center cursor-pointer flex justify-center items-center h-fit px-1 py-1 rounded-full text-xs"
              >
                Login / Register
              </button>
            )}
          </div>
        </AccordionCard>
      </div>
    </header>
  );
};

export default Header;
