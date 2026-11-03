import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowUpRightFromSquare,
  FaGraduationCap,
  FaShieldHalved,
  FaXmark,
} from "react-icons/fa6";
import InputBox from "./Input";
import { useToast } from "./hooks/ToastContext";
import { FetchData } from "../utils/FetchFromApi";

const initialForm = {
  name: "",
  email: "",
  contactNumber: "",
  extraDetail: "",
  message: "",
};

const EnquiryModal = ({ type, interest, context, onClose }) => {
  const { alertError, alertSuccess, alertInfo } = useToast();
  const [form, setForm] = useState(initialForm);
  const [enquiryId, setEnquiryId] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCourse = type === "course";
  const extraLabel = isCourse
    ? "Preferred Batch"
    : "City or Preferred Location";
  const extraPlaceholder = isCourse ? "Morning / Evening" : "Enter your city";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const sendOtp = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await FetchData("enquiries/send-otp", "post", {
        type,
        name: form.name,
        email: form.email,
        contactNumber: form.contactNumber,
        interest,
        message: form.message,
        details: {
          [isCourse ? "preferredBatch" : "location"]: form.extraDetail,
          ...context,
        },
      });
      setEnquiryId(response.data.data.enquiryId);
      alertInfo("A verification code has been sent to your email.");
    } catch (error) {
      alertError(
        error?.response?.data?.message || "Unable to send verification code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await FetchData("enquiries/verify-otp", "post", { enquiryId, otp });
      alertSuccess("Your enquiry has been submitted.");
      onClose();
    } catch (error) {
      alertError(
        error?.response?.data?.message || "Unable to verify the code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onMouseDown={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          onMouseDown={(event) => event.stopPropagation()}
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        >
          <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100 bg-white px-5 py-5 sm:px-7">
            <div className="pr-4">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8B2954] bg-[#8B2954]/5">
                <FaGraduationCap />
                {isCourse ? "Course Enquiry" : "Franchise Enquiry"}
              </div>
              <h2 className="mt-3 text-xl font-black text-gray-900 sm:text-2xl">
                {enquiryId ? "Verify your email" : "Talk to our team"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {enquiryId
                  ? `Enter the 6-digit code sent to ${form.email}.`
                  : "Share your details and our team will get in touch."}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close enquiry form"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
            >
              <FaXmark />
            </button>
          </div>

          <div className="px-5 pt-5 sm:px-7">
            <div className="rounded-xl border border-[#8B2954]/15 bg-[#8B2954]/[0.03] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B2954]">
                {isCourse ? "Selected Course" : "Area of Interest"}
              </p>
              <h3 className="mt-1 font-bold text-gray-900">{interest}</h3>
              {context?.duration && (
                <p className="mt-1 text-xs text-gray-500">
                  {context.duration} · {context.classes} · {context.fee}
                </p>
              )}
            </div>
          </div>

          {!enquiryId ? (
            <form onSubmit={sendOtp} className="px-5 pb-6 pt-3 sm:px-7 sm:pb-8">
              <div className="grid gap-x-5 sm:grid-cols-2">
                <InputBox
                  label="Full Name"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={100}
                />
                <InputBox
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                />
                <InputBox
                  label="Phone Number"
                  name="contactNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.contactNumber}
                  onChange={handleChange}
                  maxLength={20}
                />
                <InputBox
                  label={extraLabel}
                  name="extraDetail"
                  placeholder={extraPlaceholder}
                  value={form.extraDetail}
                  onChange={handleChange}
                  required={false}
                />
              </div>
              <InputBox
                label="Message"
                name="message"
                placeholder="What would you like to know?"
                value={form.message}
                onChange={handleChange}
                required={false}
                textarea
                rows={4}
              />
              <div className="mt-2 flex gap-3 rounded-xl border border-[#8B2954]/10 bg-[#8B2954]/[0.03] p-4">
                <FaShieldHalved className="mt-0.5 shrink-0 text-[#8B2954]" />
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Email verification required
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    We will email a one-time code to verify your enquiry before
                    it is recorded.
                  </p>
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B2954] px-5 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending code..." : "Continue & Verify Email"}
                {!isSubmitting && <FaArrowUpRightFromSquare />}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="px-5 pb-7 pt-3 sm:px-7">
              <InputBox
                label="Email verification code"
                name="otp"
                placeholder="6-digit code"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#8B2954] px-5 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Verifying..." : "Verify and submit enquiry"}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnquiryModal;
