import { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Button from "../../../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import { FetchData } from "../../../utils/FetchFromApi";

const ServiceFilters = ({ filters, setFilters }) => {
  const [search, setSearch] = useState(filters.search);
  const [isOpen, setIsOpen] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getAllCategoriesName = async () => {
      try {
        const response = await FetchData(
          "category-subcategory/get/categories/name-all",
          "get",
        );
        setCategories(response.data.data);
      } catch (err) {}
    };

    getAllCategoriesName();
  }, []);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        search,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setSearch("");
    setFilters("");
    localStorage.clear("homeClickedCategory");

    setFilters({
      page: 1,
      limit: 20,
      category: "",
      serviceFor: "",
      search: "",
      sortBy: "latest",
    });
  };

  const catName = useMemo(() => {
    const q = filters?.category;
    return categories.filter((cat) => `${cat?._id}`.includes(q));
  }, [filters, categories]);

  return (
    <div className="bg-white rounded-2xl shadow border border-neutral-200 p-5 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* Search */}

        <div className="relative col-span-2 sm:col-span-2 xl:col-span-5">
          <FaSearch className="absolute top-1/2 -translate-y-1/2 left-4 text-neutral-400" />

          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 py-3 pl-11 pr-4 focus:border-[#d65f92] outline-none"
          />
        </div>
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setRotate(!rotate);
          }}
          className="heading flex justify-center items-center gap-2 border rounded-full p-2"
        >
          Filters{" "}
          {rotate ? (
            <FaChevronUp className="md:hidden" />
          ) : (
            <FaChevronDown className="md:hidden" />
          )}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, width: 0, opacity: 0 }}
              animate={{ height: "auto", width: "auto", opacity: 1 }}
              exit={{ height: 0, width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full col-span-4"
            >
              <select
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="rounded-xl border border-neutral-200 px-3 py-2 focus:border-[#d65f92] outline-none"
              >
                <option value="">All Categories</option>
                {categories?.map((i, index) => (
                  <option key={index} value={i?._id}>
                    {i?.title}
                  </option>
                ))}
              </select>
              <select
                value={filters.serviceFor}
                onChange={(e) => updateFilter("serviceFor", e.target.value)}
                className="rounded-xl border border-neutral-200 px-3 py-2 focus:border-[#d65f92] outline-none"
              >
                <option value="">For Everyone</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Both">Both</option>
              </select>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter("sortBy", e.target.value)}
                className="rounded-xl border border-neutral-200 px-3 py-2 focus:border-[#d65f92] outline-none"
              >
                <option value="latest">Latest</option>
                <option value="priceLow">Price : Low → High</option>
                <option value="priceHigh">Price : High → Low</option>
                <option value="duration">Duration</option>
              </select>
              <Button
                onClick={() => {
                  clearFilters();
                }}
                variant="secondary"
                LabelName={
                  <h1 className="flex justify-center items-center gap-2">
                    <FaTimes />
                    Clear Filters
                  </h1>
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Applied Filters */}
      <div className="flex flex-wrap gap-2 mt-6">
        {filters?.category?.length ? (
          <div>
            {filters.category && (
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs">
                Category : {catName[0]?.title}
              </span>
            )}
          </div>
        ) : (
          ""
        )}

        {filters.serviceFor && (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
            {filters.serviceFor}
          </span>
        )}

        {filters.search && (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
            "{filters.search}"
          </span>
        )}
      </div>
    </div>
  );
};

export default ServiceFilters;
