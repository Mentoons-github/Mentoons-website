import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { WordRotate } from "../magicui/word-rotate";
import { useEffect, useState, useRef, CSSProperties } from "react";
import { WorkshopCategory } from "@/types";

interface AboutWorkshopProps {
  categories: WorkshopCategory[];
}

interface Testimonial {
  name: string;
  role: string;
  workshop: string;
  quote: string;
  rating: number;
}

const INK = "#1f1308";

// ---- SAMPLE parent testimonials (replace with real ones before launch) ----
const testimonials: Testimonial[] = [
  {
    name: "Priya Nair",
    role: "Parent of Aarav, 9",
    workshop: "KalaKriti",
    quote:
      "Aarav used to lose hours on his tablet. After KalaKriti he picks up his colours first, and he is so much calmer and more focused.",
    rating: 5,
  },
  {
    name: "Rahul Menon",
    role: "Parent of Diya, 11",
    workshop: "Instant Katha",
    quote:
      "Diya now makes up her own stories and tells them at dinner. Her confidence and vocabulary have grown a lot in just a few weeks.",
    rating: 5,
  },
  {
    name: "Sneha Iyer",
    role: "Parent of Kabir, 8",
    workshop: "Hasyras",
    quote:
      "The sessions are full of laughter, and the facilitators really understand kids. Kabir looks forward to every class instead of his games.",
    rating: 5,
  },
  {
    name: "Anita Sharma",
    role: "Parent of Meera, 10",
    workshop: "Swar",
    quote:
      "Meera discovered her love for music through Swar. It gave her a healthy outlet and a real hobby that screens never could.",
    rating: 4,
  },
];

// ---- inline comic styles ----
const halftoneStyle: CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(31,19,8,0.14) 1.5px, transparent 1.6px)",
  backgroundSize: "14px 14px",
};

const headingStyle: CSSProperties = {
  color: INK,
  letterSpacing: "0.03em",
  lineHeight: 1.05,
  textShadow: "3px 3px 0 #fb923c",
};

const panelStyle: CSSProperties = {
  background: "#fff",
  border: `3px solid ${INK}`,
  borderRadius: 14,
  boxShadow: `5px 5px 0 ${INK}`,
};

const panelLgStyle: CSSProperties = {
  ...panelStyle,
  boxShadow: `8px 8px 0 ${INK}`,
};

const chipOrangeStyle: CSSProperties = {
  background: "#fb923c",
  color: INK,
  border: `3px solid ${INK}`,
  borderRadius: 12,
  boxShadow: `3px 3px 0 ${INK}`,
};

const backdropStyle: CSSProperties = {
  background: "#fdba74",
  border: `3px solid ${INK}`,
  borderRadius: 28,
  transform: "translate(14px, 14px) rotate(4deg)",
};

const testimonialCardStyle: CSSProperties = {
  ...panelStyle,
  background: "#fffdf5",
};

const avatarStyle: CSSProperties = {
  background: "#fdba74",
  color: INK,
  border: `2px solid ${INK}`,
};

const AboutWorkshop = ({ categories }: AboutWorkshopProps) => {
  const workshopImages = categories
    .map((category) =>
      category.workshops.map((workshop) =>
        workshop.ageGroups.map((group) => group.image),
      ),
    )
    .flat(2)
    .filter((image): image is string => image !== null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Below lg, skip scroll-linked fade/translate so text is never stuck hidden.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const titleOpacityRaw = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 1],
  );
  const titleXRaw = useTransform(scrollYProgress, [0, 0.3], [-100, 0]);

  const rotateOpacityRaw = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.7, 1],
    [0, 1, 1, 1],
  );
  const rotateYRaw = useTransform(scrollYProgress, [0.1, 0.4], [30, 0]);

  const para1OpacityRaw = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.7, 1],
    [0, 1, 1, 1],
  );
  const para1YRaw = useTransform(scrollYProgress, [0.2, 0.5], [40, 0]);

  const para2OpacityRaw = useTransform(
    scrollYProgress,
    [0.3, 0.6, 0.7, 1],
    [0, 1, 1, 1],
  );
  const para2YRaw = useTransform(scrollYProgress, [0.3, 0.6], [40, 0]);

  const imageOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.7, 1],
    [0, 1, 1, 1],
  );
  const imageX = useTransform(scrollYProgress, [0.2, 0.5], [200, 0]);
  const imageRotate = useTransform(scrollYProgress, [0.2, 0.5], [15, 0]);
  const imageScale = useTransform(scrollYProgress, [0.2, 0.5], [0.8, 1]);

  const titleOpacity = isMobile ? 1 : titleOpacityRaw;
  const titleX = isMobile ? 0 : titleXRaw;
  const rotateOpacity = isMobile ? 1 : rotateOpacityRaw;
  const rotateY = isMobile ? 0 : rotateYRaw;
  const para1Opacity = isMobile ? 1 : para1OpacityRaw;
  const para1Y = isMobile ? 0 : para1YRaw;
  const para2Opacity = isMobile ? 1 : para2OpacityRaw;
  const para2Y = isMobile ? 0 : para2YRaw;

  useEffect(() => {
    if (workshopImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % workshopImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [workshopImages.length]);

  // Auto-rotate testimonials (pauses while hovered / touched)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeTestimonial = testimonials[testimonialIndex];

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col lg:flex-row justify-between items-center overflow-hidden w-full px-4 lg:px-8 py-8 md:py-12 min-h-screen bg-[#fff7e6]"
    >
      {/* Halftone dots */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={halftoneStyle}
      />

      <div className="relative z-10 flex-1 w-full max-w-4xl px-2 lg:px-8 pt-8 md:pt-12 md:text-left">
        <motion.h1
          style={{ ...headingStyle, opacity: titleOpacity, x: titleX }}
          className="font-comic text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4"
        >
          Workshops At Mentoons
        </motion.h1>

        <motion.div
          style={{ opacity: rotateOpacity, y: rotateY }}
          className="mt-3"
        >
          <WordRotate
            motionProps={{
              initial: { opacity: 1, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            words={[
              "Fun and Creative Workshops for Kids",
              "Offline and Online Workshops Available",
              "Led By Psychologists and Academicians",
            ]}
            className="font-comic-chip tracking-wide text-lg sm:text-xl md:text-2xl w-full md:w-[80%] mx-auto md:mx-0 text-orange-600"
          />
        </motion.div>

        <motion.p
          style={{
            ...panelStyle,
            color: INK,
            opacity: para1Opacity,
            y: para1Y,
          }}
          className="text-base sm:text-lg md:text-xl w-full md:w-[80%] mt-5 mb-6 mx-auto md:mx-0 p-4 sm:p-5"
        >
          These are specially designed workshops aimed at social media
          de-addiction, cell-phone de-addiction, and gaming de-addiction by
          improving productivity and overall quality of life.
        </motion.p>

        <motion.p
          style={{
            ...panelStyle,
            color: INK,
            opacity: para2Opacity,
            y: para2Y,
          }}
          className="text-base sm:text-lg md:text-xl w-full md:w-[80%] mb-6 mx-auto md:mx-0 p-4 sm:p-5"
        >
          Our team of Psychology Graduates, Certified Career Experts, and Human
          Resources Experts, all trained in child psychology, work together to
          provide a safe and supportive environment for our participants.
        </motion.p>
      </div>

      <motion.div
        style={{
          opacity: imageOpacity,
          x: imageX,
          rotate: imageRotate,
          scale: imageScale,
        }}
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-md md:max-w-lg flex-1 mt-10 md:mt-0 px-4"
      >
        {/* flat offset shape behind the card */}
        <div
          className="absolute w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 -z-10"
          style={backdropStyle}
        />

        {workshopImages.length > 0 ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            style={panelLgStyle}
            className="relative p-3 sm:p-4 pb-8 sm:pb-10 w-64 sm:w-80 md:w-96"
          >
            <div
              className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center"
              style={{ border: `2px solid ${INK}` }}
            >
              <img
                src={workshopImages[currentIndex]}
                alt={`workshop-${currentIndex}`}
                className="w-full h-full object-contain"
              />
            </div>
            <span
              style={chipOrangeStyle}
              className="font-comic-chip absolute -top-4 left-1/2 -translate-x-1/2 rotate-2 text-[11px] sm:text-sm px-3 py-1 whitespace-nowrap"
            >
              Workshop Moments
            </span>
          </motion.div>
        ) : (
          <div
            style={panelLgStyle}
            className="relative p-3 sm:p-4 w-64 sm:w-80 md:w-96"
          >
            <img
              src="/assets/workshopv2/workshopNew.png"
              alt="default-workshop"
              className="rounded-lg object-contain w-full aspect-square"
            />
          </div>
        )}

        {workshopImages.length > 1 && (
          <div className="mt-5 sm:mt-6 flex gap-2">
            {workshopImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Show workshop image ${i + 1}`}
                style={{ border: `2px solid ${INK}` }}
                className={`h-3 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-orange-500 w-6"
                    : "bg-white w-3 hover:bg-orange-200"
                }`}
              />
            ))}
          </div>
        )}

        {/* ---- Parent testimonials ---- */}
        <div
          className="relative mt-10 sm:mt-12 w-64 sm:w-80 md:w-96"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <span
            style={chipOrangeStyle}
            className="font-comic-chip absolute -top-4 left-4 -rotate-2 z-10 text-[11px] sm:text-sm px-3 py-1 whitespace-nowrap"
          >
            What Parents Say
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialIndex}
              initial={{ opacity: 0, y: 16, rotate: 1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={testimonialCardStyle}
              className="relative p-4 sm:p-5 pt-6 min-h-[210px] sm:min-h-[220px] flex flex-col justify-between"
            >
              <span
                aria-hidden
                className="font-comic absolute -top-1 right-4 text-6xl leading-none text-orange-400 select-none"
              >
                &rdquo;
              </span>

              {/* stars */}
              <div
                className="flex gap-0.5 mb-2"
                aria-label={`${activeTestimonial.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg leading-none ${
                      i < activeTestimonial.rating
                        ? "text-orange-500"
                        : "text-orange-200"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p
                style={{ color: INK }}
                className="text-sm sm:text-base leading-snug mb-4"
              >
                {activeTestimonial.quote}
              </p>

              <div className="flex items-center gap-3">
                <div
                  style={avatarStyle}
                  className="font-comic-chip w-10 h-10 rounded-full flex items-center justify-center text-base shrink-0"
                >
                  {activeTestimonial.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    style={{ color: INK }}
                    className="font-comic-chip text-sm sm:text-base truncate"
                  >
                    {activeTestimonial.name}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {activeTestimonial.role}
                  </p>
                </div>
                <span
                  style={{
                    background: "#fdba74",
                    color: INK,
                    border: `2px solid ${INK}`,
                  }}
                  className="font-comic-chip text-[10px] sm:text-xs px-2 py-0.5 rounded-lg whitespace-nowrap"
                >
                  {activeTestimonial.workshop}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* testimonial dots */}
          <div className="mt-5 flex justify-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setTestimonialIndex(i)}
                aria-label={`Show testimonial from ${t.name}`}
                style={{ border: `2px solid ${INK}` }}
                className={`h-3 rounded-full transition-all ${
                  i === testimonialIndex
                    ? "bg-orange-500 w-6"
                    : "bg-white w-3 hover:bg-orange-200"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutWorkshop;
