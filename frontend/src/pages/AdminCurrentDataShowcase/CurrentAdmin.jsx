import React from "react";

const CurrentAdmin = ({ data }) => {
  const TableData = [
    {
      id: 1,
      label: "Creator Admin",
      value: data?.creatorAdmin?.name,
    },
    {
      id: 2,
      label: "Name",
      value: data?.name,
    },
    {
      id: 3,
      label: "Contact Number ",
      value: data?.contactNumber,
    },
    {
      id: 4,
      label: "Email",
      value: data?.email,
    },
    {
      id: 6,
      label: " Employee Id ",
      value: data?.employeeId,
    },
    {
      id: 8,
      label: "Role ",
      value: data?.role,
    },
    {
      id: 9,
      label: " Restricted Access",
      value: data?.restrictedAccess === true ? "Yes" : "No",
    },
    {
      id: 10,
      label: "section List ",
      value: data?.sectionList.map((i, index) => (
        <p key={index}>
          {index + 1}. {i}
        </p>
      )),
    },

    {
      id: 10,
      label: "Is Active",
      value: (
        <div>
          {data?.isActive ? (
            <div className="w-fit h-4 bg-green-300 p-4 text-center rounded-full flex items-center justify-center">
              <button>Active</button>
            </div>
          ) : (
            <div className="w-fit h-4 py-4 px-4 rounded-full bg-red-300 flex items-center justify-center">
              <button>Not Active</button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 22,
      label: "Is Verified",
      value: (
        <div>
          {data?.isVerified ? (
            <div className="w-fit h-4 bg-green-300 p-4 text-center rounded-full flex items-center justify-center">
              <button>Verified</button>
            </div>
          ) : (
            <div className="w-fit h-4 py-4 px-4 rounded-full bg-red-300 flex items-center justify-center">
              <button>Non Verified</button>
            </div>
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

export default CurrentAdmin;
