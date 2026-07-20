import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = ({ type = "success", title, message, duration = 3000 }) => {
    setToast({ type, title, message });

    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <AnimatePresence>
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 2, ease: "easeInOut" }}
            className="fixed top-5 right-5 z-50 animate-slide-in"
          >
            <div
              className={`min-w-[320px] rounded-xl shadow-xl p-4 text-white ${
                toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "error"
                    ? "bg-red-500"
                    : "bg-[#8B2954]"
              }`}
            >
              <h3 className="font-semibold">{toast.title}</h3>
              <p className="text-sm">{toast.message}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
