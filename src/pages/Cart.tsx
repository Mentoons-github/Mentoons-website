import ProductCard from "@/components/MentoonsStore/ProductCard";
import { getAllProducts } from "@/redux/cardProductSlice";
import { getCart } from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartItemCard from "../components/MentoonsStore/CartItemCard";
const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { getToken, userId } = useAuth();

  const { cart, loading, error } = useSelector(
    (state: RootState) => state.cart
  );
  const { cardProducts } = useSelector((state: RootState) => state.cardProduct);

  const handleCheckout = () => {
    navigate("/order-summary");
  };

  useEffect(() => {
    const fetchCart = async () => {
      const token = await getToken();
      if (token && userId) {
        dispatch(getCart({ token, userId }));
        const response = await dispatch(
          getAllProducts({ search: "", filtercategory: "" })
        );
        console.log("Response", response.payload);
      }
    };
    fetchCart();
  }, [dispatch, getToken, userId, cart.totalItemCount]);

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
    <div className=" p-10 lg:py-20 space-y-10 md:w-[90%] mx-auto  ">
      <div className="pb-3 text-start ">
        <div className="text-5xl lg:text-7xl w-full  border-b-4 border-black font-extrabold leading-[1.10] pb-4">
          Checkout Your Cart
        </div>
      </div>

      {error || cart?.items?.length > 0 ? (
        <div className="flex flex-wrap gap-4 bg-transparent ">
          <div className="flex flex-col w-full gap-4 lg:flex-row-reverse">
            <div className="w-full lg:w-[40%] flex flex-col items-start justify-between rounded-3xl border-4 bg-white shadow-xl h-fit text-2xl font-semibold p-4">
              <div className="w-full text-lg ">
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-gray-600">
                    Subtotal
                  </span>
                  <span>₹{cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{cart.totalPrice.toFixed(2)}</span>
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
              {cart.items && cart.items.length > 0 ? (
                cart.items.map((item) => {
                  // Ensure product data exists before rendering
                  if (item.productId && item.productId._id) {
                    return (
                      <CartItemCard
                        key={item.productId._id + "_" + Date.now()} // Add timestamp to ensure unique key
                        cartItem={{
                          ...item,
                          productId: {
                            ...item.productId,
                            productImages:
                              item?.productId?.productImage[0].imageSrc || "", // Handle missing productImages
                          },
                        }}
                      />
                    );
                  }
                  return null; // Skip rendering if product data is incomplete
                })
              ) : (
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                  <p className="text-xl font-semibold md:text-4xl ">
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
            <h2 className="mb-8 text-4xl font-semibold">People also bought</h2>

            <div className="flex flex-wrap gap-4">
              {cardProducts?.length > 0 ? (
                cardProducts.map((product) => (
                  <ProductCard key={product._id} productDetails={product} />
                ))
              ) : (
                <div>No Product found</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <p className="text-xl font-semibold md:text-4xl ">
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
