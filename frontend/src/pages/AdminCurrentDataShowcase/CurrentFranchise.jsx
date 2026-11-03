import { useState } from "react";
import Button from "../../components/Button";
import { FaTimes } from "react-icons/fa";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../../components/Input";
import { useToast } from "../../components/hooks/ToastContext";
import { useSelector } from "react-redux";
import { formInputs } from "../../constants/constants";

const CurrentFranchise = ({ data, onSaved }) => {
  const user = useSelector((state) => state.auth.user);
  const { alertSuccess, alertError } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [formData, setFormData] = useState({});

  const openEditForm = async () => {
    setFormData(
      Object.fromEntries(formInputs.map(({ name }) => [name, data?.[name] || ""])),
    );
    setStoreId(data?.store?._id || data?.store || "");

    try {
      setLoading(true);
      const response = await FetchData("store/get/store-for-franchise", "get");
      setStores(response.data.data);
      setShowForm(true);
    } catch (err) {
      alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await FetchData(
        `franchise/update/modify/franchise-by-id/${user?._id}/${data?._id}`,
        "post",
        { ...formData, storeId },
      );
      onSaved?.(response.data.data);
      setShowForm(false);
      alertSuccess(response.data.message);
    } catch (err) {
      alertError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const TableData = [
    {
      id: 1,
      Label: "Franchise Name",
      Value: data?.name || "N/A",
    },
    {
      id: 2,
      Label: "Subtitle",
      Value: data?.subtitle || "N/A",
    },
    {
      id: 3,
      Label: "Budget",
      Value: data?.budget || "N/A",
    },
    {
      id: 4,
      Label: "Franchise fee",
      Value: data?.franchiseFee || "N/A",
    },
    {
      id: 5,
      Label: "Interior",
      Value: data?.interior || "N/A",
    },
    {
      id: 6,
      Label: "equipment",
      Value: data?.equipment || "N/A",
    },
    {
      id: 7,
      Label: "Stock",
      Value: data?.stock || "N/A",
    },
    {
      id: 8,
      Label: "Marketing",
      Value: data?.marketing || "N/A",
    },
    {
      id: 9,
      Label: "Working Capital",
      Value: data?.workingCapital || "N/A",
    },
    {
      id: 10,
      Label: "Space",
      Value: data?.space || "N/A",
    },
    {
      id: 11,
      Label: "Staff",
      Value: data?.staff || "N/A",
    },
    {
      id: 12,
      Label: "ROI",
      Value: data?.roi || "N/A",
    },
    {
      id: 13,
      Label: "Location",
      Value: data?.location || "N/A",
    },
    {
      id: 14,
      Label: "Services",
      Value: data?.services || "N/A",
    },
    {
      id: 15,
      Label: "Advantage",
      Value: data?.advantage || "N/A",
    },
    {
      id: 16,
      Label: "Store",
      Value: data?.store?.storeName || "N/A",
    },
    {
      id: 17,
      Label: "Franchise created by",
      Value: data?.admin?.name || "N/A",
    },
  ];

  return (
    <div className="space-y-6  h-full w-full p-10 mb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl heading">Current Franchise</h1>
        <Button
          LabelName={loading ? "Please wait..." : "Edit Franchise"}
          onClick={openEditForm}
          disabled={loading}
          enableIcon
        />
      </div>
      <div className="w-full h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <tbody>
            {TableData.map((item, index) => (
              <tr
                key={item.id || index}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
              >
                {/* Label */}
                <td className="w-1/2 px-5 py-4 text-sm font-medium text-gray-500">
                  {item.Label}
                </td>

                {/* Value */}
                <td className="w-1/2 px-5 py-4 text-sm font-semibold text-gray-800">
                  {item.Value || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-franchise-title"
            className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
              <h2
                id="edit-franchise-title"
                className="text-xl font-semibold text-gray-800"
              >
                Edit Franchise
              </h2>
              <Button
                LabelName={<FaTimes size={18} />}
                onClick={() => setShowForm(false)}
                variant="secondary"
              />
            </div>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-2"
            >
              {formInputs.map((input) => (
                <InputBox
                  key={input.name}
                  {...input}
                  value={formData[input.name] ?? ""}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      [input.name]: event.target.value,
                    }))
                  }
                />
              ))}
              <div className="w-full py-3">
                <label
                  htmlFor="franchise-store"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Select Store<span className="text-red-500">*</span>
                </label>
                <select
                  id="franchise-store"
                  name="storeId"
                  value={storeId}
                  onChange={(event) => setStoreId(event.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-neutral-50 px-4 py-2 text-gray-700 outline-none transition hover:shadow-md focus:border-[#8B2954] focus:ring-1 focus:ring-[#8B2954]"
                >
                  <option value="">Select a store</option>
                  {stores.map((store) => (
                    <option key={store._id} value={store._id}>
                      {store.storeName}, {store.storeContactNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-full mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
                <Button
                  LabelName="Cancel"
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                />
                <Button
                  LabelName={loading ? "Please wait..." : "Save Changes"}
                  type="submit"
                  disabled={loading}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentFranchise;
