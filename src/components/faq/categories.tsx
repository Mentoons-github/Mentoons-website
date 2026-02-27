import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import type { SiteCategory } from "@/types";

type CategoryConfig = {
  label: SiteCategory;
  active: string;
  idle: string;
};

interface CategoriesProps {
  categories: CategoryConfig[];
  defaultCategory?: SiteCategory;
  onSelect?: (category: SiteCategory | null) => void;
}

const Categories = ({
  categories,
  defaultCategory,
  onSelect,
}: CategoriesProps) => {
  const [active, setActive] = useState<SiteCategory | null>(
    defaultCategory ?? null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const buttons = containerRef.current.querySelectorAll("button");

    gsap.fromTo(
      buttons,
      { opacity: 0, y: 20, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.07,
        ease: "back.out(1.5)",
        delay: 0.2,
      },
    );
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    label: SiteCategory,
  ) => {
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.93 },
      { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" },
    );

    // If clicking the already-active category, keep it selected (don't deselect)
    // unless it's not "All" — clicking "All" again keeps "All"
    const next = active === label && label !== "All" ? null : label;
    setActive(next ?? ("All" as SiteCategory));
    onSelect?.(next);
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center gap-3 overflow-x-auto py-2 px-1 scrollbar-hide mx-auto mt-10 md:mt-16 lg:mt-20"
    >
      {categories.map((cat) => {
        const isActive = active === cat.label;
        return (
          <button
            key={cat.label}
            onClick={(e) => handleClick(e, cat.label)}
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                scale: 1.07,
                duration: 0.2,
                ease: "power2.out",
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out",
              })
            }
            aria-pressed={isActive}
            className={`
              whitespace-nowrap px-5 py-2.5 md:px-6 md:py-3 rounded-full 
              border-2 font-medium md:font-semibold text-base md:text-xl
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white
              flex-shrink-0 shadow-sm transition-colors duration-200
              ${isActive ? `${cat.active} shadow-lg` : `bg-white ${cat.idle}`}
            `}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

export default Categories;
