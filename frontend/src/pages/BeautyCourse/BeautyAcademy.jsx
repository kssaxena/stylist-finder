import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EnquiryModalForm from "../../components/EnquiryModal";
import {
  FaAward,
  FaBookOpen,
  FaCalendarDays,
  FaChevronDown,
  FaClock,
  FaGift,
  FaGraduationCap,
  FaIndianRupeeSign,
  FaArrowUpRightFromSquare,
  //   FaSparkles,
  FaXmark,
  FaStar,
  FaUsers,
  FaPaintbrush,
} from "react-icons/fa6";

const BRAND = "#8B2954";

const courses = [
  {
    id: 1,
    name: "Self Grooming Course",
    duration: "1 Week",
    classes: "5 Days / Week",
    regularFee: "₹5,000",
    discount: "10% OFF",
    finalFee: "₹4,500",
    kit: "Practice Only",

    description:
      "For individuals who want to learn their own makeup, hair styling and basic skincare.",
    learn:
      "Daily makeup, party looks, eyeliner techniques and basic hair styling.",
  },

  {
    id: 2,
    name: "Basic Beauty Course",
    duration: "1 Month",
    classes: "5 Days / Week",
    regularFee: "₹15,000",
    discount: "15% OFF",
    finalFee: "₹12,750",
    kit: "Practice Only",

    description:
      "For individuals who want to start working in a beauty parlour at a basic level.",
    learn: "Threading, waxing, basic facials, clean-ups and simple haircuts.",
  },

  {
    id: 3,
    name: "Professional Makeup Artistry",
    duration: "1 Month",
    classes: "4 Days / Week",
    regularFee: "₹35,000",
    discount: "20% OFF",
    finalFee: "₹28,000",
    kit: "Practice Only",

    description:
      "For individuals who want to become professional bridal and party makeup artists.",
    learn:
      "HD makeup, waterproof makeup, engagement and party looks, and saree/dupatta draping.",
  },

  {
    id: 4,
    name: "Advanced Hair Designing",
    duration: "2 Months",
    classes: "5 Days / Week",
    regularFee: "₹40,000",
    discount: "15% OFF",
    finalFee: "₹34,000",
    kit: "Practice Only",

    description:
      "Designed for those interested in professional hair styling and chemical treatments.",
    learn:
      "Advanced haircuts, hair coloring, Keratin, Smoothening and Rebonding.",
  },

  {
    id: 5,
    name: "Professional Nail Art",
    duration: "15 Days",
    classes: "6 Days / Week",
    regularFee: "₹12,000",
    discount: "10% OFF",
    finalFee: "₹10,800",
    kit: "Mini Kit Free",
  },

  {
    id: 6,
    name: "Bridal Makeup Masterclass",
    duration: "10 Days",
    classes: "Continuous",
    regularFee: "₹25,000",
    discount: "20% OFF",
    finalFee: "₹20,000",
    kit: "Practice Only",
  },

  {
    id: 7,
    name: "All-in-One Beauty Combo",
    duration: "3 Months",
    classes: "5 Days / Week",
    regularFee: "₹60,000",
    discount: "25% OFF",
    finalFee: "₹45,000",
    kit: "Professional Kit",
    popular: true,
  },

  {
    id: 8,
    name: "Cosmetology (Advanced)",
    duration: "6 Months",
    classes: "5 Days / Week",
    regularFee: "₹1,20,000",
    discount: "25% OFF",
    finalFee: "₹90,000",
    kit: "Master Kit Free",
  },
];

const detailedCourses = [
  {
    number: "01",
    name: "Self Grooming Course",
    duration: "1 Week",

    audience:
      "For individuals who want to learn their own makeup, hair styling and basic skincare.",

    learn:
      "Daily makeup, party looks, eyeliner techniques and basic hair styling.",
  },

  {
    number: "02",
    name: "Basic Beauty Course",
    duration: "1 Month",

    audience:
      "For individuals who want to start working in a beauty parlour at a basic level.",

    learn: "Threading, waxing, basic facials, clean-ups and simple haircuts.",
  },

  {
    number: "03",
    name: "Professional Makeup Artistry",
    duration: "1 Month",

    audience:
      "For individuals who want to become professional bridal and party makeup artists.",

    learn:
      "HD makeup, waterproof makeup, engagement and party looks, and saree/dupatta draping.",
  },

  {
    number: "04",
    name: "Advanced Hair Designing & Chemical Work",
    duration: "2 Months",

    audience:
      "For professionals interested in advanced hair styling and chemical treatments.",

    learn:
      "Advanced haircuts, hair coloring, Keratin, Smoothening and Rebonding.",
  },

  {
    number: "05",
    name: "All-in-One Beauty Combo",
    duration: "3 Months",

    audience:
      "For individuals who want to open their own beauty parlour or salon.",

    learn:
      "Complete skincare, professional hair work and advanced makeup — all together.",

    benefit:
      "A professional practice kit worth ₹5,000 is provided free with this course.",

    popular: true,
  },
];

const benefits = [
  {
    icon: FaAward,
    title: "Certification",
    text: "After successful completion of the course, a government-certified / academy industry certificate will be provided.",
  },

  {
    icon: FaPaintbrush,
    title: "Live Practical Training",
    text: "100% hands-on practical training on real models and dummies.",
  },

  {
    icon: FaCalendarDays,
    title: "Flexible Batches",
    text: "Morning and evening batches are available for housewives and college students.",
  },

  {
    icon: FaIndianRupeeSign,
    title: "Installment Facility",
    text: "Course fees can also be paid through 2 or 3 easy monthly installments (EMI).",
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const stagger = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const CourseCard = ({ course, index, onEnquire }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{
        y: -7,
      }}
      className={`
        group relative overflow-hidden
        rounded-[1.75rem]
        border bg-white
        transition-all duration-300
        ${
          course.popular
            ? "border-[#8B2954]/40 shadow-[0_20px_60px_rgba(139,41,84,0.14)]"
            : "border-gray-100 shadow-[0_15px_50px_rgba(0,0,0,0.05)]"
        }
      `}
    >
      {/* Glow */}
      <div
        className="
          absolute -right-12 -top-12
          h-36 w-36
          rounded-full
          opacity-10
          blur-3xl
          transition-transform duration-500
          group-hover:scale-150
        "
        style={{
          backgroundColor: BRAND,
        }}
      />

      {/* Popular Badge */}
      {course.popular && (
        <div
          className="
            absolute right-4 top-4
            flex items-center gap-1
            rounded-full
            px-3 py-1.5
            text-[9px] font-bold
            uppercase tracking-wider
            text-white
            sm:right-5 sm:top-5
            sm:text-[10px]
          "
          style={{
            backgroundColor: BRAND,
          }}
        >
          <FaStar />
          Most Popular
        </div>
      )}

      <div className="relative p-5 sm:p-6">
        {/* Number / Duration */}
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              text-xs font-black
              sm:h-10 sm:w-10
            "
            style={{
              color: BRAND,
              backgroundColor: `${BRAND}0D`,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <FaClock />
            {course.duration}
          </div>
        </div>

        {/* Course Name */}
        <h3 className="mt-5 pr-16 text-lg font-bold leading-tight text-gray-900 sm:text-xl">
          {course.name}
        </h3>

        {/* Price */}
        <div
          className="mt-6 rounded-2xl p-4"
          style={{
            backgroundColor: `${BRAND}07`,
          }}
        >
          <p className="text-[11px] font-medium text-gray-400">Offer Price</p>

          <div className="mt-1 flex flex-wrap items-end gap-2 sm:gap-3">
            <span
              className="text-2xl font-black sm:text-3xl"
              style={{
                color: BRAND,
              }}
            >
              {course.finalFee}
            </span>

            <span className="pb-1 text-xs text-gray-400 line-through sm:text-sm">
              {course.regularFee}
            </span>
          </div>

          <div
            className="
              mt-2 inline-flex
              rounded-full
              bg-white
              px-2.5 py-1
              text-[10px] font-bold
            "
            style={{
              color: BRAND,
            }}
          >
            {course.discount}
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-50 px-3 py-1.5 text-[11px] font-medium text-gray-500">
            {course.classes}
          </span>

          <span className="rounded-full bg-gray-50 px-3 py-1.5 text-[11px] font-medium text-gray-500">
            {course.kit}
          </span>
        </div>

        {/* Details */}
        {(course.description || course.learn) && (
          <div className="mt-5 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="
                flex w-full
                items-center justify-between
                text-sm font-semibold
                text-gray-800
              "
            >
              <span>Course Details</span>

              <motion.span
                animate={{
                  rotate: open ? 180 : 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                style={{
                  color: BRAND,
                }}
              >
                <FaChevronDown />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
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
                    duration: 0.3,
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    {course.description && (
                      <div className="mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Suitable For
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {course.description}
                        </p>
                      </div>
                    )}

                    {course.learn && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          What You Will Learn
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {course.learn}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* CTA */}
        <motion.button
          type="button"
          whileHover={{
            x: 3,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={() => onEnquire(course)}
          className="
            mt-6 flex w-full
            items-center justify-center gap-2
            rounded-xl
            px-5 py-3
            text-sm font-bold
            text-white
          "
          style={{
            backgroundColor: BRAND,
          }}
        >
          Enquire Now
          <FaArrowUpRightFromSquare />
        </motion.button>
      </div>
    </motion.article>
  );
};

const DetailedCourse = ({ course, index }) => {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 35,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-60px",
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
      }}
      className={`
        relative overflow-hidden
        rounded-[2rem]
        border bg-white
        p-5
        shadow-[0_15px_55px_rgba(0,0,0,0.045)]
        sm:p-8
        ${course.popular ? "border-[#8B2954]/30" : "border-gray-100"}
      `}
    >
      {/* Popular */}
      {course.popular && (
        <div
          className="
            absolute right-0 top-0
            rounded-bl-2xl
            px-3 py-2
            text-[10px] font-bold
            text-white
            sm:px-4 sm:text-xs
          "
          style={{
            backgroundColor: BRAND,
          }}
        >
          ⭐ MOST POPULAR
        </div>
      )}

      <div className="flex gap-4 sm:gap-5">
        {/* Number */}
        <motion.div
          whileHover={{
            scale: 1.08,
            rotate: 4,
          }}
          className="
            flex h-11 w-11 shrink-0
            items-center justify-center
            rounded-2xl
            text-xs font-black
            text-white
            sm:h-12 sm:w-12
          "
          style={{
            backgroundColor: BRAND,
          }}
        >
          {course.number}
        </motion.div>

        <div className="min-w-0">
          {/* Heading */}
          <div className="flex flex-wrap items-center gap-2 pr-16 sm:gap-3 sm:pr-24">
            <h3 className="text-lg font-bold text-gray-900 sm:text-2xl">
              {course.name}
            </h3>

            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold sm:text-xs"
              style={{
                color: BRAND,
                backgroundColor: `${BRAND}0C`,
              }}
            >
              {course.duration}
            </span>
          </div>

          {/* Details */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-2">
                <FaUsers
                  style={{
                    color: BRAND,
                  }}
                />

                <p className="text-sm font-bold text-gray-800">Suitable For</p>
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {course.audience}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <FaBookOpen
                  style={{
                    color: BRAND,
                  }}
                />

                <p className="text-sm font-bold text-gray-800">
                  What You Will Learn
                </p>
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {course.learn}
              </p>
            </div>
          </div>

          {/* Benefit */}
          {course.benefit && (
            <div
              className="
                mt-5 flex gap-3
                rounded-2xl
                border p-4
              "
              style={{
                borderColor: `${BRAND}20`,
                backgroundColor: `${BRAND}06`,
              }}
            >
              <FaGift
                className="mt-0.5 shrink-0"
                style={{
                  color: BRAND,
                }}
              />

              <p className="text-sm font-semibold leading-6 text-gray-700">
                <span style={{ color: BRAND }}>Special Benefit: </span>

                {course.benefit}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const EnquiryModal = ({ course, onClose }) => {
  return (
    <EnquiryModalForm
      type="course"
      interest={course.name}
      context={{
        courseId: course.id,
        duration: course.duration,
        classes: course.classes,
        fee: course.finalFee,
      }}
      onClose={onClose}
    />
  );
};

const BeautyAcademy = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleEnquire = (course) => {
    setSelectedCourse(course);
  };

  const closeEnquiry = () => {
    setSelectedCourse(null);
  };

  return (
    <section className="min-h-screen overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
          }}
          variants={stagger}
          className="relative mx-auto max-w-4xl text-center"
        >
          {/* Floating Icon */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 4, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute -left-5 top-0
              hidden
              text-[#8B2954]/20
              lg:block
            "
          >
            <FaStar className="text-4xl" />
          </motion.div>

          <motion.div variants={fadeUp}>
            <span
              className="inline-flex items-center gap-2rounded-fullpx-4 py-2text-[10px] font-bolduppercase tracking-[0.2em]sm:text-xs"
              style={{
                color: BRAND,
                backgroundColor: `${BRAND}09`,
              }}
            >
              <FaGraduationCap />
              Beauty Academy
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className=" mt-6 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl md:text-5xl lg:text-6xl "
          >
            Learn. Create. <span style={{ color: BRAND }}>Transform.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className=" mx-auto mt-5 max-w-2xl text-sm leading-6 text-gray-500 sm:mt-6 sm:text-base sm:leading-7 lg:text-lg"
          >
            Professional beauty courses designed to help you develop skills
            across makeup, hair, nails, skincare and cosmetology.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mx-auto mt-7 h-1 w-20 rounded-full"
            style={{
              backgroundColor: BRAND,
            }}
          />
        </motion.div>

        {/* Course Menu */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial={{
              opacity: 0,
              x: -25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <div
                className=" flex h-10 w-10 items-center justify-center rounded-xl text-white sm:h-11 sm:w-11"
                style={{
                  backgroundColor: BRAND,
                }}
              >
                <FaBookOpen />
              </div>

              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs"
                  style={{
                    color: BRAND,
                  }}
                >
                  Course Menu
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
                  Choose Your Course
                </h2>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: "-80px",
            }}
            variants={stagger}
            className="
              grid gap-5
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {courses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                onEnquire={handleEnquire}
              />
            ))}
          </motion.div>
        </section>

        {/* Detailed Courses */}
        <section className="mt-20 sm:mt-24">
          <motion.div
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
            className="mx-auto max-w-2xl text-center"
          >
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs"
              style={{
                color: BRAND,
              }}
            >
              Course Details
            </span>

            <h2 className="mt-3 text-2xl font-black text-gray-900 sm:text-3xl lg:text-4xl">
              What You Will Learn
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500 sm:mt-4">
              Explore the detailed learning focus mentioned in the academy
              course document.
            </p>
          </motion.div>

          <div className="mx-auto mt-8 max-w-5xl space-y-5 sm:mt-10">
            {detailedCourses.map((course, index) => (
              <DetailedCourse
                key={course.number}
                course={course}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mt-20 sm:mt-24">
          <motion.div
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
            className="text-center"
          >
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs"
              style={{
                color: BRAND,
              }}
            >
              Student Benefits
            </span>

            <h2 className="mt-3 text-2xl font-black text-gray-900 sm:text-3xl lg:text-4xl">
              More Than Just Classes
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
            variants={stagger}
            className="
              mt-8
              grid gap-5
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.title}
                  variants={fadeUp}
                  whileHover={{
                    y: -6,
                  }}
                  className="
                    rounded-[1.5rem]
                    border border-gray-100
                    bg-white
                    p-5
                    shadow-[0_15px_50px_rgba(0,0,0,0.045)]
                    sm:p-6
                  "
                >
                  <div
                    className="
                      flex h-11 w-11
                      items-center justify-center
                      rounded-2xl
                    "
                    style={{
                      color: BRAND,
                      backgroundColor: `${BRAND}0D`,
                    }}
                  >
                    <Icon />
                  </div>

                  <h3 className="mt-5 font-bold text-gray-900">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {benefit.text}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="
            relative mt-16
            overflow-hidden
            rounded-[2rem]
            p-7
            text-center
            sm:mt-20 sm:p-10
            lg:p-12
          "
          style={{
            backgroundColor: BRAND,
          }}
        >
          {/* Animated Background */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute -right-20 -top-32
              h-80 w-80
              rounded-full
              bg-white
              blur-3xl
            "
          />

          <div className="relative">
            <div
              className="
              mx-auto flex h-12 w-12
              items-center justify-center
              rounded-2xl
              bg-white/15
              text-white
              sm:h-14 sm:w-14
            "
            >
              <FaStar />
            </div>

            <h2
              className="
              mt-5
              text-2xl font-black
              text-white
              sm:text-3xl
              lg:text-4xl
            "
            >
              Ready to Start Your Beauty Journey?
            </h2>

            <p
              className="
              mx-auto mt-3
              max-w-xl
              text-sm leading-6
              text-white/75
            "
            >
              Book your seat or contact us today for a free demo class!
            </p>

            <motion.button
              whileHover={{
                scale: 1.04,
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="
                mt-7
                inline-flex
                items-center gap-2
                rounded-xl
                bg-white
                px-6 py-3.5
                text-sm font-bold
              "
              style={{
                color: BRAND,
              }}
            >
              Book Your Seat
              <FaArrowUpRightFromSquare />
            </motion.button>
          </div>
        </motion.div>
        {/* Enquiry Modal */}
        {selectedCourse && (
          <EnquiryModal course={selectedCourse} onClose={closeEnquiry} />
        )}
      </div>
    </section>
  );
};

export default BeautyAcademy;
