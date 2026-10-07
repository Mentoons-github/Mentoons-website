import { useState } from "react";
import { NavLink } from "react-router-dom";

const TICKER_ITEMS = ["Mobile", "Porn", "Gaming", "Gambling"];

const PHYSICAL_ITEMS = ["Neck Pain", "Fatigue", "Muscle Tension", "Eye Strain"];

const PSYCHOLOGICAL_ITEMS = [
  "Anger",
  "Loneliness",
  "Frustration",
  "Sleep Disturbance",
  "Neglect of Personal Hygiene",
];

const BACK_POINTS = [
  "Feeling left out or excluded because of Social Media",
  "Increase in Sport Betting",
  "Increase in Suicide Rates",
  "Increase in Drug Overdose",
  "Increase in Money Laundering",
  "Increase in Chain Snatching",
];

const OurCoreFlipCard = () => {
  const [flipped, setFlipped] = useState(false);

  const tickerContent = [
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
  ];

  return (
    <>
      <style>{`
        .oc-scene {
          perspective: 1200px;
          width: 100%;
          height: 100%;
        }
        .oc-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1);
        }
        .oc-card.oc-flipped {
          transform: rotateY(180deg);
        }
        .oc-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: inherit;
          overflow: hidden;
        }
        .oc-back {
          transform: rotateY(180deg);
        }
        @keyframes ocTickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .oc-ticker-track {
          display: flex;
          width: max-content;
          animation: ocTickerScroll 10s linear infinite;
        }
        .oc-ticker-track:hover { animation-play-state: paused; }
        @keyframes ocFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .oc-tbl-row { animation: ocFadeUp 0.4s ease both; }
        @keyframes ocPointIn {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .oc-point { animation: ocPointIn 0.45s ease both; }
      `}</style>

      <div
        className="oc-scene"
        onClick={(e) => {
          e.stopPropagation();
          setFlipped((f) => !f);
        }}
        style={{ cursor: "pointer" }}
      >
        <div className={`oc-card${flipped ? " oc-flipped" : ""}`}>
          <div
            className="oc-face"
            style={{
              background:
                "linear-gradient(135deg,#0d2137 0%,#0a4a35 55%,#0f3d20 100%)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #34d39930 1.5px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
            />
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "clamp(100px,28vw,300px)",
                height: "clamp(100px,28vw,300px)",
                top: "-20%",
                right: "-10%",
                background:
                  "radial-gradient(circle, #34d39940 0%, transparent 70%)",
              }}
            />

            <div
              className="relative z-10 h-full flex flex-col"
              style={{
                padding: "clamp(8px,2vw,26px) clamp(12px,3vw,44px)",
                gap: "clamp(4px,1vw,14px)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="font-black tracking-wide rounded-2xl uppercase"
                  style={{
                    background: "#34d399",
                    color: "#064e3b",
                    fontSize: "clamp(8px,1.3vw,14px)",
                    padding: "clamp(2px,.5vw,5px) clamp(6px,1.2vw,16px)",
                    boxShadow: "3px 3px 0 #059669",
                  }}
                >
                  Our Core
                </span>
                <span style={{ fontSize: "clamp(16px,3vw,38px)" }}>🧠</span>
              </div>

              <h2
                className="font-black leading-tight"
                style={{
                  fontFamily: "'Georgia','Times New Roman',serif",
                  fontSize: "clamp(16px,3.8vw,52px)",
                  color: "#fff",
                  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                Discover&nbsp;
                <span
                  style={{ color: "#34d399", textShadow: "0 0 20px #34d39966" }}
                >
                  Our Core
                </span>
              </h2>

              <NavLink
                to="/community"
                className="inline-flex items-center gap-1.5 font-bold transition-colors duration-200 w-fit hover:opacity-80"
                style={{ fontSize: "clamp(10px,1.3vw,15px)", color: "#6ee7b7" }}
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className="inline-block rounded-full flex-shrink-0"
                  style={{
                    width: "clamp(5px,.7vw,8px)",
                    height: "clamp(5px,.7vw,8px)",
                    background: "#34d399",
                  }}
                />
                Join Community →
              </NavLink>

              <div
                className="grid grid-cols-2 rounded-2xl overflow-hidden flex-1"
                style={{
                  border: "2px solid rgba(52,211,153,0.35)",
                  minHeight: 0,
                  maxHeight: "clamp(80px,18vw,200px)",
                  boxShadow: "3px 3px 0 rgba(52,211,153,0.2)",
                }}
              >
                <div className="flex flex-col">
                  <div
                    className="font-black text-center uppercase tracking-wider"
                    style={{
                      background: "rgba(52,211,153,0.2)",
                      color: "#6ee7b7",
                      fontSize: "clamp(8px,1.2vw,13px)",
                      padding: "clamp(3px,.6vw,7px) 0",
                      borderBottom: "2px solid rgba(52,211,153,0.25)",
                    }}
                  >
                    Physical
                  </div>
                  <div
                    className="flex-1 overflow-hidden divide-y"
                    style={{ borderColor: "rgba(52,211,153,0.12)" }}
                  >
                    {PHYSICAL_ITEMS.map((item, i) => (
                      <div
                        key={item}
                        className="oc-tbl-row flex items-center gap-1.5"
                        style={{
                          fontSize: "clamp(8px,1.1vw,13px)",
                          padding: "clamp(2px,.5vw,6px) clamp(6px,1vw,12px)",
                          animationDelay: `${i * 80}ms`,
                          color: "rgba(255,255,255,0.88)",
                          background:
                            i % 2 === 0
                              ? "rgba(255,255,255,0.04)"
                              : "transparent",
                        }}
                      >
                        <span
                          style={{
                            color: "#34d399",
                            fontSize: "clamp(5px,.7vw,9px)",
                          }}
                        >
                          ●
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="flex flex-col"
                  style={{ borderLeft: "2px solid rgba(52,211,153,0.2)" }}
                >
                  <div
                    className="font-black text-center uppercase tracking-wider"
                    style={{
                      background: "rgba(167,139,250,0.2)",
                      color: "#c4b5fd",
                      fontSize: "clamp(8px,1.2vw,13px)",
                      padding: "clamp(3px,.6vw,7px) 0",
                      borderBottom: "2px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    Psychological
                  </div>
                  <div
                    className="flex-1 overflow-hidden divide-y"
                    style={{ borderColor: "rgba(167,139,250,0.12)" }}
                  >
                    {PSYCHOLOGICAL_ITEMS.map((item, i) => (
                      <div
                        key={item}
                        className="oc-tbl-row flex items-center gap-1.5"
                        style={{
                          fontSize: "clamp(8px,1.1vw,13px)",
                          padding: "clamp(2px,.5vw,6px) clamp(6px,1vw,12px)",
                          animationDelay: `${(i + PHYSICAL_ITEMS.length) * 80}ms`,
                          color: "rgba(255,255,255,0.88)",
                          background:
                            i % 2 === 0
                              ? "rgba(255,255,255,0.04)"
                              : "transparent",
                        }}
                      >
                        <span
                          style={{
                            color: "#c4b5fd",
                            fontSize: "clamp(5px,.7vw,9px)",
                          }}
                        >
                          ●
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="overflow-hidden rounded-full"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "2px solid rgba(52,211,153,0.4)",
                  padding: "clamp(2px,.4vw,5px) 0",
                  boxShadow: "2px 2px 0 rgba(52,211,153,0.25)",
                }}
              >
                <div className="oc-ticker-track">
                  {tickerContent.map((item, i) => (
                    <span
                      key={i}
                      className="font-black uppercase tracking-widest whitespace-nowrap"
                      style={{
                        color: i % 2 === 0 ? "#34d399" : "#c4b5fd",
                        fontSize: "clamp(9px,1.3vw,15px)",
                        padding: "0 clamp(10px,2vw,30px)",
                      }}
                    >
                      {item}
                      <span className="mx-2 opacity-40">✦</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="oc-face oc-back"
            style={{
              background:
                "linear-gradient(135deg,#1e0a3c 0%,#2d1060 55%,#160a2e 100%)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #a855f740 1.5px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
            />

            <div
              className="relative z-10 h-full flex flex-col"
              style={{
                padding: "clamp(8px,2vw,26px) clamp(12px,3vw,44px)",
                gap: "clamp(6px,1.4vw,18px)",
              }}
            >
              <h3
                className="font-black"
                style={{
                  fontFamily: "'Georgia','Times New Roman',serif",
                  fontSize: "clamp(14px,3.2vw,46px)",
                  color: "#fff",
                  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                Social <span style={{ color: "#c4b5fd" }}>Impact</span>
              </h3>

              <ul
                className="flex flex-col flex-1 justify-center"
                style={{ gap: "clamp(4px,1vw,12px)" }}
              >
                {BACK_POINTS.map((point, i) => (
                  <li
                    key={i}
                    className="oc-point flex items-start"
                    style={{
                      animationDelay: `${i * 80}ms`,
                      fontSize: "clamp(9px,1.25vw,15px)",
                      gap: "clamp(6px,1vw,12px)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    <span
                      className="flex-shrink-0 rounded-xl font-black flex items-center justify-center"
                      style={{
                        width: "clamp(15px,2.1vw,28px)",
                        height: "clamp(15px,2.1vw,28px)",
                        background: i % 2 === 0 ? "#34d399" : "#a855f7",
                        color: i % 2 === 0 ? "#064e3b" : "#fff",
                        fontSize: "clamp(6px,.9vw,11px)",
                        marginTop: "0.1em",
                        boxShadow: `2px 2px 0 ${i % 2 === 0 ? "#059669" : "#7e22ce"}`,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-snug">{point}</span>
                  </li>
                ))}
              </ul>

              <div
                className="overflow-hidden rounded-full"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "2px solid rgba(167,139,250,0.4)",
                  padding: "clamp(2px,.4vw,5px) 0",
                  boxShadow: "2px 2px 0 rgba(167,139,250,0.25)",
                }}
              >
                <div className="oc-ticker-track">
                  {tickerContent.map((item, i) => (
                    <span
                      key={i}
                      className="font-black uppercase tracking-widest whitespace-nowrap"
                      style={{
                        color: i % 2 === 0 ? "#c4b5fd" : "#34d399",
                        fontSize: "clamp(9px,1.3vw,15px)",
                        padding: "0 clamp(10px,2vw,30px)",
                      }}
                    >
                      {item}
                      <span className="mx-2 opacity-40">✦</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurCoreFlipCard;
