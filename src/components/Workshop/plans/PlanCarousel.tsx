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

const navBtn =
  "absolute top-1/2 z-10 -translate-y-1/2 p-2 md:p-3 rounded-full bg-[#ffd93d] border-4 border-black shadow-[3px_3px_0_#000] transition hover:-translate-y-[55%] active:translate-y-[-45%] active:shadow-none";

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
    <div className="relative w-full mx-auto py-4">
      {/* LEFT BUTTON */}
      <button
        onClick={() => scroll("left")}
        className={`${navBtn} left-0`}
        aria-label="Scroll left"
      >
        <IoIosArrowBack className="text-2xl text-black" />
      </button>

      {/* CAROUSEL */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-6 px-12 md:px-16 pt-6 pb-8 scrollbar-hide"
      >
        {PlanHeads.map((plan, index) => {
          const isActive =
            carouselClick?.title === plan.title &&
            carouselClick?.from === plan.from;

          return (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              whileTap={{ y: 2 }}
              animate={{ scale: isActive ? 1.05 : 1 }}
              onClick={() => handleCarouselClick(plan.from, plan.title)}
              className="relative min-w-[260px] sm:min-w-[300px] snap-center p-4 md:p-6 flex flex-col justify-between gap-2 md:gap-3 cursor-pointer border-4 border-black"
              style={{
                backgroundColor: plan.bg,
                boxShadow: isActive
                  ? `8px 8px 0 ${plan.border}, 8px 8px 0 2px #000`
                  : "5px 5px 0 #000",
              }}
            >
              {isActive && (
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute -top-4 -right-4 text-black w-9 h-9 rounded-full border-4 border-black flex items-center justify-center"
                  style={{ backgroundColor: plan.border }}
                >
                  <CheckCircle size={18} strokeWidth={3} />
                </motion.div>
              )}

              <h3 className="font-comic-chip text-2xl tracking-wide text-[#221c1c]">
                {plan.title} {plan.from === "plan" ? "Workshop" : ""}
              </h3>

              <p className="font-comic text-xl tracking-wider text-[#272071]">
                6-12 & 13-19
              </p>

              <p className="font-number text-xl tracking-wider self-start bg-white border-2 border-black px-3 py-0.5 text-black -rotate-1">
                {plan.bottom} {plan.price && <span>({plan.price})</span>}
              </p>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => scroll("right")}
        className={`${navBtn} right-0`}
        aria-label="Scroll right"
      >
        <IoIosArrowForward className="text-2xl text-black" />
      </button>
    </div>
  );
};

export default PlanCarousel;
