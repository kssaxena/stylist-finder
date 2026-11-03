import React, { useState } from "react";
import Button from "../../components/Button";
import { FetchData } from "../../utils/FetchFromApi";
import { useToast } from "../../components/hooks/ToastContext";

const CurrentCategory = ({ data }) => {
  const { alertSuccess, alertInfo, alertError } = useToast();
  const [loading, setLoading] = useState(false);

  const deleteSubcategory = async ({ subcategoryId }) => {
    try {
      setLoading(true);
      const response = await FetchData(
        `category-subcategory/update/delete/subcategory/${data?._id}/${subcategoryId}`,
        "delete",
      );
      alertSuccess(response.data.message);
      window.location.reload();
    } catch (err) {
      setLoading(false);
      alertError(err.response.data);
    } finally {
      setLoading(false);
    }
  };
  const TableData = [
    {
      id: 1,
      label: "Creator Admin",
      value: (
        <div className="flex justify-start items-start flex-col">
          <span>{data?.createdBy?.name}</span>
          <span>{data?.createdBy?.employeeId}</span>
          <span>{data?.createdBy?.role}</span>
        </div>
      ),
    },
    {
      id: 2,
      label: "Display order",
      value: data?.displayOrder,
    },
    {
      id: 3,
      label: "Active / Inactive",
      value: data?.isActive === true ? "Active" : "Inactive",
    },
    {
      id: 4,
      label: "Status",
      value: data?.status,
    },
    {
      id: 6,
      label: "Title",
      value: data?.title,
    },
    {
      id: 8,
      label: "Image ",
      value: (
        <div>
          <img src={data?.image?.url} className="w-40" />
        </div>
      ),
    },
    {
      id: 9,
      label: "Subcategories",
      value: (
        <div className="flex flex-col justify-start items-start">
          {data?.subcategories?.map((i, index) => (
            <div className="flex justify-between items-center w-full border-b-[0.1px]">
              <span>
                {index + 1}. {i?.title}
              </span>
              <img src={i?.image?.url} className="w-20" />
              <Button
                variant="secondary"
                LabelName={loading ? "Deleting..." : "Delete"}
                onClick={() => deleteSubcategory({ subcategoryId: i?._id })}
              />
            </div>
          ))}
        </div>
      ),
    },
    // {
    //   id: 10,
    //   label: "section List ",
    //   value: data?.sectionList.map((i, index) => (
    //     <p key={index}>
    //       {index + 1}. {i}
    //     </p>
    //   )),
    // },

    // {
    //   id: 10,
    //   label: "Is Active",
    //   value: (
    //     <div>
    //       {data?.isActive ? (
    //         <div className="w-fit h-4 bg-green-300 p-4 text-center rounded-full flex items-center justify-center">
    //           <button>Active</button>
    //         </div>
    //       ) : (
    //         <div className="w-fit h-4 py-4 px-4 rounded-full bg-red-300 flex items-center justify-center">
    //           <button>Not Active</button>
    //         </div>
    //       )}
    //     </div>
    //   ),
    // },
    // {
    //   id: 22,
    //   label: "Is Verified",
    //   value: (
    //     <div>
    //       {data?.isVerified ? (
    //         <div className="w-fit h-4 bg-green-300 p-4 text-center rounded-full flex items-center justify-center">
    //           <button>Verified</button>
    //         </div>
    //       ) : (
    //         <div className="w-fit h-4 py-4 px-4 rounded-full bg-red-300 flex items-center justify-center">
    //           <button>Non Verified</button>
    //         </div>
    //       )}
    //     </div>
    //   ),
    // },
  ];
  return (
    <div className="space-y-6  h-full w-full p-10 mb-20">
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
                  {item.label}
                </td>

                {/* Value */}
                <td className="w-1/2 px-5 py-4 text-sm font-semibold text-gray-800">
                  {item.value || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentCategory;
