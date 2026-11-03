import { useEffect, useState } from "react";
import { adminDashboardSection } from "../../constants/constants";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import DashboardTable from "./DashboardTables";
import { FetchData } from "../../utils/FetchFromApi";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import AdminAuth from "../Auth/AdminAuth";
import SubscriptionModelForm from "./SubscriptionForm";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/slice/authSlice";
import { useToast } from "../../components/hooks/ToastContext";
import AddCategoryForm from "./AddCategoryForm";
import AddSubCategoryForm from "./AddSubcategoryForm";
import AddStoreForm from "./AddStoreForm";
import AddNewFranchiseForm from "./AddFranchiseForm";
import { clearAuthStorage } from "../../utils/utility-functions";
import ProductManagement from "./ProductManagement";
import ProductOrderManagement from "./ProductOrderManagement";

function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);
  const adminRole = ["admin", "subAdmin", "sales", "marketing"];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState(
    () => localStorage.getItem("adminDashboardQuery") || "store",
  );
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [addFranchise, setAddFranchise] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);
  const { alertInfo } = useToast();

  const fetchDashboard = async ({ query }) => {
    if (!query) return;
    try {
      const res =
        query === "enquiries"
          ? await FetchData("enquiries/admin/list", "get")
          : query === "products"
            ? await FetchData("products/admin/list", "get")
            : query === "product_orders"
              ? await FetchData("products/admin/orders", "get")
          : await FetchData(`admin/get/data/dashboard-data/${query}`, "get");
      setData(res.data.data);
    } catch (error) {
      console.error("Unable to load admin dashboard data", error);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const loadInitialData = async () => {
      const query = localStorage.getItem("adminDashboardQuery") || "store";
      try {
        const response =
          query === "enquiries"
            ? await FetchData("enquiries/admin/list", "get")
            : query === "products"
              ? await FetchData("products/admin/list", "get")
              : query === "product_orders"
                ? await FetchData("products/admin/orders", "get")
                : await FetchData(`admin/get/data/dashboard-data/${query}`, "get");
        if (!cancelled) setData(response.data.data);
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to load admin dashboard data", error);
        }
      }
    };
    loadInitialData();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = () => {
    clearAuthStorage();
    dispatch(clearUser());
    alertInfo("You are logged out successfully");
    navigate("/");
  };

  const filteredSections =
    user?.restrictedAccess === true
      ? adminDashboardSection.filter((section) =>
          user?.sectionList?.includes(section.label),
        )
      : adminDashboardSection;

  const handleAddCategory = async (formData) => {
    try {
      setCategoryLoading(true);

      const response = await FetchData(
        "category-subcategory/update/add-new/category",
        "post",
        formData,
        true,
      );

      if (response?.data?.success) {
        alert("Category added successfully.");

        setIsCategoryOpen(false);
        fetchDashboard({
          query: localStorage.getItem("adminDashboardQuery") || "store",
        });

        // Refresh category list
        // await getCategories();
      } else {
        alert(response?.data?.message || "Unable to add category.");
      }
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while adding the category.",
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleAddSubCategory = async (formData, categoryId) => {
    try {
      setSubCategoryLoading(true);

      if (!categoryId) {
        alert("Please select a main category.");
        return;
      }

      const response = await FetchData(
        `category-subcategory/update/add-new/subcategory/${categoryId}`,
        "post",
        formData,
        true,
      );

      if (response?.data?.success) {
        alert("Subcategory added successfully.");

        setIsSubCategoryOpen(false);
        fetchDashboard({
          query: localStorage.getItem("adminDashboardQuery") || "store",
        });

        // Refresh category list
        // await getCategories();
      } else {
        alert(response?.data?.message || "Unable to add subcategory.");
      }
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while adding the subcategory.",
      );
    } finally {
      setSubCategoryLoading(false);
    }
  };

  if (!adminRole.includes(user?.role)) {
    return (
      <div className="flex justify-center items-center w-full h-[70vh]">
        <h2 className="text-2xl font-bold text-center">
          <p className="text-5xl ">⚠️</p>
          Restricted Access !!
        </h2>
      </div>
    );
  } else {
    return (
      <div className="relative p-2 flex w-full items-start h-[90vh]">
        {isMenuOpen && (
          <button
            type="button"
            aria-label="Close admin menu"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        <aside
          className={`${isMenuOpen ? "flex" : "hidden"} fixed inset-y-2 left-2 z-50 h-[calc(90vh-1rem)] w-[84vw] max-w-xs flex-col items-start justify-between rounded-xl bg-[#8B2954] px-5 py-6 text-white md:sticky md:inset-auto md:z-auto md:flex md:h-full md:w-[20vw] md:shrink-0`}
        >
          <div className="mb-4 flex w-full items-center justify-between md:hidden">
            <span className="font-semibold">Admin menu</span>
            <button
              type="button"
              aria-label="Close admin menu"
              className="rounded p-2 hover:bg-white/15"
              onClick={() => setIsMenuOpen(false)}
            >
              <HiOutlineX size={22} />
            </button>
          </div>
          <div className="flex h-full w-full flex-col items-end justify-between">
            <ul className="flex w-full flex-col gap-2">
              {filteredSections.map((data, index) => (
                <li
                  key={index}
                  className={`cursor-pointer h-fit hover:bg-white/50 duration-300 ease-in-out hover:text-black rounded-lg px-3 py-2 w-full ${activeSection === data.query ? "bg-white text-black hover:" : "hover:bg-white text black"}`}
                  onClick={() => {
                    localStorage.setItem("adminDashboardQuery", data.query);
                    setActiveSection(data.query);
                    fetchDashboard({
                      query: localStorage.getItem("adminDashboardQuery"),
                    });
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="flex items-center justify-start gap-2">
                    {/* <span>{data.icon}</span> */}
                    <span>{data.label}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant="secondary"
              LabelName="Log out"
              onClick={() => logout()}
            />
          </div>
        </aside>

        <main className="h-full min-w-0 flex-1 overflow-y-auto p-3 md:p-5">
          <div className="mb-3 flex items-center justify-between md:hidden">
            <button
              type="button"
              aria-label="Open admin menu"
              aria-expanded={isMenuOpen}
              className="rounded-lg border border-gray-200 p-2 text-gray-800"
              onClick={() => setIsMenuOpen(true)}
            >
              <HiOutlineMenu size={22} />
            </button>
            <span className="font-semibold text-gray-800">Admin dashboard</span>
          </div>
          {activeSection === "enquiries" && (
            <DashboardTable tableRole="enquiries" TableData={data} />
          )}
          {activeSection === "customer" && (
            <DashboardTable tableRole="customer" TableData={data} />
          )}
          {activeSection === "store" && (
            <div>
              <Button
                LabelName="Add new Store"
                onClick={() => setIsAddStoreOpen(true)}
              />
              <DashboardTable tableRole="store" TableData={data} />
              <AddStoreForm
                isOpen={isAddStoreOpen}
                onClose={() => setIsAddStoreOpen(false)}
                onSuccess={() => {
                  setIsAddStoreOpen(false);
                  fetchDashboard({ query: "store" });
                }}
              />
            </div>
          )}
          {activeSection === "categories" && (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Categories
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage your categories and their subcategories.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    LabelName="Add Category"
                    onClick={() => setIsCategoryOpen(true)}
                  />

                  <Button
                    LabelName="Add Subcategory"
                    onClick={() => setIsSubCategoryOpen(true)}
                  />
                </div>
              </div>
              <DashboardTable tableRole="categories" TableData={data} />

              <AddCategoryForm
                isOpen={isCategoryOpen}
                onClose={() => setIsCategoryOpen(false)}
                onSubmit={handleAddCategory}
                loading={categoryLoading}
              />

              <AddSubCategoryForm
                isOpen={isSubCategoryOpen}
                onClose={() => setIsSubCategoryOpen(false)}
                onSubmit={handleAddSubCategory}
                categories={data}
                loading={subCategoryLoading}
              />
            </div>
          )}
          {activeSection === "active_services" && (
            <DashboardTable tableRole="activeService" TableData={data} />
          )}
          {activeSection === "inactive_services" && (
            <DashboardTable tableRole="inactive_services" TableData={data} />
          )}
          {activeSection === "subscription" && (
            <div className="w-full">
              {/* popup for adding pricing model  */}
              <div className="border px-4 rounded-xl border-[#8B2954]">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className=" flex items-center justify-between px-6 py-5 heading"
                >
                  Add new subscription model
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <SubscriptionModelForm
                      onClose={() => setIsOpen(!isOpen)}
                      adminId={user?._id}
                    />
                  )}
                </AnimatePresence>
              </div>
              <DashboardTable tableRole="pricing" TableData={data} />
            </div>
          )}
          {activeSection === "bookings" && (
            <DashboardTable tableRole="booking" TableData={data} />
          )}
          {activeSection === "payments" && (
            <DashboardTable tableRole="payments" TableData={data} />
          )}
          {activeSection === "adminsQuery" && (
            <div className="w-full">
              <div className="border-[0.1px] px-4 py-3 rounded-xl border-[#8B2954]">
                <button
                  onClick={() => setIsOpen1(!isOpen1)}
                  className=" flex items-center justify-between px-6 py-5 heading"
                >
                  Add admin
                  {isOpen1 ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen1 && <AdminAuth login={false} />}
                </AnimatePresence>
              </div>

              <DashboardTable tableRole="adminsQuery" TableData={data} />
            </div>
          )}
          {activeSection === "franchise" && (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Franchise
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage your Franchise here
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    LabelName="Add franchise"
                    onClick={() => setAddFranchise(true)}
                  />
                </div>
              </div>
              <DashboardTable tableRole="franchise" TableData={data} />
              {addFranchise && (
                <AddNewFranchiseForm
                  handleReload={() => fetchDashboard({ query: "franchise" })}
                  onClose={() => setAddFranchise(false)}
                />
              )}
            </div>
          )}
          {activeSection === "products" && <ProductManagement />}
          {activeSection === "product_orders" && <ProductOrderManagement />}
        </main>
      </div>
    );
  }
}

export default AdminDashboard;
