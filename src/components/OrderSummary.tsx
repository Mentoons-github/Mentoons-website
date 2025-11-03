import { fetchProductById } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ProductBase } from "@/types/productTypes";
import { ORDER_TYPE, ProductType } from "@/utils/enum";
import { useRewardActions } from "@/utils/rewardHelper";

import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

import { useRewards } from "@/hooks/useRewards";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// Define maximum discount limits per product type
const MAX_DISCOUNT_LIMITS = {
  [ProductType.MENTOONS_CARDS]: 20, // 20 rupees max discount
  [ProductType.MENTOONS_BOOKS]: 4, // 4 rupees max discount
  [ProductType.COMIC]: 4, // 4 rupees max discount
  [ProductType.AUDIO_COMIC]: 4, // 4 rupees max discount
  [ProductType.PODCAST]: 4, // 4 rupees max discount
  [ProductType.ASSESSMENT]: 3, // 3 rupees max discount
  DEFAULT: 4, // Default max discount
};

// Conversion rate: how many points = 1 rupee
const POINTS_TO_RUPEE_RATIO = 10;

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
  const { totalPoints } = useRewards();
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const { redeemPoints: handleRedeemPoints, rewardPurchaseProduct } =
    useRewardActions();

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

  // Calculate the maximum discount allowed based on product type
  const calculateMaxDiscount = () => {
    if (productDetail) {
      // For single product purchase
      return (
        MAX_DISCOUNT_LIMITS[productDetail.type] || MAX_DISCOUNT_LIMITS.DEFAULT
      );
    } else if (cart.items && cart.items.length > 0) {
      // For cart with multiple items, use the sum of max discounts per item
      return cart.items.reduce((total, item) => {
        const maxForItem =
          MAX_DISCOUNT_LIMITS[item.productType as keyof typeof ProductType] ||
          MAX_DISCOUNT_LIMITS.DEFAULT;
        return total + maxForItem;
      }, 0);
    }
    return 0;
  };

  // Maximum points the user can redeem based on their total points and the max discount
  const maxRedeemablePoints = Math.min(
    totalPoints,
    calculateMaxDiscount() * POINTS_TO_RUPEE_RATIO
  );

  // Calculate the discount amount based on points
  const calculateDiscountFromPoints = (points: number) => {
    return Math.min(points / POINTS_TO_RUPEE_RATIO, calculateMaxDiscount());
  };

  // Handle points redemption
  const handleApplyPoints = () => {
    if (redeemPoints <= 0) {
      toast.error("Please enter a valid number of points to redeem");
      return;
    }

    if (redeemPoints > totalPoints) {
      toast.error(`You only have ${totalPoints} points available`);
      return;
    }

    if (redeemPoints > maxRedeemablePoints) {
      toast.error(
        `You can only redeem up to ${maxRedeemablePoints} points for this purchase`
      );
      return;
    }

    const discount = calculateDiscountFromPoints(redeemPoints);
    setAppliedDiscount(discount);
    toast.success(`Discount of ₹${discount.toFixed(2)} applied`);
  };

  // Reset applied discount
  const handleRemoveDiscount = () => {
    setRedeemPoints(0);
    setAppliedDiscount(0);
    toast.success("Discount removed");
  };

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

  // Calculate the final amount after applying discount
  const calculateFinalAmount = () => {
    const originalTotal = productDetail
      ? productDetail.price
      : cart.totalPrice || 0;
    return Math.max(0, originalTotal - appliedDiscount);
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

    const totalAmount = calculateFinalAmount();

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
      // Add reward points details
      rewardPointsRedeemed: redeemPoints,
      discountApplied: appliedDiscount,
      // products: productIds,
      // Original payment gateway fields that might be needed
      orderId: formData.order_id,
    };

    console.log("order Data", orderData);

    try {
      console.log("Sending order data:", orderData);
      console.log("UserObjectClerk", user);
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/payment/initiate?type=downloads`,
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

      // If payment is successful, deduct the redeemed points
      if (redeemPoints > 0) {
        try {
          // Use the redeemPoints action from useRewardActions
          handleRedeemPoints(-redeemPoints, orderData.orderId);
          toast.success(`${redeemPoints} points redeemed successfully!`);
        } catch (error) {
          console.error("Error deducting reward points:", error);
        }
      }

      // Award points for purchase
      if (productDetail) {
        rewardPurchaseProduct(productDetail._id);
      }

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

        {/* Reward Points Redemption Section */}
        <motion.div
          className="p-6 mb-8 bg-white rounded-lg shadow-md"
          variants={itemVariants}
        >
          <h2 className="mb-4 text-2xl font-semibold text-black">
            Redeem Reward Points
          </h2>
          <div className="mb-4">
            <p className="mb-2 text-gray-600">
              Available Points:{" "}
              <span className="font-semibold">{totalPoints}</span>
            </p>
            <p className="mb-4 text-sm text-gray-500">
              {`You can redeem up to ${maxRedeemablePoints} points for a discount of ₹${(
                maxRedeemablePoints / POINTS_TO_RUPEE_RATIO
              ).toFixed(2)}`}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                min="0"
                max={maxRedeemablePoints}
                value={redeemPoints}
                onChange={(e) =>
                  setRedeemPoints(
                    Math.min(parseInt(e.target.value) || 0, maxRedeemablePoints)
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter points to redeem"
                disabled={appliedDiscount > 0}
              />
              {appliedDiscount === 0 ? (
                <button
                  onClick={handleApplyPoints}
                  className="px-4 py-2 text-white rounded-lg bg-primary hover:bg-primary-dark"
                >
                  Apply
                </button>
              ) : (
                <button
                  onClick={handleRemoveDiscount}
                  className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>

            {appliedDiscount > 0 && (
              <div className="p-3 mb-2 text-green-700 bg-green-100 rounded-md">
                <p>Discount applied: ₹{appliedDiscount.toFixed(2)}</p>
                <p className="text-sm">{redeemPoints} points redeemed</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="p-6 mb-8 bg-white rounded-lg shadow-md"
          variants={itemVariants}
        >
          <h2 className="mb-4 text-2xl font-semibold text-black">
            Payment Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>
                ₹ {productDetail ? productDetail.price : cart.totalPrice || 0}
              </span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Points Discount:</span>
                <span>-₹ {appliedDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 mt-2 text-xl font-bold border-t border-gray-200">
              <span>Total:</span>
              <span>₹ {calculateFinalAmount().toFixed(2)}</span>
            </div>
          </div>
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
        <NavLink to="/assessment-page">
          <img
            src="/assets/assesments/assessment/Assessment .png"
            alt="Order Illustration"
            className="w-full max-h-[500px] h-auto object-contain rounded-lg"
          />
        </NavLink>
      </motion.div>
    </motion.div>
  );
};

export default OrderSummary;
