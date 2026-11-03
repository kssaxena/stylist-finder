import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

const HomeProductsSection = ({ title, products }) => {
  const navigate = useNavigate();

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="heading text-2xl">{title}</h2>

        <button
          onClick={() =>
            navigate(`/e-commerce?category=${encodeURIComponent(title)}`)
          }
          className="text-[#8B2954] font-medium"
        >
          See All
        </button>
      </div>

      <div className="flex gap-4 overflow-scroll scrollbar-hide pb-2 w-full justify-start items-start">
        {products.map((product) => (
          <div key={product._id} className="w-fit">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeProductsSection;
