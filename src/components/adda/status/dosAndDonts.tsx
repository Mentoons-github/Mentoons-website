import { useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, X } from "lucide-react";
import { DONTS, DOS } from "@/constant/adda/status";

interface DosAndDontsProps {
  isOpen: boolean;
  onClose: () => void;
}

const DosAndDonts: React.FC<DosAndDontsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"dos" | "donts">("dos");

  if (!isOpen) return null;

  return createPortal(
    <div
      className="dd-backdrop fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <style>{`
        @keyframes dd-pop {
          0%   { transform: scale(0.8) rotate(-2deg); opacity: 0; }
          70%  { transform: scale(1.03) rotate(0.5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .dd-modal { animation: dd-pop 0.4s cubic-bezier(.2,.9,.3,1.4) both; }

        .dd-font {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.05em;
        }
        .dd-chip-font {
          font-family: var(--font-comic-chip, var(--font-comic)) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }

        .dd-backdrop {
          background-color: rgba(0,0,0,0.65);
          background-image: radial-gradient(rgba(249,115,22,0.25) 1.5px, transparent 2px);
          background-size: 16px 16px;
        }

        .dd-modal {
          background-color: #fffbeb;
          background-image: radial-gradient(rgba(249,115,22,0.18) 1.5px, transparent 2px);
          background-size: 14px 14px;
          border: 4px solid #000;
          box-shadow: 8px 8px 0 #000;
          border-radius: 16px;
        }

        .dd-header {
          background-color: #f97316;
          background-image: radial-gradient(rgba(0,0,0,0.18) 2px, transparent 2.5px);
          background-size: 12px 12px;
          border-bottom: 4px solid #000;
        }
        .dd-title {
          background: #fde047;
          color: #000;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 10px;
          padding: 0 14px;
          transform: rotate(-2deg) skewX(-6deg);
          display: inline-block;
        }
        .dd-subtitle {
          background: #fff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 8px;
          padding: 0 10px;
          transform: rotate(1deg);
          display: inline-block;
        }

        .dd-close {
          background: #ef4444;
          color: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 999px;
          transition: box-shadow 0.1s ease, transform 0.15s cubic-bezier(.34,1.56,.64,1), background 0.1s ease;
        }
        .dd-close:hover { background: #f87171; transform: rotate(8deg) scale(1.08); }
        .dd-close:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }

        .dd-tabs {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 999px;
        }
        .dd-tab {
          background: #fff;
          color: #000;
          border: 3px solid transparent;
          border-radius: 999px;
          transition: transform 0.15s cubic-bezier(.34,1.56,.64,1), box-shadow 0.1s ease, background 0.1s ease;
          cursor: pointer;
        }
        .dd-tab:hover { background: #fef9c3; transform: translateY(-2px) rotate(-2deg); }
        .dd-tab-dos-on {
          background: #4ade80;
          border-color: #000;
          box-shadow: 3px 3px 0 #000;
        }
        .dd-tab-dos-on:hover { background: #86efac; }
        .dd-tab-donts-on {
          background: #f87171;
          border-color: #000;
          box-shadow: 3px 3px 0 #000;
        }
        .dd-tab-donts-on:hover { background: #fca5a5; }

        .dd-section-icon {
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 999px;
        }
        .dd-section-title {
          background: #fde047;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 8px;
          padding: 0 10px;
          transform: rotate(-1.5deg) skewX(-5deg);
          display: inline-block;
        }
        .dd-section-sub {
          color: #000;
          background: #fff;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 6px;
          padding: 0 8px;
          display: inline-block;
          transform: rotate(1deg);
        }

        .dd-card {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 12px;
          transition: transform 0.15s cubic-bezier(.34,1.56,.64,1), box-shadow 0.1s ease, background 0.1s ease;
        }
        .dd-card-dos:hover { background: #dcfce7; transform: translate(-2px, -2px) rotate(-0.5deg); box-shadow: 5px 5px 0 #000; }
        .dd-card-donts:hover { background: #fee2e2; transform: translate(-2px, -2px) rotate(0.5deg); box-shadow: 5px 5px 0 #000; }
        .dd-card-icon {
          border: 3px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
        }
        .dd-card-tag {
          background: #fde047;
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 6px;
          padding: 0 8px;
          transform: rotate(-2deg) skewX(-6deg);
          display: inline-block;
        }

        .dd-footer {
          background-color: #fde047;
          background-image: radial-gradient(rgba(249,115,22,0.35) 1.5px, transparent 2px);
          background-size: 12px 12px;
          border-top: 4px solid #000;
          color: #000;
        }

        .dd-scroll::-webkit-scrollbar { width: 10px; }
        .dd-scroll::-webkit-scrollbar-track {
          background: #fff;
          border: 2px solid #000;
          border-radius: 999px;
        }
        .dd-scroll::-webkit-scrollbar-thumb {
          background: #fde047;
          border: 2px solid #000;
          border-radius: 999px;
        }

        @media (prefers-reduced-motion: reduce) {
          .dd-modal { animation: none; }
        }
      `}</style>

      <div
        className="dd-modal relative w-full max-w-5xl max-h-[92vh] overflow-y-auto overflow-x-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close guidelines"
          className="dd-close absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" strokeWidth={3} />
        </button>

        <div className="dd-header p-6 sm:p-8">
          <div className="text-center flex flex-col items-center gap-3">
            <h1 className="dd-title dd-font text-2xl md:text-4xl">
              Community Guidelines
            </h1>
            <p className="dd-subtitle dd-chip-font text-sm md:text-lg">
              Creating a positive space for everyone
            </p>
          </div>
        </div>

        <div className="flex justify-center -mt-6 relative z-10 px-4 sm:px-8">
          <div className="dd-tabs flex p-1.5 gap-1">
            <button
              onClick={() => setActiveTab("dos")}
              className={`dd-tab dd-font px-5 sm:px-8 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 text-sm sm:text-base ${
                activeTab === "dos" ? "dd-tab-dos-on" : ""
              }`}
            >
              <CheckCircle className="w-5 h-5" strokeWidth={3} />
              Do's
            </button>
            <button
              onClick={() => setActiveTab("donts")}
              className={`dd-tab dd-font px-5 sm:px-8 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 text-sm sm:text-base ${
                activeTab === "donts" ? "dd-tab-donts-on" : ""
              }`}
            >
              <XCircle className="w-5 h-5" strokeWidth={3} />
              Don'ts
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-8 pt-10">
          <div className="relative h-[22rem] overflow-hidden">
            <div
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                activeTab === "dos"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full pointer-events-none"
              }`}
            >
              <div className="h-full">
                <div className="mb-5 text-center flex flex-col items-center gap-2">
                  <h2 className="dd-section-title dd-font text-xl sm:text-2xl flex items-center justify-center gap-3 pr-1">
                    <span className="dd-section-icon w-10 h-10 bg-green-400 flex items-center justify-center">
                      <CheckCircle
                        className="w-6 h-6 text-black"
                        strokeWidth={3}
                      />
                    </span>
                    Best Practices
                  </h2>
                  <p className="dd-section-sub dd-chip-font text-sm">
                    Guidelines for positive engagement
                  </p>
                </div>

                <div className="dd-scroll grid md:grid-cols-2 gap-4 h-52 overflow-y-auto p-2 pr-3">
                  {DOS.map((item, index) => (
                    <div
                      key={index}
                      className="dd-card dd-card-dos group flex items-start gap-4 p-4"
                    >
                      <div className="dd-card-icon w-10 h-10 bg-green-500 flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="dd-chip-font text-black leading-relaxed text-sm">
                          {item.text}
                        </p>
                        <span className="dd-card-tag dd-chip-font mt-2 text-xs">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                activeTab === "donts"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-full pointer-events-none"
              }`}
            >
              <div className="h-full">
                <div className="mb-5 text-center flex flex-col items-center gap-2">
                  <h2 className="dd-section-title dd-font text-xl sm:text-2xl flex items-center justify-center gap-3 pr-1">
                    <span className="dd-section-icon w-10 h-10 bg-red-400 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-black" strokeWidth={3} />
                    </span>
                    Things to Avoid
                  </h2>
                  <p className="dd-section-sub dd-chip-font text-sm">
                    Keep our community safe and welcoming
                  </p>
                </div>

                <div className="dd-scroll grid md:grid-cols-2 gap-4 h-52 overflow-y-auto p-2 pr-3">
                  {DONTS.map((item, index) => (
                    <div
                      key={index}
                      className="dd-card dd-card-donts group flex items-start gap-4 p-4"
                    >
                      <div className="dd-card-icon w-10 h-10 bg-red-500 flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="dd-chip-font text-black leading-relaxed text-sm">
                          {item.text}
                        </p>
                        <span className="dd-card-tag dd-chip-font mt-2 text-xs">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dd-footer p-5 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🌟</span>
            <p className="dd-font text-sm sm:text-base">
              Together we create a positive and inclusive community!
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default DosAndDonts;
