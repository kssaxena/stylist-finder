import React from "react";
import Button from "../../components/Button";
import { FaUser, FaStar, FaPlus } from "react-icons/fa";

const CurrentProfessional = ({ data }) => {
  const TableData = [
    {
      id: 1,
      label: "Name",
      value: data?.name,
    },
    {
      id: 2,
      label: "Contact Number",
      value: data?.contactNumber,
    },
    {
      id: 3,
      label: "Email",
      value: data?.email,
    },
    {
      id: 4,
      label: "Gender",
      // data.address.ref
      value: data?.gender,
    },
    {
      id: 5,
      label: "Alternate Contact Number",
      value: (
        <div>
          {data?.alternateContactNumber ? data?.alternateContactNumber : "NA"}
        </div>
      ),
    },
    {
      id: 6,
      label: "About ",
      value: data?.about,
    },
    {
      id: 7,
      label: "Specialization",
      value: data?.specialization,
    },
    {
      id: 8,
      label: "Address ",
      value: data?.address,
    },
    {
      id: 9,
      label: "Bank",
      value: data?.bank,
    },
    {
      id: 10,
      label: "Services ",
      value: data?.services,
    },
    {
      id: 11,
      label: "Bookings ",
      value: data?.bookings,
    },
    {
      id: 12,
      label: "Service Type",
      value: data?.serviceType,
    },
    {
      id: 13,
      label: " Payment Option",
      value: data?.paymentOptions,
    },
    {
      id: 14,
      label: "Profile Image",
      value: (
        <div className="h-36 w-36  rounded-full ">
          <img
            src={data?.profileImage?.url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      id: 14,
      label: "KYC Details",
      value: (
        <div>
          {data?.KycDetails ? (
            <div className="flex flex-col ">
              <div>
                <h1>AAdhar Details</h1>
                <p>{data.kycDetails?.aadhar?.number}</p>
                <div className="">
                  <img src={data.kycDetails?.aadhar?.image?.front} alt="" />
                  <img src={data.kycDetails?.aadhar?.image?.back} alt="" />
                </div>
              </div>
              <div>
                <h1>PAN Details</h1>
                <div className="flex flex-row">
                  <p>{data.kycDetails?.pan?.number}</p>
                  <div>
                    <img src={data.kycDetails?.pan?.image} alt="" />
                  </div>
                </div>
              </div>
              <div>
                <h1>GST Details</h1>
                <div className="flex flex-row">
                  <p>{data.kycDetails?.gst?.number}</p>
                  <div>
                    <img src={data.kycDetails?.gst?.image} alt="" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            "NA"
          )}
        </div>
      ),
    },
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

export default CurrentProfessional;
