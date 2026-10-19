import ProductCard from "@/components/MentoonsStore/ProductCard";
import { PRODUCT_TYPE } from "@/constant";
import { getCart } from "@/redux/cartSlice";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ProductType } from "@/utils/enum";
import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartItemCard from "../components/MentoonsStore/CartItemCard";

/*
  Comic theme tokens
  page   #FFFFFF   white background
  ink    #000      outlines + hard shadows
  yellow #FFD93B   summary panel / buttons
  red    #FF4D3D   primary action
  blue   #2D6BFF   secondary accents

  Mobile (< lg): thinner borders, smaller shadows, no tilt, a sticky
  checkout bar at the bottom, swipeable snap carousel, one-line filter strip.
  Desktop (lg+): tilted panels, side summary card, arrow buttons.
*/
const comicCss = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700;900&display=swap');

.comic-page { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; background: #fff; }
.comic-title { font-family: 'Bangers', 'Impact', sans-serif; letter-spacing: 0.04em; }

.comic-panel { border: 3px solid #000; box-shadow: 4px 4px 0 #000; }
.comic-btn {
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
  transition: transform 0.08s ease, box-shadow 0.08s ease;
}
.comic-btn:active { transform: translate(3px, 3px); box-shadow: 0 0 0 #000; }
.comic-btn:focus-visible { outline: 4px dashed #2D6BFF; outline-offset: 3px; }

@media (min-width: 1024px) {
  .comic-panel { border-width: 4px; box-shadow: 8px 8px 0 #000; }
  .comic-btn { border-width: 4px; box-shadow: 5px 5px 0 #000; }
  .comic-btn:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 #000; }
  .comic-btn:active { transform: translate(5px, 5px); box-shadow: 0 0 0 #000; }
}

.comic-burst {
  clip-path: polygon(50% 0%, 61% 12%, 75% 5%, 79% 20%, 95% 21%, 90% 36%, 100% 48%, 90% 60%,
    96% 76%, 80% 78%, 75% 94%, 61% 88%, 50% 100%, 39% 88%, 25% 94%, 20% 78%,
    4% 76%, 10% 60%, 0% 48%, 10% 36%, 5% 21%, 21% 20%, 25% 5%, 39% 12%);
}
@keyframes comic-pop {
  0% { transform: scale(0.6) rotate(-8deg); opacity: 0; }
  70% { transform: scale(1.08) rotate(-2deg); opacity: 1; }
  100% { transform: scale(1) rotate(-3deg); }
}
.comic-pop { animation: comic-pop 0.45s ease-out both; }

.comic-snap { scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
.comic-snap > * { scroll-snap-align: center; }
.comic-hide-scroll { scrollbar-width: none; }
.comic-hide-scroll::-webkit-scrollbar { display: none; }

@media (prefers-reduced-motion: reduce) {
  .comic-pop { animation: none; }
  .comic-btn { transition: none; }
}
`;

const EmptyCart: React.FC = () => (
  <div className="comic-panel flex flex-col items-center justify-center gap-5 bg-white p-6 text-center lg:-rotate-1 lg:gap-6 lg:p-10">
    <p className="comic-title text-4xl text-[#FF4D3D] [text-shadow:2px_2px_0_#000] md:text-6xl lg:text-7xl lg:[text-shadow:3px_3px_0_#000]">
      Whoosh! Nothing here!
    </p>
    <p className="text-lg font-bold md:text-2xl">Your cart is empty.</p>
    <Link
      to="/products"
      className="comic-btn w-full rounded-full bg-[#FFD93B] px-6 py-3 text-lg font-black text-black sm:w-auto lg:px-8 lg:text-xl"
    >
      Visit our store to add some items!
    </Link>
  </div>
);

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { getToken, userId } = useAuth();

  const [recommendationsFilter, setRecommendationFilter] = useState(
    ProductType.MENTOONS_CARDS,
  );

  // Updated selector for cart structure
  const { cart, loading, error } = useSelector(
    (state: RootState) => state.cart,
  );

  // Get products from the productSlice
  const { items: products } = useSelector((state: RootState) => state.products);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === "left" ? -400 : 400;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });

    // Update scroll position after scroll
    setScrollPosition(container.scrollLeft + scrollAmount);
  };

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setScrollPosition(container.scrollLeft);
  };

  const handleCheckout = () => {
    navigate("/order-summary");
  };

  useEffect(() => {
    const loadCartData = async () => {
      const token = await getToken();
      if (token && userId) {
        // Fetch cart data
        dispatch(getCart({ token, userId }));

        // Fetch product recommendations with empty filters
        dispatch(fetchProducts({}));
      }
    };
    loadCartData();
  }, [dispatch, getToken, userId]);

  if (loading) {
    return (
      <div className="comic-page min-h-screen">
        <style>{comicCss}</style>
        <div className="mx-auto animate-pulse space-y-6 p-4 md:w-[90%] md:p-10 lg:space-y-10 lg:py-20">
          <div className="mb-6 h-14 w-3/4 border-[3px] border-black bg-[#FFD93B] shadow-[4px_4px_0_#000] lg:h-20 lg:w-1/2"></div>
          <div className="flex w-full flex-col gap-4 lg:flex-row-reverse">
            <div className="hidden h-48 w-[40%] rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_#000] lg:block"></div>
            <div className="flex w-full flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 w-full rounded-xl border-[3px] border-black bg-white shadow-[4px_4px_0_#000] lg:h-32"
                ></div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 w-56 shrink-0 rounded-xl border-[3px] border-black bg-white shadow-[4px_4px_0_#000] lg:h-72 lg:w-64"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const itemCount = cart?.items?.length || 0;
  const totalLabel =
    cart?.discountedPrice?.toFixed(2) || cart?.totalPrice?.toFixed(2) || "0.00";

  return (
    <div className="comic-page min-h-screen">
      <style>{comicCss}</style>

      {/* Extra bottom padding on mobile so the sticky bar never covers content */}
      <div className="mx-auto space-y-6 p-4 pb-32 md:w-[90%] md:p-10 md:pb-36 lg:space-y-10 lg:py-20 lg:pb-20">
        {/* Page title */}
        <div className="text-start lg:pb-3">
          <div className="comic-title w-full border-b-4 border-black pb-3 text-5xl leading-[1.05] text-[#FFD93B] [text-shadow:3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000] sm:text-6xl lg:border-b-8 lg:pb-4 lg:text-8xl lg:[text-shadow:4px_4px_0_#000,-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000]">
            Checkout Your Cart
          </div>
        </div>

        {error || itemCount > 0 ? (
          <div className="flex flex-wrap gap-4 bg-transparent">
            <div className="flex w-full flex-col gap-6 lg:flex-row-reverse lg:gap-8">
              {/* Desktop summary panel (mobile uses the sticky bar below) */}
              <div className="relative hidden h-fit w-full lg:block lg:w-[40%]">
                <div className="comic-burst comic-pop absolute -right-4 -top-10 z-10 flex h-28 w-28 items-center justify-center bg-[#FF4D3D] text-center">
                  <span className="comic-title -rotate-6 text-2xl leading-none text-white [text-shadow:2px_2px_0_#000]">
                    Almost
                    <br />
                    there!
                  </span>
                </div>

                <div className="comic-panel flex rotate-1 flex-col items-start justify-between rounded-3xl bg-[#FFD93B] p-6 text-2xl font-semibold">
                  <div className="w-full text-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-black">
                        Subtotal
                      </span>
                      <span className="font-black">
                        ₹{cart?.totalPrice?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="mt-4 border-t-4 border-dashed border-black pt-4">
                      <div className="flex items-center justify-between">
                        <span className="comic-title text-3xl">Total</span>
                        <span className="comic-title text-4xl text-black">
                          ₹{totalLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="comic-btn comic-title mt-6 w-full rounded-xl bg-[#FF4D3D] py-3 text-3xl text-white [text-shadow:2px_2px_0_#000]"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>

              {/* Cart items */}
              <div className="flex w-full flex-col items-center gap-4 lg:gap-6">
                {cart?.items && cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <div
                      key={item.productId}
                      className="comic-panel w-full rounded-xl bg-white p-1 lg:transition-transform lg:hover:-rotate-1"
                    >
                      <CartItemCard cartItem={item} />
                    </div>
                  ))
                ) : (
                  <EmptyCart />
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-4 w-full lg:mt-8 lg:p-4">
              <div>
                <h2 className="comic-title inline-block border-[3px] border-black bg-[#2D6BFF] px-4 py-1.5 text-3xl text-white shadow-[4px_4px_0_#000] sm:text-4xl lg:-rotate-1 lg:border-4 lg:px-6 lg:py-2 lg:text-5xl lg:shadow-[6px_6px_0_#000]">
                  People also bought
                </h2>

                {/* One swipeable line on mobile, wrapping row on desktop */}
                <div className="comic-hide-scroll -mx-4 mb-4 mt-5 flex items-center gap-3 overflow-x-auto px-4 pb-3 pt-1 lg:mx-0 lg:mb-8 lg:flex-wrap lg:gap-4 lg:overflow-visible lg:px-0">
                  {PRODUCT_TYPE.filter(
                    (type) =>
                      type.value !== "audio comic" &&
                      type.value !== "podcast" &&
                      type.value !== "workshop" &&
                      type.value !== "assessment" &&
                      type.value !== "comic",
                  ).map((type) => (
                    <button
                      key={type.id}
                      className={`comic-btn w-fit shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-base font-black leading-none lg:px-6 lg:text-lg ${
                        recommendationsFilter === type.value
                          ? "bg-[#FF4D3D] text-white"
                          : "bg-white text-black"
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
                    aria-label="Scroll left"
                    className="comic-btn absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-[#FFD93B] p-2 lg:block"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}

                <div
                  ref={scrollContainerRef}
                  onScroll={checkScrollPosition}
                  className="comic-snap comic-hide-scroll -mx-4 flex gap-4 overflow-x-scroll px-4 py-8 scrollbar-hide lg:mx-0 lg:gap-0 lg:px-0 lg:py-16"
                >
                  {products?.length > 0 ? (
                    products
                      .filter(
                        (product) => product.type === recommendationsFilter,
                      )
                      .map((product) => {
                        return (
                          <div
                            className="flex min-w-[80vw] justify-center sm:min-w-[340px] lg:min-w-[400px]"
                            key={product._id}
                          >
                            <ProductCard productDetails={product} />
                          </div>
                        );
                      })
                  ) : (
                    <div className="comic-panel w-full rounded-lg bg-white p-6 text-center lg:rotate-1 lg:p-8">
                      <p className="comic-title text-2xl text-[#2D6BFF] lg:text-3xl">
                        No products found in this category
                      </p>
                      <p className="mt-2 text-base font-bold text-black">
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
                      aria-label="Scroll right"
                      className="comic-btn absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-[#FFD93B] p-2 lg:block"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
              </div>
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>

      {/* Mobile-only sticky checkout bar */}
      {(error || itemCount > 0) && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-black bg-[#FFD93B] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_0_#000] lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <div className="leading-none">
              <p className="text-sm font-bold text-black">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
              <p className="comic-title mt-1 text-3xl text-black">
                ₹{totalLabel}
              </p>
            </div>
            <button
              className="comic-btn comic-title flex-1 rounded-xl bg-[#FF4D3D] py-3 text-2xl text-white [text-shadow:2px_2px_0_#000] sm:max-w-xs"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
