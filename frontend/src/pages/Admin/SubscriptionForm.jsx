import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import InputBox from "../../components/Input";
import Button from "../../components/Button";
import { FaChevronUp } from "react-icons/fa";
import { FetchData } from "../../utils/FetchFromApi";
import { useToast } from "../../components/hooks/ToastContext";

const SubscriptionModelForm = ({ onClose, adminId, initialData, onSaved }) => {
  const formRef = useRef();
  const { alertInfo, alertError, alertSuccess } = useToast();
  const [features, setFeatures] = useState([""]);
  const [planFor, setPlanFor] = useState("");
  const [customModel, setCustomModel] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [priceData, setPriceData] = useState({
    mrp: "",
    discount: "",
    sellingPrice: "",
  });
  const [faqs, setFaqs] = useState([
    {
      question: "",
      answer: "",
    },
  ]);

  useEffect(() => {
    if (!initialData) return;
    setPlanFor(initialData.planFor || "");
    setCustomModel(Boolean(initialData.customModel));
    setIsActive(initialData.isActive !== false);
    setPriceData({
      mrp: initialData.price?.mrp ?? "",
      discount: initialData.price?.discount ?? "",
      sellingPrice: initialData.price?.sellingPrice ?? "",
    });
    setFeatures(initialData.features?.length ? initialData.features : [""]);
    setFaqs(
      initialData.faqs?.length
        ? initialData.faqs
        : [{ question: "", answer: "" }],
    );
  }, [initialData]);

  const addFaqs = () => {
    setFaqs((prev) => [
      ...prev,
      {
        question: "",
        answer: "",
      },
    ]);
  };
  const addFeatures = () => {
    setFeatures((prev) => [...prev, ""]);
  };
  const removeFaqs = (index) => {
    if (faqs.length === 1) return;

    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };
  const removeFeatures = (index) => {
    if (features.length === 1) return;

    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFeaturesChange = (index, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
      ...priceData,
      [name]: value,
    };

    const mrp = parseFloat(updatedData.mrp) || 0;
    const discount = parseFloat(updatedData.discount) || 0;

    if (mrp > 0 && discount >= 0) {
      updatedData.sellingPrice = (mrp - (mrp * discount) / 100).toFixed(2);
    } else {
      updatedData.sellingPrice = "";
    }

    setPriceData(updatedData);
  };

  const handleFAQChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const addNewSubscriptionModel = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(formRef.current);

      formData.append(
        "parsingData",
        JSON.stringify({
          features,
          faqs,

          validity: {
            months: formData.get("validityMonths"),
            renewalType: formData.get("renewalType"),
          },

          price: {
            mrp: Number(formData.get("mrp")),
            discount: Number(formData.get("discount")),
            sellingPrice: Number(formData.get("sellingPrice")),
          },

          support: formData.get("support"),

          mediaLimit: {
            photos: Number(formData.get("photos")),
            videos: Number(formData.get("videos")),
            unlimitedPhotos: formData.get("unlimitedPhotos") === "on",
            unlimitedVideos: formData.get("unlimitedVideos") === "on",
          },

          serviceLimit: {
            count: Number(formData.get("serviceLimit")),
            unlimited: formData.get("unlimitedServices") === "on",
          },

          booking: {
            enabled: formData.get("bookingEnabled") === "on",
            advancedBooking: formData.get("advancedBooking") === "on",
          },

          visibility: {
            featured: formData.get("featured") === "on",
            verifiedBadge: formData.get("verifiedBadge") === "on",
          },

          franchise: {
            enabled: formData.get("franchiseEnabled") === "on",
            enquiryButton: formData.get("enquiryButton") === "on",
          },

          managementTools: {
            staffAttendance: formData.get("staffAttendance") === "on",
            inventory: formData.get("inventory") === "on",
            commissionTracking: formData.get("commissionTracking") === "on",
            analytics: formData.get("analytics") === "on",
          },

          marketing: {
            socialPromotion: formData.get("socialPromotion") === "on",
            couponManager: formData.get("couponManager") === "on",
            smsWhatsapp: formData.get("smsWhatsapp") === "on",
            reviews: formData.get("reviews") === "on",
          },
        }),
      );

      const response = await FetchData(
        initialData
          ? `subscription/update/${initialData._id}`
          : `subscription/create/new-model/${adminId}`,
        "post",
        formData,
      );

      formRef.current.reset();
      setFeatures([""]);
      setFaqs([{ question: "", answer: "" }]);
      alertInfo(response.data.message);
      onSaved?.(response.data.data);
      onClose?.();
    } catch (err) {
      alertError(err.response.data);
    }
  };

  return (
    <motion.div
      key="content"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden backdrop-blur-3xl"
    >
      <div className="w-full bg-neutral-200 p-3 rounded-xl flex justify-center items-start gap-5 flex-col ">
        <form
          className="grid grid-cols-3 place-items-center w-full gap-2"
          onSubmit={addNewSubscriptionModel}
          ref={formRef}
        >
          <div className={`w-full py-3 `}>
            <label
              htmlFor={name}
              className={`block text-sm font-medium text-gray-700 mb-2 capitalize`}
            >
              Plan name<span className="text-red-500">*</span>
            </label>
            <select
              name="planName"
              defaultValue={initialData?.planName || ""}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-neutral-50 text-gray-700 outline-none focus:ring-1 focus:ring-[#8B2954] focus:border-[#8B2954] transition hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed`}
            >
              <option className="uppercase" value="">
                Select
              </option>
              {["platinum", "gold", "silver", "bronze", "basic"].map(
                (i, index) => (
                  <option className="uppercase" key={index} value={i}>
                    {index + 1}. {i}
                  </option>
                ),
              )}
            </select>
          </div>
          <div className="w-full py-3">
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              Plan for<span className="text-red-500">*</span>
            </label>

            <select
              name="planFor"
              value={planFor}
              onChange={(e) => setPlanFor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-neutral-50 text-gray-700 outline-none focus:ring-1 focus:ring-[#8B2954] focus:border-[#8B2954]"
            >
              <option value="">Select</option>

              {["customer", "store", "professional", "custom"].map(
                (item, index) => (
                  <option key={index} value={item}>
                    {index + 1}. {item}
                  </option>
                ),
              )}
            </select>
          </div>
          <InputBox
            label="Validity"
            name="validity"
            type="number"
            defaultValue={initialData?.validity?.months || ""}
            placeholder="Enter months. Eg: 1, 6, 24"
          />
          <div className="w-full py-3 flex justify-between items-center border rounded-lg px-4">
            <div>
              <h3 className="font-medium">Custom Model</h3>
              <p className="text-sm text-gray-500">
                Enable if this is a custom subscription.
              </p>
            </div>

            <input
              type="checkbox"
              name="customModel"
              checked={customModel}
              onChange={(e) => setCustomModel(e.target.checked)}
              className="w-5 h-5 accent-[#8B2954]"
            />
          </div>
          {planFor === "custom" && (
            <InputBox
              label="Custom Model For"
              name="customModelFor"
              defaultValue={initialData?.customModelFor || ""}
              placeholder="Example: Franchise, Academy, Premium Store"
            />
          )}

          <div className="py-4 w-full col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <textarea
              required={false}
              placeholder="Write a short tagline..."
              name="tagline"
              defaultValue={initialData?.tagline || ""}
              rows="2"
              className="bg-neutral-50 w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-[#8B2954] focus:border-[#8B2954] outline-none transition duration-200 ease-in-out hover:shadow-md"
            />
          </div>
          <div className="col-span-3 w-full">
            <div className="flex justify-between items-center w-full gap-5">
              <InputBox
                name="mrp"
                type="number"
                label="MRP"
                onChange={handlePriceChange}
                value={priceData.mrp}
              />
              <InputBox
                name="discount"
                type="number"
                label="Discount (in %)"
                onChange={handlePriceChange}
                value={priceData.discount}
              />
              <InputBox
                name="sellingPrice"
                type="number"
                label="Discounted Price"
                value={priceData.sellingPrice}
                // Disabled={true}
              />
              <InputBox
                label="Plan Price Label"
                name="planPrice"
                defaultValue={initialData?.planPrice || ""}
                placeholder="Example: ₹500/year or ₹125/month"
              />
            </div>
          </div>
          <div className="col-span-3 w-full">
            <div className="w-full border border-neutral-300 rounded-xl p-2 gap-2 flex flex-col">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold">Features</h2>
                <Button
                  LabelName={"Add"}
                  type={"button"}
                  onClick={addFeatures}
                />
              </div>

              {features.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-center items-start bg-neutral-100 rounded-xl w-full gap-5 px-5 py-2"
                >
                  <InputBox
                    LabelName={`Feature ${index + 1}`}
                    Name={`features-${index}`}
                    Value={item}
                    onChange={(e) =>
                      handleFeaturesChange(index, e.target.value)
                    }
                  />

                  <Button
                    variant="secondary"
                    LabelName={"Remove"}
                    Disabled={features.length === 1}
                    onClick={() => removeFeatures(index)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full">
            <div className="w-full border border-neutral-300 rounded-xl p-5 gap-2 flex flex-col ">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold">FAQs</h2>
                <Button LabelName={"Add"} type={"button"} onClick={addFaqs} />
              </div>

              {faqs.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-center items-start bg-neutral-100 rounded-xl w-full gap-5 px-5 py-2"
                >
                  <InputBox
                    label="Question"
                    name={`question-${index}`}
                    value={item.question}
                    onChange={(e) =>
                      handleFAQChange(index, "question", e.target.value)
                    }
                  />

                  <InputBox
                    label="Answer"
                    name={`answer-${index}`}
                    value={item.answer}
                    onChange={(e) =>
                      handleFAQChange(index, "answer", e.target.value)
                    }
                  />
                  <Button
                    normal={false}
                    LabelName={"Remove"}
                    Disabled={faqs.length === 1}
                    onClick={() => removeFaqs(index)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full flex justify-between items-center border rounded-lg px-4 py-3">
            <div>
              <h3 className="font-medium">Plan Status</h3>
              <p className="text-sm text-gray-500">
                Enable or disable this subscription plan.
              </p>
            </div>

            <input
              type="checkbox"
              name="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 accent-[#8B2954]"
            />
          </div>
          <div className="col-span-3 w-full border rounded-xl p-4">
            <h2 className="font-semibold mb-4">Validity & Support</h2>

            <div className="grid grid-cols-3 gap-4">
              <InputBox
                label="Validity (Months)"
                name="validityMonths"
                type="number"
                defaultValue={initialData?.validity?.months || ""}
                placeholder="12"
              />

              <div>
                <label className="block text-sm mb-2">Renewal Type</label>
                <select
                  name="renewalType"
                  defaultValue={initialData?.validity?.renewalType || "yearly"}
                  className="w-full px-4 py-2 border rounded-lg bg-neutral-50"
                >
                  <option value="oneTime">One Time</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Support</label>
                <select
                  name="support"
                  defaultValue={initialData?.support || "basic"}
                  className="w-full px-4 py-2 border rounded-lg bg-neutral-50"
                >
                  <option value="basic">Basic</option>
                  <option value="priority">Priority</option>
                  <option value="dedicated">Dedicated</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-span-3 w-full border rounded-xl p-4">
            <h2 className="font-semibold mb-4">Media Limits</h2>

            <div className="grid grid-cols-4 gap-4">
              <InputBox
                label="Photos"
                name="photos"
                type="number"
                defaultValue={initialData?.mediaLimit?.photos || 0}
              />
              <InputBox
                label="Videos"
                name="videos"
                type="number"
                defaultValue={initialData?.mediaLimit?.videos || 0}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="unlimitedPhotos"
                  defaultChecked={initialData?.mediaLimit?.unlimitedPhotos}
                />
                Unlimited Photos
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="unlimitedVideos"
                  defaultChecked={initialData?.mediaLimit?.unlimitedVideos}
                />
                Unlimited Videos
              </label>
            </div>
          </div>
          <div className="col-span-3 w-full border rounded-xl p-4">
            <h2 className="font-semibold mb-4">Service Limits</h2>

            <div className="grid grid-cols-2 gap-4">
              <InputBox
                label="Services"
                name="serviceLimit"
                type="number"
                defaultValue={initialData?.serviceLimit?.count || 0}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="unlimitedServices"
                  defaultChecked={initialData?.serviceLimit?.unlimited}
                />
                Unlimited Services
              </label>
            </div>
          </div>
          <div className="col-span-3 w-full border rounded-xl p-4">
            <h2 className="font-semibold mb-4">Booking Features</h2>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="bookingEnabled"
                  defaultChecked={initialData?.booking?.enabled}
                />
                Online Booking
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="advancedBooking"
                  defaultChecked={initialData?.booking?.advancedBooking}
                />
                Advanced Booking
              </label>
            </div>
          </div>
          <div className="col-span-3 w-full border rounded-xl p-4">
            <h2 className="font-semibold mb-4">Visibility</h2>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={initialData?.visibility?.featured}
                />
                Featured Listing
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="verifiedBadge"
                  defaultChecked={initialData?.visibility?.verifiedBadge}
                />
                Verified Badge
              </label>
            </div>
          </div>

          <div className="col-span-3 w-full border rounded-xl p-4">
            <h2 className="font-semibold mb-4">Franchise</h2>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="franchiseEnabled"
                  defaultChecked={initialData?.franchise?.enabled}
                />
                Franchise Enabled
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="enquiryButton"
                  defaultChecked={initialData?.franchise?.enquiryButton}
                />
                Franchise Enquiry Button
              </label>
            </div>
          </div>

          <div className="col-span-3 w-full border rounded-xl p-4">
            <h2 className="font-semibold mb-4">Management Tools</h2>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="staffAttendance"
                  defaultChecked={initialData?.managementTools?.staffAttendance}
                />
                Staff Attendance
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="inventory"
                  defaultChecked={initialData?.managementTools?.inventory}
                />
                Inventory
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="commissionTracking"
                  defaultChecked={
                    initialData?.managementTools?.commissionTracking
                  }
                />
                Commission Tracking
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="analytics"
                  defaultChecked={initialData?.managementTools?.analytics}
                />
                Analytics Dashboard
              </label>
            </div>
          </div>

          <div className="col-span-3 w-full border rounded-xl p-4">
            <h2 className="font-semibold mb-4">Marketing</h2>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="socialPromotion"
                  defaultChecked={initialData?.marketing?.socialPromotion}
                />
                Social Promotion
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="couponManager"
                  defaultChecked={initialData?.marketing?.couponManager}
                />
                Coupon Manager
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="smsWhatsapp"
                  defaultChecked={initialData?.marketing?.smsWhatsapp}
                />
                SMS & WhatsApp
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="reviews"
                  defaultChecked={initialData?.marketing?.reviews}
                />
                Reviews & Ratings
              </label>
            </div>
          </div>
          <Button LabelName="Submit" type="submit" />
        </form>
      </div>
      <button
        onClick={() => onClose()}
        className="w-full flex flex-col items-center justify-between px-6 py-5 "
      >
        Close <FaChevronUp className="w-6 h-6 text-gray-300" />
      </button>
    </motion.div>
  );
};

export default SubscriptionModelForm;
