import { useEffect, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import EmptyState from "./components/EmptyState";
import ServiceFilters from "./components/ServiceFilters";
import ServiceGrid from "./components/ServiceGrid";
import Pagination from "./components/Pagination";
import LoadingSkeleton from "./components/LoadingSkeleton";

const Service = () => {
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState({});

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    category: localStorage.getItem("homeClickedCategory") || "",
    serviceFor: "",
    search: localStorage.getItem("homeClickedSearch") || "",
    sortBy: "latest",
  });

  const getBookingServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          params.append(key, value);
        }
      });
      const response = await FetchData(
        `services/get/service?${params.toString()}`,
        "get",
      );
      setServices(response.data.data.services);
      setPagination(response.data.data.pagination);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookingServices();
  }, [filters]);

  return (
    <section className="w-full py-10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <ServiceFilters filters={filters} setFilters={setFilters} />

        {/* Result Counter */}

        {!loading && (
          <div className="flex justify-between items-center my-8">
            <h2 className="heading text-xl md:text-2xl">Browse Services</h2>

            <span className="paragraph text-neutral-500">
              {pagination.total || services.length} Services Found
            </span>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : services.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ServiceGrid services={services} />

            <Pagination
              pagination={pagination}
              filters={filters}
              setFilters={setFilters}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default Service;
