import { useNavigate } from "react-router-dom";
import ServiceCard from "./ServiceCard";


const CategoryMenu = ({ categories, gender, location, selectedCategory }) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-5 overflow-x-auto py-5">
      {categories.map((category) => (
        <div key={category.id}>
          <div className="h-10 w-fit px-4 py-2 rounded-lg bg-[#8B2954] text-white">
            <h1>{category.name}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryMenu;
