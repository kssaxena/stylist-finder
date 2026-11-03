import React, { useMemo, useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import SubscriptionModelForm from "../Admin/SubscriptionForm";

const CurrentSubscription = ({ data, onSaved }) => {
  const [isEditing, setIsEditing] = useState(false);

  /*
   * ============================================================
   * NULL SAFE HELPERS
   * ============================================================
   */

  const safeString = (value, fallback = "") => {
    if (value === null || value === undefined) {
      return fallback;
    }

    return String(value);
  };

  const safeNumber = (value, fallback = 0) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      Number.isNaN(Number(value))
    ) {
      return fallback;
    }

    return Number(value);
  };

  const safeBoolean = (value, fallback = false) => {
    if (value === null || value === undefined) {
      return fallback;
    }

    return Boolean(value);
  };

  /*
   * ============================================================
   * STATUS BADGE
   *
   * true  -> Enabled
   * false -> Disabled
   * null  -> N/A
   * ============================================================
   */

  const statusBadge = (value) => {
    if (value === null || value === undefined) {
      return (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
          N/A
        </span>
      );
    }

    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {value ? "Enabled" : "Disabled"}
      </span>
    );
  };

  /*
   * ============================================================
   * FEATURES NORMALIZER
   *
   * Handles:
   *
   * ["Feature 1", "Feature 2"]
   *
   * null
   *
   * ["Feature 1", null, ""]
   *
   * ============================================================
   */

  const normalizeFeatures = (features) => {
    if (!Array.isArray(features)) {
      return [];
    }

    return features
      .map((feature) => {
        if (feature === null || feature === undefined) {
          return "";
        }

        if (typeof feature === "string") {
          return feature;
        }

        /*
         * Defensive handling in case the API ever returns:
         *
         * {
         *   name: "Feature"
         * }
         *
         * instead of a string.
         */
        if (typeof feature === "object") {
          return (
            feature.name ??
            feature.title ??
            feature.label ??
            feature.feature ??
            ""
          );
        }

        return String(feature);
      })
      .map((feature) => feature.trim())
      .filter(Boolean);
  };

  /*
   * ============================================================
   * FAQ NORMALIZER
   * ============================================================
   */

  const normalizeFaqs = (faqs) => {
    if (!Array.isArray(faqs)) {
      return [];
    }

    return faqs.filter(Boolean).map((faq) => ({
      question: safeString(faq?.question, ""),

      answer: safeString(faq?.answer, ""),
    }));
  };

  /*
   * ============================================================
   * EDIT FORM DATA
   *
   * This is the important part.
   *
   * DO NOT directly send the raw API response to the form.
   * ============================================================
   */

  const editData = useMemo(() => {
    if (!data) {
      return {
        planName: "",
        planFor: "",
        customModel: false,
        customModelFor: "",
        tagline: "",

        validity: {
          months: 0,
          renewalType: "",
        },

        price: {
          mrp: 0,
          discount: 0,
          sellingPrice: 0,
        },

        support: "",

        mediaLimit: {
          photos: 0,
          videos: 0,
          unlimitedPhotos: false,
          unlimitedVideos: false,
        },

        booking: {
          enabled: false,
          advancedBooking: false,
        },

        visibility: {
          featured: false,
          verifiedBadge: false,
        },

        franchise: {
          enabled: false,
          enquiryButton: false,
        },

        managementTools: {
          staffAttendance: false,
          inventory: false,
          commissionTracking: false,
          analytics: false,
        },

        marketing: {
          socialPromotion: false,
          couponManager: false,
          smsWhatsapp: false,
          reviews: false,
        },

        features: [],

        faqs: [],

        isActive: false,
      };
    }

    return {
      /*
       * ========================================================
       * BASIC DETAILS
       * ========================================================
       */

      planName: safeString(data?.planName),
      planFor: safeString(data?.planFor),

      customModel: safeBoolean(data?.customModel),

      customModelFor: safeString(data?.customModelFor),

      tagline: safeString(data?.tagline),

      /*
       * ========================================================
       * VALIDITY
       * ========================================================
       */

      validity: {
        months: safeNumber(data?.validity?.months),

        renewalType: safeString(data?.validity?.renewalType),
      },

      /*
       * ========================================================
       * PRICE
       * ========================================================
       */

      price: {
        mrp: safeNumber(data?.price?.mrp),

        discount: safeNumber(data?.price?.discount),

        sellingPrice: safeNumber(data?.price?.sellingPrice),
      },

      /*
       * ========================================================
       * SUPPORT
       * ========================================================
       */

      support: safeString(data?.support),

      /*
       * ========================================================
       * MEDIA LIMIT
       * ========================================================
       */

      mediaLimit: {
        photos: safeNumber(data?.mediaLimit?.photos),

        videos: safeNumber(data?.mediaLimit?.videos),

        unlimitedPhotos: safeBoolean(data?.mediaLimit?.unlimitedPhotos),

        unlimitedVideos: safeBoolean(data?.mediaLimit?.unlimitedVideos),
      },

      /*
       * ========================================================
       * BOOKING
       * ========================================================
       */

      booking: {
        enabled: safeBoolean(data?.booking?.enabled),

        advancedBooking: safeBoolean(data?.booking?.advancedBooking),
      },

      /*
       * ========================================================
       * VISIBILITY
       * ========================================================
       */

      visibility: {
        featured: safeBoolean(data?.visibility?.featured),

        verifiedBadge: safeBoolean(data?.visibility?.verifiedBadge),
      },

      /*
       * ========================================================
       * FRANCHISE
       * ========================================================
       */

      franchise: {
        enabled: safeBoolean(data?.franchise?.enabled),

        enquiryButton: safeBoolean(data?.franchise?.enquiryButton),
      },

      /*
       * ========================================================
       * MANAGEMENT TOOLS
       * ========================================================
       */

      managementTools: {
        staffAttendance: safeBoolean(data?.managementTools?.staffAttendance),

        inventory: safeBoolean(data?.managementTools?.inventory),

        commissionTracking: safeBoolean(
          data?.managementTools?.commissionTracking,
        ),

        analytics: safeBoolean(data?.managementTools?.analytics),
      },

      /*
       * ========================================================
       * MARKETING
       * ========================================================
       */

      marketing: {
        socialPromotion: safeBoolean(data?.marketing?.socialPromotion),

        couponManager: safeBoolean(data?.marketing?.couponManager),

        smsWhatsapp: safeBoolean(data?.marketing?.smsWhatsapp),

        reviews: safeBoolean(data?.marketing?.reviews),
      },

      /*
       * ========================================================
       * FEATURES
       *
       * THIS FIXES THE FEATURE MAPPING ISSUE.
       * ========================================================
       */

      features: normalizeFeatures(data?.features),

      /*
       * ========================================================
       * FAQS
       * ========================================================
       */

      faqs: normalizeFaqs(data?.faqs),

      /*
       * ========================================================
       * PLAN STATUS
       * ========================================================
       */

      isActive: safeBoolean(data?.isActive),
    };
  }, [data]);

  /*
   * ============================================================
   * TABLE DATA
   * ============================================================
   */

  const TableData = [
    {
      id: 1,
      label: "Admin",
      value: data?.admin?.name ?? data?.admin?._id ?? "N/A",
    },

    {
      id: 2,
      label: "Plan Name",
      value: data?.planName ? data.planName.toUpperCase() : "N/A",
    },

    {
      id: 3,
      label: "Plan For",
      value: data?.planFor ?? "N/A",
    },

    {
      id: 4,
      label: "Custom Model",
      value: statusBadge(data?.customModel),
    },

    {
      id: 5,
      label: "Custom Model For",
      value: data?.customModelFor ?? "N/A",
    },

    {
      id: 6,
      label: "Tagline",
      value: data?.tagline ?? "N/A",
    },

    {
      id: 7,
      label: "Validity",
      value: `${data?.validity?.months ?? 0} Months (${
        data?.validity?.renewalType ?? "N/A"
      })`,
    },

    {
      id: 8,
      label: "Price",
      value: (
        <div className="space-y-1">
          <p>MRP: ₹{data?.price?.mrp ?? "N/A"}</p>

          <p>Discount: {data?.price?.discount ?? 0}%</p>

          <p className="font-bold text-[#8B2954]">
            Selling: ₹{data?.price?.sellingPrice ?? "N/A"}
          </p>
        </div>
      ),
    },

    {
      id: 9,
      label: "Support",
      value: data?.support ?? "N/A",
    },

    {
      id: 10,
      label: "Media Limit",
      value: (
        <div className="space-y-1">
          <p>Photos: {data?.mediaLimit?.photos ?? 0}</p>

          <p>Videos: {data?.mediaLimit?.videos ?? 0}</p>

          <p>
            Unlimited Photos: {statusBadge(data?.mediaLimit?.unlimitedPhotos)}
          </p>

          <p>
            Unlimited Videos: {statusBadge(data?.mediaLimit?.unlimitedVideos)}
          </p>
        </div>
      ),
    },

    {
      id: 11,
      label: "Booking",
      value: (
        <div className="space-y-1">
          <p>Online Booking: {statusBadge(data?.booking?.enabled)}</p>

          <p>Advanced Booking: {statusBadge(data?.booking?.advancedBooking)}</p>
        </div>
      ),
    },

    {
      id: 12,
      label: "Visibility",
      value: (
        <div className="space-y-1">
          <p>Featured: {statusBadge(data?.visibility?.featured)}</p>

          <p>Verified Badge: {statusBadge(data?.visibility?.verifiedBadge)}</p>
        </div>
      ),
    },

    {
      id: 13,
      label: "Franchise",
      value: (
        <div className="space-y-1">
          <p>Enabled: {statusBadge(data?.franchise?.enabled)}</p>

          <p>Enquiry Button: {statusBadge(data?.franchise?.enquiryButton)}</p>
        </div>
      ),
    },

    {
      id: 14,
      label: "Management Tools",
      value: (
        <div className="space-y-1">
          <p>
            Staff Attendance:{" "}
            {statusBadge(data?.managementTools?.staffAttendance)}
          </p>

          <p>Inventory: {statusBadge(data?.managementTools?.inventory)}</p>

          <p>
            Commission Tracking:{" "}
            {statusBadge(data?.managementTools?.commissionTracking)}
          </p>

          <p>Analytics: {statusBadge(data?.managementTools?.analytics)}</p>
        </div>
      ),
    },

    {
      id: 15,
      label: "Marketing",
      value: (
        <div className="space-y-1">
          <p>
            Social Promotion: {statusBadge(data?.marketing?.socialPromotion)}
          </p>

          <p>Coupon Manager: {statusBadge(data?.marketing?.couponManager)}</p>

          <p>SMS / WhatsApp: {statusBadge(data?.marketing?.smsWhatsapp)}</p>

          <p>Reviews: {statusBadge(data?.marketing?.reviews)}</p>
        </div>
      ),
    },

    {
      id: 16,
      label: "Features",
      value:
        Array.isArray(data?.features) && data.features.length > 0 ? (
          <ul className="list-inside list-disc space-y-1">
            {data.features
              .filter(
                (feature) =>
                  feature !== null && feature !== undefined && feature !== "",
              )
              .map((feature, index) => (
                <li key={index}>
                  {typeof feature === "object"
                    ? (feature?.name ??
                      feature?.title ??
                      feature?.label ??
                      "N/A")
                    : feature}
                </li>
              ))}
          </ul>
        ) : (
          "N/A"
        ),
    },

    {
      id: 17,
      label: "FAQs",
      value:
        Array.isArray(data?.faqs) && data.faqs.length > 0 ? (
          <div className="space-y-4">
            {data.faqs.filter(Boolean).map((faq, index) => (
              <div key={index} className="border-l-4 border-[#8B2954] pl-3">
                <h4 className="font-semibold">{faq?.question ?? "N/A"}</h4>

                <p className="text-sm text-gray-600">{faq?.answer ?? "N/A"}</p>
              </div>
            ))}
          </div>
        ) : (
          "N/A"
        ),
    },

    {
      id: 18,
      label: "Plan Status",
      value: statusBadge(data?.isActive),
    },
  ];

  /*
   * ============================================================
   * SAVE HANDLER
   * ============================================================
   */

  const handleSaved = (savedData) => {
    setIsEditing(false);

    if (onSaved) {
      onSaved(savedData);
    }
  };

  return (
    <div className="mb-20 h-full w-full space-y-6 p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="heading text-2xl">Current Subscription</h1>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="
            flex w-full
            items-center justify-center gap-2
            rounded-lg
            bg-[#8B2954]
            px-4 py-2
            text-white
            transition
            hover:bg-[#742247]
            sm:w-auto
          "
        >
          <FaEdit />
          Edit Subscription
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div
          className="
            fixed inset-0 z-50
            overflow-y-auto
            bg-black/50
            p-3
            sm:p-6
          "
        >
          <div
            className="
              mx-auto
              max-w-6xl
              rounded-xl
              bg-white
              shadow-xl
            "
          >
            {/* Modal Header */}
            <div
              className="
                sticky top-0 z-10
                flex items-center
                justify-between
                border-b
                bg-white
                px-4 py-4
                sm:px-5
              "
            >
              <h2 className="text-lg font-semibold sm:text-xl">
                Edit Subscription
              </h2>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="
                  rounded-full
                  p-2
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-gray-800
                "
                aria-label="Close editor"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <SubscriptionModelForm
              initialData={editData}
              onClose={() => setIsEditing(false)}
              onSaved={handleSaved}
            />
          </div>
        </div>
      )}

      {/* Subscription Table */}
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
            {TableData.map((item) => (
              <tr
                key={item.id}
                className="
                  border-b border-gray-100
                  transition
                  last:border-b-0
                  hover:bg-gray-50
                "
              >
                <td
                  className="
                    w-1/3
                    px-5 py-4
                    align-top
                    text-sm
                    font-medium
                    text-gray-500
                  "
                >
                  {item.label}
                </td>

                <td
                  className="
                    w-2/3
                    px-5 py-4
                    align-top
                    text-sm
                    font-semibold
                    text-gray-800
                  "
                >
                  {item.value ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentSubscription;
