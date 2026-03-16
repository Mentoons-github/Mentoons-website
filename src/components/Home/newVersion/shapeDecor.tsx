import { SlideShape } from "@/types";

interface ShapeDecorProps {
  shape: SlideShape;
  accent: string;
  shapeRef: React.RefObject<HTMLDivElement>;
}

const ShapeDecor = ({ shape, accent, shapeRef }: ShapeDecorProps) => {
  const wrapperCls =
    "absolute pointer-events-none opacity-80 right-3 sm:right-6 md:right-10 top-3 sm:top-6 md:top-8 w-20 h-20 sm:w-36 sm:h-36 md:w-52 md:h-52";
  const glow = { filter: `drop-shadow(0 0 32px ${accent}99)` };

  if (shape === "circle")
    return (
      <div ref={shapeRef} className={wrapperCls} style={glow}>
        <svg
          viewBox="0 0 220 220"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle
            cx="110"
            cy="110"
            r="100"
            fill="none"
            stroke={accent}
            strokeWidth="3"
          />
          <circle cx="110" cy="110" r="70" fill={accent} fillOpacity="0.07" />
          <circle cx="110" cy="110" r="40" fill={accent} fillOpacity="0.12" />
          <circle cx="65" cy="65" r="12" fill={accent} fillOpacity="0.5" />
          <circle cx="155" cy="155" r="8" fill={accent} fillOpacity="0.6" />
          <circle cx="160" cy="70" r="5" fill={accent} fillOpacity="0.8" />
          <circle cx="55" cy="150" r="6" fill={accent} fillOpacity="0.4" />
        </svg>
      </div>
    );

  if (shape === "triangle")
    return (
      <div ref={shapeRef} className={wrapperCls} style={glow}>
        <svg
          viewBox="0 0 220 220"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <polygon
            points="110,12 208,198 12,198"
            fill="none"
            stroke={accent}
            strokeWidth="3"
          />
          <polygon
            points="110,55 170,162 50,162"
            fill={accent}
            fillOpacity="0.12"
          />
          <polygon
            points="110,90 140,145 80,145"
            fill={accent}
            fillOpacity="0.18"
          />
          <circle cx="110" cy="12" r="7" fill={accent} fillOpacity="0.9" />
          <circle cx="208" cy="198" r="7" fill={accent} fillOpacity="0.9" />
          <circle cx="12" cy="198" r="7" fill={accent} fillOpacity="0.9" />
        </svg>
      </div>
    );

  if (shape === "star")
    return (
      <div ref={shapeRef} className={wrapperCls} style={glow}>
        <svg
          viewBox="0 0 220 220"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <polygon
            points="110,10 130,80 210,80 150,125 170,200 110,155 50,200 70,125 10,80 90,80"
            fill="none"
            stroke={accent}
            strokeWidth="3"
          />
          <polygon
            points="110,45 124,88 168,88 133,112 146,155 110,132 74,155 87,112 52,88 96,88"
            fill={accent}
            fillOpacity="0.15"
          />
          <polygon
            points="110,75 118,98 142,98 123,112 130,136 110,122 90,136 97,112 78,98 102,98"
            fill={accent}
            fillOpacity="0.25"
          />
        </svg>
      </div>
    );

  if (shape === "wave")
    return (
      <div ref={shapeRef} className={wrapperCls} style={glow}>
        <svg
          viewBox="0 0 220 220"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M10,110 C40,60 80,60 110,110 C140,160 180,160 210,110"
            fill="none"
            stroke={accent}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M10,80 C40,30 80,30 110,80 C140,130 180,130 210,80"
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
          <path
            d="M10,140 C40,90 80,90 110,140 C140,190 180,190 210,140"
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
          <path
            d="M10,110 C40,60 80,60 110,110 C140,160 180,160 210,110 L210,220 L10,220 Z"
            fill={accent}
            fillOpacity="0.07"
          />
          <circle cx="10" cy="110" r="5" fill={accent} fillOpacity="0.8" />
          <circle cx="110" cy="110" r="5" fill={accent} fillOpacity="0.8" />
          <circle cx="210" cy="110" r="5" fill={accent} fillOpacity="0.8" />
          <circle cx="60" cy="72" r="4" fill={accent} fillOpacity="0.5" />
          <circle cx="160" cy="148" r="4" fill={accent} fillOpacity="0.5" />
        </svg>
      </div>
    );

  if (shape === "square")
    return (
      <div ref={shapeRef} className={wrapperCls} style={glow}>
        <svg
          viewBox="0 0 220 220"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect
            x="15"
            y="15"
            width="190"
            height="190"
            rx="8"
            fill="none"
            stroke={accent}
            strokeWidth="3"
          />
          <rect
            x="45"
            y="45"
            width="130"
            height="130"
            rx="4"
            fill={accent}
            fillOpacity="0.08"
          />
          <rect
            x="75"
            y="75"
            width="70"
            height="70"
            rx="2"
            fill={accent}
            fillOpacity="0.15"
          />
          <circle cx="15" cy="15" r="6" fill={accent} fillOpacity="0.9" />
          <circle cx="205" cy="15" r="6" fill={accent} fillOpacity="0.9" />
          <circle cx="205" cy="205" r="6" fill={accent} fillOpacity="0.9" />
          <circle cx="15" cy="205" r="6" fill={accent} fillOpacity="0.9" />
          <circle cx="110" cy="110" r="5" fill={accent} fillOpacity="0.4" />
          <line
            x1="15"
            y1="50"
            x2="15"
            y2="15"
            stroke={accent}
            strokeWidth="2"
            strokeOpacity="0.4"
          />
          <line
            x1="15"
            y1="15"
            x2="50"
            y2="15"
            stroke={accent}
            strokeWidth="2"
            strokeOpacity="0.4"
          />
        </svg>
      </div>
    );

  if (shape === "hexagon")
    return (
      <div ref={shapeRef} className={wrapperCls} style={glow}>
        <svg
          viewBox="0 0 220 220"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <polygon
            points="110,12 198,60 198,160 110,208 22,160 22,60"
            fill="none"
            stroke={accent}
            strokeWidth="3"
          />
          <polygon
            points="110,45 175,82 175,138 110,175 45,138 45,82"
            fill={accent}
            fillOpacity="0.08"
          />
          <polygon
            points="110,78 148,100 148,144 110,166 72,144 72,100"
            fill={accent}
            fillOpacity="0.15"
          />
          <circle cx="110" cy="12" r="5" fill={accent} fillOpacity="0.9" />
          <circle cx="198" cy="60" r="5" fill={accent} fillOpacity="0.9" />
          <circle cx="198" cy="160" r="5" fill={accent} fillOpacity="0.9" />
          <circle cx="110" cy="208" r="5" fill={accent} fillOpacity="0.9" />
          <circle cx="22" cy="160" r="5" fill={accent} fillOpacity="0.9" />
          <circle cx="22" cy="60" r="5" fill={accent} fillOpacity="0.9" />
          <circle cx="110" cy="110" r="7" fill={accent} fillOpacity="0.35" />
        </svg>
      </div>
    );

  return (
    <div ref={shapeRef} className={wrapperCls} style={glow}>
      <svg
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <polygon
          points="110,10 210,110 110,210 10,110"
          fill="none"
          stroke={accent}
          strokeWidth="3"
        />
        <polygon
          points="110,45 175,110 110,175 45,110"
          fill={accent}
          fillOpacity="0.09"
        />
        <polygon
          points="110,80 140,110 110,140 80,110"
          fill={accent}
          fillOpacity="0.2"
        />
        <circle cx="110" cy="10" r="6" fill={accent} fillOpacity="0.9" />
        <circle cx="210" cy="110" r="6" fill={accent} fillOpacity="0.9" />
        <circle cx="110" cy="210" r="6" fill={accent} fillOpacity="0.9" />
        <circle cx="10" cy="110" r="6" fill={accent} fillOpacity="0.9" />
        <line
          x1="110"
          y1="10"
          x2="110"
          y2="210"
          stroke={accent}
          strokeWidth="1"
          strokeOpacity="0.12"
        />
        <line
          x1="10"
          y1="110"
          x2="210"
          y2="110"
          stroke={accent}
          strokeWidth="1"
          strokeOpacity="0.12"
        />
      </svg>
    </div>
  );
};


export default ShapeDecor