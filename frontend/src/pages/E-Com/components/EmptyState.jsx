import { FaSearch } from "react-icons/fa";

const EmptyState = ({ hasFilters = false }) => (
  <div className="flex flex-col items-center justify-center py-24 px-4">
    <FaSearch className="text-7xl text-neutral-300 mb-5" />
    <h2 className="heading text-3xl mb-2">No products found</h2>
    <p className="paragraph text-neutral-500 text-center max-w-lg">
      {hasFilters
        ? "No products match your search. Try another name or category."
        : "Our store is getting ready. Please check back soon."}
    </p>
  </div>
);

export default EmptyState;
