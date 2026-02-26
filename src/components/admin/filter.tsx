import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";

interface ProductFilter {
  types: string[];
  ageCategories: string[];
  membershipTypes: string[];
  price: { minPrice: number; maxPrice: number };
}

interface FilterButtonProps {
  filters: ProductFilter | string[];
  selectedFilter?: string | null;
  onSelect: (value: string | null) => void;
}

const FilterButton = ({
  filters,
  selectedFilter,
  onSelect,
}: FilterButtonProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function isProductFilter(value: unknown): value is ProductFilter {
    if (value == null) return false;
    if (typeof value !== "object") return false;
    if (Array.isArray(value)) return false;

    const obj = value as Record<string, unknown>;

    return (
      "types" in obj &&
      Array.isArray(obj.types) &&
      "ageCategories" in obj &&
      Array.isArray(obj.ageCategories) &&
      "membershipTypes" in obj &&
      Array.isArray(obj.membershipTypes) &&
      "price" in obj &&
      obj.price != null &&
      typeof obj.price === "object" &&
      !Array.isArray(obj.price) &&
      "minPrice" in obj.price &&
      "maxPrice" in obj.price
    );
  }

  const hasValidPrice =
    isProductFilter(filters) &&
    typeof filters.price.minPrice === "number" &&
    typeof filters.price.maxPrice === "number" &&
    filters.price.minPrice <= filters.price.maxPrice;

  const displayText = selectedFilter ?? "Filter";

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-2 min-w-[140px] rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition flex items-center justify-between gap-2 shadow-sm"
      >
        <span className="truncate">{displayText}</span>
        <FaChevronDown
          className={`text-sm transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden divide-y divide-gray-100">
          {!isProductFilter(filters) && Array.isArray(filters) && (
            <>
              <button
                onClick={() => {
                  onSelect(null);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${
                  selectedFilter === null
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-gray-700"
                }`}
              >
                All
              </button>
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    onSelect(filter);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${
                    selectedFilter === filter
                      ? "bg-blue-50 font-medium text-blue-700"
                      : "text-gray-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </>
          )}

          {isProductFilter(filters) && (
            <>
              <PriceRangeSection
                min={filters.price.minPrice}
                max={filters.price.maxPrice}
                selected={selectedFilter}
                onSelect={(val) => {
                  onSelect(val);
                  setOpen(false);
                }}
                hasValidPrice={hasValidPrice}
              />

              <NestedFilterGroup
                label="Type"
                items={filters.types}
                selected={selectedFilter}
                onSelect={(val) => {
                  onSelect(val);
                  setOpen(false);
                }}
              />
              <NestedFilterGroup
                label="Age Category"
                items={filters.ageCategories}
                selected={selectedFilter}
                onSelect={(val) => {
                  onSelect(val);
                  setOpen(false);
                }}
              />
              <NestedFilterGroup
                label="Membership"
                items={filters.membershipTypes}
                selected={selectedFilter}
                onSelect={(val) => {
                  onSelect(val);
                  setOpen(false);
                }}
              />

              <button
                onClick={() => {
                  onSelect(null);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium"
              >
                Clear filter
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const NestedFilterGroup = ({
  label,
  items,
  selected,
  onSelect,
}: {
  label: string;
  items: string[];
  selected?: string | null;
  onSelect: (value: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {label}
        <FaChevronRight
          className={`text-xs transition-transform ${expanded ? "rotate-90" : ""}`}
        />
      </button>

      {expanded && (
        <div className="bg-gray-50/70">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => onSelect(item)}
              className={`w-full text-left pl-10 pr-4 py-2 text-sm hover:bg-gray-100 border-t border-gray-100/50 ${
                selected === item
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-800"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PriceRangeSection = ({
  min,
  max,
  selected,
  onSelect,
  hasValidPrice,
}: {
  min: number;
  max: number;
  selected?: string | null;
  onSelect: (value: string | null) => void;
  hasValidPrice: boolean;
}) => {
  if (!hasValidPrice) {
    return (
      <div className="px-4 py-2.5 text-xs text-gray-500 bg-gray-50">
        Price: ₹{min} – ₹{max}
      </div>
    );
  }

  const ranges = [
    { label: "Under ₹50", value: `price:${min}-50` },
    { label: "₹50 – ₹100", value: `price:50-100` },
    { label: "₹100 – ₹500", value: `price:100-500` },
    { label: "₹500 – ₹1000", value: `price:500-1000` },
    { label: "Over ₹1000", value: `price:1000-${max}` },
    { label: "Any price", value: null },
  ].filter((r) => {
    if (r.value === null) return true;
    const [, rangeMinStr, rangeMaxStr] = r.value.split(/:|-/) as [
      string,
      string,
      string,
    ];
    const rangeMin = Number(rangeMinStr);
    const rangeMax = Number(rangeMaxStr);
    return rangeMin < max && rangeMax > min;
  });

  return (
    <div className="bg-gray-50">
      <div className="px-4 py-2 text-xs font-medium text-gray-600 border-b">
        Price range
      </div>
      {ranges.map((range) => (
        <button
          key={range.label}
          onClick={() => onSelect(range.value)}
          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 ${
            selected === range.value
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-800"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButton;
