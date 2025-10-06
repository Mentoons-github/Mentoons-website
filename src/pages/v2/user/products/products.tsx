import LoginModal from "@/components/common/modal/loginModal";
import AddToCartModal from "@/components/modals/AddToCartModal";
import AgeButton from "@/components/products/ageButton";
import ProductDetailCards from "@/components/products/cards";
import ProductsBenefits from "@/components/products/productsBenefits";
import ProductsSlider from "@/components/products/slider";
import { FAQ_PRODUCT } from "@/constant/faq";
import { useProductActions } from "@/hooks/useProductAction";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ProductType } from "@/utils/enum";
import { useAuth } from "@clerk/clerk-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaShoppingCart, FaFilter, FaTimes } from "react-icons/fa";
import { FaBolt, FaMagnifyingGlass, FaStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import FAQ from "../faq/faq";
import MobileProductItem, {
  MobileProductSkeleton,
} from "@/components/products/mobile/mobileView";
import MobileProductList from "@/components/products/mobile/productList";
import { debounce } from "@/utils/products/debounce";
import ProductNav from "@/components/products/productNav";

interface FetchParams {
  productType?: string;
  cardType?: string;
  token: string;
  search?: string;
  ageCategory?: string;
}

const ProductsSkeletonCard = () => (
  <div className="w-full animate-pulse">
    <div className="flex justify-center w-full">
      <div className="w-full mb-4 bg-gray-200 rounded-lg h-60"></div>
    </div>
    <div className="w-3/4 h-8 mb-2 bg-gray-200 rounded"></div>
    <div className="w-1/2 h-6 mb-4 bg-gray-200 rounded"></div>
    <div className="flex mb-3 space-x-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
      ))}
    </div>
    <div className="w-full h-20 mb-4 bg-gray-200 rounded"></div>
    <div className="flex items-center justify-between">
      <div className="w-24 h-8 bg-gray-200 rounded"></div>
      <div className="w-32 h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const ProductsLoadingSkeleton = () => (
  <>
    <div className="relative p-4 mb-6 rounded-full shadow-lg animate-pulse">
      <div className="w-full h-10 bg-gray-200 rounded-full"></div>
    </div>
    <div className="w-full mb-10 bg-gray-200 rounded-lg h-60"></div>

    <div className="hidden md:block">
      <div className="grid w-full grid-cols-1 gap-6 mx-auto mt-10 xs:grid-cols-2 lg:grid-cols-4 sm:gap-10 md:gap-16 lg:gap-20 lg:mx-0">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-full"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 mt-20">
        {[...Array(3)].map((_, i) => (
          <ProductsSkeletonCard key={i} />
        ))}
      </div>
    </div>

    <div className="block md:hidden mt-10">
      {[...Array(6)].map((_, i) => (
        <MobileProductSkeleton key={i} />
      ))}
    </div>
  </>
);

const SearchingSkeleton = ({ searchTerm }: { searchTerm: string }) => (
  <div className="h-auto px-4 py-8 sm:px-8 md:px-12 lg:px-20 sm:py-10 md:py-15">
    <div className="relative p-4 mb-6 rounded-full shadow-lg">
      <FaMagnifyingGlass className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 top-1/2 left-4" />
      <input
        type="text"
        placeholder="search here...."
        value={searchTerm}
        className="w-full pl-10 pr-10 bg-gray-100 border border-transparent outline-none"
        disabled
      />
      <div className="absolute transform -translate-y-1/2 right-4 top-1/2">
        <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin border-t-blue-500"></div>
      </div>
    </div>

    <div className="p-8 mt-10 text-center border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-500"></div>
          <FaMagnifyingGlass className="absolute w-6 h-6 text-blue-500 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 animate-pulse" />
        </div>
      </div>
      <h3 className="mb-2 text-2xl font-semibold text-blue-700">
        Searching for "{searchTerm}"...
      </h3>
      <p className="text-lg text-blue-600">
        Please wait while we find the best products for you
      </p>
      <div className="flex justify-center mt-6 space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="p-8 mt-10 text-center border border-red-300 rounded-lg bg-red-50">
    <h3 className="mb-2 text-xl font-semibold text-red-700">
      Oops! Something went wrong
    </h3>
    <p className="text-red-600">
      {message || "Failed to load products. Please try again later."}
    </p>
    <button
      onClick={() => window.location.reload()}
      className="px-6 py-2 mt-4 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
    >
      Retry
    </button>
  </div>
);

const FilterSidebar = () => {
  const ageCategories = ["6-12", "13-16", "17-19", "20+"];
  const productTypes = ["Books", "Cards"];
  const cardTypes = [
    "Conversation Starter Cards",
    "Conversation Story Cards",
    "Silent Stories",
    "Story Reteller",
  ];

  return (
    <div className="w-full md:w-60 p-4 bg-white rounded-lg shadow-md md:sticky md:top-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <FaFilter className="w-4 h-4 text-blue-600" /> Filters
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 cursor-not-allowed opacity-50">
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Age Category
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {ageCategories.map((age) => (
              <label
                key={age}
                className="flex items-center gap-2 text-sm text-gray-600 cursor-not-allowed"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-not-allowed"
                  disabled
                />
                {age}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Product Type
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {productTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 text-sm text-gray-600 cursor-not-allowed"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-not-allowed"
                  disabled
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Card Type</h3>
          <div className="space-y-1">
            {cardTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 text-sm text-gray-600 cursor-not-allowed"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-not-allowed"
                  disabled
                />
                {type}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category") || undefined;
  const productType = searchParams.get("productType") || undefined;
  const cardType = searchParams.get("cardType") || undefined;
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const section20Ref = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartProductTitle, setCartProductTitle] = useState("");
  const [isSearching, setIsSearching] = useState(false);
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

  const debouncedSearch = useCallback(
    debounce(
      async (
        value: string,
        category: string | undefined,
        productType: string | undefined,
        cardType: string | undefined
      ) => {
        try {
          setIsSearching(true);
          setSearchTerm(value);

          const searchParams = new URLSearchParams();
          if (category && category !== "all") {
            searchParams.set("category", category);
          }
          if (value.trim()) {
            searchParams.set("search", value.trim());
          }

          navigate({ search: searchParams.toString() });

          const token = await getToken();
          const fetchParams: FetchParams = {
            token: token ?? "",
            ...(value && { search: value.trim() }),
            ...(category && { ageCategory: category }),
            ...(productType && { productType }),
            ...(cardType && { cardType }),
          };

          await dispatch(fetchProducts(fetchParams)).unwrap();

          if (sectionRef.current) {
            const offsetTop =
              sectionRef.current.getBoundingClientRect().top +
              window.scrollY -
              NAV_HEIGHT;
            window.scrollTo({ top: offsetTop, behavior: "smooth" });
          }
        } catch (error: unknown) {
          console.error("Error fetching products:", error);
        } finally {
          setIsSearching(false);
        }
      },
      400
    ),
    [dispatch, getToken, navigate]
  );

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setInputValue(search);
    setSearchTerm(search);
  }, [location.search]);

  useEffect(() => {
    debouncedSearch(searchTerm, category, productType, cardType);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, category, productType, cardType, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedSearch(newValue, category, productType, cardType);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSearchTerm("");
    const searchParams = new URLSearchParams();
    if (category && category !== "all") {
      searchParams.set("category", category);
    }
    navigate({ search: searchParams.toString() });
    debouncedSearch("", category, productType, cardType);
  };

  const handleSelectedCategory = async (category: string) => {
    try {
      const searchParams = new URLSearchParams();
      if (category !== "all") {
        searchParams.set("category", category);
      }
      navigate({ search: searchParams.toString() });

      if (category === "20+" && section20Ref.current) {
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
    } catch (error) {
      console.error(error);
    }
  };

  const searchLower = searchTerm?.toLowerCase() || "";

  const filteredProducts = products.filter((product) => {
    const matchesType =
      product.type === ProductType.MENTOONS_CARDS ||
      product.type === ProductType.MENTOONS_BOOKS;

    const isNot20Plus = product.ageCategory !== "20+";

    const titleMatch = product.title.toLowerCase().includes(searchLower);
    const categoryMatch = product.ageCategory
      .toLowerCase()
      .includes(searchLower);

    let ageMatch = false;
    const searchNumber = parseInt(searchLower);
    if (!isNaN(searchNumber) && product.ageCategory.includes("-")) {
      const [min, max] = product.ageCategory.split("-").map(Number);
      ageMatch = searchNumber >= min && searchNumber <= max;
    }

    const matchesSearch =
      !searchLower || titleMatch || categoryMatch || ageMatch;

    return matchesType && isNot20Plus && matchesSearch;
  });

  const groupedProducts = filteredProducts.reduce(
    (acc: Record<string, typeof products>, curr) => {
      const key = curr.ageCategory || "unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    },
    {}
  );

  const products20Plus = products.filter((product) => {
    const titleMatch = product.title.toLowerCase().includes(searchLower);
    const categoryMatch = product.ageCategory
      .toLowerCase()
      .includes(searchLower);

    const searchNumber = parseInt(searchLower);
    const is20Plus = product.ageCategory === "20+";
    const ageMatch = !isNaN(searchNumber) && is20Plus && searchNumber >= 20;

    const matchesSearch =
      !searchLower || titleMatch || categoryMatch || ageMatch;

    return (
      product.type === ProductType.MENTOONS_CARDS && is20Plus && matchesSearch
    );
  });

  const should20PlusBeShown =
    category === "20+" ||
    (!category && searchLower === "") ||
    products20Plus.length > 0;

  if (isSearching && searchTerm.trim()) {
    return <SearchingSkeleton searchTerm={searchTerm} />;
  }

  if (loading) {
    return (
      <div className="h-auto px-4 py-8 sm:px-8 md:px-12 lg:px-20 sm:py-10 md:py-15">
        <ProductsLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-auto px-4 py-8 sm:px-8 md:px-12 lg:px-20 sm:py-10 md:py-15">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  return (
    <div className="h-auto px-4 py-8 sm:px-8 md:px-12 lg:px-20 sm:py-10 md:py-15">
      <ProductNav
        debouncedSearch={debouncedSearch}
        searchTerm={searchTerm}
        productType={productType}
        cardType={cardType}
        selectedCategory={category}
      />
      <div className="relative p-4 rounded-full shadow-lg mb-6 bg-white">
        <FaMagnifyingGlass className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 top-1/2 left-4" />
        <input
          type="text"
          placeholder="Search products..."
          value={inputValue}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-16 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
        {inputValue && (
          <button
            onClick={handleClearSearch}
            className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-10 top-1/2 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        )}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 md:hidden text-gray-600 hover:text-blue-600"
          aria-label="Toggle filters"
        >
          <FaFilter className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-6">
        <div
          className={`${
            isFilterOpen ? "block" : "hidden"
          } md:block w-full md:w-60 mb-6 md:mb-0`}
        >
          <FilterSidebar />
        </div>
        <div className="flex-1">
          {!searchTerm && (
            <>
              <ProductsSlider shopNow={setSearchTerm} />
              <AgeButton
                showAll={true}
                isInView={true}
                selectedCategory={category}
                setSelectedCategory={handleSelectedCategory}
                className="hidden md:grid w-full grid-cols-1 gap-6 mx-auto mt-10 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-10 md:gap-16 lg:gap-20 lg:mx-0"
              />
            </>
          )}

          <div className="mt-10" ref={sectionRef} id="product">
            {Object.keys(groupedProducts).length > 0 ? (
              <>
                <div className="hidden md:block">
                  {Object.entries(groupedProducts).map(([age, group]) => (
                    <div
                      className="flex justify-center w-full"
                      id={`product-${age}`}
                      key={age}
                    >
                      <ProductDetailCards
                        key={age}
                        ageCategory={age}
                        productDetails={group}
                        handleAddToCart={handleAddToCart}
                        handleBuyNow={handleBuyNow}
                        isLoading={isLoading}
                      />
                    </div>
                  ))}
                </div>

                <div className="block md:hidden">
                  {Object.entries(groupedProducts).map(([age, group]) => (
                    <MobileProductList
                      key={age}
                      products={group}
                      ageCategory={age}
                      handleAddToCart={handleAddToCart}
                      handleBuyNow={handleBuyNow}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </>
            ) : (
              !loading &&
              !isSearching &&
              filteredProducts.length === 0 &&
              products20Plus.length === 0 && (
                <div className="py-12 text-center rounded-lg bg-gray-50">
                  <img
                    src="/assets/productv2/no-products.png"
                    alt="No products found"
                    className="w-40 h-40 mx-auto mb-4 opacity-60"
                  />
                  <h3 className="text-xl font-medium text-gray-600">
                    No products found
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your search to find what you're looking for.
                  </p>
                </div>
              )
            )}
          </div>

          {should20PlusBeShown && products20Plus.length > 0 && (
            <div className="mt-20" ref={section20Ref}>
              <h1 className="mb-8 text-3xl font-medium text-center font-akshar sm:text-4xl md:text-5xl sm:text-left">
                Explore Products for 20+
              </h1>

              <div className="hidden md:block">
                {products20Plus.map((product) => (
                  <div key={product._id} className="mb-12">
                    <div className="relative flex flex-col items-center justify-center px-4 py-8 bg-white md:flex-row sm:px-6 md:px-12 sm:py-10 rounded-lg shadow-sm">
                      <div className="flex items-center justify-center w-full md:w-1/2">
                        <img
                          src={product?.productImages?.[0]?.imageUrl}
                          alt={product.title}
                          className="w-[300px] h-[240px] sm:w-[260px] sm:h-[200px] md:w-[360px] md:h-[300px] lg:w-[450px] lg:h-[360px] object-contain drop-shadow-md"
                        />
                      </div>

                      <div className="w-full px-2 mt-6 space-y-4 md:w-1/2 md:mt-0 sm:px-4 sm:space-y-5">
                        <span className="bg-red-500 text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
                          {product.ageCategory}
                        </span>
                        <h1 className="mt-1 text-lg font-semibold sm:text-xl md:text-2xl">
                          {product.title}
                        </h1>
                        <div className="flex my-1 text-yellow-400 sm:my-2">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar className="text-gray-400" />
                        </div>

                        <p className="mb-3 text-sm text-gray-600 sm:text-base line-clamp-3">
                          {product.description}
                        </p>

                        <div className="flex flex-col items-center justify-between gap-4 font-bold md:flex-row">
                          <span className="text-lg sm:text-xl lg:text-2xl text-[#ff9800] whitespace-nowrap">
                            Rs {product.price}
                          </span>
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                              className="flex items-center gap-2 bg-white border border-[#ff9800] text-[#ff9800] text-xs sm:text-sm md:text-base px-3 py-2 rounded-lg hover:bg-[#fff3e0] transition whitespace-nowrap w-full sm:w-auto"
                              onClick={(e) => handleBuyNow(e, product)}
                            >
                              <FaBolt /> Buy Now
                            </button>
                            <button
                              className="flex items-center gap-2 bg-[#ff9800] text-white text-xs sm:text-sm md:text-base px-3 py-2 rounded-lg hover:bg-[#e68900] transition whitespace-nowrap"
                              onClick={(e) => handleAddToCart(e, product)}
                            >
                              <FaShoppingCart /> Add to cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="block md:hidden">
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

          {category === "20+" && products20Plus.length === 0 && (
            <div className="mt-20">
              <h1 className="mb-8 text-3xl font-medium font-akshar sm:text-4xl md:text-5xl">
                Explore Products for 20+
              </h1>
              <div className="py-12 text-center rounded-lg bg-gray-50">
                <img
                  src="/assets/productv2/no-products.png"
                  alt="No products found"
                  className="w-40 h-40 mx-auto mb-4 opacity-60"
                  loading="lazy"
                />
                <h3 className="text-xl font-medium text-gray-600">
                  No 20+ products found
                </h3>
                <p className="mt-2 text-gray-500">
                  Check back later for new products.
                </p>
              </div>
            </div>
          )}

          <ProductsBenefits />
          <FAQ data={FAQ_PRODUCT} />
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
  );
};

export default ProductsPage;
