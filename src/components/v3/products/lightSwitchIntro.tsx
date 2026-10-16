import { useEffect, useRef, useState } from "react";

const PULL_THRESHOLD = 60; // px the chain must be pulled to toggle
const MAX_PULL = 110; // max stretch of the chain
const CHAIN_BASE = 150; // resting chain length
const STORAGE_KEY = "mentoons-light-on";

type Props = {
  oncePerSession?: boolean;
};

const LightSwitchIntro = ({ oncePerSession = true }: Props) => {
  const [isOn, setIsOn] = useState(() => {
    if (!oncePerSession) return false;
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [flashKey, setFlashKey] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const touchPointer = useRef(false);

  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isOn) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOn]);

  const toggle = () => {
    const next = !isOn;
    setIsOn(next);
    setDragY(0);
    setDragging(false);
    if (next) setFlashKey((k) => k + 1);
    try {
      if (oncePerSession) sessionStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "touch" || isTouch) {
      touchPointer.current = true;
      setDragY(55);
      return;
    }
    touchPointer.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    startY.current = e.clientY;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (touchPointer.current || !dragging) return;
    const delta = e.clientY - startY.current;
    setDragY(Math.max(0, Math.min(MAX_PULL, delta)));
  };

  const onPointerUp = () => {
    if (touchPointer.current) {
      touchPointer.current = false;
      toggle();
      return;
    }
    if (!dragging) return;
    setDragging(false);
    if (dragY >= PULL_THRESHOLD) toggle();
    else setDragY(0);
  };

  const onPointerCancel = () => {
    if (touchPointer.current) {
      touchPointer.current = false;
      setDragY(0);
      return;
    }
    onPointerUp();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  const chainLength = CHAIN_BASE + dragY;

  return (
    <>
      <style>{`
        @keyframes ls-sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes ls-hint {
          0%, 100% { transform: translateY(0); opacity: .5; }
          50% { transform: translateY(6px); opacity: 1; }
        }
        @keyframes ls-flash {
          0% { opacity: 0; transform: translate(50%, -50%) scale(.2); }
          25% { opacity: 1; }
          100% { opacity: 0; transform: translate(50%, -50%) scale(3); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[9998] bg-black"
        style={{
          opacity: isOn ? 0 : 0.93,
          pointerEvents: isOn ? "none" : "auto",
          transition: "opacity 900ms ease-out",
        }}
        aria-hidden="true"
      />

      {/* Light flash radiating from the bulb (only when switching on) */}
      {flashKey > 0 && (
        <div
          key={flashKey}
          className="pointer-events-none fixed right-6 top-24 z-[9999] h-[700px] w-[700px] rounded-full sm:right-16"
          style={{
            background:
              "radial-gradient(circle, rgba(255,236,150,0.95) 0%, rgba(255,214,90,0.5) 35%, rgba(255,214,90,0) 70%)",
            animation: "ls-flash 1.2s ease-out forwards",
          }}
        />
      )}

      {/* Bulb + pull chain: always present. Big when dark, smaller when lit */}
      <div
        className="pointer-events-none fixed right-6 top-0 z-[10000] sm:right-16"
        style={{
          transform: isOn ? "scale(0.65)" : "scale(1)",
          transformOrigin: "top right",
          transition: "transform 600ms ease-out",
        }}
      >
        {/* Bulb hanging from a wire */}
        <div className="absolute right-0 top-0 flex flex-col items-center">
          <div className="h-16 w-[3px] bg-gray-600" />
          <svg
            width="64"
            height="96"
            viewBox="0 0 64 96"
            aria-hidden="true"
            style={{
              filter: isOn
                ? "drop-shadow(0 0 20px #FFD93D) drop-shadow(0 0 40px #ff9800)"
                : "none",
              transition: "filter 300ms",
            }}
          >
            <rect x="22" y="0" width="20" height="14" rx="3" fill="#4b5563" />
            <rect x="24" y="14" width="16" height="6" rx="2" fill="#374151" />
            <path
              d="M32 20 C12 20 6 38 14 54 C18 62 22 66 22 74 L42 74 C42 66 46 62 50 54 C58 38 52 20 32 20 Z"
              fill={isOn ? "#FFF3B0" : "#374151"}
              stroke="#6b7280"
              strokeWidth="2"
              style={{ transition: "fill 300ms" }}
            />
            <path
              d="M26 74 L28 52 L32 60 L36 52 L38 74"
              fill="none"
              stroke={isOn ? "#ff9800" : "#6b7280"}
              strokeWidth="2"
            />
            <rect x="24" y="74" width="16" height="6" rx="2" fill="#4b5563" />
          </svg>
        </div>

        <div
          className="absolute top-0 flex flex-col items-center"
          style={{
            right: 84,
            transformOrigin: "top center",
            animation:
              dragging || dragY > 0
                ? "none"
                : "ls-sway 3.2s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: 6,
              height: chainLength,
              backgroundImage:
                "radial-gradient(circle at center, #9ca3af 2px, transparent 2.5px)",
              backgroundSize: "6px 9px",
              transition: dragging
                ? "none"
                : "height 350ms cubic-bezier(.3,1.6,.5,1)",
            }}
          />
          <button
            type="button"
            aria-label={
              isOn
                ? "Pull to switch off the light"
                : "Pull to switch on the light"
            }
            title={isOn ? "Pull to switch off" : "Pull to switch on"}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onKeyDown={onKeyDown}
            className={`pointer-events-auto -mt-1 flex items-center justify-center rounded-full border-2 border-gray-900 bg-[#ff9800] shadow-[3px_3px_0_0_#111827] outline-none focus-visible:ring-2 focus-visible:ring-white ${
              isTouch ? "h-12 w-9" : "h-9 w-6"
            } ${
              isTouch
                ? "cursor-pointer"
                : dragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
            }`}
            style={{ touchAction: "none" }}
          >
            <span className="h-3 w-1 rounded-full bg-white/70" />
          </button>
        </div>
      </div>

      {/* Hint message: only while the room is dark */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-10 z-[9999] flex flex-col items-center gap-2 px-6 text-center"
        style={{
          opacity: isOn ? 0 : 1,
          transition: "opacity 400ms ease-out",
        }}
      >
        <span
          className="text-white/40"
          style={{ animation: "ls-hint 1.6s ease-in-out infinite" }}
          aria-hidden="true"
        >
          ↓
        </span>
        <p className="font-comic text-xl tracking-wide text-white/40 sm:text-2xl">
          {isTouch
            ? "Tap the chain to switch on the light"
            : "Pull the chain down to switch on the light"}
        </p>
      </div>
    </>
  );
};

export default LightSwitchIntro;
