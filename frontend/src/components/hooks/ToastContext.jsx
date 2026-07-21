import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseErrorMessage } from "../../utils/parseErrorMessage";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = ({
    type = "info",
    title = "Information",
    message = "",
    duration = 5000,
  }) => {
    setToast({
      type,
      title,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const alertSuccess = (data) => {
    if (typeof data === "string") {
      return showToast({
        type: "success",
        title: "Success!",
        message: data,
      });
    }

    return showToast({
      type: "success",
      title: data?.title || "Success!",
      message: data?.message || "",
      duration: data?.duration || 5000,
    });
  };

  const alertError = (data) => {
    if (typeof data === "string") {
      return showToast({
        type: "error",
        title: "Error!",
        message: data,
      });
    }

    return showToast({
      type: "error",
      title: data?.title || "Error!",
      message: data?.message || "Something went wrong",
      duration: data?.duration || 5000,
    });
  };

  const alertInfo = (data) => {
    if (typeof data === "string") {
      return showToast({
        type: "info",
        title: "Information!",
        message: data,
      });
    }

    return showToast({
      type: "info",
      title: data?.title || "Information!",
      message: data?.message || "",
      duration: data?.duration || 5000,
    });
  };

  return (
    <ToastContext.Provider
      value={{
        alertSuccess,
        alertError,
        alertInfo,
      }}
    >
      {children}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-5 right-5 z-[9999]"
          >
            <div
              className={`min-w-[320px] max-w-[420px] rounded-xl shadow-xl p-4 text-white ${
                toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "error"
                  ? "bg-red-500"
                  : "bg-[#22719b]"
              }`}
            >
              <h3 className="font-semibold text-lg">{toast.title}</h3>

              <p className="mt-1 break-words">
                {toast.type === "error"
                  ? parseErrorMessage(toast.message)
                  : toast.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};