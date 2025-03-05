import { RootState } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

const OrderSummary: React.FC = () => {
  const { cart } = useSelector((state: RootState) => state.cart);
  const { userId } = useAuth();
  const [formData, setFormData] = useState({
    merchant_id: "3545043",
    order_id: `#ORD-${Date.now()}`,
    currency: "INR",
    amount: cart.totalPrice,
    redirect_url: "https://www.mentoons.com/mentons-store",
    cancel_url: "https://www.mentoons.com/mentons-store",
    language: "EN",
    billing_name: "Peter",
    billing_address: "Santacruz",
    billing_city: "Mumbai",
    billing_state: "MH",
    billing_zip: "400054",
    billing_country: "India",
    billing_tel: "9876543210",
    billing_email: "testing@domain.com",
    delivery_name: "Sam",
    delivery_address: "Vile Parle",
    delivery_city: "Mumbai",
    delivery_state: "Maharashtra",
    delivery_zip: "400038",
    delivery_country: "India",
    delivery_tel: "0123456789",
    merchant_param1: "additional Info.",
    merchant_param2: "additional Info.",
    merchant_param3: "additional Info.",
    merchant_param4: "additional Info.",
    merchant_param5: "additional Info.",
    promo_code: "",
    userId,
  });
  // const navigate = useNavigate();

  console.log("OrderSummary -> cart", cart);
  const { getToken } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const handleProceedToPay = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const token = await getToken();

    // Format cart items to match the orderItemSchema
    const formattedItems = cart.items.map((item) => ({
      product: item.productId, // Assuming productId maps to MongoDB _id
      quantity: item.quantity,
      price: item.price,
      productName: item.title,
      productType: item.productType || "merchandise", // Default to merchandise if type is not specified
    }));

    // Concatenate product names for product info
    const productInfo = cart.items
      .map((item) => `${item.title} (${item.quantity})`)
      .join(", ");

    // Prepare complete order data according to the backend schema
    const orderData = {
      user: userId,
      items: formattedItems,
      paymentDetails: {
        paymentMethod: "credit_card", // Default payment method
        paymentStatus: "initiated",
      },
      orderStatus: "pending",
      totalAmount: cart.totalPrice,
      amount: cart.totalPrice, // Duplicate amount field as per schema
      currency: formData.currency,

      // Additional required fields from schema
      productInfo: productInfo,
      customerName: formData.billing_name,
      email: formData.billing_email,
      phone: formData.billing_tel,
      status: "PENDING",

      // Original payment gateway fields that might be needed
      orderId: formData.order_id,
      redirectUrl: formData.redirect_url,
      cancelUrl: formData.cancel_url,
      merchantId: formData.merchant_id,
    };

    try {
      console.log("Sending order data:", orderData);
      const response = await axios.post(
        "http://localhost:4000/api/v1/payment/initiate",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response", response);
      console.log("response.data", response.data);
      // Assuming the response contains the HTML string for the form
      // const formHtml = response.data; // This should be the HTML string

      // // Create a temporary container to hold the form HTML
      // const tempDiv = document.createElement("div");
      // tempDiv.innerHTML = formHtml;

      // // Append the form to the body and submit it
      // const form = tempDiv.querySelector("form");
      // if (form) {
      //   document.body.appendChild(form);
      //   form.submit(); // Submit the form
      // } else {
      //   console.error("Form not found in the response HTML.");
      // }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <motion.div
      className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl my-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl sm:text-4xl font-bold mb-8 text-center text-black"
        variants={itemVariants}
      >
        Order Summary
      </motion.h1>

      <motion.div
        className="mb-8 p-6 bg-white rounded-lg shadow-md"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-semibold mb-4 text-black">
          Cart Products
        </h2>
        {cart.items && cart.items.length > 0 ? (
          <ul className="space-y-3">
            {cart.items.map((item, index) => (
              <motion.li
                key={item.productId}
                className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-full order text-white flex items-center justify-center font-medium"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        {index + 1}
                      </div>
                    )}
                  </motion.div>
                  <span className="text-lg text-black">
                    {item.title} x {item.quantity}
                  </span>
                </div>
                <span className="text-lg font-semibold text-black whitespace-nowrap">
                  ₹ {item.price}
                </span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <motion.p
            className="text-lg text-gray-600 text-center py-6"
            variants={itemVariants}
          >
            Your cart is empty.
          </motion.p>
        )}
      </motion.div>

      <motion.div
        className="mb-8 p-6 bg-white rounded-lg shadow-md"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-semibold mb-4 text-black">Subtotal</h2>
        <motion.p
          className="text-2xl text-black font-bold"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ yoyo: Infinity, duration: 1.5 }}
        >
          ₹ {cart.totalPrice || 0}
        </motion.p>
      </motion.div>

      <motion.button
        onClick={handleProceedToPay}
        type="button"
        className="w-full px-5 py-4 bg-black text-white rounded-lg font-medium text-lg shadow-lg"
        variants={itemVariants}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        Proceed to Pay
      </motion.button>
    </motion.div>
  );
};

export default OrderSummary;
