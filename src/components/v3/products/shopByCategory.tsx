import {
  getBaseTitle,
  POCKET_SERIES_LABEL,
} from "@/components/products/productsByTitle";
import { ProductBase } from "@/types/productTypes";
import { CardType, ProductType } from "@/utils/enum";
import {
  BookOpen,
  BookText,
  Layers,
  LayoutGrid,
  MessagesSquare,
  Palette,
  Repeat2,
  type LucideIcon,
} from "lucide-react";

export interface CategoryFilter {
  id: string;
  label: string;
  tagline: string;
  icon: LucideIcon;
  /** product.type values that belong here (checked second) */
  productTypes?: string[];
  /** ?cardType= values from footer/sidebar links */
  cardTypes?: string[];
  /** getBaseTitle() results that belong here (checked first) */
  baseTitles?: string[];
  /** lowercase words in the title that put a product here (checked first) */
  titleKeywords?: string[];
}

export const ALL_CATEGORY_ID = "all";

export const CATEGORY_FILTERS: CategoryFilter[] = [
  {
    id: ALL_CATEGORY_ID,
    label: "All Products",
    tagline: "",
    icon: LayoutGrid,
  },
  {
    id: "conversation-starter-cards",
    label: "Conversation Starter Cards",
    tagline: "Deeper connections",
    icon: MessagesSquare,
    baseTitles: ["Conversation Starter Cards"],
    cardTypes: [CardType.CONVERSATION_STARTER_CARDS],
  },
  {
    id: "conversation-story-cards",
    label: "Conversation Story Cards",
    tagline: "Talk through stories",
    icon: BookText,
    baseTitles: ["Conversation Story Cards"],
    cardTypes: [CardType.CONVERSATION_STORY_CARDS],
  },
  {
    id: "story-reteller-cards",
    label: "Story Reteller Cards",
    tagline: "Create & express",
    icon: Repeat2,
    baseTitles: ["Story Re-Teller Cards"],
    cardTypes: [CardType.STORY_RE_TELLER_CARD],
  },
  {
    id: "silent-stories",
    label: "Silent Stories",
    tagline: "Real-life learning",
    icon: Layers,
    baseTitles: ["Silent Stories"],
    cardTypes: [CardType.SILENT_STORIES],
  },
  {
    id: "colouring-books",
    label: "Colouring Books",
    tagline: "Creative activities",
    icon: Palette,
    baseTitles: ["Coloring Books"],
    productTypes: [ProductType.MENTOONS_COLORING_BOOKS],
  },
  {
    id: "pocket-series",
    label: "Pocket Series",
    tagline: "Journals & reflections",
    icon: BookOpen,
    baseTitles: [POCKET_SERIES_LABEL],
  },
];

const REAL_CATEGORIES = CATEGORY_FILTERS.filter(
  (c) => c.id !== ALL_CATEGORY_ID,
);

/** Returns the single category a product belongs to (undefined = none). */
export const classifyProduct = (
  product: ProductBase,
): CategoryFilter | undefined => {
  const title = product.title.toLowerCase();
  const base = getBaseTitle(product.title).toLowerCase();

  const byTitle = REAL_CATEGORIES.find(
    (c) =>
      c.baseTitles?.some((t) => t.toLowerCase() === base) ||
      c.titleKeywords?.some((k) => title.includes(k)),
  );
  if (byTitle) return byTitle;

  return REAL_CATEGORIES.find((c) =>
    c.productTypes?.includes(product.type as string),
  );
};

/** Maps footer / sidebar URL params to a category (defaults to "All"). */
export const getCategoryFromParams = (
  productType?: string | null,
  cardType?: string | null,
  filter?: string | null,
): CategoryFilter => {
  if (filter === "pocket-series") {
    return (
      REAL_CATEGORIES.find((c) => c.id === "pocket-series") ??
      CATEGORY_FILTERS[0]
    );
  }
  if (cardType) {
    const byCard = REAL_CATEGORIES.find((c) => c.cardTypes?.includes(cardType));
    if (byCard) return byCard;
  }
  if (productType) {
    const byType = REAL_CATEGORIES.find((c) =>
      c.productTypes?.includes(productType),
    );
    if (byType) return byType;
  }
  return CATEGORY_FILTERS[0];
};

interface ShopByCategoryProps {
  selectedId: string;
  onSelect: (category: CategoryFilter) => void;
}

const ShopByCategory = ({ selectedId, onSelect }: ShopByCategoryProps) => {
  return (
    <section aria-labelledby="shop-by-category" className="pt-6">
      <h2
        id="shop-by-category"
        className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl"
      >
        Shop by Category
      </h2>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7">
        {CATEGORY_FILTERS.map((category) => {
          const isSelected = category.id === selectedId;
          const Icon = category.icon;

          return (
            <li key={category.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(category)}
                className={`flex h-full w-full flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition ${
                  isSelected
                    ? "border-[#ff9800] bg-[#fff3e0] shadow-sm"
                    : "border-gray-200 bg-gray-100 hover:border-[#ff9800]/60 hover:bg-white"
                }`}
              >
                <Icon
                  className={`h-6 w-6 sm:h-7 sm:w-7 ${
                    isSelected ? "text-[#ff9800]" : "text-gray-600"
                  }`}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold leading-tight text-gray-900">
                  {category.label}
                </span>
                {category.tagline && (
                  <span className="text-[10px] leading-tight text-gray-500">
                    {category.tagline}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ShopByCategory;
