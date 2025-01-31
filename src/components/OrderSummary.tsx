import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderSummary: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useSelector((state: RootState) => state.cart);
  console.log("cartSlice", cart);

  const handleCheckout = () => {
    navigate("/payment");
  };

  return (
    <div className="p-10 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-center text-black">
        Order Summary
        <p></p>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Shipping Address
          </h2>
          <p className="text-lg text-black">John Doe</p>
          <p className="text-lg text-black">123 Main St</p>
          <p className="text-lg text-black">City, State, ZIP</p>
          <p className="text-lg text-black">Country</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Billing Address
          </h2>
          <p className="text-lg text-black">John Doe</p>
          <p className="text-lg text-black">123 Main St</p>
          <p className="text-lg text-black">City, State, ZIP</p>
          <p className="text-lg text-black">Country</p>
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          Cart Products
        </h2>
        {cart.items.length > 0 ? (
          <ul className="list-disc pl-5">
            {cart.items.map((item) => (
              <li
                key={item.productId._id}
                className="flex justify-between mb-4 border-b pb-2 text-black"
              >
                <span className="text-lg">{item.productId.productTitle}</span>
                <span className="text-lg">₹ {item.price}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-black">Your cart is empty.</p>
        )}
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-black">Subtotal</h2>
        <p className="text-lg text-black">₹ {cart.totalPrice}</p>
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          Delivery Status
        </h2>
        <p className="text-lg text-black">Pending</p>{" "}
        {/* Adjust based on your delivery status logic */}
      </div>

      <button
        onClick={handleCheckout}
        className="w-full px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
