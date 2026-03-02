import { useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const PlanHeads = [
  {
    from: "offer",
    title: "BPL (Below Poverty Line)",
    bottom: "70% off",
    bg: "#d1f1ff",
    border: "#00b8fe",
  },
  {
    from: "plan",
    title: "1 Month",
    bottom: "8 Sessions",
    bg: "#eaf8d4",
    border: "#88d914",
    price: "₹2999",
  },
  {
    from: "plan",
    title: "3 Months",
    bottom: "24 Sessions",
    bg: "#ffdfd2",
    border: "#ff6200",
    price: "₹7129",
  },
  {
    from: "plan",
    title: "6 Months",
    bottom: "48 Sessions",
    bg: "#fcc0c0",
    border: "#db1717",
    price: "₹75000",
  },
  {
    from: "plan",
    title: "12 Months",
    bottom: "96 Sessions",
    bg: "#d7f8f8",
    border: "#108989e6",
    price: "₹120000",
  },
];

interface PlanCarouselProps {
  handleCarouselClick: (from: string, title: string) => void;
  carouselClick?: { from: string; title: string } | null;
}

const PlanCarousel = ({
  handleCarouselClick,
  carouselClick,
}: PlanCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const scrollAmount = carouselRef.current.offsetWidth;

    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full mx-auto py-6">
      {/* LEFT BUTTON */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-10 p-3 -translate-y-1/2 bg-white rounded-full shadow-xl hover:bg-orange-100 hover:scale-110 transition"
      >
        <IoIosArrowBack className="text-2xl text-orange-500" />
      </button>

      {/* CAROUSEL */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-6 px-8 md:px-12 p-3 scrollbar-hide"
      >
        {PlanHeads.map((plan, index) => {
          const isActive =
            carouselClick?.title === plan.title &&
            carouselClick?.from === plan.from;

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCarouselClick(plan.from, plan.title)}
              className={`relative min-w-[260px] sm:min-w-[300px] snap-center rounded-xl p-4 md:p-6 flex flex-col justify-between space-y-2 md:space-y-3 cursor-pointer border-4 transition-all duration-300`}
              style={{
                backgroundColor: plan.bg,
                borderColor:  plan.border,
                boxShadow: isActive
                  ? "0px 12px 30px rgba(0,0,0,0.2)"
                  : "0px 4px 12px rgba(0,0,0,0.08)",
                transform: isActive ? "scale(1.05)" : "scale(1)",
              }}
            >
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`absolute -top-3 -right-3 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg`}
                  style={{backgroundColor:plan.border}}
                >
                  <CheckCircle size={14} />
                </motion.div>
              )}

              <h3 className="text-lg font-semibold text-[#221c1c]">
                {plan.title} {plan.from === "plan" ? "Workshop" : ""}
              </h3>

              <p className="text-[#272071] font-bold">6-12 & 13-19</p>

              <p style={{ color: plan.border }} className="font-bold">
                {plan.bottom} {plan.price && <span>({plan.price})</span>}
              </p>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 p-3 -translate-y-1/2 bg-white rounded-full shadow-xl hover:bg-orange-100 hover:scale-110 transition"
      >
        <IoIosArrowForward className="text-2xl text-orange-500" />
      </button>
    </div>
  );
};

export default PlanCarousel;
