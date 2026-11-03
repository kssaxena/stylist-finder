import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FetchData } from "../../../../utils/FetchFromApi";
import { useToast } from "../../../../components/hooks/ToastContext";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import ProductCard from "../../components/ProductCard";

const EcomHome = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useSelector((state) => state.auth.user);
  const { alertError } = useToast();
  const alertErrorRef = useRef(alertError);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    sortBy: "latest",
  });

  useEffect(() => {
    alertErrorRef.current = alertError;
  }, [alertError]);

  useEffect(() => {
    let cancelled = false;
    FetchData("products", "get", {
      page,
      limit: 12,
      ...filters,
    })
      .then((response) => {
        if (cancelled) return;
        const result = response.data.data;
        setProducts(result.products || []);
        setCategories(result.categories || []);
        setTotalPages(result.totalPages || 1);
      })
      .catch((error) => {
        if (!cancelled) {
          alertErrorRef.current(
            error?.response?.data?.message || "Unable to load products.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  const submitSearch = (event) => {
    event.preventDefault();
    setLoading(true);
    setPage(1);
    setFilters((current) => ({ ...current, search: searchInput.trim() }));
    const nextParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) nextParams.set("search", searchInput.trim());
    else nextParams.delete("search");
    setSearchParams(nextParams, { replace: true });
  };

  const updateCategory = (category) => {
    setLoading(true);
    setPage(1);
    setFilters((current) => ({ ...current, category }));
    const nextParams = new URLSearchParams(searchParams);
    if (category) nextParams.set("category", category);
    else nextParams.delete("category");
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <main className="mx-auto min-h-[50vh] max-w-7xl px-4 py-8 pb-24 lg:px-8">
      <header className="mb-8 rounded-2xl bg-[#8B2954] px-6 py-8 text-white md:px-10">
        <p className="text-sm uppercase tracking-[0.2em] text-white/80">
          Cute and Glow store
        </p>
        <h1 className="heading mt-2 text-3xl md:text-4xl">Shop beauty essentials</h1>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-white/85">
            Explore products selected for your everyday care routine.
          </p>
          {user?.role?.toLowerCase() === "customer" && (
            <Link
              to="/e-commerce/orders"
              className="w-fit rounded-lg border border-white/60 px-4 py-2 text-sm font-medium hover:bg-white/10"
            >
              My orders
            </Link>
          )}
        </div>
      </header>

      <form
        onSubmit={submitSearch}
        className="mb-6 flex flex-col gap-3 md:flex-row"
      >
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search products"
          aria-label="Search products"
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-4 py-3"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#8B2954] px-6 py-3 font-medium text-white"
        >
          Search
        </button>
        <select
          value={filters.category}
          onChange={(event) => updateCategory(event.target.value)}
          aria-label="Filter by product category"
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={filters.sortBy}
          onChange={(event) => {
            setLoading(true);
            setPage(1);
            setFilters((current) => ({ ...current, sortBy: event.target.value }));
          }}
          aria-label="Sort products"
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3"
        >
          <option value="latest">Latest</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </form>

      {loading ? (
        <LoadingSkeleton />
      ) : products.length === 0 ? (
        <EmptyState hasFilters={Boolean(filters.category || filters.search)} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {totalPages > 1 && (
            <nav
              aria-label="Product pages"
              className="mt-8 flex items-center justify-center gap-4"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  setLoading(true);
                  setPage((current) => current - 1);
                }}
                className="rounded-lg border px-4 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => {
                  setLoading(true);
                  setPage((current) => current + 1);
                }}
                className="rounded-lg border px-4 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
};

export default EcomHome;
