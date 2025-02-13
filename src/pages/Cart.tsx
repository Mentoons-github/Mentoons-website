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
    (state: RootState) => state.cart,
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
          getAllProducts({ search: "", filtercategory: "" }),
        );
        console.log("Response", response.payload);
      }
    };
    fetchCart();
  }, [dispatch, getToken, userId, cart.totalItemCount]);

  if (loading) {
    return (
      <div className="p-10 lg:py-20 space-y-10 md:w-[90%] mx-auto animate-pulse">
        <div className="h-20 bg-gray-200 rounded-lg w-1/2 mb-10"></div>
        <div className="flex gap-4 flex-wrap">
          <div className="w-full flex flex-col lg:flex-row-reverse gap-4">
            <div className="w-full lg:w-[40%] h-48 bg-gray-200 rounded-3xl"></div>
            <div className="w-full flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full h-32 bg-gray-200 rounded-xl"
                ></div>
              ))}
            </div>
          </div>
          <div className="w-full mt-4">
            <div className="h-12 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-64 h-72 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-10 lg:py-20 space-y-10 md:w-[90%] mx-auto  ">
      <div className="text-start pb-3 ">
        <div className="text-5xl lg:text-7xl w-full  border-b-4 border-black font-extrabold leading-[1.10] pb-4">
          Checkout Your Cart
        </div>
      </div>

      {error || cart?.items?.length > 0 ? (
        <div className="flex gap-4 bg-transparent flex-wrap ">
          <div className="w-full flex flex-col lg:flex-row-reverse gap-4">
            <div className="w-full lg:w-[40%] flex flex-col items-start justify-between rounded-3xl border-4 bg-white shadow-xl h-fit text-2xl font-semibold p-4">
              <div className=" text-lg w-full">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-lg font-medium">
                    Subtotal
                  </span>
                  <span>₹{cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{cart.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors text-lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
            <div className="w-full flex flex-col gap-4 items-center">
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
                              item?.productId?.productImages[0].imageSrc || [], // Handle missing productImages
                          },
                        }}
                      />
                    );
                  }
                  return null; // Skip rendering if product data is incomplete
                })
              ) : (
                <div className="text-center flex flex-col items-center justify-center gap-6">
                  <p className="text-xl md:text-4xl font-semibold ">
                    Your cart is empty
                  </p>
                  <Link
                    to="/mentoons-store"
                    className="text-white bg-primary p-2 px-6 rounded-full text-lg font-medium  hover:bg-primary-dark transition-colors duration-300"
                  >
                    Visit our store to add some items!
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className=" mt-4 p-4 w-full  ">
            <h2 className="text-4xl font-semibold mb-8">People also bought</h2>

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
        <div className="text-center flex flex-col items-center justify-center gap-6">
          <p className="text-xl md:text-4xl font-semibold ">
            Your cart is empty
          </p>
          <Link
            to="/mentoons-store"
            className="text-white bg-primary p-2 px-6 rounded-full text-lg font-medium  hover:bg-primary-dark transition-colors duration-300"
          >
            Visit our store to add some items!
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
