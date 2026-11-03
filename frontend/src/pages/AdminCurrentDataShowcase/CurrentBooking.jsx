import React from "react";

const CurrentBooking = ({ data }) => {

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBoolean = (value) => {
    if (value === true) return "Yes";
    if (value === false) return "No";
    return "N/A";
  };

  const renderArray = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return "N/A";
    }

    return (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => {
          if (typeof item === "object" && item !== null) {
            if (item.brand && item.productType) {
              return (
                <li key={item._id || index}>
                  {item.brand} - {item.productType}
                </li>
              );
            }

            if (item.name) {
              return <li key={item._id || index}>{item.name}</li>;
            }

            return (
              <li key={item._id || index}>
                {Object.entries(item)
                  .filter(([key]) => key !== "_id" && key !== "__v")
                  .map(([key, value]) => `${key}: ${String(value)}`)
                  .join(", ")}
              </li>
            );
          }

          return <li key={index}>{item}</li>;
        })}
      </ul>
    );
  };

  const TableData = [
    // =========================
    // BOOKING INFORMATION
    // =========================
    {
      id: 1,
      label: "Booking ID",
      value: data?._id,
    },
    {
      id: 2,
      label: "Booking Date",
      value: formatDate(data?.dateOfBooking),
    },
    {
      id: 3,
      label: "Service Date",
      value: formatDate(data?.dateForBooking),
    },
    {
      id: 4,
      label: "Booking Amount",
      value:
        data?.bookingAmount !== undefined ? `₹${data.bookingAmount}` : "N/A",
    },
    {
      id: 5,
      label: "Mode Of Payment",
      value: data?.modeOfPayment,
    },

    // =========================
    // SERVICE
    // =========================
    {
      id: 10,
      label: "Service ID",
      value: data?.service?._id,
    },
    {
      id: 11,
      label: "Service Name",
      value: data?.service?.name,
    },
    {
      id: 12,
      label: "Category",
      value: data?.service?.category,
    },
    {
      id: 13,
      label: "Service Charges",
      value:
        data?.service?.charges !== undefined
          ? `₹${data.service.charges}`
          : "N/A",
    },
    {
      id: 14,
      label: "Duration",
      value:
        data?.service?.duration !== undefined
          ? `${data.service.duration} minutes`
          : "N/A",
    },
    {
      id: 15,
      label: "Preparation Time",
      value:
        data?.service?.prepTime !== undefined
          ? `${data.service.prepTime} minutes`
          : "N/A",
    },
    {
      id: 16,
      label: "Is Preparation Time",
      value: formatBoolean(data?.service?.isPrepTime),
    },
    {
      id: 17,
      label: "Time Including Preparation",
      value: formatBoolean(data?.service?.timeIncludingPrepTime),
    },
    {
      id: 18,
      label: "Booking Days",
      value: data?.service?.bookingDays,
    },
    {
      id: 19,
      label: "Booking Accepting Hours",
      value: data?.service?.bookingAcceptingHours
        ? `${data.service.bookingAcceptingHours.from} - ${data.service.bookingAcceptingHours.till}`
        : "N/A",
    },
    {
      id: 20,
      label: "Service Area",
      value: data?.service?.serviceArea,
    },
    {
      id: 21,
      label: "Service For",
      value: data?.service?.serviceFor,
    },
    {
      id: 22,
      label: "On Site",
      value: formatBoolean(data?.service?.onSite),
    },
    {
      id: 23,
      label: "In House",
      value: formatBoolean(data?.service?.inHouse),
    },
    {
      id: 24,
      label: "Service Active",
      value: formatBoolean(data?.service?.isActive),
    },

    // =========================
    // PRODUCTS
    // =========================
    {
      id: 30,
      label: "Products",
      value: renderArray(data?.service?.products),
    },

    // =========================
    // SERVICE INCLUSION
    // =========================
    {
      id: 31,
      label: "Service Inclusion",
      value: renderArray(data?.service?.serviceInclusion),
    },

    // =========================
    // SERVICE EXCLUSION
    // =========================
    {
      id: 32,
      label: "Service Exclusion",
      value: renderArray(data?.service?.serviceExclusion),
    },

    // =========================
    // SERVICE REQUIREMENTS
    // =========================
    {
      id: 33,
      label: "Service Requirements",
      value: renderArray(data?.service?.serviceRequirements),
    },

    // =========================
    // EXECUTIVE
    // =========================
    {
      id: 40,
      label: "Executive ID",
      value:
        typeof data?.service?.executive === "object"
          ? data.service.executive?._id
          : data?.service?.executive,
    },
    {
      id: 41,
      label: "Executive Name",
      value:
        typeof data?.service?.executive === "object"
          ? data.service.executive?.name
          : "N/A",
    },

    // =========================
    // CUSTOMER
    // =========================
    {
      id: 50,
      label: "Customer ID",
      value: data?.customer?._id,
    },
    {
      id: 51,
      label: "Customer Name",
      value: data?.customer?.name,
    },
    {
      id: 52,
      label: "Customer Contact",
      value: data?.customer?.contactNumber,
    },
    {
      id: 53,
      label: "Customer Email",
      value: data?.customer?.email,
    },
    {
      id: 54,
      label: "Gender",
      value: data?.customer?.gender,
    },
    {
      id: 55,
      label: "Customer Role",
      value: data?.customer?.role,
    },
    {
      id: 56,
      label: "Profile Complete",
      value: formatBoolean(data?.customer?.isProfileComplete),
    },
    {
      id: 57,
      label: "Customer Active",
      value: formatBoolean(data?.customer?.isActive),
    },
    {
      id: 58,
      label: "Currently Under Booking",
      value: formatBoolean(data?.customer?.currentlyUnderBooking),
    },

    // =========================
    // ADDRESS
    // =========================
    {
      id: 60,
      label: "Address ID",
      value: data?.address?._id,
    },
    {
      id: 61,
      label: "Address Type",
      value: data?.address?.addressType,
    },
    {
      id: 62,
      label: "Contact Name",
      value: data?.address?.contactDetails?.name,
    },
    {
      id: 63,
      label: "Contact Number",
      value: data?.address?.contactDetails?.contact,
    },
    {
      id: 64,
      label: "Flat Number",
      value: data?.address?.flatNumber,
    },
    {
      id: 65,
      label: "Floor",
      value: data?.address?.floor,
    },
    {
      id: 66,
      label: "Society Name",
      value: data?.address?.societyName,
    },
    {
      id: 67,
      label: "Street 1",
      value: data?.address?.street1,
    },
    {
      id: 68,
      label: "Street 2",
      value: data?.address?.street2,
    },
    {
      id: 69,
      label: "Area",
      value: data?.address?.area,
    },
    {
      id: 70,
      label: "Locality",
      value: data?.address?.locality,
    },
    {
      id: 71,
      label: "Block",
      value: data?.address?.block,
    },
    {
      id: 72,
      label: "Sector",
      value: data?.address?.sector,
    },
    {
      id: 73,
      label: "City",
      value: data?.address?.city,
    },
    {
      id: 74,
      label: "State",
      value: data?.address?.state,
    },
    {
      id: 75,
      label: "Country",
      value: data?.address?.country,
    },
    {
      id: 76,
      label: "Default Address",
      value: formatBoolean(data?.address?.defaultAddress),
    },
    {
      id: 77,
      label: "Latitude",
      value: data?.address?.location?.coordinates?.[1],
    },
    {
      id: 78,
      label: "Longitude",
      value: data?.address?.location?.coordinates?.[0],
    },
  ];

  return (
    <div className="space-y-6 h-full w-full p-10 mb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl heading">Current Booking</h1>
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <tbody>
            {TableData.map((item, index) => (
              <tr
                key={item.id || index}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
              >
                <td className="w-1/3 px-5 py-4 text-sm font-medium text-gray-500 align-top">
                  {item.label}
                </td>

                <td className="w-2/3 px-5 py-4 text-sm font-semibold text-gray-800 align-top break-words">
                  {item.value !== null &&
                  item.value !== undefined &&
                  item.value !== ""
                    ? item.value
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentBooking;
