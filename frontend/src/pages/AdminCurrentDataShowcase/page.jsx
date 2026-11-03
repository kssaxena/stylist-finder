import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
// import { useToast } from "../../components/hooks/ToastContext";
import { useSelector } from "react-redux";

import CurrentCustomer from "./CurrentCustomer";
import CurrentStore from "./CurrentStore";
import CurrentProfessional from "./CurrentProfessional";
import CurrentService from "./CurrentServices";
import CurrentSubscription from "./CurrentSubscription";
import CurrentAdmin from "./CurrentAdmin";
import CurrentBooking from "./CurrentBooking";
import CurrentCategory from "./CurrentCategory";
import CurrentFranchise from "./CurrentFranchise";

const componentMap = {
  customer: CurrentCustomer,
  store: CurrentStore,
  professional: CurrentProfessional,
  service: CurrentService,
  subscription: CurrentSubscription,
  admin: CurrentAdmin,
  booking: CurrentBooking,
  category: CurrentCategory,
  franchise: CurrentFranchise,
};

const CurrentDataShowcase = () => {
  const { keyId, currentDataQuery } = useParams();
  // const { alertError } = useToast();
  const user = useSelector((state) => state.auth.user);
  const adminId = user?._id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const CurrentComponent = componentMap[currentDataQuery];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await FetchData(
          `admin/get/data/current/${currentDataQuery}/${keyId}/${adminId}`,
          "get",
        );
        setData(response.data.data);
      } catch (err) {
        // alertError(err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, keyId, adminId, currentDataQuery]);

  if (loading)
    return (
      <div className="mb-20 h-full w-full space-y-6 p-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-7 w-48 animate-pulse rounded-md bg-gray-200" />

          <div className="h-11 w-40 animate-pulse rounded-lg bg-gray-200" />
        </div>

        {/* Table */}
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center border-b border-gray-100 px-5 py-5 last:border-b-0"
            >
              {/* Label */}
              <div className="w-1/2">
                <div
                  className="h-4 animate-pulse rounded bg-gray-200"
                  style={{
                    width: `${90 + (index % 3) * 30}px`,
                  }}
                />
              </div>

              {/* Value */}
              <div className="w-1/2">
                <div
                  className="h-4 animate-pulse rounded bg-gray-200"
                  style={{
                    width: `${130 + (index % 4) * 35}px`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (!CurrentComponent) return <div>Invalid page</div>;

  return <CurrentComponent data={data} onSaved={setData} />;
};

export default CurrentDataShowcase;
