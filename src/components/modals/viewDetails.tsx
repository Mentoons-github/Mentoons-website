import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { X } from "lucide-react";

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  data: any | null;
  excludeFields?: string[];
  imageFields?: string[];
  linkFields?: string[];
  actions?: React.ReactNode;
}

const EMOJIS = [
  "🌈",
  "⭐",
  "🎨",
  "🦄",
  "🌸",
  "🍭",
  "🎈",
  "🌻",
  "🐸",
  "🦋",
  "🍀",
  "🎠",
  "🚀",
  "🌟",
  "🍒",
  "🌺",
  "🍄",
  "🐢",
  "🍓",
  "🌙",
];

const ViewDetailsModal = ({
  isOpen,
  onClose,
  title = "Details",
  data,
  excludeFields = ["__v", "updatedAt"],
  imageFields = ["speakerImage", "profileImage", "image", "photo", "logo"],
  linkFields = ["meetingLink", "link", "url", "website"],
  actions,
}: ViewDetailsModalProps) => {
  if (!data) return null;

  const renderValue = (key: string, value: any): React.ReactNode => {
    if (imageFields.includes(key) && typeof value === "string" && value) {
      return (
        <img
          src={value}
          alt={key}
          className="max-w-[160px] max-h-[160px] object-cover rounded-xl border shadow-sm"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      );
    }

    if (
      (linkFields.includes(key) ||
        (typeof value === "string" && value.startsWith("http"))) &&
      typeof value === "string"
    ) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all hover:text-blue-800 text-sm"
        >
          {value}
        </a>
      );
    }

    if (
      (key.toLowerCase().includes("date") ||
        key.toLowerCase().includes("time") ||
        key === "createdAt") &&
      typeof value === "string" &&
      value.length > 0
    ) {
      try {
        return format(new Date(value), "MMM d, yyyy, h:mm a");
      } catch {
        return value;
      }
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "-";
    }

    if (typeof value === "boolean") {
      return value ? "✅ Yes" : "❌ No";
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return (
        <div className="space-y-1 text-sm">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey}>
              <span className="font-semibold capitalize">{subKey}:</span>{" "}
              {String(subValue || "-")}
            </div>
          ))}
        </div>
      );
    }

    if (value == null || value === "") return "-";

    return String(value);
  };

  const entries = Object.entries(data).filter(
    ([key]) => !excludeFields.includes(key),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

        .kf-dialog-content {
          font-family: 'Nunito', sans-serif;
          background: #fffdf7;
          border-radius: 24px !important;
          border: 3px solid #ffb347 !important;
          box-shadow: 8px 8px 0 #ffb347, 0 25px 60px rgba(255, 150, 80, 0.28) !important;
          padding: 0 !important;
          overflow: hidden !important;
          color: #3d2c1e;
          width: min(620px, 96vw) !important;
          max-width: min(620px, 96vw) !important;
          max-height: min(95vh, 1080px) !important;   /* ← Increased Height */
          display: flex !important;
          flex-direction: column !important;
        }

        .kf-header {
          flex-shrink: 0;
          background: linear-gradient(135deg, #ff9a5c 0%, #ffb347 60%, #ffd166 100%);
          padding: 16px 24px 12px;   /* Slightly reduced padding */
          position: relative;
          overflow: hidden;
        }

        .kf-header::before {
          content: '';
          position: absolute;
          top: -25px;
          right: -25px;
          width: 100px;
          height: 100px;
          background: rgba(255,255,255,0.20);
          border-radius: 50%;
        }

        .kf-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        .kf-title-text {
          font-family: 'Fredoka One', cursive;
          font-size: 1.4rem;
          font-weight: 400;
          color: #fff;
          letter-spacing: 0.02em;
          text-shadow: 2px 2px 0 rgba(180, 80, 10, 0.3);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .kf-count-badge {
          font-family: 'Nunito', sans-serif;
          font-size: 0.7rem;
          font-weight: 800;
          background: rgba(255,255,255,0.35);
          color: #fff;
          padding: 3px 10px;
          border-radius: 9999px;
          letter-spacing: 0.06em;
        }

        .kf-close-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.25s ease;
          color: #ff6b35;
          box-shadow: 3px 3px 0 rgba(200, 100, 20, 0.25);
        }

        .kf-close-btn:hover {
          transform: rotate(90deg) scale(1.1);
        }

        .kf-body {
          flex: 1 1 auto;                    /* Better flex growth */
          overflow-y: auto;
          padding: 28px 28px;                /* Slightly more breathing room */
          background: #fffdf7;
          scrollbar-width: thin;
          scrollbar-color: #ffb347 #fff3e0;
        }

        .kf-body::-webkit-scrollbar { width: 7px; }
        .kf-body::-webkit-scrollbar-track { background: #fff3e0; border-radius: 12px; }
        .kf-body::-webkit-scrollbar-thumb { background: #ffb347; border-radius: 12px; }

        .kf-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 520px) {
          .kf-grid {
            grid-template-columns: 1fr;
          }
        }

        .kf-field {
          background: #fff;
          border-radius: 18px;
          border: 2px solid #ffe0b2;
          padding: 14px 16px;
          position: relative;
          transition: all 0.2s ease;
        }

        .kf-field:hover {
          border-color: #ffb347;
          box-shadow: 0 8px 20px rgba(255, 160, 60, 0.2);
        }

        .kf-field-emoji {
          position: absolute;
          top: -11px;
          right: 14px;
          font-size: 1.1rem;
        }

        .kf-field-label {
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #ff9a5c;
          margin-bottom: 5px;
        }

        .kf-field-value {
          font-size: 0.92rem;
          font-weight: 600;
          color: #4a3728;
          line-height: 1.55;
          word-break: break-word;
        }

        .kf-actions {
          flex-shrink: 0;
          padding: 16px 28px 20px;
          border-top: 2px dashed #ffe0b2;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: #fff9f0;
        }
      `}</style>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="kf-dialog-content p-0 gap-0 border-0 bg-transparent">
          <div className="kf-header">
            <DialogHeader>
              <DialogTitle asChild>
                <div className="kf-title-row">
                  <span className="kf-title-text">
                    🎉 {title}
                    <span className="kf-count-badge">
                      {entries.length} fields
                    </span>
                  </span>
                  <button
                    onClick={onClose}
                    className="kf-close-btn"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="kf-body">
            <div className="kf-grid">
              {entries.map(([key, value], idx) => (
                <div key={key} className="kf-field">
                  <span className="kf-field-emoji">
                    {EMOJIS[idx % EMOJIS.length]}
                  </span>
                  <div className="kf-field-label">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="kf-field-value">
                    {renderValue(key, value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {actions && <div className="kf-actions">{actions}</div>}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewDetailsModal;
