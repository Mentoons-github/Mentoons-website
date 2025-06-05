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

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { getToken, userId } = useAuth();
  console.log("User ID", userId);

  const [recommendationsFilter, setRecommendationFilter] = useState(
    ProductType.MENTOONS_CARDS
  );

  // Updated selector for cart structure
  const { cart, loading, error } = useSelector(
    (state: RootState) => state.cart
  );

  console.log("Cart", cart);

  // Get products from the productSlice
  const { items: products } = useSelector((state: RootState) => state.products);

  console.log("Product", products);

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
      <div className="p-10 lg:py-20 space-y-10 md:w-[90%] mx-auto animate-pulse">
        <div className="w-1/2 h-20 mb-10 bg-gray-200 rounded-lg"></div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col w-full gap-4 lg:flex-row-reverse">
            <div className="w-full lg:w-[40%] h-48 bg-gray-200 rounded-3xl"></div>
            <div className="flex flex-col w-full gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full h-32 bg-gray-200 rounded-xl"
                ></div>
              ))}
            </div>
          </div>
          <div className="w-full mt-4">
            <div className="w-48 h-12 mb-8 bg-gray-200 rounded"></div>
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-64 bg-gray-200 h-72 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 lg:py-20 space-y-10 md:w-[90%] mx-auto">
      <div className="pb-3 text-start">
        <div className="text-5xl lg:text-7xl w-full border-b-4 border-black font-extrabold leading-[1.10] pb-4">
          Checkout Your Cart
        </div>
      </div>

      {error || cart?.items?.length > 0 ? (
        <div className="flex flex-wrap gap-4 bg-transparent">
          <div className="flex flex-col-reverse w-full gap-4 lg:flex-row-reverse">
            <div className="w-full lg:w-[40%] flex flex-col items-start justify-between rounded-3xl border-4 bg-white shadow-xl h-fit text-2xl font-semibold p-4">
              <div className="w-full text-lg">
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-gray-600">
                    Subtotal
                  </span>
                  <span>₹{cart.totalPrice?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      ₹
                      {cart.discountedPrice?.toFixed(2) ||
                        cart.totalPrice?.toFixed(2) ||
                        "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="w-full py-3 mt-6 text-lg text-white transition-colors bg-black rounded-xl hover:bg-gray-800"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
            <div className="flex flex-col items-center w-full gap-4">
              {cart?.items && cart.items.length > 0 ? (
                cart.items.map((item) => (
                  <CartItemCard key={item.productId} cartItem={item} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                  <p className="text-xl font-semibold md:text-4xl">
                    Your cart is empty
                  </p>
                  <Link
                    to="/mentoons-store"
                    className="p-2 px-6 text-lg font-medium text-white transition-colors duration-300 rounded-full bg-primary hover:bg-primary-dark"
                  >
                    Visit our store to add some items!
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="w-full p-4 mt-4 ">
            <div>
              <h2 className="mb-4 text-4xl font-semibold">
                People also bought
              </h2>
              <div className="flex items-center justify-start gap-6 rounded-sm flex-wrap mb-8">
                {PRODUCT_TYPE.filter(
                  (type) =>
                    type.value !== "audio comic" &&
                    type.value !== "podcast" &&
                    type.value !== "workshop" &&
                    type.value !== "assessment" &&
                    type.value !== "comic"
                ).map((type) => (
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

            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-auto">
              {products?.length > 0 ? (
                products
                  .filter((product) => product.type === recommendationsFilter)
                  .map((product) => {
                    return (
                      <div
                        className="flex justify-center w-full"
                        key={product._id}
                      >
                        <ProductCard
                          key={product._id}
                          productDetails={product}
                        />
                      </div>
                    );
                  })
              ) : (
                <div>No Product found</div>
              )}
            </div> */}

            <div className="relative">
              {scrollPosition > 0 && (
                <button
                  onClick={() => handleScroll("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
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
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              <div
                ref={scrollContainerRef}
                onScroll={checkScrollPosition}
                className="flex overflow-x-scroll scrollbar-hide py-16"
              >
                {products?.length > 0 ? (
                  products
                    .filter((product) => product.type === recommendationsFilter)
                    .map((product) => {
                      return (
                        <div
                          className="min-w-[400px] flex justify-center"
                          key={product._id}
                        >
                          <ProductCard productDetails={product} />
                        </div>
                      );
                    })
                ) : (
                  <div className="w-full text-center p-8 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-lg text-gray-600 font-medium">
                      No products found in this category
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
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
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
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
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <p className="text-xl font-semibold md:text-4xl">
            Your cart is empty
          </p>
          <Link
            to="/mentoons-store"
            className="p-2 px-6 text-lg font-medium text-white transition-colors duration-300 rounded-full bg-primary hover:bg-primary-dark"
          >
            Visit our store to add some items!
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
