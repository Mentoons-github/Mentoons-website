import { useEffect } from "react";

export type ComboItem = { title: string; price: number; image?: string };
export type ComboImage = { imageUrl: string };

type ComboModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  title: string;
  tag: string;
  heroImage: string;
  heroAlt: string;
  items: ComboItem[];
  productImages?: ComboImage[];
  price: number;
  mrp: number;
  discountPercent: number;
};

const ComboModal = ({
  isOpen,
  onClose,
  onProceed,
  title,
  tag,
  heroImage,
  heroAlt,
  items,
  productImages = [],
  price,
  mrp,
  discountPercent,
}: ComboModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bundleValue = items.reduce((sum, item) => sum + item.price, 0);
  const savings = Math.max(mrp - price, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} details`}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-2 border-gray-900 bg-white shadow-[6px_6px_0_0_#111827]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-900 bg-white text-gray-900 transition hover:bg-gray-900 hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 border-b-2 border-gray-900 bg-[#F5F5F4] p-6 md:flex-row md:items-center">
            <div className="flex h-40 w-full shrink-0 items-center justify-center rounded-2xl border-2 border-gray-900 bg-white md:w-52">
              <img
                src={heroImage}
                alt={heroAlt}
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-fit rounded-full border-2 border-gray-900 bg-white px-4 py-1 text-xs font-bold uppercase tracking-wide text-gray-900">
                  {tag}
                </span>
                <span className="w-fit rounded-full border-2 border-gray-900 bg-gray-900 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {discountPercent}% OFF
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
                {title}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold text-gray-900">
                  ₹{price}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ₹{mrp}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6">
            <h4 className="text-sm font-bold uppercase tracking-wide text-gray-900">
              What's inside · {items.length} items
            </h4>
            <ul className="flex flex-col gap-3">
              {items.map((item, i) => {
                const image = item.image || productImages[i]?.imageUrl;
                return (
                  <li
                    key={`${item.title}-${i}`}
                    className="flex items-center gap-4 rounded-2xl border-2 border-gray-900 bg-white p-3"
                  >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-gray-900 bg-[#F5F5F4]">
                      {image ? (
                        <img
                          src={image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-xl font-extrabold text-gray-900">
                          {i + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-base font-bold text-gray-900">
                        {item.title}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Included in bundle
                      </span>
                    </div>
                    <span className="text-base font-bold text-gray-900">
                      ₹{item.price}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border-2 border-gray-900 bg-[#FFE9A8] px-3 py-1 text-xs font-bold text-gray-900">
                You save ₹{savings}
              </span>
              <span className="rounded-full border-2 border-gray-900 bg-[#CDE7FF] px-3 py-1 text-xs font-bold text-gray-900">
                Bundle value ₹{bundleValue}
              </span>
              <span className="rounded-full border-2 border-gray-900 bg-white px-3 py-1 text-xs font-bold text-gray-900">
                {items.length} items, one combo
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t-2 border-gray-900 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Total
            </span>
            <span className="text-2xl font-extrabold text-gray-900">
              ₹{price}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border-2 border-gray-900 bg-white px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-gray-100"
            >
              Keep browsing
            </button>
            <button
              type="button"
              onClick={onProceed}
              className="rounded-xl border-2 border-gray-900 bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-gray-900"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboModal;
