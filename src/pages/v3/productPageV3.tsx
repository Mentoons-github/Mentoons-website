import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import ProductBanner from "@/components/v3/products/productBanner";
import ProductFilters, {
  AGE_OPTIONS,
} from "@/components/v3/products/productFilters";
import ProductSectionsV3 from "@/components/v3/products/productDataV3";
import ShopByCategory, {
  ALL_CATEGORY_ID,
  CATEGORY_FILTERS,
  getCategoryFromParams,
  type CategoryFilter,
} from "@/components/v3/products/shopByCategory";

import LightSwitchIntro from "@/components/v3/products/lightSwitchIntro";

const NAV_HEIGHT = 100;

const COMIC_BTN =
  "border-2 border-gray-900 shadow-[3px_3px_0_0_#111827] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";

const HALFTONE_BG = {
  backgroundColor: "#F5F5F4",
  backgroundImage: "radial-gradient(#d6d3d1 1.2px, transparent 1.2px)",
  backgroundSize: "16px 16px",
};

const toggleInList = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const ageFromParam = (age: string | null) =>
  age && age !== "all" ? [age] : [];

const ProductPageV3 = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [selectedAgeCategories, setSelectedAgeCategories] = useState<string[]>(
    ageFromParam(searchParams.get("category")),
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(() =>
    getCategoryFromParams(
      searchParams.get("productType"),
      searchParams.get("cardType"),
      searchParams.get("filter"),
    ),
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setSelectedAgeCategories(ageFromParam(searchParams.get("category")));
    setSelectedCategory(
      getCategoryFromParams(
        searchParams.get("productType"),
        searchParams.get("cardType"),
        searchParams.get("filter"),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    if (location.hash !== "#product") return;
    const timer = setTimeout(() => {
      const el = document.getElementById("product");
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 400);
    return () => clearTimeout(timer);
  }, [location.hash, location.search]);

  const activeFilterCount =
    selectedAgeCategories.length +
    selectedPriceRanges.length +
    selectedAvailability.length +
    (selectedCategory.id !== ALL_CATEGORY_ID ? 1 : 0);

  const clearAll = () => {
    setSelectedAgeCategories([]);
    setSelectedPriceRanges([]);
    setSelectedAvailability([]);
    setSelectedCategory(CATEGORY_FILTERS[0]);
  };

  const ageTabs = [{ value: "all", label: "All Ages" }, ...AGE_OPTIONS];
  const isAgeTabActive = (value: string) =>
    value === "all"
      ? selectedAgeCategories.length === 0
      : selectedAgeCategories.length === 1 &&
        selectedAgeCategories[0] === value;

  return (
    <div style={HALFTONE_BG}>
      <LightSwitchIntro oncePerSession />

      <div className="relative overflow-hidden">
        <img
          src="/assets/LandingPage/psyco.png"
          alt="Carefully crafted by psychologists"
          className="absolute -top-3 -right-4 z-20 pointer-events-none object-contain w-28 h-28 sm:w-44 sm:h-44 lg:w-56 lg:h-56"
        />
        <ProductBanner />
      </div>
      <div className="px-4 pb-12 sm:px-8">
        <ShopByCategory
          selectedId={selectedCategory.id}
          onSelect={setSelectedCategory}
        />

        <section aria-labelledby="shop-by-age" className="pt-8">
          <h2
            id="shop-by-age"
            className="font-comic mb-4 text-3xl tracking-wide text-gray-900 sm:text-4xl"
          >
            Shop by Age
          </h2>
          <div className="flex flex-wrap gap-3">
            {ageTabs.map((tab) => {
              const active = isAgeTabActive(tab.value);
              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setSelectedAgeCategories(
                      tab.value === "all" ? [] : [tab.value],
                    )
                  }
                  className={`font-comic rounded-full px-5 py-2 text-lg tracking-wide ${COMIC_BTN} ${
                    active
                      ? "bg-[#ff9800] text-white"
                      : "bg-white text-gray-900 hover:bg-[#FFD93D]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-8 flex flex-col items-start gap-6 lg:mt-10 lg:flex-row">
          {/* Filters: collapsible on small screens, sidebar on lg+ */}
          <div className="w-full lg:w-1/5">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              aria-controls="product-filters-panel"
              className={`font-comic flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-xl tracking-wide text-gray-900 lg:hidden ${COMIC_BTN}`}
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="font-comic rounded-full border-2 border-gray-900 bg-[#ff9800] px-2 text-base text-white">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  filtersOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              id="product-filters-panel"
              className={`${
                filtersOpen ? "block" : "hidden"
              } mt-3 rounded-2xl border-2 border-gray-900 bg-white p-4 shadow-[5px_5px_0_0_#111827] lg:mt-0 lg:block`}
            >
              <ProductFilters
                selectedAgeCategories={selectedAgeCategories}
                onToggleAge={(age) =>
                  setSelectedAgeCategories((prev) => toggleInList(prev, age))
                }
                selectedCategoryId={selectedCategory.id}
                onSelectCategory={setSelectedCategory}
                onClearAll={clearAll}
                selectedPriceRanges={selectedPriceRanges}
                onTogglePrice={(id) =>
                  setSelectedPriceRanges((prev) => toggleInList(prev, id))
                }
                selectedAvailability={selectedAvailability}
                onToggleAvailability={(id) =>
                  setSelectedAvailability((prev) => toggleInList(prev, id))
                }
              />

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className={`font-comic mt-4 w-full rounded-xl bg-[#ff9800] px-4 py-3 text-xl tracking-wide text-white hover:bg-[#e68900] lg:hidden ${COMIC_BTN}`}
              >
                Show results
              </button>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <ProductSectionsV3
              selectedAgeCategories={selectedAgeCategories}
              selectedCategory={selectedCategory}
              selectedPriceRanges={selectedPriceRanges}
              selectedAvailability={selectedAvailability}
              onClearAll={clearAll}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageV3;
