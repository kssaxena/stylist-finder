import React from "react";
import Button from "../../components/Button";
import { FetchData } from "../../utils/FetchFromApi";
import { useToast } from "../../components/hooks/ToastContext";

const CurrentServices = ({ data }) => {
  const { alertSuccess, alertError } = useToast();

  /*
   * ============================================================
   * NULL / EMPTY VALUE HANDLER
   * ============================================================
   */

  const isEmptyValue = (value) => {
    return value === null || value === undefined || value === "";
  };

  /*
   * ============================================================
   * BOOLEAN FORMATTER
   * ============================================================
   */

  const formatBoolean = (value) => {
    if (value === null || value === undefined) {
      return "N/A";
    }

    return value ? "Yes" : "No";
  };

  /*
   * ============================================================
   * PRODUCT FORMATTER
   *
   * Backend:
   *
   * products: [
   *   {
   *     brand: "",
   *     productType: "",
   *     _id: "..."
   *   }
   * ]
   *
   * We DON'T want JSON.stringify here.
   * ============================================================
   */

  const formatProducts = (products) => {
    if (!Array.isArray(products) || products.length === 0) {
      return "N/A";
    }

    return (
      <div className="space-y-2">
        {products.map((product, index) => {
          if (!product || typeof product !== "object") {
            return (
              <div key={index} className="text-sm text-gray-700">
                {product || "N/A"}
              </div>
            );
          }

          const brand = product?.brand?.trim?.() || "";

          const productType = product?.productType?.trim?.() || "";

          /*
           * Both empty
           */
          if (!brand && !productType) {
            return (
              <div
                key={product?._id || index}
                className="
                  rounded-lg
                  border border-gray-200
                  bg-gray-50
                  px-3 py-2
                  text-sm
                  text-gray-500
                "
              >
                Product details not provided
              </div>
            );
          }

          /*
           * Both available
           */
          if (brand && productType) {
            return (
              <div
                key={product?._id || index}
                className="
                  rounded-lg
                  border border-[#8B2954]/10
                  bg-[#8B2954]/5
                  px-3 py-2
                "
              >
                <p className="font-semibold text-gray-800">{brand}</p>

                <p className="mt-0.5 text-xs text-gray-500">{productType}</p>
              </div>
            );
          }

          /*
           * Only brand available
           */
          if (brand) {
            return (
              <div
                key={product?._id || index}
                className="
                  rounded-lg
                  border border-[#8B2954]/10
                  bg-[#8B2954]/5
                  px-3 py-2
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                {brand}
              </div>
            );
          }

          /*
           * Only product type available
           */
          return (
            <div
              key={product?._id || index}
              className="
                rounded-lg
                border border-[#8B2954]/10
                bg-[#8B2954]/5
                px-3 py-2
                text-sm
                font-semibold
                text-gray-800
              "
            >
              {productType}
            </div>
          );
        })}
      </div>
    );
  };

  /*
   * ============================================================
   * GENERIC ARRAY FORMATTER
   * ============================================================
   */

  const formatArray = (value) => {
    if (!Array.isArray(value) || value.length === 0) {
      return "N/A";
    }

    const validItems = value.filter(
      (item) => item !== null && item !== undefined && item !== "",
    );

    if (validItems.length === 0) {
      return "N/A";
    }

    return (
      <ul className="list-inside list-disc space-y-1">
        {validItems.map((item, index) => {
          /*
           * String / Number
           */
          if (typeof item === "string" || typeof item === "number") {
            return <li key={index}>{item}</li>;
          }

          /*
           * Object
           */
          if (typeof item === "object" && item !== null) {
            const displayValue =
              item?.name ??
              item?.title ??
              item?.label ??
              item?.value ??
              item?.storeName ??
              item?.categoryName ??
              item?._id;

            return <li key={item?._id || index}>{displayValue || "N/A"}</li>;
          }

          return <li key={index}>{String(item)}</li>;
        })}
      </ul>
    );
  };

  /*
   * ============================================================
   * OBJECT FORMATTER
   * ============================================================
   */

  const formatObject = (value) => {
    if (value === null || value === undefined || typeof value !== "object") {
      return "N/A";
    }

    /*
     * Store object
     */
    if (value?.storeName) {
      return value.storeName;
    }

    /*
     * Professional / Category / Generic populated document
     */
    if (value?.name) {
      return value.name;
    }

    /*
     * Category-specific names
     */
    if (value?.categoryName) {
      return value.categoryName;
    }

    /*
     * Booking accepting hours
     */
    if (
      Object.prototype.hasOwnProperty.call(value, "from") ||
      Object.prototype.hasOwnProperty.call(value, "till")
    ) {
      const from = value?.from || null;
      const till = value?.till || null;

      if (!from && !till) {
        return "N/A";
      }

      return (
        <div className="space-y-1">
          <p>
            <span className="font-medium">From:</span> {from || "N/A"}
          </p>

          <p>
            <span className="font-medium">Till:</span> {till || "N/A"}
          </p>
        </div>
      );
    }

    /*
     * Generic object fallback
     *
     * IMPORTANT:
     * We don't JSON.stringify the complete object.
     */

    const entries = Object.entries(value).filter(
      ([key, val]) =>
        key !== "_id" &&
        key !== "__v" &&
        val !== null &&
        val !== undefined &&
        val !== "",
    );

    if (entries.length === 0) {
      return "N/A";
    }

    return (
      <div className="space-y-1">
        {entries.map(([key, val]) => {
          let formattedValue = val;

          if (typeof val === "boolean") {
            formattedValue = formatBoolean(val);
          }

          if (Array.isArray(val)) {
            formattedValue = formatArray(val);
          }

          if (typeof val === "object" && val !== null && !Array.isArray(val)) {
            formattedValue = formatObject(val);
          }

          return (
            <div key={key}>
              <span className="font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1")}:
              </span>{" "}
              <span>{formattedValue}</span>
            </div>
          );
        })}
      </div>
    );
  };

  /*
   * ============================================================
   * MAIN VALUE FORMATTER
   * ============================================================
   */

  const formatValue = (value, type = null) => {
    /*
     * Null / undefined / empty
     */
    if (isEmptyValue(value)) {
      return "N/A";
    }

    /*
     * Explicit Products
     */
    if (type === "products") {
      return formatProducts(value);
    }

    /*
     * Boolean
     */
    if (typeof value === "boolean") {
      return formatBoolean(value);
    }

    /*
     * String / Number
     */
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }

    /*
     * Array
     */
    if (Array.isArray(value)) {
      return formatArray(value);
    }

    /*
     * Object
     */
    if (typeof value === "object") {
      return formatObject(value);
    }

    return String(value);
  };

  /*
   * ============================================================
   * TABLE DATA
   * ============================================================
   */

  const TableData = [
    {
      id: 1,
      label: "Name",
      value: data?.name,
    },

    {
      id: 2,
      label: "Store",
      value: data?.store,
    },

    {
      id: 3,
      label: "Professional",
      value: data?.professional,
    },

    {
      id: 4,
      label: "Category",
      value: data?.category,
    },

    {
      id: 5,
      label: "Products",
      value: data?.products,
      type: "products",
    },

    {
      id: 6,
      label: "Service Inclusion",
      value: data?.serviceInclusion,
    },

    {
      id: 7,
      label: "Service Exclusion",
      value: data?.serviceExclusion,
    },

    {
      id: 8,
      label: "Duration",
      value: data?.duration,
    },

    {
      id: 9,
      label: "Preparation Time",
      value: data?.prepTime,
    },

    {
      id: 10,
      label: "Is Preparation Time",
      value: data?.isPrepTime,
    },

    {
      id: 11,
      label: "Time Including Preparation Time",
      value: data?.timeIncludingPrepTime,
    },

    {
      id: 12,
      label: "Service Type",
      value: data?.serviceType,
    },

    {
      id: 13,
      label: "On Site",
      value: data?.onSite,
    },

    {
      id: 14,
      label: "In House",
      value: data?.inHouse,
    },

    {
      id: 15,
      label: "Service For",
      value: data?.serviceFor,
    },

    {
      id: 16,
      label: "Charges",
      value: data?.charges,
    },

    {
      id: 17,
      label: "Booking Days",
      value: data?.bookingDays,
    },

    {
      id: 18,
      label: "Booking Accepting Hours",
      value: data?.bookingAcceptingHours,
    },

    {
      id: 19,
      label: "Service Area",
      value: data?.serviceArea,
    },

    {
      id: 20,
      label: "Service Requirements",
      value: data?.serviceRequirements,
    },

    {
      id: 21,
      label: "Service Active",
      value: data?.isActive,
    },
  ];

  /*
   * ============================================================
   * ACTIVE / INACTIVE
   * ============================================================
   */

  const markActiveInactive = async ({ action }) => {
    try {
      const serviceId = data?._id;

      if (!serviceId) {
        alertError("Service ID is missing.");

        return;
      }

      const response = await FetchData(
        `services/update/service-status/${action}/${serviceId}`,
        "post",
      );

      alertSuccess(
        response?.data?.message || "Service status updated successfully.",
      );

      window.location.reload();
    } catch (err) {
      console.error("Service status error:", err);

      alertError("Something went wrong, please try again later!");
    }
  };

  return (
    <div className="mb-20 h-full w-full space-y-6 p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="heading text-2xl">Current Service</h1>

        {data?.isActive === true ? (
          <Button
            LabelName="Mark as inactive"
            onClick={() =>
              markActiveInactive({
                action: "inactive",
              })
            }
          />
        ) : (
          <Button
            LabelName="Mark as active"
            onClick={() =>
              markActiveInactive({
                action: "active",
              })
            }
          />
        )}
      </div>

      {/* Table */}
      <div
        className="
          w-full
          overflow-x-auto
          rounded-xl
          border border-gray-200
          bg-white
          shadow-sm
        "
      >
        <table className="w-full min-w-[700px] border-collapse">
          <tbody>
            {TableData.map((item, index) => (
              <tr
                key={item.id || index}
                className="
                    border-b border-gray-100
                    transition
                    last:border-b-0
                    hover:bg-gray-50
                  "
              >
                {/* Label */}
                <td
                  className="
                      w-1/2
                      px-5 py-4
                      align-top
                      text-sm
                      font-medium
                      text-gray-500
                    "
                >
                  {item.label}
                </td>

                {/* Value */}
                <td
                  className="
                      w-1/2
                      px-5 py-4
                      align-top
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                >
                  {formatValue(item.value, item.type)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentServices;
