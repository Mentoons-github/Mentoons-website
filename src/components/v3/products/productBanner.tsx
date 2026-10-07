import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import LoginModal from "@/components/common/modal/loginModal";
import ComboModal from "./comboModal";
import { api } from "@/api/axiosInstance/axiosInstance";

const ORDER_SUMMARY_PATH = "/order-summary";
const COMBO_API_PATH = "/combo";

type ComboKey = "explorer" | "trailblazer";

type ComboData = {
  _id: string;
  price: number;
  mrp: number;
  productImages?: { imageUrl: string }[];
  details: {
    comboKey: string;
    discountPercent: number;
    bundleItems: { title: string; price: number; image?: string }[];
  };
};

type BaseSlide = {
  id: number;
  alt: string;
};
type HeroSlide = BaseSlide & {
  type: "hero";
  bg: string;
  title: ReactNode;
  description: string;
  image: string;
};
type ComboSlide = BaseSlide & {
  type: "combo";
  banner: string;
  tag: string;
  title: string;
  comboKey: ComboKey;
  image: string;
};
type Slide = HeroSlide | ComboSlide;

const slides: Slide[] = [
  {
    id: 0,
    type: "hero",
    bg: "bg-[#F5F5F4]",
    title: (
      <>
        Products for
        <br />
        brighter tomorrows
      </>
    ),
    description:
      "Books, cards, journals and activities that spark conversations, creativity and confidence in children.",
    image: "/assets/v3/products/productBanner.png",
    alt: "Two children reading books labelled Read, Create, Connect and Grow",
  },
  {
    id: 1,
    type: "combo",
    comboKey: "explorer",
    tag: "Gen Alpha · Ages 6-12",
    title: "Explorer Combo",
    banner: "/assets/v3/products/gen-alpha.png",
    image: "/assets/v3/products/gen-alpha.png",
    alt: "Explorer Combo with conversation cards, colouring book and journal",
  },
  {
    id: 2,
    type: "combo",
    comboKey: "trailblazer",
    tag: "Gen Z · Ages 13-19",
    title: "Trailblazer Combo",
    banner: "/assets/v3/products/genz.png",
    image: "/assets/v3/products/genz.png",
    alt: "Trailblazer Combo with conversation cards, reflection journal and activity book",
  },
];

const ProductBanner = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [combos, setCombos] = useState<Record<string, ComboData>>({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeComboKey, setActiveComboKey] = useState<ComboKey | null>(null);

  const total = slides.length;
  const next = () => setCurrent((p) => (p + 1) % total);
  const prev = () => setCurrent((p) => (p - 1 + total) % total);

  useEffect(() => {
    if (paused || activeComboKey) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % total), 4500);
    return () => clearInterval(timer);
  }, [paused, activeComboKey, total]);

  useEffect(() => {
    let active = true;
    api
      .get(COMBO_API_PATH)
      .then((res) => {
        if (!active) return;
        const list: ComboData[] = res.data?.data ?? [];
        setCombos(Object.fromEntries(list.map((c) => [c.details.comboKey, c])));
      })
      .catch((err) => console.error("Error fetching combos:", err));
    return () => {
      active = false;
    };
  }, []);

  const activeSlide = slides.find(
    (s): s is ComboSlide => s.type === "combo" && s.comboKey === activeComboKey,
  );
  const activeCombo = activeComboKey ? combos[activeComboKey] : undefined;

  const handleShopCombo = (combo?: ComboData) => {
    if (!combo) return;
    setActiveComboKey(combo.details.comboKey as ComboKey);
  };

  const handleProceed = () => {
    if (!activeCombo) return;
    if (!isSignedIn) {
      setActiveComboKey(null);
      setShowLoginModal(true);
      return;
    }
    const key = activeCombo.details.comboKey;
    setActiveComboKey(null);
    navigate(`${ORDER_SUMMARY_PATH}?combo=${key}`);
  };

  return (
    <section className="w-full bg-[#F5F5F4] px-10 py-10">
      <div
        className="relative mx-auto aspect-[1334/356] w-full max-w-[1334px] overflow-hidden rounded-3xl border-2 border-gray-900 shadow-[6px_6px_0_0_#111827]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => {
            if (slide.type === "hero") {
              return (
                <div
                  key={slide.id}
                  className={`flex h-full w-full shrink-0 items-stretch ${slide.bg}`}
                >
                  <div className="flex w-1/2 flex-col justify-center gap-2 pl-14 pr-4 md:gap-4 md:pl-20">
                    <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 sm:text-2xl md:text-4xl lg:text-5xl">
                      {slide.title}
                    </h1>
                    <p className="max-w-xl text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base lg:text-lg">
                      {slide.description}
                    </p>
                  </div>
                  <div className="relative w-1/2">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="absolute inset-0 h-full w-full object-contain object-right"
                      loading="eager"
                    />
                  </div>
                </div>
              );
            }

            const combo = combos[slide.comboKey];
            const clickable = !!combo;

            return (
              <div
                key={slide.id}
                role={clickable ? "button" : "img"}
                tabIndex={clickable ? 0 : -1}
                aria-label={
                  clickable ? `${slide.alt}. Click to view combo` : slide.alt
                }
                onClick={() => clickable && handleShopCombo(combo)}
                onKeyDown={(e) => {
                  if (clickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    handleShopCombo(combo);
                  }
                }}
                className={`h-full w-full shrink-0 ${
                  clickable ? "cursor-pointer" : ""
                }`}
                style={{
                  backgroundImage: `url(${slide.banner})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gray-900 bg-white text-gray-900 transition hover:bg-gray-900 hover:text-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gray-900 bg-white text-gray-900 transition hover:bg-gray-900 hover:text-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full border border-gray-900 transition-all ${
                index === current ? "w-8 bg-gray-900" : "w-2.5 bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {activeSlide && activeCombo && (
        <ComboModal
          isOpen
          onClose={() => setActiveComboKey(null)}
          onProceed={handleProceed}
          title={activeSlide.title}
          tag={activeSlide.tag}
          heroImage={activeSlide.image}
          heroAlt={activeSlide.alt}
          items={activeCombo.details.bundleItems}
          productImages={activeCombo.productImages}
          price={activeCombo.price}
          mrp={activeCombo.mrp}
          discountPercent={activeCombo.details.discountPercent}
        />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </section>
  );
};

export default ProductBanner;
