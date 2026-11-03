import { useNavigate } from "react-router-dom";
import CustomerServiceCard from "../../components/ui/CustomerServiceCard";

const HomeServiceSection = ({ title, services }) => {
  const navigate = useNavigate();

  if (!Array.isArray(services) || services.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="heading text-2xl">{title}</h2>

        <button
          onClick={() =>
            navigate(`/services/all?category=${encodeURIComponent(title)}`)
          }
          className="text-[#8B2954] font-medium"
        >
          See All
        </button>
      </div>

      <div className="flex gap-4 overflow-scroll scrollbar-hide pb-2 w-full justify-start items-start">
        {services.map((service) => (
          <div key={service._id} className="w-fit">
            <CustomerServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeServiceSection;
