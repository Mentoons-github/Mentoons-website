import { COLOR_SCHEME } from "@/constant/adda/changes/contents";
import { useState } from "react";

interface FlipCardProps {
  title: string;
  content: any;
}

const FlipCard = ({ title, content }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const colors = COLOR_SCHEME[content.color || "blue"];

  const handleCardClick = () => {
    if (content.flip?.shouldFlip) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleLinkClick = (e: React.MouseEvent, link: string) => {
    e.stopPropagation();
    window.open(link, "_blank");
  };

  const hasFlip = content.flip?.shouldFlip;

  return (
    <div
      className="relative w-full cursor-pointer break-inside-avoid-column mb-6"
      style={{ perspective: "1000px", minHeight: "fit-content" }}
      onClick={handleCardClick}
    >
      <div
        className="relative w-full transition-all duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          minHeight: "fit-content",
        }}
      >
        <div className="w-full" style={{ backfaceVisibility: "hidden" }}>
          <div
            className={`w-full bg-white rounded-2xl shadow-md border-2 ${colors.border} p-5 flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            {content.badge && (
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  {content.badge}
                </span>
              </div>
            )}

            <div className="flex items-start gap-3 mb-3">
              {content.icon && (
                <div
                  className={`${colors.bg} p-2.5 rounded-xl shadow-sm flex-shrink-0`}
                >
                  <span className="text-2xl">{content.icon}</span>
                </div>
              )}
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight flex-1">
                {title}
              </h3>
            </div>

            {content.description && (
              <p className="text-gray-700 text-lg md:text-xl mb-4 leading-relaxed font-semibold text-center py-2">
                {content.description}
              </p>
            )}

            {content.tag && content.tag.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {content.tag.map((t: string, idx: number) => (
                  <span
                    key={idx}
                    className={`${colors.light} ${colors.text} text-sm px-4 py-2 rounded-full font-semibold`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {content.tags && (
              <span
                className={`${colors.light} ${colors.text} text-xs px-3 py-1 rounded-full font-medium inline-block mb-3`}
              >
                {content.tags}
              </span>
            )}

            {content.focus && content.focus.length > 0 && (
              <div className="mb-3 mt-2">
                <p className="text-gray-700 text-sm font-bold mb-2">
                  📌 Focus Areas:
                </p>
                <div className="space-y-1.5">
                  {content.focus.map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gray-50 text-gray-700 text-md px-3 py-1.5 rounded-lg border border-gray-200"
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2">
              {content.link && (
                <button
                  onClick={(e) => handleLinkClick(e, content.link)}
                  className={`w-full ${colors.bg} text-white font-semibold py-2.5 rounded-lg ${colors.hover} transition-all shadow-sm hover:shadow-md`}
                >
                  Explore →
                </button>
              )}

              {hasFlip && (
                <div
                  className={`${colors.light} ${colors.text} text-sm text-center font-semibold py-2.5 rounded-lg border ${colors.border}`}
                >
                  🔄 Click to flip and explore →
                </div>
              )}
            </div>
          </div>
        </div>

        {hasFlip && (
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div
              className={`w-full h-full ${colors.bg} rounded-2xl shadow-md p-6 flex flex-col justify-center items-center text-center`}
            >
              {content.icon && (
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full mb-4">
                  <span className="text-4xl">{content.icon}</span>
                </div>
              )}

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {content.flip?.flipTitle}
              </h3>

              {content.flip?.subtitle && (
                <p className="text-white/95 text-base md:text-lg mb-6 font-medium">
                  {content.flip.subtitle}
                </p>
              )}

              <button
                onClick={(e) => handleLinkClick(e, content.flip?.link)}
                className={`bg-white ${colors.text} font-bold px-8 py-3 rounded-full ${colors.hover} hover:text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                Explore Now →
              </button>

              <div className="mt-6 text-white/80 text-sm font-medium">
                🔄 Click to flip back
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlipCard;
