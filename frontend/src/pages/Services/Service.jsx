import { useParams } from "react-router-dom";

import ServiceCard from "./ServiceCard";
import CategoryMenu from "./CategoryMenu";
import ServiceGrid from "./ServiceGrid";

import { categories as DemoCategory } from "../../constants/service";
import { services as DemoService } from "../../constants/service";

const Services = () => {
  const { location, gender, category } = useParams();
  console.log(location, gender, category);
  const currentLocation = location?.toLowerCase();

  // Categories for selected gender
  //   const filteredCategories = categories.filter(
  //     (item) => item.gender === gender,
  //   );

  // Services for selected gender + category
  //   const filteredServices = services.filter((item) => item.gender === gender);

  return (
    <div className="mx-auto w-full md:w-[80vw] flex flex-col gap-5 justify-center">
      <h1 className="capitalize text-4xl font-medium w-full text-center">
        Services we offer
      </h1>
      <div className="flex sm:flex-wrap">
        <CategoryMenu
          categories={DemoCategory}
          selectedCategory={category}
          location={location}
          gender={gender}
        />
      </div>

      <ServiceGrid services={DemoService} />
    </div>
  );
};

export default Services;
