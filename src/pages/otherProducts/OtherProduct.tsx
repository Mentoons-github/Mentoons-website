import {
  Check,
  Minus,
  Plus,
  Star,
  Share2,
  Link2,
  MessageCircle,
  Send,
  Users,
  Heart,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProducts, fetchProductById } from "@/redux/productSlice";
import { addItemCart } from "@/redux/cartSlice";
import { PRODUCT_TYPE } from "@/constant";
import ProductCard from "@/components/MentoonsStore/ProductCard";

export interface Products {
  _id: string;
  title: string;
  price: number;
  thumbnails: string[];
  pages: number;
  size: string;
  description: string;
  offerPrice: number;
  data: string;
  type?: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Aarav",
    rating: 5,
    comment: "Cute pages. My child loves it!",
  },
  {
    id: "r2",
    name: "Meera",
    rating: 5,
    comment: "Easy to color and very fun.",
  },
  {
    id: "r3",
    name: "Kabir",
    rating: 4,
    comment: "Great quality illustrations.",
  },
];

const RING_COLORS = ["#FF4B3E", "#2EC4B6", "#6C5CE7", "#FFC93C"];

const BURST_POINTS =
  "100,50 83.8,59.1 93.3,75 74.7,74.7 75,93.3 59.1,83.8 50,100 40.9,83.8 25,93.3 25.3,74.7 6.7,75 16.2,59.1 0,50 16.2,40.9 6.7,25 25.3,25.3 25,6.7 40.9,16.2 50,0 59.1,16.2 75,6.7 74.7,25.3 93.3,25 83.8,40.9";

const Burst = ({
  children,
  className = "",
  bg = "#FF4B3E",
}: {
  children: React.ReactNode;
  className?: string;
  bg?: string;
}) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 h-full w-full drop-shadow-md"
    >
      <polygon
        points={BURST_POINTS}
        fill={bg}
        stroke="#1A1614"
        strokeWidth="2"
      />
    </svg>
    <span className="relative z-10 text-center text-white">{children}</span>
  </div>
);

// ---- small compact review card shown under the main thumbnail ----
const MiniReviewCard = ({ review }: { review: Review }) => (
  <div className="flex-none w-52 rounded-xl border-2 border-[#1A1614] bg-white p-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-[#1A1614]">{review.name}</span>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="h-3 w-3 text-[#FFC93C]"
            fill={i < review.rating ? "currentColor" : "none"}
          />
        ))}
      </div>
    </div>
    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#1A1614]/70">
      {review.comment}
    </p>
  </div>
);

// ---- category pills shown under "You will also like this" ----
const RECOMMENDATION_TYPES = PRODUCT_TYPE.filter(
  (type) =>
    type.value !== "audio comic" &&
    type.value !== "podcast" &&
    type.value !== "workshop" &&
    type.value !== "assessment" &&
    type.value !== "comic",
);

const ToonlandProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const shareRef = useRef<HTMLDivElement>(null);

  const [product, setProduct] = useState<Products | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---- cart / buy now state ----
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const { productId: PRODUCT_ID } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { getToken, userId } = useAuth();

  const dispatch = useDispatch<AppDispatch>();

  // ---- "You will also like this" state ----
  const [recommendationsFilter, setRecommendationFilter] = useState<string>(
    RECOMMENDATION_TYPES[0]?.value ?? "",
  );
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    items: recommendedProducts,
    loading: recommendedLoading,
    error: recommendedError,
  } = useSelector((state: RootState) => state.products);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === "left" ? -400 : 400;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });

    setScrollPosition(container.scrollLeft + scrollAmount);
  };

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setScrollPosition(container.scrollLeft);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!PRODUCT_ID) return;
      try {
        setLoading(true);
        const response = await dispatch(fetchProductById(PRODUCT_ID));
        if (isMounted) {
          if (response.payload) {
            setProduct(response.payload as unknown as Products);
            setError(null);
          } else {
            setError("Couldn't load this product. Please try again.");
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        if (isMounted) {
          setError("Couldn't load this product. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [PRODUCT_ID, dispatch]);

  // ---- fetch recommended products ----
  useEffect(() => {
    const RecommendedProducts = async () => {
      try {
        await dispatch(fetchProducts({}));
      } catch (error) {
        console.error("Error fetching recommended products", error);
      }
    };
    RecommendedProducts();
  }, [product, dispatch]);

  // ---- close the share dropdown when clicking outside it ----
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---- reset the "Copied!" state after a couple seconds ----
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const getShareUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const getShareText = () =>
    product
      ? `Check out "${product.title}" on Toonland!`
      : "Check this out on Toonland!";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `${getShareText()} ${getShareUrl()}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setShareOpen(false);
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      getShareText(),
    )}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setShareOpen(false);
  };

  // ---- Add to Cart ----
  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (!product) return;

    try {
      setIsAddingToCart(true);

      const token = await getToken();
      if (!token) {
        toast.error("Please login to add to cart");
        return;
      }

      if (!userId) {
        toast.error("User ID is missing");
        return;
      }

      const response = await dispatch(
        addItemCart({
          token,
          userId,
          productId: product._id,
          // "toonland" is now a first-class value inside ProductType on the
          // backend's Cart schema, since Toonland products are real Product
          // documents with type: "toonland"
          productType: "toonland",
          title: product.title,
          quantity: quantity || 1,
          price: product.offerPrice,
          productImage: thumbnails[0],
          // stored as an object (not just the description string) so the
          // download link survives all the way to the order-confirmation
          // email — see OrderSummary's handleProceedToPay
          productDetails: {
            description: product.description,
            fileUrl: product.data,
          },
        }),
      );

      if (addItemCart.fulfilled.match(response)) {
        toast.success("Added to cart!");
      } else {
        console.error("Add to cart failed:", response);
        toast.error(
          (response.payload as string) || "Error while adding to cart",
        );
      }
    } catch (err) {
      console.error("Error while adding to cart", err);
      toast.error("Error while adding to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // ---- Buy Now ----
  const handleBuyNow = async () => {
    if (!product) return;

    try {
      setIsBuyingNow(true);

      const token = await getToken();
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      // Toonland products are now regular Mentoons products, so OrderSummary
      // can fetch them the same way as any other product — no "source"
      // query param needed anymore.
      navigate(`/order-summary?productId=${product._id}`);
    } catch (err) {
      console.error("Error while proceeding to buy now", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsBuyingNow(false);
    }
  };

  const thumbnails = product?.thumbnails ?? [];
  const discountPercent =
    product && product.price > 0
      ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
      : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF6E9]">
        <span className="text-lg font-bold text-[#1A1614]/60">
          Loading product…
        </span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF6E9]">
        <span className="text-lg font-bold text-[#FF4B3E]">
          {error ?? "Product not found."}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF6E9] px-4 py-10 sm:px-8 lg:px-16">
      {/* ---------------- HERO ---------------- */}
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* thumbnails */}
          <div className="order-2 flex gap-3 lg:order-1 lg:w-20 lg:flex-col">
            {thumbnails.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setActiveThumb(i)}
                aria-label={`Show image ${i + 1}`}
                className="h-16 w-16 flex-none overflow-hidden rounded-xl border-2 bg-white transition-transform hover:-translate-y-0.5 lg:h-20 lg:w-20"
                style={{
                  borderColor:
                    activeThumb === i
                      ? RING_COLORS[i % RING_COLORS.length]
                      : "#1A1614",
                  borderWidth: activeThumb === i ? 3 : 2,
                }}
              >
                <img
                  src={src}
                  alt={`${product.title} — image ${i + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* main image panel */}
          <div className="order-1 flex-1 lg:order-2">
            <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-3xl border-4 border-[#1A1614] bg-[#FFE1A8] sm:h-[28rem]">
              {thumbnails[activeThumb] && (
                <img
                  src={thumbnails[activeThumb]}
                  alt={product.title}
                  className="h-full w-full object-contain p-3"
                />
              )}
              {discountPercent > 0 && (
                <Burst
                  bg="#FF4B3E"
                  className="absolute -right-3 -top-3 h-24 w-24 rotate-6 sm:h-28 sm:w-28"
                >
                  <span className="flex flex-col leading-none">
                    <span className="text-lg font-black sm:text-xl">
                      {discountPercent}%
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                      off
                    </span>
                  </span>
                </Burst>
              )}
              <span className="absolute bottom-3 left-3 rounded-full border-2 border-[#1A1614] bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1A1614]">
                Toonland Originals
              </span>
            </div>

            {/* ---- small reviews strip, filling the space under the main image ---- */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-[#1A1614]">
                  What readers say
                </span>
                <span className="text-xs font-semibold text-[#1A1614]/50">
                  4.5 · 125 reviews
                </span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {MOCK_REVIEWS.map((review) => (
                  <MiniReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>

          {/* details */}
          <div className="order-3 flex-1 lg:max-w-md">
            <div className="flex items-center justify-end">
              {/* <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#2EC4B6] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Kids
                </span>
                <span className="rounded-full bg-[#6C5CE7] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Mythology
                </span>
                <span className="rounded-full bg-[#FFC93C] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1A1614]">
                  Stars
                </span>
              </div> */}

              <div className="relative" ref={shareRef}>
                <button
                  onClick={() => setShareOpen((s) => !s)}
                  aria-label="Share this product"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1A1614] bg-white transition-colors hover:bg-[#FFE1A8]"
                >
                  <Share2 className="h-4 w-4 text-[#1A1614]" />
                </button>
                {shareOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-48 rounded-2xl border-2 border-[#1A1614] bg-white p-2 shadow-lg">
                    <button
                      onClick={handleCopyLink}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#1A1614] hover:bg-[#FFF6E9]"
                    >
                      <Link2 className="h-4 w-4" />
                      {copied ? "Copied!" : "Copy link"}
                    </button>
                    <button
                      onClick={handleShareWhatsApp}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#1A1614] hover:bg-[#FFF6E9]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Share to WhatsApp
                    </button>
                    <button
                      onClick={handleShareTwitter}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#1A1614] hover:bg-[#FFF6E9]"
                    >
                      <Send className="h-4 w-4" />
                      Share to Twitter/X
                    </button>
                  </div>
                )}
              </div>
            </div>

            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-[#1A1614] sm:text-5xl">
              {product.title}
            </h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-[#FFC93C]"
                    fill="currentColor"
                  />
                ))}
                <div className="relative h-5 w-5">
                  <Star className="absolute h-5 w-5 text-[#FFC93C]" />
                  <div className="absolute w-1/2 overflow-hidden">
                    <Star
                      className="h-5 w-5 text-[#FFC93C]"
                      fill="currentColor"
                    />
                  </div>
                </div>
              </div>
              <span className="font-bold text-[#1A1614]">4.5</span>
              <span className="text-[#1A1614]/50">(125 reviews)</span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <h3 className="text-4xl font-black text-[#FF4B3E]">
                ₹{product.offerPrice}
              </h3>
              {product.offerPrice < product.price && (
                <>
                  <span className="text-lg font-semibold text-[#1A1614]/40 line-through">
                    ₹{product.price}
                  </span>
                  <span className="rounded-full bg-[#FF4B3E]/10 px-3 py-1 text-sm font-bold text-[#FF4B3E]">
                    Save ₹{product.price - product.offerPrice}
                  </span>
                </>
              )}
            </div>

            <div className="mt-3 flex items-center gap-1.5 font-bold text-[#2EC4B6]">
              <Check className="h-5 w-5" />
              <span>In Stock</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-semibold text-[#1A1614]/70">
              <span>{product.pages} pages</span>
              <span className="h-1 w-1 rounded-full bg-[#1A1614]/30" />
              <span>{product.size}</span>
            </div>

            {/* join the club banner */}
            <a
              href="https://toonland.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-dashed border-[#1A1614]/30 bg-[#CDEFEA] px-4 py-3 transition-colors hover:bg-[#CDEFEA]/70"
            >
              <Users className="h-5 w-5 flex-none text-[#1A1614]" />
              <span className="text-sm font-semibold text-[#1A1614]">
                Join Toonland
              </span>
              <ChevronRight className="h-4 w-4 flex-none text-[#1A1614]" />
            </a>

            <p className="mt-5 leading-7 text-[#1A1614]/80">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center overflow-hidden rounded-xl border-2 border-[#1A1614] bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-12 w-12 items-center justify-center border-r-2 border-[#1A1614] transition hover:bg-[#FFF6E9]"
                >
                  <Minus size={18} />
                </button>
                <span className="flex h-12 w-14 items-center justify-center text-lg font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-12 w-12 items-center justify-center border-l-2 border-[#1A1614] transition hover:bg-[#FFF6E9]"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#1A1614] bg-white text-[#1A1614] transition hover:bg-[#FFE9EC]">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF4B3E] py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-[#e6402f] hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBuyingNow ? "Please wait…" : "Buy Now"}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#1A1614] bg-white py-4 text-lg font-bold text-[#1A1614] transition-all hover:bg-[#FFF6E9] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingCart className="h-5 w-5" />
                {isAddingToCart ? "Adding…" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- YOU WILL ALSO LIKE THIS ---------------- */}
        <div className="w-full p-4 mt-4 ">
          <div>
            <h2 className="mb-8 text-4xl font-semibold">
              You will also like this -
            </h2>
            <div className="flex flex-wrap items-center justify-start gap-6 mb-8 rounded-sm">
              {RECOMMENDATION_TYPES.map((type) => (
                <button
                  key={type.id}
                  className={`border border-primary text-primary
                          w-fit leading-none py-3 px-7 rounded  ${
                            recommendationsFilter === type.value &&
                            "bg-primary text-white shadow-sm shadow-primary/50"
                          }`}
                  onClick={() => setRecommendationFilter(type.value)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            {scrollPosition > 0 && (
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-0 z-10 p-2 -translate-y-1/2 bg-white rounded-full shadow-lg top-1/2 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            <div
              ref={scrollContainerRef}
              onScroll={checkScrollPosition}
              className="flex py-16 overflow-x-scroll scrollbar-hide"
            >
              {recommendedLoading ? (
                <div className="w-full p-8 text-center text-gray-400">
                  Loading recommendations…
                </div>
              ) : recommendedError ? (
                <div className="w-full p-8 text-center text-red-500">
                  Couldn't load recommendations.
                </div>
              ) : recommendedProducts?.length > 0 ? (
                recommendedProducts
                  .filter((item) => item.type === recommendationsFilter)
                  .map((product) => (
                    <div
                      className="min-w-[400px] flex justify-center"
                      key={product._id}
                    >
                      <ProductCard productDetails={product} />
                    </div>
                  ))
              ) : (
                <div className="w-full p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-lg font-medium text-gray-600">
                    No products found in this category
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    Try selecting a different category
                  </p>
                </div>
              )}
            </div>

            {scrollContainerRef.current &&
              scrollPosition <
                scrollContainerRef.current.scrollWidth -
                  scrollContainerRef.current.clientWidth && (
                <button
                  onClick={() => handleScroll("right")}
                  className="absolute right-0 z-10 p-2 -translate-y-1/2 bg-white rounded-full shadow-lg top-1/2 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToonlandProductPage;
