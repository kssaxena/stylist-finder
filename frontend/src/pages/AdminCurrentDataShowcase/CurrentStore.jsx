import React, { useRef, useState } from "react";
import Button from "../../components/Button";
import { FaUser, FaStar, FaPlus } from "react-icons/fa";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../../components/Input";
import { useToast } from "../../components/hooks/ToastContext";
import { useSelector } from "react-redux";

const CurrentStore = ({ data }) => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const { alertInfo, alertError } = useToast();
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef();

  const addEmail = async () => {
    try {
      const formData = new FormData(formRef.current);
      setLoading(true);
      const response = await FetchData(
        `store/update/store-email/${data?._id}/${user?._id}`,
        "post",
        formData,
      );
      alertInfo(response.data.message);
      window.location.reload();
    } catch (err) {
      console.log(err);
      alertError(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  const TableData = [
    // =====================================================
    // STORE INFORMATION
    // =====================================================

    {
      id: 1,
      Label: "Store Name",
      Value: data?.storeName || "N/A",
    },

    {
      id: 2,
      Label: "Store Contact Number",
      Value: data?.storeContactNumber || "N/A",
    },

    {
      id: 3,
      Label: "Store Email",
      Value: data?.storeEmail || "N/A",
    },

    {
      id: 4,
      Label: "Service Type",
      Value: data?.serviceType || "N/A",
    },

    {
      id: 5,
      Label: "Role",
      Value: data?.role || "N/A",
    },

    // =====================================================
    // STORE STATUS
    // =====================================================

    {
      id: 6,
      Label: "Store Status",
      Value: (
        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
            data?.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              data?.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          />

          {data?.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      id: 7,
      Label: "Profile Status",
      Value: (
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
            data?.isProfileComplete
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {data?.isProfileComplete ? "Profile Completed" : "Profile Incomplete"}
        </span>
      ),
    },

    {
      id: 8,
      Label: "Registration Status",
      Value: (
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
            data?.isTemporaryRegistered
              ? "bg-orange-100 text-orange-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {data?.isTemporaryRegistered ? "Temporary Registered" : "Registered"}
        </span>
      ),
    },

    {
      id: 9,
      Label: "Verification Status",
      Value: (
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
            data?.isVerified
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {data?.isVerified ? "Verified" : "Not Verified"}
        </span>
      ),
    },

    // =====================================================
    // REGISTRATION & PAYMENT
    // =====================================================

    {
      id: 10,
      Label: "Registration Fee",
      Value: data?.isRegistrationFee ? `₹${data.isRegistrationFee}` : "N/A",
    },

    {
      id: 11,
      Label: "Registration Fee Status",
      Value: (
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
            data?.isRegistrationFeePaid
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {data?.isRegistrationFeePaid ? "Paid" : "Not Paid"}
        </span>
      ),
    },

    {
      id: 12,
      Label: "Registration Fee Paid At",
      Value: data?.registrationFeePaidAt
        ? new Date(data.registrationFeePaidAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
    },

    {
      id: 13,
      Label: "Payment Transaction",
      Value: data?.registrationPaymentTransaction || "N/A",
    },

    // =====================================================
    // SUBSCRIPTION & PROMOTION
    // =====================================================

    {
      id: 14,
      Label: "Subscription",
      Value: (
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
            data?.isSubscribed
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {data?.isSubscribed ? "Subscribed" : "Not Subscribed"}
        </span>
      ),
    },

    {
      id: 15,
      Label: "Subscription Purchased",
      Value: data?.subscription?.subscriptionPurchased ? "Yes" : "No",
    },

    {
      id: 16,
      Label: "Promotion Level",
      Value: data?.promotionLevel || "None",
    },

    {
      id: 35,
      Label: "Subscription plan details",
      Value:
        (
          <div>
            <h1>
              <strong>Plan name: </strong>
              <span className="uppercase heading">
                {data?.subscription?.subscriptionModel?.planName}
              </span>
            </h1>
            <h1>
              <strong>Plan price: </strong>
              <span className="line-through">
                {data?.subscription?.subscriptionModel?.price?.mrp}
              </span>
              <span className="bg-green-300 text-green-700 heading p-1 rounded-md">
                {data?.subscription?.subscriptionModel?.price?.discount}%
              </span>
            </h1>
            <h1>
              <strong>Selling price: </strong>
              <span>
                {data?.subscription?.subscriptionModel?.price?.sellingPrice}
              </span>
            </h1>
          </div>
        ) || "None",
    },

    // =====================================================
    // STORE ACTIVITY
    // =====================================================

    {
      id: 17,
      Label: "Total Bookings",
      Value: data?.bookings?.length || 0,
    },

    {
      id: 18,
      Label: "Total Services",
      Value: data?.services?.length || 0,
    },

    {
      id: 19,
      Label: "Total Staff",
      Value: data?.storeStaffs?.length || 0,
    },

    {
      id: 20,
      Label: "Gallery Images",
      Value: data?.images?.gallery?.length || 0,
    },

    // =====================================================
    // KYC STATUS
    // =====================================================

    {
      id: 21,
      Label: "Store KYC Submitted",
      Value: (
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
            data?.storeKycSubmitted
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {data?.storeKycSubmitted ? "Submitted" : "Not Submitted"}
        </span>
      ),
    },

    {
      id: 22,
      Label: "Store KYC Status",
      Value: (
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
            data?.storeKycComplete
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {data?.storeKycComplete ? "KYC Completed" : "KYC Incomplete"}
        </span>
      ),
    },

    {
      id: 23,
      Label: "Owner KYC Submitted",
      Value: (
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
            data?.ownerKycSubmitted
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {data?.ownerKycSubmitted ? "Submitted" : "Not Submitted"}
        </span>
      ),
    },

    {
      id: 24,
      Label: "Owner KYC Status",
      Value: (
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
            data?.ownerKycComplete
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {data?.ownerKycComplete ? "KYC Completed" : "KYC Incomplete"}
        </span>
      ),
    },

    // =====================================================
    // OWNER INFORMATION
    // =====================================================

    {
      id: 25,
      Label: "Owner Name",
      Value: data?.owner?.ownerName || "N/A",
    },

    {
      id: 26,
      Label: "Owner Contact Number",
      Value: data?.owner?.ownerContact || "N/A",
    },

    {
      id: 27,
      Label: "Owner Email",
      Value: data?.owner?.ownerEmail || "N/A",
    },

    {
      id: 28,
      Label: "Owner Address",
      Value: data?.owner?.ownerAddress || "N/A",
    },

    // =====================================================
    // OWNER AADHAAR
    // =====================================================

    {
      id: 29,
      Label: "Owner Aadhaar",
      Value: data?.owner?.aadhar?.number || "N/A",
    },

    {
      id: 30,
      Label: "Owner Aadhaar Documents",
      Value: (
        <div className="flex gap-3">
          {data?.owner?.aadhar?.image?.front?.url && (
            <img
              src={data.owner.aadhar.image.front.url}
              alt="Aadhaar Front"
              className="w-20 h-14 object-cover rounded-lg border"
            />
          )}

          {data?.owner?.aadhar?.image?.back?.url && (
            <img
              src={data.owner.aadhar.image.back.url}
              alt="Aadhaar Back"
              className="w-20 h-14 object-cover rounded-lg border"
            />
          )}

          {!data?.owner?.aadhar?.image?.front?.url &&
            !data?.owner?.aadhar?.image?.back?.url && (
              <span className="text-sm text-gray-500">
                Documents not uploaded
              </span>
            )}
        </div>
      ),
    },

    // =====================================================
    // OWNER PAN
    // =====================================================

    {
      id: 31,
      Label: "Owner PAN",
      Value: data?.owner?.pan?.number || "N/A",
    },

    {
      id: 32,
      Label: "Owner PAN Document",
      Value: data?.owner?.pan?.image?.url ? (
        <img
          src={data.owner.pan.image.url}
          alt="Owner PAN"
          className="w-20 h-14 object-cover rounded-lg border"
        />
      ) : (
        <span className="text-sm text-gray-500">Document not uploaded</span>
      ),
    },

    // =====================================================
    // DATES
    // =====================================================

    {
      id: 33,
      Label: "Store Created At",
      Value: data?.createdAt
        ? new Date(data.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
    },

    {
      id: 34,
      Label: "Last Updated",
      Value: data?.updatedAt
        ? new Date(data.updatedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
    },
  ];

  return (
    <div className="space-y-6  h-full w-full p-10 mb-20">
      <h1 className="text-2xl heading">Current store</h1>
      {data?.storeEmail ? (
        ""
      ) : (
        <Button LabelName="Add email" onClick={() => setShowForm(true)} />
      )}
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
        <div className="fixed top-0 left-0 z-50 flex justify-center items-center h-screen w-full bg-black/80">
          <div>
            <form
              ref={formRef}
              onSubmit={addEmail}
              className="bg-white rounded-xl p-5 lg:p-10 w-full md:w-96 flex flex-col justify-center items-center gap-4"
            >
              <InputBox
                label="add store Email"
                name="storeEmail"
                type="email"
              />
              <Button
                LabelName={loading ? "Please wait..." : "confirm"}
                className="w-full"
                type="submit"
              />
              <Button
                LabelName="Cancel"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setShowForm(false);
                  formRef.current.reset();
                }}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentStore;
