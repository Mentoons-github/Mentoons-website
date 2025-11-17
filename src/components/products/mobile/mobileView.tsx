import { ProductBase } from "@/types/productTypes";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaBolt, FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

interface MobileProductItemProps {
  product: ProductBase;
  handleAddToCart: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    product: ProductBase
  ) => Promise<void>;
  handleBuyNow: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    product: ProductBase
  ) => Promise<void>;
  isLoading: boolean;
}

const MobileProductItem = ({
  product,
  handleAddToCart,
  handleBuyNow,
  isLoading,
}: MobileProductItemProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartScrollLeft = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const mouseHandlersRef = useRef<{
    handleMouseMove?: (e: MouseEvent) => void;
    handleMouseUp?: () => void;
  }>({});
  const navigate = useNavigate();

  const images = product?.productImages || [];
  const totalImages = images.length;

  const scrollToImage = (index: number) => {
    if (!scrollContainerRef.current || totalImages <= 1) return;

    const container = scrollContainerRef.current;
    const imageWidth = container.offsetWidth;
    const targetScrollLeft = index * imageWidth;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
    setCurrentImageIndex(index);
  };

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (
        isDragging.current ||
        totalImages <= 1 ||
        !scrollContainerRef.current
      ) {
        return;
      }

      const container = e.currentTarget;
      const scrollLeft = container.scrollLeft;
      const imageWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / imageWidth);

      if (
        newIndex !== currentImageIndex &&
        newIndex >= 0 &&
        newIndex < totalImages
      ) {
        setCurrentImageIndex(newIndex);
      }
    },
    [currentImageIndex, totalImages]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (totalImages <= 1) return;

    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartScrollLeft.current = scrollContainerRef.current?.scrollLeft || 0;
    isDragging.current = true;

    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !scrollContainerRef.current || totalImages <= 1)
      return;

    const touch = e.touches[0];
    const walk = touchStartX.current - touch.clientX;
    scrollContainerRef.current.scrollLeft = touchStartScrollLeft.current + walk;

    e.stopPropagation();
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current || !scrollContainerRef.current || totalImages <= 1)
      return;

    isDragging.current = false;

    setTimeout(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const imageWidth = container.offsetWidth;
        const currentScroll = container.scrollLeft;
        const targetIndex = Math.round(currentScroll / imageWidth);
        const clampedIndex = Math.max(
          0,
          Math.min(targetIndex, totalImages - 1)
        );

        scrollToImage(clampedIndex);
      }
    }, 50);

    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (totalImages <= 1) return;

    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchStartScrollLeft.current = scrollContainerRef.current?.scrollLeft || 0;

    if (mouseHandlersRef.current.handleMouseMove) {
      document.removeEventListener(
        "mousemove",
        mouseHandlersRef.current.handleMouseMove
      );
    }
    if (mouseHandlersRef.current.handleMouseUp) {
      document.removeEventListener(
        "mouseup",
        mouseHandlersRef.current.handleMouseUp
      );
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (
        !isDragging.current ||
        !scrollContainerRef.current ||
        totalImages <= 1
      )
        return;

      const walk = touchStartX.current - e.clientX;
      scrollContainerRef.current.scrollLeft =
        touchStartScrollLeft.current + walk;
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;

      isDragging.current = false;

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      mouseHandlersRef.current = {};

      if (scrollContainerRef.current && totalImages > 1) {
        setTimeout(() => {
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const imageWidth = container.offsetWidth;
            const currentScroll = container.scrollLeft;
            const targetIndex = Math.round(currentScroll / imageWidth);
            const clampedIndex = Math.max(
              0,
              Math.min(targetIndex, totalImages - 1)
            );

            scrollToImage(clampedIndex);
          }
        }, 50);
      }
    };

    mouseHandlersRef.current = { handleMouseMove, handleMouseUp };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    e.stopPropagation();
    e.preventDefault();
  };

  const handleCardClick = () => {
    if (!isDragging.current) {
      navigate(`/mentoons-store/product/${product._id}`);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current && totalImages > 1) {
      scrollContainerRef.current.scrollLeft = 0;
      setCurrentImageIndex(0);
    }
  }, [totalImages]);

  useEffect(() => {
    return () => {
      if (mouseHandlersRef.current.handleMouseMove) {
        document.removeEventListener(
          "mousemove",
          mouseHandlersRef.current.handleMouseMove
        );
      }
      if (mouseHandlersRef.current.handleMouseUp) {
        document.removeEventListener(
          "mouseup",
          mouseHandlersRef.current.handleMouseUp
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current || totalImages <= 1) return;

    const container = scrollContainerRef.current;
    const images = container.querySelectorAll("img");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
            const imageElement = entry.target as HTMLImageElement;
            const index = Array.from(images).indexOf(imageElement);
            if (index !== -1 && index !== currentImageIndex) {
              setCurrentImageIndex(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.7,
      }
    );

    images.forEach((img) => observer.observe(img));

    return () => {
      observer.disconnect();
    };
  }, [totalImages, currentImageIndex]);

  return (
    <div
      className="flex p-3 sm:p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow w-full"
      onClick={handleCardClick}
    >
      <div className="flex-shrink-0 w-24 sm:w-28 h-24 sm:h-28 mr-3 sm:mr-4">
        <div className="relative w-full h-full">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide w-full h-full snap-x snap-mandatory"
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              cursor: totalImages > 1 ? "grab" : "default",
            }}
            onMouseEnter={(e) => {
              if (totalImages > 1) {
                e.currentTarget.style.cursor = isDragging.current
                  ? "grabbing"
                  : "grab";
              }
            }}
            onMouseLeave={(e) => {
              if (totalImages > 1) {
                e.currentTarget.style.cursor = "grab";
              }
            }}
          >
            {images.length > 0 ? (
              images.map((image, index) => (
                <img
                  key={`${image.imageUrl}-${index}`}
                  src={image.imageUrl}
                  alt={`${product.title} - Image ${index + 1}`}
                  className="flex-shrink-0 object-contain w-full h-full rounded-md snap-start pointer-events-none select-none"
                  draggable={false}
                  style={{ userSelect: "none" }}
                />
              ))
            ) : (
              <img
                src="/placeholder-image.jpg"
                alt={product.title}
                className="flex-shrink-0 object-contain w-full h-full rounded-md pointer-events-none select-none"
                draggable={false}
                style={{ userSelect: "none" }}
              />
            )}
          </div>

          {totalImages > 1 && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black/50 px-1.5 py-0.5 rounded-full">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? "bg-white scale-125"
                      : "bg-white/60 scale-100 hover:bg-white/80"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToImage(index);
                  }}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="mb-2">
          <span className="inline-block px-2 py-0.5 sm:py-1 mb-1 sm:mb-2 text-xs sm:text-sm text-white bg-red-500 rounded-full">
            {product.ageCategory}
          </span>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight mb-1">
            {product.title}
          </h3>
          <div className="flex my-1 sm:my-2 text-yellow-400">
            {[...Array(4)].map((_, i) => (
              <FaStar key={i} className="w-3 sm:w-4 h-3 sm:h-4" />
            ))}
            <FaStar className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2 sm:mb-3 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-base sm:text-lg font-bold text-orange-500">
            ₹{product.price}
          </span>

          <div className="flex gap-2">
            <button
              className="flex items-center justify-center gap-1 bg-white border border-orange-500 text-orange-500 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[50px] sm:min-w-[60px]"
              onClick={(e) => {
                e.stopPropagation();
                handleBuyNow(e, product);
              }}
              disabled={isLoading}
            >
              <FaBolt className="w-3 sm:w-4 h-3 sm:h-4" />
              <span className="hidden xs:inline">Buy</span>
            </button>
            <button
              className="flex items-center justify-center gap-1 bg-orange-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[50px] sm:min-w-[60px]"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(e, product);
              }}
              disabled={isLoading}
            >
              <FaShoppingCart className="w-3 sm:w-4 h-3 sm:h-4" />
              <span className="hidden xs:inline">Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MobileProductSkeleton = () => (
  <div className="flex p-3 sm:p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse w-full">
    <div className="flex-shrink-0 w-24 sm:w-28 h-24 sm:h-28 mr-3 sm:mr-4 bg-gray-200 rounded-md"></div>
    <div className="flex-1 min-w-0">
      <div className="w-12 sm:w-16 h-3 sm:h-4 mb-2 bg-gray-200 rounded"></div>
      <div className="w-3/4 sm:w-32 h-4 sm:h-5 mb-2 bg-gray-200 rounded"></div>
      <div className="flex gap-1 mb-2 sm:mb-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3 sm:w-4 h-3 sm:h-4 bg-gray-200 rounded-full"
          ></div>
        ))}
      </div>
      <div className="w-full h-6 sm:h-8 mb-2 sm:mb-3 bg-gray-200 rounded"></div>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="w-12 sm:w-16 h-4 sm:h-5 bg-gray-200 rounded"></div>
        <div className="flex gap-2">
          <div className="w-10 sm:w-12 h-6 sm:h-7 bg-gray-200 rounded"></div>
          <div className="w-10 sm:w-12 h-6 sm:h-7 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export default MobileProductItem;
