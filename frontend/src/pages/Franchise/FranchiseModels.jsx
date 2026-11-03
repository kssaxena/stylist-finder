import { useState } from "react";
import { motion } from "framer-motion";
import EnquiryModal from "../../components/EnquiryModal";

import {
  FaBuilding,
  FaCrown,
  FaGem,
  FaLocationDot,
  FaUsers,
  FaWallet,
  FaClock,
  //   FaSparkles,
  FaArrowUpRightFromSquare,
  FaChartLine,
  FaBoxOpen,
  FaCircleExclamation,
  FaCheck,
  FaStar,
} from "react-icons/fa6";
import Button from "../../components/Button";
import { FetchData } from "../../utils/FetchFromApi";
import { useEffect } from "react";

const BRAND = "#8B2954";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const stagger = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const Stat = ({ icon: Icon, label, value }) => {
  return (
    <motion.div
      variants={fadeUp}
      className="
        group rounded-2xl
        border border-[#8B2954]/10
        bg-white
        p-4
        shadow-[0_10px_35px_rgba(139,41,84,0.06)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#8B2954]/25
        hover:shadow-[0_18px_45px_rgba(139,41,84,0.12)]
      "
    >
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          backgroundColor: `${BRAND}12`,
          color: BRAND,
        }}
      >
        <Icon />
      </div>

      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-800">{value}</p>
    </motion.div>
  );
};

const InvestmentItem = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>

      <span
        className="shrink-0 text-right text-sm font-semibold"
        style={{ color: BRAND }}
      >
        {value}
      </span>
    </div>
  );
};

const FranchiseCard = ({ model, index }) => {
  const Icon = model.icon;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        group relative overflow-hidden
        rounded-[2rem]
        border border-gray-100
        bg-white
        shadow-[0_15px_60px_rgba(139,41,84,0.08)]
      "
    >
      {/* Decorative Glow */}
      <div
        className="
          absolute -right-20 -top-20
          h-56 w-56
          rounded-full
          opacity-10
          blur-3xl
          transition-all duration-500
          group-hover:scale-125
        "
        style={{
          backgroundColor: BRAND,
        }}
      />

      {/* Top Accent */}
      <div
        className="h-1.5 w-full"
        style={{
          backgroundColor: BRAND,
        }}
      />

      <div className="relative p-5 sm:p-6 lg:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {/* <motion.div
              whileHover={{
                rotate: 8,
                scale: 1.08,
              }}
              className="
                flex h-12 w-12 shrink-0
                items-center justify-center
                rounded-2xl
                text-white
                shadow-lg
                sm:h-14 sm:w-14
              "
              style={{
                backgroundColor: BRAND,
              }}
            >
              <Icon className="text-lg sm:text-xl" />
            </motion.div> */}

            <div className="min-w-0">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs"
                style={{
                  color: BRAND,
                }}
              >
                Model 0{index + 1}
              </p>

              <h3 className="mt-1  text-lg font-bold text-gray-900 sm:text-xl flex flex-col ">
                {model.name}{" "}
                <span className="text-sm heading">
                  Model by : {model.store.storeName}
                </span>
              </h3>

              <p className="text-xs text-gray-400 sm:text-sm">
                {model.subtitle}
              </p>
            </div>
          </div>

          <div
            className="
              hidden shrink-0 rounded-full
              bg-[#8B2954]/5
              px-3 py-1.5
              text-xs font-semibold
              sm:block
            "
          >
            <span style={{ color: BRAND }}>{model.roi}</span>
          </div>
        </div>

        {/* Budget */}
        <div
          className="mt-6 rounded-2xl p-4 sm:p-5"
          style={{
            backgroundColor: `${BRAND}08`,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400 sm:text-xs">
                Total Investment
              </p>

              <p
                className="mt-1 text-2xl font-black sm:text-3xl"
                style={{
                  color: BRAND,
                }}
              >
                {model.budget}
              </p>
            </div>

            <FaWallet
              className="shrink-0 text-xl opacity-30 sm:text-2xl"
              style={{
                color: BRAND,
              }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat icon={FaLocationDot} label="Space" value={model.space} />

          <Stat icon={FaUsers} label="Staff" value={model.staff} />

          <Stat icon={FaClock} label="ROI Period" value={model.roi} />

          <Stat
            icon={FaBuilding}
            label="Franchise Fee"
            value={model.franchiseFee}
          />
        </div>

        {/* Investment Breakdown */}
        <div className="mt-7">
          <div className="mb-3 flex items-center gap-2">
            <FaChartLine
              style={{
                color: BRAND,
              }}
            />

            <h4 className="font-bold text-gray-900">Investment Breakdown</h4>
          </div>

          <div className="rounded-2xl border border-gray-100 px-4">
            <InvestmentItem label="Franchise Fee" value={model.franchiseFee} />

            <InvestmentItem label="Interior / Setup" value={model.interior} />

            <InvestmentItem label="Equipment Cost" value={model.equipment} />

            <InvestmentItem label="Initial Stock" value={model.stock} />

            <InvestmentItem label="Marketing" value={model.marketing} />

            <InvestmentItem
              label="Working Capital"
              value={model.workingCapital}
            />
          </div>
        </div>

        {/* Location */}
        <div className="mt-7">
          <div className="mb-2 flex items-center gap-2">
            <FaLocationDot
              style={{
                color: BRAND,
              }}
            />

            <h4 className="font-bold text-gray-900">Target Locations</h4>
          </div>

          <p className="text-sm leading-6 text-gray-500">{model.location}</p>
        </div>

        {/* Services */}
        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2">
            <FaStar
              style={{
                color: BRAND,
              }}
            />

            <h4 className="font-bold text-gray-900">Core Services</h4>
          </div>

          <p className="text-sm leading-6 text-gray-500">{model.services}</p>
        </div>

        {/* Advantage */}
        <div
          className="mt-6 rounded-2xl border p-4"
          style={{
            borderColor: `${BRAND}20`,
            backgroundColor: `${BRAND}05`,
          }}
        >
          <div className="flex gap-3">
            <div
              className="
                mt-0.5 flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-full
                text-white
              "
              style={{
                backgroundColor: BRAND,
              }}
            >
              <FaCheck className="text-xs" />
            </div>

            <div>
              <p
                className="text-sm font-bold"
                style={{
                  color: BRAND,
                }}
              >
                Business Advantage
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                {model.advantage}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{
            x: 4,
          }}
          whileTap={{
            scale: 0.98,
          }}
          className="
            mt-7 flex w-full
            items-center justify-center gap-2
            rounded-xl
            px-5 py-3.5
            text-sm font-bold
            text-white
            transition-shadow
            hover:shadow-lg
          "
          style={{
            backgroundColor: BRAND,
          }}
        >
          Explore {model.name}
          <FaArrowUpRightFromSquare />
        </motion.button>
      </div>
    </motion.article>
  );
};

const FranchiseChecklist = () => {
  const items = [
    {
      title: "Monthly Royalty Fees",
      description:
        "The source notes that larger brands may charge approximately 5% to 10% of gross turnover as royalty.",
      icon: FaWallet,
    },

    {
      title: "Product Binding",
      description:
        "The source states that salon products may need to be purchased through the brand's authorized channel.",
      icon: FaBoxOpen,
    },

    {
      title: "Staff Turnover",
      description:
        "The source highlights staff attrition as a consideration and recommends clarifying backup-staff and retraining support with the brand.",
      icon: FaUsers,
    },
  ];

  return (
    <motion.section
      variants={fadeUp}
      className="
        mt-16 overflow-hidden
        rounded-[2rem]
        border border-[#8B2954]/15
        bg-white
        shadow-[0_20px_70px_rgba(139,41,84,0.08)]
        sm:mt-20
      "
    >
      {/* Header */}
      <div
        className="relative overflow-hidden px-5 py-7 sm:px-8 sm:py-9 lg:px-10"
        style={{
          backgroundColor: `${BRAND}07`,
        }}
      >
        <div
          className="
            absolute -right-10 -top-20
            h-48 w-48
            rounded-full
            opacity-10
            blur-3xl
          "
          style={{
            backgroundColor: BRAND,
          }}
        />

        <div className="relative flex items-start gap-3 sm:gap-4">
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-2xl
              text-white
              sm:h-12 sm:w-12
            "
            style={{
              backgroundColor: BRAND,
            }}
          >
            <FaCircleExclamation />
          </div>

          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs"
              style={{
                color: BRAND,
              }}
            >
              Before You Sign
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
              Strategic Checklist & Hidden Costs
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Three important areas highlighted in the source document should be
              reviewed before signing a franchise agreement.
            </p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="grid md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.12,
              }}
              className="border-b border-gray-100 p-6 last:border-b-0 md:border-b-0 md:p-8"
            >
              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                "
                style={{
                  color: BRAND,
                  backgroundColor: `${BRAND}10`,
                }}
              >
                <Icon />
              </div>

              <h3 className="mt-5 font-bold text-gray-900">{item.title}</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default function FranchiseModels() {
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [franchiseModels, setFranchiseModels] = useState([]);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await FetchData(
        "franchise/get/all-models/all-franchise-model",
        "get",
      );
      setFranchiseModels(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <section className="min-h-screen bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
          }}
          variants={stagger}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeUp}>
            <span
              className="
                inline-flex items-center gap-2
                rounded-full
                px-4 py-2
                text-[10px] font-bold
                uppercase tracking-[0.2em]
                sm:text-xs
              "
              style={{
                color: BRAND,
                backgroundColor: `${BRAND}09`,
              }}
            >
              <FaGem />
              Beauty Business Opportunity
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="
              mt-6
              text-3xl font-black
              tracking-tight
              text-gray-950
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
            "
          >
            Beauty Parlour <span style={{ color: BRAND }}>Franchise</span>
            <br />
            Investment Models
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="
              mx-auto mt-5
              max-w-2xl
              text-sm leading-6
              text-gray-500
              sm:mt-6 sm:text-base sm:leading-7
              lg:text-lg
            "
          >
            Explore three franchise formats across investment, space, staffing,
            services and the ROI periods specified in the franchise model
            document.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mx-auto mt-7 h-1 w-20 rounded-full"
            style={{
              backgroundColor: BRAND,
            }}
          />
        </motion.div>

        {/* Models */}
        <motion.div
          // initial="hidden"
          // whileInView="visible"
          // viewport={{ once: true, margin: "-80px" }}
          // variants={stagger}
          className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-14 lg:grid-cols-3"
        >
          {loading ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              Loading franchise models...
            </div>
          ) : franchiseModels.length > 0 ? (
            franchiseModels.map((model, index) => (
              <FranchiseCard
                key={model?._id || model?.id || model?.name || index}
                model={model}
                index={index}
              />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-gray-200 p-8 text-center">
              <h3 className="font-semibold text-gray-800">
                No franchise models found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                The API returned no usable franchise model records.
              </p>
            </div>
          )}
        </motion.div>

        {/* Checklist */}
        <FranchiseChecklist />

        {/* Bottom */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto mt-8 max-w-3xl text-center"
        >
          <p className="text-xs leading-6 text-gray-400 sm:text-sm">
            The source document indicates that the appropriate option depends on
            the available budget and location.
          </p>
        </motion.div>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowEnquiry(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8B2954] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#702044]"
          >
            Enquire About a Franchise
            <FaArrowUpRightFromSquare />
          </button>
        </div>
        {showEnquiry && (
          <EnquiryModal
            type="franchise"
            interest="Beauty parlour franchise"
            context={{}}
            onClose={() => setShowEnquiry(false)}
          />
        )}
      </div>
    </section>
  );
}
