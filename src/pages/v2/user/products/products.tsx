import ProductsSlider from "@/components/products/slider";
import { ProductType } from "@/utils/enum";
import {
  FaBolt,
  FaChevronDown,
  FaChevronUp,
  FaMagnifyingGlass,
  FaStar,
} from "react-icons/fa6";
import FAQ from "../faq/faq";
import { FAQ_PRODUCT } from "@/constant/faq";
import { fetchProducts } from "@/redux/productSlice";
import AgeButton from "@/components/products/ageButton";
import { useEffect, useRef, useState } from "react";
import ProductDetailCards from "@/components/products/cards";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import ProductsBenefits from "@/components/products/productsBenefits";
import AddToCartModal from "@/components/modals/AddToCartModal";
import LoginModal from "@/components/common/modal/loginModal";
import { useProductActions } from "@/hooks/useProductAction";

const ProductsSkeletonCard = () => (
  <div className="animate-pulse w-full">
    <div className="flex justify-center w-full">
      <div className="bg-gray-200 h-60 w-full rounded-lg mb-4"></div>
    </div>
    <div className="bg-gray-200 h-8 w-3/4 rounded mb-2"></div>
    <div className="bg-gray-200 h-6 w-1/2 rounded mb-4"></div>
    <div className="flex space-x-2 mb-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-4 w-4 rounded-full"></div>
      ))}
    </div>
    <div className="bg-gray-200 h-20 w-full rounded mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="bg-gray-200 h-8 w-24 rounded"></div>
      <div className="bg-gray-200 h-10 w-32 rounded"></div>
    </div>
  </div>
);

const ProductsLoadingSkeleton = () => (
  <>
    <div className="animate-pulse p-4 relative rounded-full shadow-lg mb-6">
      <div className="bg-gray-200 h-10 w-full rounded-full"></div>
    </div>
    <div className="bg-gray-200 h-60 w-full rounded-lg mb-10"></div>
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 md:gap-16 lg:gap-20 w-full mx-auto lg:mx-0 mt-10">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-16 rounded-full"></div>
      ))}
    </div>
    <div className="mt-20 grid grid-cols-1 gap-8">
      {[...Array(3)].map((_, i) => (
        <ProductsSkeletonCard key={i} />
      ))}
    </div>
  </>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="mt-10 p-8 border border-red-300 bg-red-50 rounded-lg text-center">
    <h3 className="text-xl font-semibold text-red-700 mb-2">
      Oops! Something went wrong
    </h3>
    <p className="text-red-600">
      {message || "Failed to load products. Please try again later."}
    </p>
    <button
      onClick={() => window.location.reload()}
      className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
    >
      Retry
    </button>
  </div>
);

const ProductsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category") || undefined;
  const productType = searchParams.get("productType") || undefined;
  const cardType = searchParams.get("cardType") || undefined;
  const [selectedCategory, setSelectedCategory] = useState(category);

  const section20Ref = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartProductTitle, setCartProductTitle] = useState("");
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

  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  const handleSelectedCategory = async (category: string) => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (category === "all") {
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        searchParams.delete("category");
      } else {
        if (section20Ref.current && category == "20+") {
          section20Ref.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else if (sectionRef.current) {
          sectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

        searchParams.set("category", category);
      }
      navigate({
        search: searchParams.toString(),
      });
      setSelectedCategory(category === "all" ? undefined : category);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchMentoonsProduct = async () => {
      console.log("cardType :", cardType);
      try {
        const token = await getToken();
        if (productType || cardType || category) {
          await dispatch(
            fetchProducts({
              type: productType,
              cardType,
              ageCategory: category,
              token: token!,
            })
          );
        } else {
          await dispatch(fetchProducts({}));
        }
      } catch (error: unknown) {
        console.error("Error fetching products:", error);
      }
    };

    fetchMentoonsProduct();
  }, [dispatch, selectedCategory, productType, cardType, getToken]);

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
    selectedCategory === "20+" ||
    (!selectedCategory && searchLower === "") ||
    products20Plus.length > 0;

  if (loading) {
    return (
      <div className="h-auto px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-10 md:py-15">
        <ProductsLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-auto px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-10 md:py-15">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  return (
    <div className="h-auto px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-10 md:py-15">
      <div className="p-4 relative rounded-full shadow-lg">
        <FaMagnifyingGlass className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="search here...."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-transparent pl-10 outline-none"
        />
      </div>
      {!searchTerm && (
        <>
          <ProductsSlider shopNow={handleSelectedCategory} />
          <AgeButton
            showAll={true}
            isInView={true}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleSelectedCategory}
            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-10 md:gap-16 lg:gap-20 w-full mx-auto lg:mx-0 mt-10"
          />
        </>
      )}

      <div className="mt-20" ref={sectionRef}>
        {Object.keys(groupedProducts).length > 0
          ? Object.entries(groupedProducts).map(([age, group]) => (
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
            ))
          : filteredProducts.length === 0 &&
            products20Plus.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <img
                  src="/assets/productv2/ChatGPT Image Apr 7, 2025, 04_09_38 PM.png"
                  alt="No products found"
                  className="w-40 h-40 mx-auto mb-4 opacity-60"
                />
                <h3 className="text-xl font-medium text-gray-600">
                  No products found
                </h3>
                <p className="text-gray-500 mt-2">
                  We couldn't find anything matching your filters. Try searching
                  with different keywords.
                </p>
              </div>
            )}
      </div>
      {should20PlusBeShown && products20Plus.length > 0 && (
        <div className="mt-20" ref={section20Ref}>
          <h1 className="font-akshar font-medium text-3xl sm:text-4xl md:text-5xl mb-8 text-center sm:text-left">
            Explore Products for 20+
          </h1>
          {products20Plus.map((product) => (
            <div key={product._id} className="mb-12">
              <div className="relative flex flex-col md:flex-row items-center justify-center px-4 sm:px-6 md:px-12 py-8 sm:py-10 bg-white">
                <div className="absolute -left-40 top-1/2 w-0 h-0 border-t-[200px] sm:border-t-[250px] md:border-t-[300px] border-t-transparent border-l-[250px] sm:border-l-[300px] md:border-l-[380px] border-l-red-400 border-b-[200px] sm:border-b-[250px] md:border-b-[300px] border-b-transparent -translate-y-1/2 hidden md:block"></div>

                <div className="relative flex items-start justify-start w-full md:w-1/2">
                  <button className="absolute top-[10%] -left-20 hidden md:block">
                    <FaChevronUp className="text-white w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 font-extrabold" />
                  </button>

                  <button className="absolute bottom-[10%] -left-20 hidden md:block">
                    <FaChevronDown className="text-white w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 font-extrabold" />
                  </button>
                  <div className="flex justify-center md:justify-start items-center w-full">
                    <img
                      src={product?.productImages?.[0]?.imageUrl}
                      alt="Conversation Story Cards"
                      className="w-[350px] h-[280px] sm:w-[300px] sm:h-[220px] md:w-[400px] md:h-[350px] lg:w-[500px] lg:h-[400px] object-contain drop-shadow-lg"
                    />
                  </div>
                </div>

                <div className="w-full md:w-1/2 mt-6 md:mt-0 px-2 sm:px-4 space-y-4 sm:space-y-5">
                  <span className="bg-red-500 text-white text-sm sm:text-md px-4 sm:px-5 py-1.5 sm:py-2 rounded-full">
                    {product.ageCategory}
                  </span>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-1">
                    Conversation Story Cards for Age {product.ageCategory}
                  </h1>
                  <div className="flex text-yellow-400 my-1 sm:my-2">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar className="text-gray-400" />
                  </div>

                  <p className="text-gray-600 text-base sm:text-lg mb-3">
                    {product.description}
                  </p>

                  <div className="flex flex-col md:flex-row items-center justify-between font-bold gap-4">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#ff9800] text-inter whitespace-nowrap mr-5">
                      Rs {product.price}
                    </span>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        className="flex items-center gap-2 bg-white border border-[#ff9800] text-[#ff9800] text-sm sm:text-md md:text-lg px-3 py-2 rounded-lg hover:bg-[#fff3e0] transition whitespace-nowrap w-full sm:w-auto"
                        onClick={(e) => handleBuyNow(e, product)}
                      >
                        <FaBolt /> Buy Now
                      </button>
                      <button
                        className="flex items-center gap-2 bg-[#ff9800] text-white text-sm sm:text-md md:text-lg px-3 py-2 rounded-lg hover:bg-[#e68900] transition whitespace-nowrap"
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
      )}
      {selectedCategory === "20+" && products20Plus.length === 0 && (
        <div className="mt-20">
          <h1 className="font-akshar font-medium text-5xl mb-8">
            Explore Products for 20+
          </h1>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <img
              src="/no-products.svg"
              alt="No products found"
              className="w-40 h-40 mx-auto mb-4 opacity-60"
            />
            <h3 className="text-xl font-medium text-gray-600">
              No 20+ products found
            </h3>
            <p className="text-gray-500 mt-2">
              Check back later for new products
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
  );
};

export default ProductsPage;
