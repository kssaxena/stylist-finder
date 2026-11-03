import React from "react";
import Landing from "./Landing";
import ServiceCard from "./ServiceCard";
import ChooseUs from "./ChooseUs";
import ServiceGrid from "../Services/components/ServiceGrid";
import { services } from "../../constants/service";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import BookingServiceCard from "../../components/ui/StoreServiceCard";
import { FetchData } from "../../utils/FetchFromApi";
import { useEffect } from "react";
import { useState } from "react";
import EmptyState from "../Services/components/EmptyState";
import LoadingSkeleton from "../Services/components/LoadingSkeleton";
import MobileServiceTags from "./MobileNavigator";
import HomeServiceSection from "./HomeServiceSection";
import HomeBanner from "../../components/ui/HomeBanner";
import { homeBanners } from "../../constants/constants";

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesByCategory, setServicesByCategory] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    category: "",
    serviceFor: "",
    search: "",
    sortBy: "latest",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getAllCategoriesName = async () => {
      try {
        const response = await FetchData(
          "category-subcategory/get/categories/name-all",
          "get",
        );
        setCategories(response.data.data);
      } catch (err) {
        // console.log(err);
      }
    };

    getAllCategoriesName();
  }, []);

  const getHomeServices = async () => {
    try {
      setLoading(true);

      const responses = await Promise.all(
        categories?.map(async (category) => {
          const res = await FetchData(
            `services/get/service?category=${encodeURIComponent(category._id)}&limit=6`,
            "get",
          );

          return {
            label: category.title,
            services: res.data.data.services,
          };
        }),
      );

      const grouped = {};
      responses
        .filter(
          (item) => Array.isArray(item.services) && item.services.length > 0,
        )
        .forEach((item) => {
          grouped[item.label] = item.services;
        });

      setServicesByCategory(grouped);
      setData(grouped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHomeServices();
  }, [categories]);

  return (
    <div className="h-full pb-10 gap-10 flex flex-col">
      <div className="hidden lg:block h-screen">
        <Landing />
      </div>
      <div className="lg:hidden">
        <MobileServiceTags />
      </div>
      <div className="px-3 space-y-5 lg:px-10">
        <Button
          variant="secondary"
          className="w-full hidden lg:block"
          LabelName={
            <h1 className="text-6xl w-full text-left py-10 px-5 flex justify-between items-center italic ">
              Welcome to our <br /> E-Commerce{" "}
              <span className="text-base heading capitalize text-wrap text-center cursor-pointer flex justify-center items-center h-fit px-4 py-2 rounded-xl bg-white text-black border border-[#8B2954] shadow-md">
                Explore now
              </span>
            </h1>
          }
          onClick={() => navigate("/e-commerce")}
        />
        <HomeBanner banners={homeBanners} />
      </div>
      <div className="flex flex-col justify-center items-center gap-5 px-2 w-full mt-10">
        <h1 className="font-medium text-3xl w-full text-center heading">
          Featured Services
        </h1>
        {loading ? (
          <LoadingSkeleton />
        ) : Object.keys(servicesByCategory).length === 0 ? (
          <EmptyState />
        ) : (
          <div className="px-4 lg:px-10 mt-10 flex flex-col gap-12 w-full">
            {categories
              .filter(
                (category) =>
                  Array.isArray(servicesByCategory[category.title]) &&
                  servicesByCategory[category.title].length > 0,
              )
              .map((category) => (
                <HomeServiceSection
                  key={category.label}
                  title={category.title}
                  services={servicesByCategory[category.title] || []}
                />
              ))}
          </div>
        )}
        <Button
          LabelName="Explore more services"
          onClick={() => navigate("/services/all")}
        />
      </div>
      {/* extras  */}
      <ServiceCard />
      <ChooseUs />
    </div>
  );
}

export default Home;
