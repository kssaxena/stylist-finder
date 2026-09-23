import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";

const AccordionSection = ({ title, children, isOpen, onClick, icon }) => {
  return (
    <div className="border-t border-gray-200">
      {/* Header */}
      <button
        type="button"
        onClick={onClick}
        className="
          w-full flex items-center justify-between
          py-4 text-left
          group
        "
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-[#8B2954]">{icon}</span>}

          <span
            className="
              font-semibold text-gray-800
              transition-colors duration-300
              group-hover:text-[#8B2954]
            "
          >
            {title}
          </span>
        </div>

        <motion.span
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="text-[#8B2954]"
        >
          <IoIosArrowDown className="text-xl" />
        </motion.span>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.35,
                ease: [0.4, 0, 0.2, 1],
              },
              opacity: {
                duration: 0.2,
              },
            }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccordionSection;
