import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  title: string;
}

interface ProductScrollNavProps {
  productsData: Product[];
}

const ProductScrollNav: React.FC<ProductScrollNavProps> = ({
  productsData,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 1);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [productsData]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex items-center w-full group overflow-hidden">
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 transition-all duration-200 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-lg top-1/2 hover:bg-gray-50 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={checkScrollPosition}
        className="flex w-full gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        {productsData.map((product) => (
          <a
            href={`/mentoons-store/product/${product.id}`}
            key={product.id}
            className="flex-shrink-0 px-5 py-2 text-sm font-medium text-blue-700 transition-all duration-200 border border-blue-600 rounded-full bg-blue-50 hover:bg-blue-100 hover:shadow-md whitespace-nowrap"
          >
            {product.title}
          </a>
        ))}
      </div>

      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 transition-all duration-200 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-lg top-1/2 hover:bg-gray-50 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductScrollNav;
