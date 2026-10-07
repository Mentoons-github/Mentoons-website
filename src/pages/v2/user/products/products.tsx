import LoginModal from "@/components/common/modal/loginModal";
import AddToCartModal from "@/components/modals/AddToCartModal";
import AgeButton from "@/components/products/ageButton";
import ProductsByTitle, {
  getBaseTitle,
  POCKET_SERIES_LABEL,
} from "@/components/products/productsByTitle";
import ProductsBenefits from "@/components/products/productsBenefits";
import ProductsSlider from "@/components/products/slider";
import { FAQ_PRODUCT } from "@/constant/faq";
import { useProductActions } from "@/hooks/useProductAction";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { CardType, ProductType } from "@/utils/enum";
import { useAuth } from "@clerk/clerk-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import { FaBolt, FaMagnifyingGlass, FaStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import FAQ from "../faq/faq";
import MobileProductItem from "@/components/products/mobile/mobileView";
import { debounce } from "@/utils/products/debounce";
import ProductNav from "@/components/products/productNav";
import {
  ErrorDisplay,
  ProductsLoadingSkeleton,
  SearchingSkeleton,
} from "@/components/products/productSkelton";

interface FetchParams {
  productType?: string;
  cardType?: string;
  token: string;
  search?: string;
  ageCategory?: string;
}

interface CardFilterOption {
  id: string;
  label: string;
  productType?: string;
  cardType?: string;
  isPocketSeries?: boolean;
}

const CARD_TYPE_FILTERS: CardFilterOption[] = [
  {
    id: "S_1",
    label: "Conversation Starter Cards",
    productType: ProductType.MENTOONS_CARDS,
    cardType: CardType.CONVERSATION_STARTER_CARDS,
  },
  {
    id: "S_2",
    label: "Story Re-Teller Cards",
    productType: ProductType.MENTOONS_CARDS,
    cardType: CardType.STORY_RE_TELLER_CARD,
  },
  {
    id: "S_3",
    label: "Silent Stories",
    productType: ProductType.MENTOONS_CARDS,
    cardType: CardType.SILENT_STORIES,
  },
  {
    id: "S_4",
    label: "Conversataion Story Cards",
    productType: ProductType.MENTOONS_CARDS,
    cardType: CardType.CONVERSATION_STORY_CARDS,
  },
  {
    id: "S_5",
    label: "Coloring Books",
    productType: ProductType.MENTOONS_COLORING_BOOKS,
    cardType: undefined,
  },
];

const POCKET_SERIES_FILTER: CardFilterOption = {
  id: "S_pocket",
  label: "Pocket Series",
  isPocketSeries: true,
};

const ALL_OPTION_FILTER: CardFilterOption = {
  id: "S_all",
  label: "All",
};

const ALL_FILTERS: CardFilterOption[] = [
  ALL_OPTION_FILTER,
  ...CARD_TYPE_FILTERS,
  POCKET_SERIES_FILTER,
];

const ProductsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category") || undefined;
  const productType = searchParams.get("productType") || undefined;
  const cardType = searchParams.get("cardType") || undefined;
  const urlSearch = searchParams.get("search") || "";
  const filterParam = searchParams.get("filter") || undefined;
  const pocketSeriesActive = filterParam === "pocket-series";

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [inputValue, setInputValue] = useState(urlSearch);
  const section20Ref = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartProductTitle, setCartProductTitle] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const {
    items: products,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  const { handleAddToCart, handleBuyNow, isLoading } = useProductActions({
    setShowLoginModal,
    setShowAddToCartModal,
    setCartProductTitle,
  });

  const { getToken } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const NAV_HEIGHT = 100;

  const scrollToSection = useCallback(() => {
    setTimeout(() => {
      if (location.hash) {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          const yOffset = -NAV_HEIGHT;
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      } else if (category === "20+" && section20Ref.current) {
        const offsetTop =
          section20Ref.current.getBoundingClientRect().top +
          window.scrollY -
          NAV_HEIGHT;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      } else if (sectionRef.current) {
        const offsetTop =
          sectionRef.current.getBoundingClientRect().top +
          window.scrollY -
          NAV_HEIGHT;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    }, 300);
  }, [location.hash, category]);

  const fetchProductsData = useCallback(
    async (search: string = "") => {
      try {
        setIsSearching(true);
        const token = await getToken();

        const fetchParams: FetchParams = {
          token: token ?? "",
          ...(search && { search: search.trim() }),
          ...(!search && category && { ageCategory: category }),
          ...(productType && { productType: productType }),
          ...(cardType && { cardType }),
        };

        await dispatch(fetchProducts(fetchParams)).unwrap();
        scrollToSection();
        setHasInitialLoad(true);
      } catch (error: unknown) {
        console.error("Error fetching products:", error);
        setHasInitialLoad(true);
      } finally {
        setIsSearching(false);
      }
    },
    [dispatch, getToken, category, productType, cardType, scrollToSection],
  );

  const debouncedSearch = useRef(
    debounce(
      (searchValue: string, fetchFn: (search: string) => Promise<void>) => {
        fetchFn(searchValue);
      },
      400,
    ),
  ).current;

  useEffect(() => {
    const urlSearchParam = searchParams.get("search") || "";

    if (!urlSearchParam) {
      setSearchTerm("");
      setInputValue("");
    } else if (urlSearchParam !== searchTerm) {
      setSearchTerm(urlSearchParam);
      setInputValue(urlSearchParam);
    }

    setHasInitialLoad(false);
    fetchProductsData(urlSearchParam);
  }, [location.search, location.hash]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);

    const params = new URLSearchParams();
    if (newValue.trim()) {
      params.set("search", newValue.trim());
    } else if (category && category !== "all") {
      params.set("category", category);
    }
    if (productType) params.set("productType", productType);
    if (cardType) params.set("cardType", cardType);

    window.history.replaceState(
      {},
      "",
      `${location.pathname}?${params.toString()}`,
    );

    debouncedSearch(newValue, fetchProductsData);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSearchTerm("");
    setHasInitialLoad(false);

    const params = new URLSearchParams();
    if (category && category !== "all") {
      params.set("category", category);
    }
    if (productType) params.set("productType", productType);
    if (cardType) params.set("cardType", cardType);

    navigate({ search: params.toString() });
  };

  const handleSelectedCategory = async (selectedCategory: string) => {
    try {
      setHasInitialLoad(false);
      setSearchTerm("");
      setInputValue("");

      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.set("category", selectedCategory);
      }

      navigate({ search: params.toString() });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCardTypeFilterClick = (filter: CardFilterOption) => {
    setHasInitialLoad(false);
    setSearchTerm("");
    setInputValue("");

    const params = new URLSearchParams();

    if (filter.isPocketSeries) {
      // Pocket Series items are all 6-12, identified by title rather than
      // productType/cardType, so they get their own URL marker instead.
      params.set("category", "6-12");
      params.set("filter", "pocket-series");
    } else if (filter === ALL_OPTION_FILTER) {
      // Reset productType/cardType/pocket filter, keep age category.
      if (category && category !== "all") {
        params.set("category", category);
      }
    } else {
      if (category && category !== "all") {
        params.set("category", category);
      }
      params.set("productType", filter.productType ?? "");
      if (filter.cardType) {
        params.set("cardType", filter.cardType);
      }
    }

    navigate({ search: params.toString(), hash: "product" });
  };

  const isCardTypeFilterActive = (filter: CardFilterOption) => {
    if (filter.isPocketSeries) {
      return pocketSeriesActive;
    }
    if (filter === ALL_OPTION_FILTER) {
      return !pocketSeriesActive && !productType && !cardType;
    }
    return (
      !pocketSeriesActive &&
      productType === filter.productType &&
      (filter.cardType ? cardType === filter.cardType : !cardType)
    );
  };

  const searchLower = searchTerm?.toLowerCase() || "";

  const filteredProducts = products.filter((product) => {
    const matchesType =
      product.type === ProductType.MENTOONS_CARDS ||
      product.type === ProductType.MENTOONS_BOOKS ||
      product.type === ProductType.TOONLAND;

    const ageCategory = product.ageCategory || "";

    const matchesCategory =
      product.type === ProductType.TOONLAND || !category || searchLower
        ? true
        : ageCategory === category;

    const titleMatch = product.title.toLowerCase().includes(searchLower);
    const categoryMatch = ageCategory.toLowerCase().includes(searchLower);

    let ageMatch = false;
    const searchNumber = parseInt(searchLower);
    if (!isNaN(searchNumber) && ageCategory.includes("-")) {
      const [min, max] = ageCategory.split("-").map(Number);
      ageMatch = searchNumber >= min && searchNumber <= max;
    } else if (!isNaN(searchNumber) && ageCategory === "20+") {
      ageMatch = searchNumber >= 20;
    }

    const matchesSearch =
      !searchLower || titleMatch || categoryMatch || ageMatch;

    return matchesType && matchesCategory && matchesSearch;
  });

  // Everything except 20+ goes through ProductsByTitle, which does its
  // own internal grouping by base title — no need to pre-group by age
  // category anymore.
  const nonAdultFilteredProducts = filteredProducts.filter(
    (product) => product.ageCategory !== "20+",
  );

  const pocketSeriesProducts = products.filter(
    (product) =>
      product.ageCategory === "6-12" &&
      getBaseTitle(product.title) === POCKET_SERIES_LABEL,
  );

  const products20Plus = products.filter((product) => {
    const ageCategory = product.ageCategory || "";

    const titleMatch = product.title.toLowerCase().includes(searchLower);
    const categoryMatch = ageCategory.toLowerCase().includes(searchLower);

    const searchNumber = parseInt(searchLower);
    const is20Plus = ageCategory === "20+";
    const ageMatch = !isNaN(searchNumber) && is20Plus && searchNumber >= 20;

    const matchesSearch =
      !searchLower || titleMatch || categoryMatch || ageMatch;

    return (
      product.type === ProductType.MENTOONS_CARDS && is20Plus && matchesSearch
    );
  });

  const should20PlusBeShown =
    !pocketSeriesActive &&
    (category === "20+" ||
      (!category && searchLower === "") ||
      products20Plus.length > 0);

  if (isSearching && searchTerm.trim()) {
    return <SearchingSkeleton searchTerm={searchTerm} />;
  }

  if (loading && !hasInitialLoad) {
    return (
      <div className="w-full max-w-full overflow-hidden h-auto px-2 sm:px-4 py-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12">
        <ProductsLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-full overflow-hidden h-auto px-2 sm:px-4 py-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden min-h-screen">
      <div className="h-auto px-2 sm:px-4 py-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12 max-w-full">
        <div className="lg:flex gap-4 items-center">
          <div className="flex flex-col gap-4 text-center md:text-left max-w-4xl mx-auto">
            <h1 className="text-3xl  md:text-6xl font-bold text-gray-900">
              <span className="text-[#ff9800]">Mentoons Products</span>
            </h1>
            <p className=" md:text-lg text-gray-600">
              Rediscover the perfect balance between{" "}
              <span className="font-medium">work</span>,{" "}
              <span className="font-medium">personal growth</span>, and{" "}
              <span className="font-medium">well-being</span>.
            </p>
            <p className=" md:text-lg text-gray-600">
              Each product is backed by{" "}
              <span className="font-semibold text-gray-800">
                extensive research
              </span>{" "}
              and real-world success stories. We are confident they will make a
              difference, and we offer a{" "}
              <span className="text-[#ff9800] font-semibold">
                satisfaction guarantee
              </span>{" "}
              for peace of mind.
            </p>
          </div>
          <ProductsSlider
            shopNow={(title: string) => {
              setSearchTerm(title);
              setInputValue(title);
              setHasInitialLoad(false);
              const params = new URLSearchParams();
              params.set("search", title);
              navigate({ search: params.toString() });
            }}
          />
        </div>
        <div className="max-w-full overflow-hidden mb-2">
          <ProductNav
            searchTerm={searchTerm}
            productType={productType}
            cardType={cardType}
            selectedCategory={category}
          />
        </div>

        <div className="relative p-3 md:mt-5 lg:mt-10 sm:p-4 border rounded-full shadow-lg mb-4 sm:mb-6 bg-white max-w-full">
          <FaMagnifyingGlass className="absolute w-3 sm:w-4 h-3 sm:h-4 text-gray-400 transform -translate-y-1/2 top-1/2 left-3 sm:left-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={inputValue}
            onChange={handleSearchChange}
            className="w-full pl-8 sm:pl-10 pr-12 sm:pr-16 py-2 sm:py-3 rounded-full outline-none text-sm sm:text-base"
          />
          {inputValue && (
            <button
              onClick={handleClearSearch}
              className="absolute w-4 sm:w-5 h-4 sm:h-5 text-gray-400 transform -translate-y-1/2 right-8 sm:right-10 top-1/2 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="flex gap-4 sm:gap-6 w-full max-w-full overflow-hidden">
          <div className="flex-1 min-w-0 max-w-full">
            {!searchTerm && (
              <div className="max-w-full overflow-hidden">
                <AgeButton
                  showAll={true}
                  isInView={true}
                  selectedCategory={category}
                  setSelectedCategory={handleSelectedCategory}
                  className="py-2 md:grid w-full grid-cols-5 hidden gap-2 mx-auto mt-8 sm:mt-10  md:gap-8  lg:gap-16"
                />

                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start mt-4 sm:mt-6 px-2">
                  {ALL_FILTERS.map((filter) => {
                    const active = isCardTypeFilterActive(filter);
                    return (
                      <button
                        key={filter.id}
                        onClick={() => handleCardTypeFilterClick(filter)}
                        className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition whitespace-nowrap ${
                          active
                            ? "bg-[#ff9800] text-white border-[#ff9800]"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#ff9800] hover:text-[#ff9800]"
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {inputValue === "Conversation Starter Cards" && (
              <div className="flex flex-col gap-4 text-center md:text-left lg:mx-5 ">
                <h1 className="text-3xl  md:text-5xl font-bold text-gray-900">
                  <span className="text-[#ff9800]">
                    Conversation Starter Cards Kit
                  </span>
                </h1>
                <p className=" md:text-lg text-gray-600">
                  As parents ourselves, we've faced the same challenges you're
                  experiencing. We've put our hearts into creating a solution
                  that works. Our team of child psychologists and educators has
                  carefully crafted each question to spark engaging
                  conversations.
                </p>
                <p className=" md:text-lg text-gray-600">
                  Trusted by thousands of families and recommended by leading
                  child development experts, our Conversation Starter Cards are
                  your key to unlocking your child's potential.
                </p>
              </div>
            )}

            <div
              className="mt-8 sm:mt-10 w-full max-w-full overflow-hidden"
              ref={sectionRef}
              id="product"
            >
              {pocketSeriesActive ? (
                pocketSeriesProducts.length > 0 ? (
                  <ProductsByTitle
                    products={pocketSeriesProducts}
                    handleAddToCart={handleAddToCart}
                    handleBuyNow={handleBuyNow}
                    isLoading={isLoading}
                  />
                ) : (
                  hasInitialLoad &&
                  !loading &&
                  !isSearching && (
                    <div className="py-8 sm:py-12 text-center rounded-lg bg-gray-50 max-w-full">
                      <img
                        src="/assets/notFound/notFound.png"
                        alt="No products found"
                        className="w-32 sm:w-40 h-32 sm:h-40 mx-auto mb-4 opacity-60"
                        loading="lazy"
                      />
                      <h3 className="text-lg sm:text-xl font-medium text-gray-600">
                        No Pocket Series products found
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-gray-500 px-4">
                        Check back later for new products.
                      </p>
                    </div>
                  )
                )
              ) : nonAdultFilteredProducts.length > 0 ? (
                <ProductsByTitle
                  products={nonAdultFilteredProducts}
                  handleAddToCart={handleAddToCart}
                  handleBuyNow={handleBuyNow}
                  isLoading={isLoading}
                />
              ) : (
                hasInitialLoad &&
                !loading &&
                !isSearching &&
                filteredProducts.length === 0 &&
                products20Plus.length === 0 && (
                  <div className="py-8 sm:py-12 text-center rounded-lg bg-gray-50 max-w-full">
                    <img
                      src="/assets/notFound/notFound.png"
                      alt="No products found"
                      className="w-32 sm:w-40 h-32 sm:h-40 mx-auto mb-4 opacity-60"
                      loading="lazy"
                    />
                    <h3 className="text-lg sm:text-xl font-medium text-gray-600">
                      No products found
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-500 px-4">
                      Try adjusting your search to find what you're looking for.
                    </p>
                  </div>
                )
              )}
            </div>

            {should20PlusBeShown && products20Plus.length > 0 && (
              <div
                className="mt-12 sm:mt-20 w-full max-w-full overflow-hidden"
                ref={section20Ref}
              >
                <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl md:text-4xl font-medium text-center font-akshar sm:text-left px-2">
                  Explore Products for 20+
                </h1>

                <div className="hidden md:block w-full max-w-full">
                  {products20Plus.map((product) => (
                    <div
                      key={product._id}
                      className="mb-8 sm:mb-12 w-full max-w-full"
                    >
                      <div className="relative flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-8 bg-white md:flex-row sm:px-6 md:px-8 rounded-lg shadow-sm w-full max-w-full overflow-hidden">
                        <div className="flex items-center justify-center w-full md:w-1/2 shrink-0">
                          <img
                            src={product?.productImages?.[0]?.imageUrl}
                            alt={product.title}
                            className="w-[200px] h-[160px] sm:w-[240px] sm:h-[192px] md:w-[300px] md:h-[240px] lg:w-[360px] lg:h-[288px] object-contain drop-shadow-md"
                          />
                        </div>

                        <div className="w-full px-2 sm:px-4 mt-4 sm:mt-6 md:mt-0 md:w-1/2 space-y-3 sm:space-y-4 min-w-0">
                          <span className="inline-block bg-red-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                            {product.ageCategory}
                          </span>
                          <h1 className="mt-1 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold break-words">
                            {product.title}
                          </h1>
                          <div className="flex my-1 sm:my-2 text-yellow-400">
                            <FaStar className="w-4 sm:w-5 h-4 sm:h-5" />
                            <FaStar className="w-4 sm:w-5 h-4 sm:h-5" />
                            <FaStar className="w-4 sm:w-5 h-4 sm:h-5" />
                            <FaStar className="w-4 sm:w-5 h-4 sm:h-5" />
                            <FaStar className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                          </div>

                          <p className="mb-2 sm:mb-3 text-xs sm:text-sm md:text-base text-gray-600 line-clamp-3 break-words">
                            {product.description}
                          </p>

                          <div className="flex flex-col items-start justify-between gap-3 sm:gap-4 md:flex-row md:items-center w-full">
                            <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#ff9800] whitespace-nowrap">
                              Rs {product.price}
                            </span>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
                              <button
                                className="flex items-center justify-center gap-1 sm:gap-2 bg-white border border-[#ff9800] text-[#ff9800] text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-[#fff3e0] transition whitespace-nowrap w-full sm:w-auto"
                                onClick={(e) => handleBuyNow(e, product)}
                              >
                                <FaBolt className="w-3 sm:w-4 h-3 sm:h-4" /> Buy
                                Now
                              </button>
                              <button
                                className="flex items-center justify-center gap-1 sm:gap-2 bg-[#ff9800] text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-[#e68900] transition whitespace-nowrap w-full sm:w-auto"
                                onClick={(e) => handleAddToCart(e, product)}
                              >
                                <FaShoppingCart className="w-3 sm:w-4 h-3 sm:h-4" />{" "}
                                Add to cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="block md:hidden w-full max-w-full overflow-hidden">
                  <div className="space-y-0">
                    {products20Plus.map((product) => (
                      <MobileProductItem
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                        handleBuyNow={handleBuyNow}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {category === "20+" &&
              products20Plus.length === 0 &&
              hasInitialLoad &&
              !loading && (
                <div className="mt-12 sm:mt-20 max-w-full">
                  <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl md:text-4xl font-medium font-akshar px-2">
                    Explore Products for 20+
                  </h1>
                  <div className="py-8 sm:py-12 text-center rounded-lg bg-gray-50">
                    <img
                      src="/assets/productv2/no-products.png"
                      alt="No products found"
                      className="w-32 sm:w-40 h-32 sm:h-40 mx-auto mb-4 opacity-60"
                      loading="lazy"
                    />
                    <h3 className="text-lg sm:text-xl font-medium text-gray-600">
                      No 20+ products found
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-500 px-4">
                      Check back later for new products.
                    </p>
                  </div>
                </div>
              )}

            <div className="max-w-full overflow-hidden">
              <ProductsBenefits />
              <FAQ data={FAQ_PRODUCT} />
            </div>

            {showAddToCartModal && (
              <AddToCartModal
                onClose={() => setShowAddToCartModal(false)}
                isOpen={showAddToCartModal}
                productName={cartProductTitle}
              />
            )}
            <LoginModal
              isOpen={showLoginModal}
              onClose={() => setShowLoginModal(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
