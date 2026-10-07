import React from "react";
import { NavLink } from "react-router-dom";

interface Item {
  name: string;
  link: string;
  image?: string;
  color?: string;
}

interface ItemsPanelProps {
  items: Item[];
  accent: string;
  isWorkshops: boolean;
  isProducts: boolean;
  workshopBgStyle: React.CSSProperties;
  productsBgStyle: React.CSSProperties;
  imgFitClass: string;
}

const ItemsPanel: React.FC<ItemsPanelProps> = ({
  items,
  accent,
  isWorkshops,
  isProducts,
  workshopBgStyle,
  productsBgStyle,
  imgFitClass,
}) => {
  const count = items.length;

  const colClass =
    count <= 2
      ? "grid-cols-2"
      : count <= 4
        ? "grid-cols-2"
        : count <= 6
          ? "grid-cols-3"
          : "grid-cols-3 sm:grid-cols-4";

  return (
    <>
      <style>{`
        @keyframes ipPop {
          from { opacity: 0; transform: scale(0.82) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ip-item { animation: ipPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        .ip-item:hover .ip-overlay { opacity: 1 !important; }
        .ip-item:hover { transform: scale(1.06) rotate(-1deg) !important; }
      `}</style>

      <div
        className="absolute top-0 right-0 bottom-0 z-10 flex items-center"
        style={{
          width: "clamp(120px, 42%, 52%)",
          padding:
            "clamp(6px,1.5vw,18px) clamp(6px,1.5vw,16px) clamp(6px,1.5vw,18px) clamp(4px,1vw,10px)",
        }}
      >
        <div
          className={`grid ${colClass} w-full h-full`}
          style={{ gap: "clamp(5px,0.9vw,12px)" }}
        >
          {items.map((item, idx) => {
            const hasImage = !!item.image;
            const baseColor = item.color || accent;
            const colorCardBg = `linear-gradient(145deg, ${baseColor}ff 0%, ${baseColor}cc 100%)`;

            const cardBg = isWorkshops
              ? (workshopBgStyle.background as string)
              : isProducts
                ? (productsBgStyle.background as string)
                : hasImage
                  ? "#fff"
                  : colorCardBg;

            return (
              <NavLink
                key={idx}
                to={item.link}
                className="ip-item group relative overflow-hidden transition-all duration-200"
                style={{
                  animationDelay: `${idx * 60}ms`,
                  background: cardBg,
                  aspectRatio: count <= 4 ? "4/3" : count <= 6 ? "1/1" : "4/3",
                  ...(isWorkshops
                    ? workshopBgStyle
                    : isProducts
                      ? productsBgStyle
                      : {}),
                  borderRadius: "clamp(8px,1.4vw,18px)",
                  border: "2.5px solid rgba(0,0,0,0.12)",
                  boxShadow: hasImage
                    ? "3px 4px 0 rgba(0,0,0,0.18)"
                    : "3px 4px 0 rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.35)",
                }}
              >
                {hasImage ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`w-full h-full transition-all duration-300 group-hover:scale-105 group-hover:brightness-105 ${imgFitClass}`}
                    loading="lazy"
                    style={{ objectPosition: "center" }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2 text-center relative overflow-hidden">
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: "65%",
                        aspectRatio: "1/1",
                        background: "rgba(255,255,255,0.25)",
                        top: "-28%",
                        right: "-18%",
                      }}
                    />
                    <span
                      className="font-black leading-tight relative z-10"
                      style={{
                        fontSize: "clamp(9px,1.5vw,18px)",
                        color: "#fff",
                        textShadow: "0 2px 4px rgba(0,0,0,0.25)",
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                )}

                {hasImage && (
                  <div
                    className="ip-overlay absolute inset-0 flex items-end justify-center transition-opacity duration-200"
                    style={{
                      opacity: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 60%)",
                      paddingBottom: "clamp(4px,0.8vw,10px)",
                      borderRadius: "inherit",
                    }}
                  >
                    <span
                      className="text-white font-black text-center leading-tight px-1"
                      style={{ fontSize: "clamp(8px,1.2vw,15px)" }}
                    >
                      {item.name}
                    </span>
                  </div>
                )}

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 0 2.5px ${accent}cc`,
                    borderRadius: "inherit",
                  }}
                />
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ItemsPanel;
