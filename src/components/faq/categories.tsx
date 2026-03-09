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
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!scrollRef.current || !active) return;
    const activeBtn = scrollRef.current.querySelector(
      `[data-label="${active}"]`,
    ) as HTMLButtonElement | null;
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [active]);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    label: SiteCategory,
  ) => {
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.93 },
      { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" },
    );

    const next = active === label && label !== "All" ? null : label;
    setActive(next ?? ("All" as SiteCategory));
    onSelect?.(next);
  };

  return (
    <div ref={containerRef} className="w-full mt-10 md:mt-16 lg:mt-20">
      <div
        className="relative px-4 sm:px-6 md:hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="shrink-0 w-2" aria-hidden />

          {categories.map((cat) => {
            const isActive = active === cat.label;
            return (
              <button
                key={cat.label}
                data-label={cat.label}
                onClick={(e) => handleClick(e, cat.label)}
                aria-pressed={isActive}
                className={`
                  snap-center shrink-0
                  whitespace-nowrap px-4 py-2 rounded-full
                  border-2 font-semibold text-sm
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white
                  shadow-sm transition-colors duration-200 active:scale-95
                  ${isActive ? `${cat.active} shadow-md` : `bg-white ${cat.idle}`}
                `}
              >
                {cat.label}
              </button>
            );
          })}

          <div className="shrink-0 w-2" aria-hidden />
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center flex-wrap gap-3 px-8 lg:px-16 xl:px-24 py-2">
        {categories.map((cat) => {
          const isActive = active === cat.label;
          return (
            <button
              key={cat.label}
              data-label={cat.label}
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
                whitespace-nowrap
                px-5 py-2.5 md:px-6 md:py-3 rounded-full
                border-2 font-semibold text-base md:text-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white
                shadow-sm transition-colors duration-200
                ${isActive ? `${cat.active} shadow-lg` : `bg-white ${cat.idle}`}
              `}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
