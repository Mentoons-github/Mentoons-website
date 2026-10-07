import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
import { gsap } from "gsap";

interface Product {
  id: string;
  title: string;
}

interface ProductScrollNavProps {
  productsData: Product[];
  loading: boolean;
  currentPage: number;
}

// Pattern: 3 pills with "#", then 3 without, then repeat
const GROUP_SIZE = 3;
const hasHashtag = (index: number) => Math.floor(index / GROUP_SIZE) % 2 === 0;

// Fill colours for the hashtag pills (plain pills stay white)
const HASH_COLORS = ["#fde68a", "#fdba74", "#a5f3fc"];

const ProductScrollNav: React.FC<ProductScrollNavProps> = ({
  productsData,
  loading,
  currentPage,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLButtonElement>(null);
  const rightArrowRef = useRef<HTMLButtonElement>(null);
  const pillRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const prevProductCount = useRef(0);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();

  useEffect(() => {
    if (!wrapperRef.current) return;
    gsap.fromTo(
      wrapperRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
    );
  }, []);

  useEffect(() => {
    if (productsData.length === 0) return;

    const newPills = pillRefs.current
      .slice(prevProductCount.current)
      .filter(Boolean);
    if (newPills.length === 0) return;

    gsap.fromTo(
      newPills,
      { scale: 0.7, opacity: 0, y: 10 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.04,
        ease: "back.out(1.5)",
      },
    );

    prevProductCount.current = productsData.length;
  }, [productsData]);

  useEffect(() => {
    if (!leftArrowRef.current) return;
    if (showLeftArrow) {
      gsap.fromTo(
        leftArrowRef.current,
        { x: -16, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.7)" },
      );
    }
  }, [showLeftArrow]);

  useEffect(() => {
    if (!rightArrowRef.current) return;
    if (showRightArrow) {
      gsap.fromTo(
        rightArrowRef.current,
        { x: 16, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.7)" },
      );
    }
  }, [showRightArrow]);

  const checkArrows = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 5);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    checkArrows();
    const container = scrollContainerRef.current;
    if (container) container.addEventListener("scroll", checkArrows);
    window.addEventListener("resize", checkArrows);
    return () => {
      container?.removeEventListener("scroll", checkArrows);
      window.removeEventListener("resize", checkArrows);
    };
  }, [productsData, checkArrows]);

  const manualScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    // Scroll roughly 70% of the visible width so it feels right on phones too
    const amount = Math.max(
      160,
      Math.round(scrollContainerRef.current.clientWidth * 0.7),
    );
    const target =
      direction === "left"
        ? scrollContainerRef.current.scrollLeft - amount
        : scrollContainerRef.current.scrollLeft + amount;
    scrollContainerRef.current.scrollTo({ left: target, behavior: "smooth" });
  };

  const handleArrowClick = (direction: "left" | "right") => {
    const ref =
      direction === "left" ? leftArrowRef.current : rightArrowRef.current;
    if (ref) {
      gsap.to(ref, {
        scale: 0.88,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }
    manualScroll(direction);
  };

  const handlePillHoverEnter = (el: HTMLAnchorElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 1.07, y: -2, duration: 0.18, ease: "power2.out" });
  };

  const handlePillHoverLeave = (el: HTMLAnchorElement | null) => {
    if (!el) return;
    gsap.to(el, { scale: 1, y: 0, duration: 0.18, ease: "power2.out" });
  };

  const loadMore = async () => {
    if (loading || isLoadingMore) return;

    setIsLoadingMore(true);
    const token = await getToken();
    if (!token) {
      setIsLoadingMore(false);
      return;
    }

    const nextPage = currentPage + 1;

    await dispatch(
      fetchProducts({
        token,
        type: undefined,
        cardType: undefined,
        ageCategory: undefined,
        page: nextPage,
        append: true,
      }),
    );

    setIsLoadingMore(false);
  };

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || loading || isLoadingMore) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const scrollPercentage = (scrollLeft + clientWidth) / scrollWidth;

    if (scrollPercentage > 0.8) {
      void loadMore();
    }
  }, [loading, isLoadingMore, currentPage]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={wrapperRef}
      className="relative flex items-center w-full overflow-hidden"
    >
      <div className="flex items-center justify-center flex-shrink-0 w-9 md:w-11">
        {showLeftArrow && (
          <button
            ref={leftArrowRef}
            type="button"
            aria-label="Scroll left"
            onClick={() => handleArrowClick("left")}
            onMouseEnter={() =>
              gsap.to(leftArrowRef.current, {
                scale: 1.15,
                duration: 0.18,
                ease: "power2.out",
              })
            }
            onMouseLeave={() =>
              gsap.to(leftArrowRef.current, {
                scale: 1,
                duration: 0.18,
                ease: "power2.out",
              })
            }
            className="psn-arrow flex items-center justify-center w-7 h-7 md:w-8 md:h-8"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="psn-scroll flex flex-1 min-w-0 items-center gap-2 md:gap-4 px-2 py-3 overflow-x-auto scroll-smooth"
      >
        {productsData.map((p, i) => (
          <a
            key={p.id}
            ref={(el) => (pillRefs.current[i] = el)}
            href={`/mentoons-store/product/${p.id}`}
            onMouseEnter={() => handlePillHoverEnter(pillRefs.current[i])}
            onMouseLeave={() => handlePillHoverLeave(pillRefs.current[i])}
            className="psn-pill psn-chip-font flex-shrink-0 px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm whitespace-nowrap"
            style={
              hasHashtag(i)
                ? { background: HASH_COLORS[i % HASH_COLORS.length] }
                : { background: "#fff" }
            }
          >
            {hasHashtag(i) ? `#${p.title}` : p.title}
          </a>
        ))}
        {isLoadingMore && (
          <div className="flex items-center justify-center flex-shrink-0 w-12 md:w-20">
            <Loader2 className="w-5 h-5 animate-spin text-black" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center flex-shrink-0 w-9 md:w-11">
        {showRightArrow && (
          <button
            ref={rightArrowRef}
            type="button"
            aria-label="Scroll right"
            onClick={() => {
              handleArrowClick("right");
              if (!loading && !isLoadingMore) {
                void loadMore();
              }
            }}
            onMouseEnter={() =>
              gsap.to(rightArrowRef.current, {
                scale: 1.15,
                duration: 0.18,
                ease: "power2.out",
              })
            }
            onMouseLeave={() =>
              gsap.to(rightArrowRef.current, {
                scale: 1,
                duration: 0.18,
                ease: "power2.out",
              })
            }
            disabled={loading || isLoadingMore}
            className="psn-arrow flex items-center justify-center w-7 h-7 md:w-8 md:h-8 disabled:opacity-50"
          >
            {isLoadingMore ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-white" />
            ) : (
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
            )}
          </button>
        )}
      </div>

      <style>{`
        .psn-chip-font {
          font-family: var(--font-comic-chip, var(--font-comic)) !important;
          font-weight: 400 !important;
          letter-spacing: 0.03em;
        }

        .psn-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x proximity;
        }
        .psn-scroll::-webkit-scrollbar { display: none; }

        .psn-pill {
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
          scroll-snap-align: start;
          transition: box-shadow 0.1s ease;
        }
        .psn-pill:hover { box-shadow: 3px 3px 0 #000; }
        .psn-pill:focus-visible { outline: 3px solid #000; outline-offset: 2px; }

        .psn-arrow {
          background: #000;
          border: 2px solid #000;
          border-radius: 999px;
          transition: background-color 0.15s ease;
        }
        .psn-arrow svg { color: #fff !important; }
        .psn-arrow:hover { background: #ea580c; }
        .psn-arrow:focus-visible { outline: 3px solid #000; outline-offset: 2px; }
      `}</style>
    </div>
  );
};

export default ProductScrollNav;
