import { CONTENTS } from "@/constant/adda/changes/contents";
import FlipCard from "./flipCard";

const INK = "#1a1a1a";

const Contents = () => {
  const entries = Object.entries(CONTENTS);

  return (
    <div
      className="min-h-screen py-16 px-4 md:px-8"
      style={{
        borderTop: `6px solid ${INK}`,
        backgroundColor: "#D6ECFF",
        backgroundImage: `radial-gradient(${INK}26 1.6px, transparent 1.8px)`,
        backgroundSize: "16px 16px",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="font-comic"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 5rem)",
              lineHeight: 1.05,
              color: "#FFD60A",
              letterSpacing: "0.04em",
              WebkitTextStroke: `3px ${INK}`,
              paintOrder: "stroke fill",
              textShadow: `5px 5px 0 ${INK}`,
              transform: "rotate(-1.5deg)",
              display: "inline-block",
            }}
          >
            Explore Mentoons
          </h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
          {entries.map(([key, value]) => (
            <div key={key} className="break-inside-avoid mb-8">
              <FlipCard title={(value as any).title || key} content={value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contents;
