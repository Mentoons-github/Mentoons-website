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
    const amount = 300;
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
      className="relative flex items-center w-full group overflow-hidden"
    >
      {showLeftArrow && (
        <button
          ref={leftArrowRef}
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
          className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 transition-all duration-200 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-lg top-1/2 hover:bg-gray-50 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex w-full px-2 md:px-10 gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {productsData.map((p, i) => (
          <a
            key={p.id}
            ref={(el) => (pillRefs.current[i] = el)}
            href={`/mentoons-store/product/${p.id}`}
            onMouseEnter={() => handlePillHoverEnter(pillRefs.current[i])}
            onMouseLeave={() => handlePillHoverLeave(pillRefs.current[i])}
            className="flex-shrink-0 px-3 md:px-5 py-2 text-xs md:text-sm font-medium text-blue-700 transition-all duration-200 border border-blue-600 rounded-full bg-blue-50 hover:bg-blue-100 hover:shadow-md whitespace-nowrap"
          >
            {p.title}
          </a>
        ))}
        {isLoadingMore && (
          <div className="flex items-center justify-center flex-shrink-0 w-20">
            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          </div>
        )}
      </div>

      {showRightArrow && (
        <button
          ref={rightArrowRef}
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
          className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 transition-all duration-200 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-lg top-1/2 hover:bg-gray-50 hover:scale-110 disabled:opacity-50"
        >
          {isLoadingMore ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-700" />
          )}
        </button>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </div>
  );
};

export default ProductScrollNav;
