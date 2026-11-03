import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CustomerServiceCard from "../components/ui/CustomerServiceCard";

const FavoriteServices = () => {
  const favorites = useSelector((state) => state.shopping.favoriteServices);
  const navigate = useNavigate();

  return (
    <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-10 pb-24 lg:pb-10 min-h-[50vh]">
      <h1 className="heading text-3xl text-[#8B2954] mb-2">
        Favorite services
      </h1>
      <p className="text-neutral-600 mb-8">
        Keep the services you like handy and revisit them any time.
      </p>
      {favorites.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 items-start">
          {favorites.map((service) => (
            <CustomerServiceCard key={service._id} service={service} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 p-8 text-center">
          <p className="text-neutral-600 mb-5">
            You have not added any favorite services yet.
          </p>
          <Button
            LabelName="Explore services"
            onClick={() => navigate("/services/all")}
          />
        </div>
      )}
    </main>
  );
};

export default FavoriteServices;
