import { fetchProductById } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ProductBase } from "@/types/productTypes";
import { ORDER_TYPE } from "@/utils/enum";

import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

const OrderSummary: React.FC = () => {
  const { cart } = useSelector((state: RootState) => state.cart);
  const { userId } = useAuth();
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const productId: string | null = new URLSearchParams(location.search).get(
    "productId"
  );
  const [productDetail, setProductDetail] = useState<ProductBase>();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productId) {
          const response = await dispatch(fetchProductById(productId));
          if (response.payload) {
            setProductDetail(response.payload as ProductBase);
          } else {
            console.error("Invalid product data received", response);
            toast.error("Failed to load product details");
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      }
    };

    fetchProduct();
  }, [productId, dispatch]);

  console.log("productDetail :", productDetail);

  const [formData] = useState({
    merchant_id: "3545043",
    order_id: `#ORD-${Date.now()}`,
    currency: "INR",
    amount: productDetail ? productDetail.price : cart.totalPrice,
    redirect_url: "https://www.mentoons.com/mentons-store",
    cancel_url: "https://www.mentoons.com/mentons-store",
    language: "EN",
    billing_name:
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.fullName || "",
    billing_address: "Santacruz",
    billing_city: "Mumbai",
    billing_state: "MH",
    billing_zip: "400054",
    billing_country: "India",
    billing_tel: user?.phoneNumbers?.[0]?.phoneNumber
      ? user.phoneNumbers[0].phoneNumber.replace(/^\+\d+\s*/, "") // Remove country code
      : "0123456789",
    billing_email: user?.emailAddresses?.[0]?.emailAddress || "",
    delivery_name:
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.fullName || "Sam",
    delivery_address: "Vile Parle",
    delivery_city: "Mumbai",
    delivery_state: "Maharashtra",
    delivery_zip: "400038",
    delivery_country: "India",
    delivery_tel: "0123456789",
    order_type: ORDER_TYPE.PRODUCT_PURCHASE,
    merchant_param1: "additional Info.",
    merchant_param2: "additional Info.",
    merchant_param3: "additional Info.",
    merchant_param4: "additional Info.",
    merchant_param5: "additional Info.",
    promo_code: "",
    userId,
  });
  // const navigate = useNavigate();

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

    const formattedItems = productDetail
      ? {
          product: productDetail._id,
          quantity: 1,
          price: productDetail.price,
          productName: productDetail.title,
          productType: productDetail.type,
        }
      : cart.items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          productName: item.title,
          productType: item.productType, // Default to merchandise if type is not specified
        }));

    const productInfo = productDetail
      ? `${productDetail.title} (1)`
      : cart.items.map((item) => `${item.title} (${item.quantity})`).join(", ");

    const totalAmount = productDetail
      ? productDetail.price
      : cart.totalPrice || 0;

    const orderData = {
      user: userId,
      items: formattedItems,
      paymentDetails: {
        paymentMethod: "credit_card", // Default payment method
        paymentStatus: "initiated",
      },
      orderStatus: "pending",
      totalAmount,
      amount: totalAmount, // Duplicate amount field as per schema
      currency: formData.currency,
      order_type: ORDER_TYPE.PRODUCT_PURCHASE,

      // Additional required fields from schema
      productInfo: productInfo,
      customerName: formData.billing_name,
      email: formData.billing_email,
      phone: formData.billing_tel,
      status: "PENDING",
      firstName: user?.firstName,
      lastName: user?.lastName,
      // products: productIds,
      // Original payment gateway fields that might be needed
      orderId: formData.order_id,
    };

    console.log("order Date", orderData);

    try {
      console.log("Sending order data:", orderData);
      console.log("UserObjectClerk", user);
      const response = await axios.post(
        "https://mentoons-backend-zlx3.onrender.com/api/v1/payment/initiate?type=downloads",
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

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = response.data;

      // Append the form to the body and submit it
      const form = tempDiv.querySelector("form");
      if (form) {
        document.body.appendChild(form);
        form.submit(); // Submit the form
      } else {
        console.error("Form not found in the response HTML.");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.message || "Failed to process payment. Please try again later."
      );
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-between max-w-6xl gap-10 p-4 mx-auto my-8 shadow-xl md:flex-row bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:p-6 md:p-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="w-full md:w-1/2">
        <motion.h1
          className="mb-8 text-3xl font-bold text-center text-black sm:text-4xl"
          variants={itemVariants}
        >
          Order Summary
        </motion.h1>

        <motion.div
          className="p-6 mb-8 bg-white rounded-lg shadow-md"
          variants={itemVariants}
        >
          <h2 className="mb-4 text-2xl font-semibold text-black">
            {productDetail ? "Review Your Purchase" : "Cart Products"}
          </h2>
          {productDetail ? (
            <motion.div
              className="flex items-center justify-between p-3 transition-colors border border-gray-100 rounded-lg hover:bg-gray-50"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex items-center justify-center w-10 h-10 font-medium text-white rounded-full order"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {productDetail.productImages ? (
                    <img
                      src={productDetail?.productImages?.[0]?.imageUrl}
                      alt={productDetail.title}
                      className="object-cover w-12 h-12 rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
                      ?
                    </div>
                  )}
                </motion.div>
                <span className="text-lg text-black">
                  {productDetail.title}
                </span>
              </div>
              <span className="text-lg font-semibold text-black whitespace-nowrap">
                ₹ {productDetail.price}
              </span>
            </motion.div>
          ) : cart.items && cart.items.length > 0 ? (
            <ul className="space-y-3">
              {cart.items.map((item, index) => (
                <motion.li
                  key={item.productId}
                  className="flex items-center justify-between p-3 transition-colors border border-gray-100 rounded-lg hover:bg-gray-50"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="flex items-center justify-center w-10 h-10 font-medium text-white rounded-full order"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.title}
                          className="object-cover w-12 h-12 rounded-lg"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
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
              className="py-6 text-lg text-center text-gray-600"
              variants={itemVariants}
            >
              Your cart is empty.
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="p-6 mb-8 bg-white rounded-lg shadow-md"
          variants={itemVariants}
        >
          <h2 className="mb-4 text-2xl font-semibold text-black">Subtotal</h2>
          <motion.p
            className="text-2xl font-bold text-black"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ yoyo: Infinity, duration: 1.5 }}
          >
            ₹ {productDetail ? productDetail.price : cart.totalPrice || 0}
          </motion.p>
        </motion.div>

        <motion.button
          onClick={handleProceedToPay}
          type="button"
          className="w-full px-5 py-4 text-lg font-medium text-white bg-black rounded-lg shadow-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          Proceed to Pay
        </motion.button>
      </motion.div>

      <motion.div
        className="flex items-center justify-center hidden md:block md:w-1/2"
        variants={itemVariants}
      >
        <img
          src="/assets/store/orderSummary/Instruction.png"
          alt="Order Illustration"
          className="w-full h-auto rounded-lg"
        />
      </motion.div>
    </motion.div>
  );
};

export default OrderSummary;
