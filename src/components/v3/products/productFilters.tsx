import { useState } from "react";
import { useSelector } from "react-redux";
import { ChevronUp } from "lucide-react";
import { RootState } from "@/redux/store";
import { ProductBase } from "@/types/productTypes";
import {
  ALL_CATEGORY_ID,
  CATEGORY_FILTERS,
  type CategoryFilter,
} from "./shopByCategory";

export const AGE_OPTIONS = [
  { value: "6-12", label: "6 – 12 years" },
  { value: "13-16", label: "13 – 16 years" },
  { value: "17-19", label: "17 – 19 years" },
  { value: "20+", label: "20+ years" },
];

export const PRICE_RANGES = [
  { id: "0-250", label: "₹0 – ₹250", min: 0, max: 250 },
  { id: "251-500", label: "₹251 – ₹500", min: 251, max: 500 },
  { id: "501-1000", label: "₹501 – ₹1,000", min: 501, max: 1000 },
  { id: "1001+", label: "Above ₹1,000", min: 1001, max: Infinity },
];

export const AVAILABILITY_OPTIONS = [
  { id: "in-stock", label: "In Stock" },
  { id: "preorder", label: "Preorder" },
];

export const getSellingPrice = (product: ProductBase): number =>
  product.offerPrice ?? product.price;

type PreorderFields = { isPreorder?: boolean; preorder?: boolean };

export const getAvailability = (
  product: ProductBase,
): "in-stock" | "preorder" => {
  const flags = product as unknown as PreorderFields;
  return flags.isPreorder || flags.preorder ? "preorder" : "in-stock";
};

export const matchesPriceRanges = (
  product: ProductBase,
  selectedIds: string[],
): boolean => {
  if (selectedIds.length === 0) return true;
  const price = Math.round(getSellingPrice(product));
  return PRICE_RANGES.some(
    (range) =>
      selectedIds.includes(range.id) &&
      price >= range.min &&
      price <= range.max,
  );
};

const FilterGroup = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-900"
      >
        {title}
        <ChevronUp
          className={`h-4 w-4 text-gray-500 transition-transform ${
            open ? "" : "rotate-180"
          }`}
          aria-hidden="true"
        />
      </button>
      {open && <div className="mt-3 flex flex-col gap-2.5">{children}</div>}
    </div>
  );
};

const CheckboxRow = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700 hover:text-gray-900">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#ff9800]"
    />
    {label}
  </label>
);

interface ProductFiltersProps {
  selectedAgeCategories: string[];
  onToggleAge: (age: string) => void;
  selectedCategoryId: string;
  onSelectCategory: (category: CategoryFilter) => void;
  onClearAll: () => void;
  selectedPriceRanges?: string[];
  onTogglePrice?: (rangeId: string) => void;
  selectedAvailability?: string[];
  onToggleAvailability?: (id: string) => void;
}

const ProductFilters = ({
  selectedAgeCategories,
  onToggleAge,
  selectedCategoryId,
  onSelectCategory,
  onClearAll,
  selectedPriceRanges = [],
  onTogglePrice,
  selectedAvailability = [],
  onToggleAvailability,
}: ProductFiltersProps) => {
  const products = useSelector((state: RootState) => state.products.items);

  const availabilityCounts = products.reduce<Record<string, number>>(
    (acc, product) => {
      const key = getAvailability(product);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const handleCategoryToggle = (category: CategoryFilter) => {
    onSelectCategory(
      category.id === selectedCategoryId ? CATEGORY_FILTERS[0] : category,
    );
  };

  return (
    <aside aria-label="Product filters" className="w-full">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm text-gray-500 underline underline-offset-2 hover:text-[#ff9800]"
        >
          Clear all
        </button>
      </div>

      <FilterGroup title="Age Group">
        {AGE_OPTIONS.map((age) => (
          <CheckboxRow
            key={age.value}
            label={age.label}
            checked={selectedAgeCategories.includes(age.value)}
            onChange={() => onToggleAge(age.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Product Type">
        {CATEGORY_FILTERS.filter((c) => c.id !== ALL_CATEGORY_ID).map(
          (category) => (
            <CheckboxRow
              key={category.id}
              label={category.label}
              checked={category.id === selectedCategoryId}
              onChange={() => handleCategoryToggle(category)}
            />
          ),
        )}
      </FilterGroup>

      <FilterGroup title="Price Range">
        {PRICE_RANGES.map((range) => (
          <CheckboxRow
            key={range.id}
            label={range.label}
            checked={selectedPriceRanges.includes(range.id)}
            onChange={() => onTogglePrice?.(range.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        {AVAILABILITY_OPTIONS.map((option) => (
          <CheckboxRow
            key={option.id}
            label={`${option.label} (${availabilityCounts[option.id] ?? 0})`}
            checked={selectedAvailability.includes(option.id)}
            onChange={() => onToggleAvailability?.(option.id)}
          />
        ))}
      </FilterGroup>
    </aside>
  );
};

export default ProductFilters;
