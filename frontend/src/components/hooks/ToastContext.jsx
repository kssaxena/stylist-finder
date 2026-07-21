import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseErrorMessage } from "../../utils/parseErrorMessage";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const alertSuccess = ({
    type = "success",
    title = "Success !",
    message,
    duration = 5000,
  }) => {
    setToast({ type, title, message });

    setTimeout(() => {
      setToast(null);
    }, duration);
  };
  const alertError = ({
    type = "error",
    title = "Error !",
    message,
    duration = 5000,
  }) => {
    setToast({ type, title, message });

    setTimeout(() => {
      setToast(null);
    }, duration);
  };
  const alertInfo = ({
    type = "info",
    title = "Information !",
    message,
    duration = 5000,
  }) => {
    setToast({ type, title, message });

    setTimeout(() => {
      setToast(null);
    }, duration);
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
            transition={{ type: "spring" }}
            className="fixed top-5 right-5 z-50"
          >
            <div
              className={`min-w-[320px] rounded-xl shadow-xl p-4 text-white ${
                toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "error"
                    ? "bg-red-500"
                    : "bg-[#22719b]"
              }`}
            >
              <h3 className="font-semibold">{toast.title}</h3>
              <p>
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

export const useToast = () => useContext(ToastContext);
