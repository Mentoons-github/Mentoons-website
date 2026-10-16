import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  CalendarClock,
  ChevronDown,
  Gift,
  Heart,
  Search,
  ShoppingCart,
  Star,
  X,
  Zap,
} from "lucide-react";

import LoginModal from "@/components/common/modal/loginModal";
import AddToCartModal from "@/components/modals/AddToCartModal";
import SendGiftModal, {
  type GiftPayload,
} from "@/components/v3/products/sendGiftModal";
import {
  ErrorDisplay,
  ProductsLoadingSkeleton,
} from "@/components/products/productSkelton";
import { useProductActions } from "@/hooks/useProductAction";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ProductBase } from "@/types/productTypes";
import { ORDER_TYPE, ProductType } from "@/utils/enum";
import {
  ALL_CATEGORY_ID,
  CATEGORY_FILTERS,
  classifyProduct,
  type CategoryFilter,
} from "./shopByCategory";
import {
  getAvailability,
  getSellingPrice,
  matchesPriceRanges,
} from "./productFilters";
import { api } from "@/api/axiosInstance/axiosInstance";

type SortKey = "popularity" | "newest" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

// Comic look: ink border + hard offset shadow that "presses" on click
const COMIC_BTN =
  "border-2 border-gray-900 shadow-[2px_2px_0_0_#111827] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

const getProductDetailPath = (product: ProductBase): string =>
  product.type === ProductType.TOONLAND
    ? `/mentoons-store/toonland-product/${product._id}`
    : `/mentoons-store/product/${product._id}`;

const getDiscountInfo = (product: ProductBase) => {
  const mrp = product.mrp;
  const sellingPrice = getSellingPrice(product);
  if (!mrp || mrp <= sellingPrice) return null;
  const percentOff = Math.round(((mrp - sellingPrice) / mrp) * 100);
  return percentOff > 0 ? { mrp, sellingPrice, percentOff } : null;
};

const matchesSearch = (product: ProductBase, term: string): boolean => {
  const q = term.trim().toLowerCase();
  if (!q) return true;

  const ageCategory = product.ageCategory || "";
  if (product.title.toLowerCase().includes(q)) return true;
  if (ageCategory.toLowerCase().includes(q)) return true;

  const n = parseInt(q, 10);
  if (isNaN(n)) return false;
  if (ageCategory === "20+") return n >= 20;
  if (ageCategory.includes("-")) {
    const [min, max] = ageCategory.split("-").map(Number);
    return n >= min && n <= max;
  }
  return false;
};

const sortProducts = (products: ProductBase[], sortKey: SortKey) => {
  const list = [...products];
  switch (sortKey) {
    case "popularity":
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "price-asc":
      return list.sort((a, b) => getSellingPrice(a) - getSellingPrice(b));
    case "price-desc":
      return list.sort((a, b) => getSellingPrice(b) - getSellingPrice(a));
    default:
      return list;
  }
};

type CartHandler = (
  e: React.MouseEvent<HTMLButtonElement>,
  product: ProductBase,
) => void | Promise<void>;

const ProductCardV3 = ({
  product,
  isFavourite,
  onToggleFavourite,
  handleAddToCart,
  handleBuyNow,
  onSendGift,
  isLoading,
}: {
  product: ProductBase;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
  handleAddToCart: CartHandler;
  handleBuyNow: CartHandler;
  onSendGift: (product: ProductBase) => void;
  isLoading?: boolean;
}) => {
  const navigate = useNavigate();
  const thumbnail = product.productImages?.[0]?.imageUrl;
  const discount = getDiscountInfo(product);
  const isPreorder = getAvailability(product) === "preorder";

  return (
    <article
      onClick={() => navigate(getProductDetailPath(product))}
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-gray-900 bg-white p-2 shadow-[5px_5px_0_0_#111827] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#111827]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-2 border-gray-900 bg-[#FFF3E0]">
        {product.ageCategory && (
          <span className="font-comic absolute left-2 top-2 z-10 rounded-md border-2 border-gray-900 bg-[#FFD93D] px-1.5 text-sm leading-5 tracking-wide text-gray-900">
            {product.ageCategory} yrs
          </span>
        )}
        {discount && (
          <span className="font-comic-chip absolute right-2 top-2 z-10 rotate-6 rounded-full border-2 border-gray-900 bg-red-500 px-2 py-0.5 text-xs tracking-wide text-white shadow-[2px_2px_0_0_#111827]">
            {discount.percentOff}% OFF
          </span>
        )}
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="font-comic flex h-full items-center justify-center text-lg tracking-wide text-gray-500">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-2.5">
        <h3 className="font-comic line-clamp-1 text-xl tracking-wide text-gray-900">
          {product.title}
        </h3>

        {typeof product.rating === "number" && (
          <div
            className="mt-1 flex items-center gap-0.5"
            aria-label={`Rated ${product.rating} out of 5`}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(product.rating ?? 0)
                    ? "fill-yellow-400 text-gray-900"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {product.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-600">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-comic-chip text-xl tracking-wide text-gray-900">
              ₹{discount ? discount.sellingPrice : product.price}
            </span>
            {discount && (
              <span className="text-xs text-gray-400 line-through">
                ₹{discount.mrp}
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label={
              isFavourite ? "Remove from favourites" : "Add to favourites"
            }
            aria-pressed={isFavourite}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavourite(product._id);
            }}
            className="rounded-full border-2 border-gray-900 bg-white p-1 text-gray-900 transition hover:bg-red-100"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavourite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>
        </div>

        <div className="mt-3 flex flex-nowrap items-stretch gap-1.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e, product);
            }}
            className={`font-comic flex min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-[#FFD93D] px-1.5 py-1.5 text-base tracking-wide text-gray-900 hover:bg-[#ff9800] hover:text-white disabled:opacity-50 ${COMIC_BTN}`}
          >
            {isPreorder ? (
              <>
                <span className="truncate">Preorder</span>
                <CalendarClock className="h-3.5 w-3.5 shrink-0" />
              </>
            ) : (
              <>
                <span className="truncate">Add to Cart</span>
                <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
              </>
            )}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              onSendGift(product);
            }}
            className={`font-comic flex min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-pink-500 px-1.5 py-1.5 text-base tracking-wide text-white hover:bg-red-500 disabled:opacity-50 ${COMIC_BTN}`}
          >
            <Gift className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Send as Gift</span>
          </button>
          <button
            type="button"
            disabled={isLoading}
            aria-label={`Buy ${product.title} now`}
            onClick={(e) => {
              e.stopPropagation();
              handleBuyNow(e, product);
            }}
            className={`flex shrink-0 items-center justify-center rounded-lg bg-white px-2.5 text-gray-900 hover:bg-[#ff9800] hover:text-white disabled:opacity-50 ${COMIC_BTN}`}
          >
            <Zap className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
};

interface ProductSectionsV3Props {
  selectedAgeCategories: string[];
  selectedCategory: CategoryFilter;
  selectedPriceRanges?: string[];
  selectedAvailability?: string[];
  onClearAll?: () => void;
}

const ProductSectionsV3 = ({
  selectedAgeCategories,
  selectedCategory,
  selectedPriceRanges = [],
  selectedAvailability = [],
  onClearAll,
}: ProductSectionsV3Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const {
    items: products,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  const [hasLoaded, setHasLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [sortKey, setSortKey] = useState<SortKey>("popularity");
  const [favourites, setFavourites] = useState<Set<string>>(new Set());

  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartProductTitle, setCartProductTitle] = useState("");
  const [giftProduct, setGiftProduct] = useState<ProductBase | null>(null);

  const { handleAddToCart, handleBuyNow, isLoading } = useProductActions({
    setShowLoginModal,
    setShowAddToCartModal,
    setCartProductTitle,
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await getToken();
        await dispatch(fetchProducts({ token: token ?? "" })).unwrap();
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        if (active) setHasLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [dispatch, getToken]);

  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  const toggleFavourite = (id: string) =>
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const initiatePayment = async (payload: GiftPayload) => {
    if (!giftProduct) return;

    const amount = getSellingPrice(giftProduct);
    const customerName =
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.fullName || payload.senderName;
    const phone = user?.phoneNumbers?.[0]?.phoneNumber
      ? user.phoneNumbers[0].phoneNumber.replace(/^\+\d+\s*/, "")
      : "0123456789";

    const orderData = {
      user: userId,
      items: [
        {
          product: giftProduct._id,
          quantity: 1,
          price: amount,
          productName: giftProduct.title,
          productType: giftProduct.type,
          source: "mentoons",
          productImage: giftProduct.productImages?.[0]?.imageUrl,
        },
      ],
      paymentDetails: {
        paymentMethod: "credit_card",
        paymentStatus: "initiated",
      },
      orderStatus: "pending",
      totalAmount: amount,
      amount,
      currency: "INR",
      order_type: ORDER_TYPE.PRODUCT_PURCHASE,
      productInfo: `${giftProduct.title} (1)`,
      customerName,
      email: user?.emailAddresses?.[0]?.emailAddress || "",
      phone,
      status: "PENDING",
      firstName: user?.firstName,
      lastName: user?.lastName,
      orderId: `#ORD-${Date.now()}`,
      isGift: true,
      giftDetails: {
        recipientEmail: payload.recipientEmail,
        senderName: payload.senderName,
        message: payload.message,
      },
    };

    const response = await api.post(
      "/payment/initiate?type=downloads",
      orderData,
    );

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = response.data;
    const form = tempDiv.querySelector("form");
    if (!form) {
      throw new Error("Payment form not found in the response");
    }
    document.body.appendChild(form);
    form.submit();
  };

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        (selectedAgeCategories.length === 0 ||
          selectedAgeCategories.includes(product.ageCategory ?? "")) &&
        matchesPriceRanges(product, selectedPriceRanges) &&
        (selectedAvailability.length === 0 ||
          selectedAvailability.includes(getAvailability(product))) &&
        matchesSearch(product, searchTerm),
    );
    return sortProducts(filtered, sortKey);
  }, [
    products,
    selectedAgeCategories,
    selectedPriceRanges,
    selectedAvailability,
    searchTerm,
    sortKey,
  ]);

  const isAllView = selectedCategory.id === ALL_CATEGORY_ID;

  const sections = useMemo(() => {
    const buckets = new Map<string, ProductBase[]>();
    visibleProducts.forEach((product) => {
      const category = classifyProduct(product);
      if (!category) return;
      buckets.set(category.id, [...(buckets.get(category.id) ?? []), product]);
    });
    return CATEGORY_FILTERS.filter((c) => c.id !== ALL_CATEGORY_ID)
      .map((category) => ({ category, items: buckets.get(category.id) ?? [] }))
      .filter((section) => section.items.length > 0);
  }, [visibleProducts]);

  const categoryProducts = useMemo(
    () =>
      isAllView
        ? []
        : visibleProducts.filter(
            (product) => classifyProduct(product)?.id === selectedCategory.id,
          ),
    [visibleProducts, isAllView, selectedCategory.id],
  );

  const totalShown = isAllView
    ? sections.reduce((sum, section) => sum + section.items.length, 0)
    : categoryProducts.length;

  if (loading && !hasLoaded) return <ProductsLoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} />;

  const renderCard = (product: ProductBase) => (
    <ProductCardV3
      key={product._id}
      product={product}
      isFavourite={favourites.has(product._id)}
      onToggleFavourite={toggleFavourite}
      handleAddToCart={handleAddToCart}
      handleBuyNow={handleBuyNow}
      onSendGift={setGiftProduct}
      isLoading={isLoading}
    />
  );

  return (
    <div className="w-full" id="product">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-comic text-3xl tracking-wide text-gray-900 sm:text-4xl">
          {selectedCategory.label}{" "}
          <span className="font-comic-chip ml-1 inline-block -rotate-3 rounded-full border-2 border-gray-900 bg-[#ff9800] px-3 py-0.5 align-middle text-lg text-white shadow-[2px_2px_0_0_#111827]">
            {totalShown}
          </span>
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-900"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="w-56 rounded-xl border-2 border-gray-900 bg-white py-2 pl-9 pr-8 text-sm font-medium shadow-[3px_3px_0_0_#111827] outline-none focus:bg-[#FFF3E0]"
            />
            {searchTerm && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-900 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <label className="relative flex items-center text-sm text-gray-900">
            <span className="sr-only">Sort products</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="font-comic cursor-pointer appearance-none rounded-xl border-2 border-gray-900 bg-[#FFD93D] py-1.5 pl-3 pr-9 text-base tracking-wide shadow-[3px_3px_0_0_#111827] outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by: {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2 h-4 w-4 text-gray-900"
              strokeWidth={3}
              aria-hidden="true"
            />
          </label>
        </div>
      </div>

      {hasLoaded && totalShown === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-900 bg-white py-12 text-center shadow-[5px_5px_0_0_#111827]">
          <img
            src="/assets/notFound/notFound.png"
            alt="No products found"
            className="mx-auto mb-4 h-32 w-32 opacity-80"
            loading="lazy"
          />
          <h3 className="font-comic text-3xl tracking-wide text-gray-900">
            No products found
          </h3>
          <p className="mt-2 px-4 text-sm text-gray-600">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          {onClearAll && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                onClearAll();
              }}
              className="font-comic mt-4 rounded-xl border-2 border-gray-900 bg-[#ff9800] px-5 py-2 text-lg tracking-wide text-white shadow-[3px_3px_0_0_#111827] transition hover:bg-[#e68900] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {isAllView && sections.length > 0 && (
        <div className="flex flex-col gap-12">
          {sections.map(({ category, items }) => {
            const Icon = category.icon;
            return (
              <section
                key={category.id}
                aria-labelledby={`section-${category.id}`}
              >
                <h3
                  id={`section-${category.id}`}
                  className="font-comic mb-4 flex items-center gap-2 text-2xl tracking-wide text-gray-900 sm:text-3xl"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-900 bg-[#ff9800] shadow-[2px_2px_0_0_#111827]">
                    <Icon
                      className="h-5 w-5 text-white"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  </span>
                  {category.label}
                </h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map(renderCard)}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {!isAllView && categoryProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryProducts.map(renderCard)}
        </div>
      )}

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
      <SendGiftModal
        isOpen={!!giftProduct}
        onClose={() => setGiftProduct(null)}
        productTitle={giftProduct?.title ?? ""}
        defaultName={user?.firstName ?? ""}
        onSubmit={initiatePayment}
      />
    </div>
  );
};

export default ProductSectionsV3;
