import { useRef, useState } from "react";

const COLORS = [
  { bg: "#FFF3E0", accent: "#FF9800", dot: "#FFE0B2", icon: "#E65100" },
  { bg: "#E8F5E9", accent: "#4CAF50", dot: "#C8E6C9", icon: "#2E7D32" },
  { bg: "#E3F2FD", accent: "#2196F3", dot: "#BBDEFB", icon: "#0D47A1" },
  { bg: "#FCE4EC", accent: "#E91E63", dot: "#F8BBD0", icon: "#880E4F" },
  { bg: "#EDE7F6", accent: "#9C27B0", dot: "#D1C4E9", icon: "#4A148C" },
  { bg: "#E0F7FA", accent: "#00BCD4", dot: "#B2EBF2", icon: "#006064" },
];

const EMOJIS = ["🌟", "🦄", "🐢", "🦕", "🌈", "🚀", "🎈", "🐙", "🦋", "🎯"];

const FaqCard = ({
  question,
  answer,
  index = 0,
}: {
  question: string;
  answer: string;
  index?: number;
}) => {
  const [open, setOpen] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const color = COLORS[index % COLORS.length];
  const emoji = EMOJIS[index % EMOJIS.length];

  const toggle = () => {
    const body = bodyRef.current;
    if (!body) return;

    // Trigger wiggle animation on open
    if (!open) {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 500);
      body.style.height = body.scrollHeight + "px";
    } else {
      body.style.height = body.scrollHeight + "px";
      requestAnimationFrame(() => {
        body.style.height = "0px";
      });
    }

    setOpen((prev) => !prev);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

        @keyframes wiggle {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(-4deg); }
          40%  { transform: rotate(4deg); }
          60%  { transform: rotate(-3deg); }
          80%  { transform: rotate(3deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes pop-in {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes bounce-dot {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }

        .faq-card-kids {
          animation: pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .faq-card-kids:hover .faq-emoji {
          animation: wiggle 0.45s ease;
        }

        .faq-card-kids:hover .faq-dot-1 { animation: bounce-dot 0.5s 0s ease infinite; }
        .faq-card-kids:hover .faq-dot-2 { animation: bounce-dot 0.5s 0.1s ease infinite; }
        .faq-card-kids:hover .faq-dot-3 { animation: bounce-dot 0.5s 0.2s ease infinite; }

        .faq-emoji-wiggle {
          animation: wiggle 0.5s ease !important;
        }

        .faq-toggle-btn {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.2s ease;
        }

        .faq-toggle-btn:hover {
          transform: scale(1.15) rotate(5deg);
        }
      `}</style>

      <div
        className="faq-card-kids"
        onClick={toggle}
        style={{
          fontFamily: "'Nunito', sans-serif",
          position: "relative",
          cursor: "pointer",
          background: open ? color.bg : "#FFFFFF",
          borderRadius: "20px",
          border: `3px solid ${open ? color.accent : "#E8E8E8"}`,
          boxShadow: open
            ? `0 8px 0px ${color.accent}40, 0 4px 20px ${color.accent}20`
            : "0 4px 0px #E0E0E0, 0 2px 12px rgba(0,0,0,0.06)",
          transition:
            "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.15s ease",
          transform: open ? "translateY(-2px)" : "translateY(0)",
          overflow: "hidden",
          marginBottom: "4px",
        }}
        onMouseEnter={(e) => {
          if (!open) {
            (e.currentTarget as HTMLElement).style.transform =
              "translateY(-3px) rotate(-0.5deg)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              `0 8px 0px #D0D0D0, 0 4px 16px rgba(0,0,0,0.1)`;
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 4px 0px #E0E0E0, 0 2px 12px rgba(0,0,0,0.06)";
          }
        }}
      >
        {/* Decorative dots top-right */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "56px",
            display: "flex",
            gap: "5px",
            opacity: open ? 1 : 0.3,
            transition: "opacity 0.3s ease",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`faq-dot-${i + 1}`}
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: color.accent,
              }}
            />
          ))}
        </div>

        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "18px 20px",
          }}
        >
          {/* Emoji badge */}
          <div
            className={`faq-emoji ${wiggle ? "faq-emoji-wiggle" : ""}`}
            style={{
              flexShrink: 0,
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: color.dot,
              border: `2.5px solid ${color.accent}60`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              boxShadow: `0 3px 0 ${color.accent}40`,
              transition: "background 0.3s ease",
            }}
          >
            {emoji}
          </div>

          {/* Question */}
          <h3
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontWeight: 400,
              fontSize: "1.15rem",
              lineHeight: 1.35,
              color: open ? color.icon : "#2D2D2D",
              margin: 0,
              flex: 1,
              letterSpacing: "0.01em",
              transition: "color 0.3s ease",
            }}
          >
            {question}
          </h3>

          {/* Toggle button */}
          <div
            className="faq-toggle-btn"
            style={{
              flexShrink: 0,
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: open ? color.accent : color.dot,
              border: `2.5px solid ${open ? color.accent : color.accent + "60"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: open ? `0 3px 0 ${color.icon}40` : "none",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{
                transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: open ? "rotate(45deg)" : "rotate(0deg)",
              }}
            >
              <line
                x1="7"
                y1="2"
                x2="7"
                y2="12"
                stroke={open ? "#fff" : color.icon}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="2"
                y1="7"
                x2="12"
                y2="7"
                stroke={open ? "#fff" : color.icon}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Collapsible body */}
        <div
          ref={bodyRef}
          style={{
            height: 0,
            overflow: "hidden",
            transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onTransitionEnd={() => {
            if (open && bodyRef.current) {
              bodyRef.current.style.height = "auto";
            }
          }}
        >
          <div
            style={{
              padding: "0 20px 20px 82px",
            }}
          >
            {/* Wavy divider */}
            <svg
              viewBox="0 0 200 12"
              style={{ width: "120px", marginBottom: "10px", display: "block" }}
            >
              <path
                d="M0,6 C20,0 40,12 60,6 C80,0 100,12 120,6 C140,0 160,12 180,6 C190,3 196,4 200,6"
                stroke={color.accent}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "#4A4A4A",
                margin: 0,
                letterSpacing: "0.01em",
              }}
            >
              {answer}
            </p>

            {/* Fun footer tag */}
            <div
              style={{
                marginTop: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: color.dot,
                borderRadius: "20px",
                padding: "4px 12px",
                border: `2px solid ${color.accent}50`,
              }}
            >
              <span style={{ fontSize: "14px" }}>⭐</span>
              <span
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "0.78rem",
                  color: color.icon,
                  letterSpacing: "0.03em",
                }}
              >
                Great question!
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqCard;
