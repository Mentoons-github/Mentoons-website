import React, { useState, useEffect } from "react";
import PencilUp from "@/assets/imgs/PencilUp.png";
import PencilDown from "@/assets/imgs/PencilDown.png";

const ProgressScroller: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(true); // Track scroll direction
  const [lastScrollTop, setLastScrollTop] = useState(0); // Store last scroll position

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    // Calculate the percentage of the page that has been scrolled
    const scrolledPercentage = (scrollTop / docHeight) * 100;

    // Determine the scroll direction
    if (scrollTop > lastScrollTop) {
      setIsScrollingDown(true);
    } else {
      setIsScrollingDown(false);
    }

    // Update last scroll position
    setLastScrollTop(scrollTop);

    // Update the scroll percentage state
    setScrollPercentage(scrolledPercentage);

    // Show button when the user has scrolled down, hide it when at the top
    if (scrollTop > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]); // Add lastScrollTop to the dependency array

  return (
    <>
      {isVisible && (
        <div
          className="w-fit rounded-full fixed right-0 p-1 cursor-pointer"
          style={{
            top: `${scrollPercentage}%`,
            transform: "translateY(-50%)", // Center the image vertically at each percentage
            transition: "top 0.2s ease-out",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <figure className="h-14 w-14 lg:h-24 lg:w-24">
            <img
              className="w-full h-full object-contain"
              src={isScrollingDown ? PencilDown : PencilUp} // Switch between pencil down/up
              alt={isScrollingDown ? "pencil down" : "pencil up"}
            />
          </figure>
        </div>
      )}
    </>
  );
};

export default ProgressScroller;
