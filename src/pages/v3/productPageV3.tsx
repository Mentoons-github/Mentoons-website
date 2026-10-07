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

const NAV_HEIGHT = 100;

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

  // Footer / sidebar links change the URL while this page is already open,
  // so re-apply the params whenever the query string changes.
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

  // Footer links end in #product: scroll to the products list.
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
    <div>
      <ProductBanner />
      <div className="px-4 sm:px-8">
        <ShopByCategory
          selectedId={selectedCategory.id}
          onSelect={setSelectedCategory}
        />

        {/* Age-wise quick tabs */}
        <section aria-labelledby="shop-by-age" className="pt-6">
          <h2
            id="shop-by-age"
            className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl"
          >
            Shop by Age
          </h2>
          <div className="flex flex-wrap gap-2">
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
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "border-[#ff9800] bg-[#ff9800] text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-[#ff9800] hover:text-[#ff9800]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-6 flex flex-col items-start gap-5 lg:mt-10 lg:flex-row">
          {/* Filters: collapsible on small screens, sidebar on lg+ */}
          <div className="w-full lg:w-1/5 lg:py-10">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              aria-controls="product-filters-panel"
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm lg:hidden"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-[#ff9800] px-2 py-0.5 text-xs font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  filtersOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              id="product-filters-panel"
              className={`${
                filtersOpen ? "block" : "hidden"
              } mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:mt-0 lg:block lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
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
                className="mt-4 w-full rounded-xl bg-[#ff9800] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#e68900] lg:hidden"
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
