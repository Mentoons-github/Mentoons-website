import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const ProductsSlider = ({ shopNow }: { shopNow: (val: string) => void }) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const products = [
    {
      id: 1,
      title: "Conversation Starter Cards",
      description: "Help kids overcome the fear of expressing themselves.",
      color: "bg-yellow-300",
      image:
        "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/Conversation+Starter+Cards+6-12.png",
      alt: "Conversation Starter Cards",
    },
    {
      id: 2,
      title: "Story Re-Teller Cards",
      description:
        "Help kids to practice their communication skills and grow stronger",
      color: "bg-green-300",
      image:
        "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/Story+reteller+cards+6-12.png",
      alt: "Story Re-Teller Cards",
    },
    {
      id: 3,
      title: "Silent Stories",
      description: "Help Kids to improve focus and logical thinking",
      color: "bg-blue-300",
      image:
        "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/Silent+stories+6-12.png",
      alt: "Silent Stories",
    },
    {
      id: 4,
      title: "Conversation Story Cards",
      description: "To overcome the fear of expressing",
      color: "bg-red-300",
      image:
        "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/Conversation_Story_Cards_20%2B/Conversation+Story+Cards+20%2B.png",
      alt: "Conversation Story Cards",
    },
  ];

  const scrollToIndex = useCallback((index: number) => {
    if (sliderRef.current) {
      const slides = sliderRef.current.children;
      if (index >= 0 && index < slides.length) {
        const slideElement = slides[index] as HTMLElement;
        const slideOffset =
          slideElement.offsetLeft - sliderRef.current.offsetLeft;

        sliderRef.current.scrollTo({
          left: slideOffset,
          behavior: "smooth",
        });

        setCurrentIndex(index);
      }
    }
  }, []);

  const scrollLeft = () => {
    const newIndex = (currentIndex - 1 + products.length) % products.length;
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const newIndex = (currentIndex + 1) % products.length;
    scrollToIndex(newIndex);
  };

  const jumpToSlide = (index: number) => {
    scrollToIndex(index);
    resetTimer();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % products.length;
          scrollToIndex(newIndex);
          return newIndex;
        });
      }, 3000);
    }
  }, [isPlaying, products.length, scrollToIndex]);

  useEffect(() => {
    const handleScroll = () => {
      const slider = sliderRef.current!;
      const scrollPosition = slider.scrollLeft;
      const containerWidth = slider.offsetWidth;

      const slides = Array.from(slider.children);
      const slidePositions = slides.map((slide, index) => {
        const el = slide as HTMLElement;
        const slideLeft = el.offsetLeft - slider.offsetLeft;
        const slideVisibility =
          1 -
          Math.min(Math.abs(scrollPosition - slideLeft) / containerWidth, 1);
        return { index, visibility: slideVisibility };
      });

      const mostVisibleSlide = slidePositions.reduce(
        (prev, current) =>
          current.visibility > prev.visibility ? current : prev,
        { index: 0, visibility: 0 }
      );

      if (
        mostVisibleSlide.visibility > 0.5 &&
        mostVisibleSlide.index !== currentIndex
      ) {
        setCurrentIndex(mostVisibleSlide.index);
      }
    };

    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentIndex]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, resetTimer]);

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      resetTimer();
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = 0;
      setCurrentIndex(0);
    }
  }, []);

  return (
    <div
      className="relative w-full max-w-6xl mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={scrollLeft}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
          aria-label="Previous product"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={scrollRight}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
          aria-label="Next product"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute right-4 bottom-4 z-10">
        <button
          onClick={togglePlayPause}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      <div
        ref={sliderRef}
        className="overflow-x-auto scroll-smooth snap-x snap-mandatory px-3 py-4 flex gap-4 hide-scrollbar"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={`min-w-[100%] sm:min-w-[80%] md:min-w-[75%] lg:min-w-[70%] border shadow-lg flex flex-col md:flex-row justify-between items-center p-4 sm:p-6 ${product.color} rounded-2xl snap-start transition-transform hover:scale-[0.98] cursor-pointer`}
            data-index={product.id - 1}
          >
            <div className="flex-1 text-start mb-6 md:mb-0 md:ml-6 lg:ml-10">
              <h2 className="font-akshar font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#040404] leading-tight">
                {product.title}
              </h2>
              <p className="font-inter text-base sm:text-lg md:text-xl mt-3 max-w-md">
                {product.description}
              </p>
              <button
                className="mt-5 bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-opacity-80 transition-colors"
                onClick={() =>
                  shopNow(
                    product.title === "Conversation Story Cards" ? "20+" : "all"
                  )
                }
              >
                Shop Now
              </button>
            </div>

            <div className="flex justify-center md:justify-end flex-shrink-0">
              <img
                src={product.image}
                alt={product.alt}
                className="w-[200px] sm:w-[250px] md:w-[300px] lg:w[340px] xl:w-[400px] object-contain transform transition-transform hover:rotate-2"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {products.map((product, index) => (
          <div
            key={`dot-${product.id}`}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
              currentIndex === index
                ? "w-6 bg-black"
                : "bg-gray-300 hover:bg-gray-500"
            }`}
            onClick={() => jumpToSlide(index)}
          />
        ))}
      </div>
      <style>{`
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
    </div>
  );
};

export default ProductsSlider;
