import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputBox from "../../components/Input";
import { BsGeoAlt, BsSearch } from "react-icons/bs";
import { saveCoordinates } from "../../utils/location-service";
import { FetchData } from "../../utils/FetchFromApi";
import Button from "../../components/Button";
import { useToast } from "../../components/hooks/ToastContext";

const prepareCategories = (categories = []) => {
  if (!Array.isArray(categories)) {
    return {
      items: [],
      columns: 3,
    };
  }

  const items = [...categories];

  // Randomly remove items until target length
  const removeRandomItems = (array, targetLength) => {
    const result = [...array];

    while (result.length > targetLength) {
      const randomIndex = Math.floor(Math.random() * result.length);
      result.splice(randomIndex, 1);
    }

    return result;
  };

  console.log(categories);

  if (items.length >= 9) {
    return {
      items: removeRandomItems(items, 9),
      columns: 3,
    };
  }

  if (items.length >= 6) {
    return {
      items: removeRandomItems(items, 6),
      columns: 3,
    };
  }

  if (items.length >= 4) {
    return {
      items: removeRandomItems(items, 3),
      columns: 3,
    };
  }

  return {
    items: [],
    columns: 4,
  };
};

const MobileServiceTags = () => {
  const navigate = useNavigate();
  const { alertInfo } = useToast();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await FetchData(
          "category-subcategory/get/categories/all",
          "get",
        );
        setCategories(response.data.data);
      } catch (err) {}
    };

    getAllCategories();
  }, []);

  const { items: sanitizedCategories, columns } = prepareCategories(categories);

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
    detectLocation();
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

  const onSearchSubmit = () => {
    localStorage.clear("homeClickedSearch");
    localStorage.setItem("homeClickedSearch", search.toLowerCase());
    navigate("/services/all");
    setSearch("");
  };

  return (
    <div className="w-full h-full px-4 py-4">
      {/* Location */}
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
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
          <div className="mt-3 relative">
            <InputBox
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

      {/* Search */}
      <form className="w-full relative" onSubmit={onSearchSubmit}>
        <InputBox
          placeholder="Search your desired service here"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="absolute top-[1.12rem] rounded-full right-2 text-neutral-700 bg-neutral-200 p-2"
          type="submit"
        >
          <BsSearch />
        </button>
      </form>

      {/* Categories */}
      <div
        className={`grid ${
          columns === 3 ? "grid-cols-3" : "grid-cols-3"
        } gap-y-4 border py-5 rounded-xl shadow-md border-neutral-200`}
      >
        {sanitizedCategories.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div
                onClick={() => {
                  localStorage.clear("homeClickedCategory");
                  localStorage.setItem("homeClickedCategory", item?._id);
                  navigate("/services/all");
                }}
                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-md"
              >
                {/* <Icon className="text-3xl text-[#8B2954]" /> */}
                <img
                  src={item?.image?.url}
                  className="w-full h-full object-contain"
                />
              </div>

              <span className="text-gray-600 text-center leading-4 text-xs">
                {item?.title}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center w-full py-5 px-10">
        <Button
          LabelName="Avail franchise"
          onClick={() => navigate("/franchise/franchise-info")}
        />

        <Button
          LabelName="beauty course"
          onClick={() => navigate("/course/course-info")}
        />
      </div>
      <Button
        LabelName="Register Parlor / Stores"
        className="w-full"
        variant="secondary"
        onClick={() => navigate("/auth/register/store")}
      />
    </div>
  );
};

export default MobileServiceTags;
