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
// NavLink is only used by the (currently commented-out) assessment image
// import { NavLink, useLocation } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { fetchCandyCoin, spendCandyCoin } from "@/api/game/mentoonsCoin";
import { CandyCoins } from "@/types/adda/game/candyCoins";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { api } from "@/api/axiosInstance/axiosInstance";

const MAX_DISCOUNT_LIMITS = {
  [ProductType.MENTOONS_CARDS]: 20,
  [ProductType.MENTOONS_BOOKS]: 4,
  [ProductType.COMIC]: 4,
  [ProductType.AUDIO_COMIC]: 4,
  [ProductType.PODCAST]: 4,
  [ProductType.ASSESSMENT]: 3,
  DEFAULT: 4,
};

const MAX_CANDY_DISCOUNT_RUPEE = 5;
const CANDY_TO_RUPEE_RATIO = 0.75 / 1000;
const POINTS_TO_RUPEE_RATIO = 10;

// NEW: returns the price that should actually be charged.
// For toonland products, use offerPrice if it exists; otherwise fall back to price.
const getPayablePrice = (
  price: number,
  offerPrice: number | undefined | null,
  productType?: string,
) => {
  if (
    productType === ProductType.TOONLAND &&
    offerPrice !== undefined &&
    offerPrice !== null &&
    offerPrice >= 0
  ) {
    return offerPrice;
  }
  return price;
};

// Small presentational helper for the section headings (design only)
const SectionHeading: React.FC<{
  icon: string;
  title: string;
  tone: string;
}> = ({ icon, title, tone }) => (
  <div className="flex items-center gap-3 mb-5">
    <span
      className={`flex items-center justify-center w-10 h-10 text-xl rounded-xl ${tone}`}
    >
      {icon}
    </span>
    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
  </div>
);

const OrderSummary: React.FC = () => {
  const { cart } = useSelector((state: RootState) => state.cart);
  const { userId } = useAuth();
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId: string | null = searchParams.get("productId");
  const comboKey: string | null = searchParams.get("combo");

  const [productDetail, setProductDetail] = useState<ProductBase>();

  const { totalPoints } = useRewards();
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [coins, setCoins] = useState<CandyCoins | null>(null);
  const { redeemPoints: handleRedeemPoints, rewardPurchaseProduct } =
    useRewardActions();

  const { showStatus } = useStatusModal();

  const [redeemCandyCoins, setRedeemCandyCoins] = useState(0);
  const [appliedCandyDiscount, setAppliedCandyDiscount] = useState(0);

  const maxRedeemableCandyCoins = coins
    ? Math.min(
        coins.currentCoins,
        MAX_CANDY_DISCOUNT_RUPEE / CANDY_TO_RUPEE_RATIO,
      )
    : 0;

  const calculateDiscountFromCandy = (coinAmount: number) => {
    const discount = coinAmount * CANDY_TO_RUPEE_RATIO;
    return Math.min(discount, MAX_CANDY_DISCOUNT_RUPEE);
  };

  const handleApplyCandyCoins = () => {
    if (redeemCandyCoins <= 0) {
      toast.error("Enter valid candy coins");
      return;
    }

    if (!coins || redeemCandyCoins > coins.currentCoins) {
      toast.error("Not enough Candy Coins");
      return;
    }

    if (redeemCandyCoins > maxRedeemableCandyCoins) {
      toast.error(
        `You can redeem only up to ${Math.floor(maxRedeemableCandyCoins)} coins`,
      );
      return;
    }

    const discount = calculateDiscountFromCandy(redeemCandyCoins);
    setAppliedCandyDiscount(discount);
    toast.success(`₹${discount.toFixed(2)} Candy Coin discount applied`);
  };

  const handleRemoveCandyDiscount = () => {
    setRedeemCandyCoins(0);
    setAppliedCandyDiscount(0);
    toast.success("Candy Coin discount removed");
  };

  useEffect(() => {
    fetchUserCandyCoins();
  }, []);

  const fetchUserCandyCoins = async () => {
    try {
      const token = await getToken();
      const response = await fetchCandyCoin(token!);
      setCoins(response.candyCoins);
    } catch (error) {
      showStatus(
        "error",
        (error as string) ||
          "Error takin coins, Please try again after sometimes",
      );
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const response = await dispatch(fetchProductById(productId));
        if (response.payload) {
          setProductDetail(response.payload as ProductBase);
        } else {
          console.error("Invalid product data received", response);
          toast.error("Failed to load product details");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      }
    };

    fetchProduct();
  }, [productId, dispatch]);

  useEffect(() => {
    if (!comboKey) return;
    let active = true;
    api
      .get(`/combo/combos/${comboKey}`)
      .then((res) => {
        if (!active) return;
        const c = res.data?.data;
        setProductDetail({
          _id: c._id,
          title: c.title,
          price: c.price,
          type: "combo",
          productImages: c.productImages,
        } as unknown as ProductBase);
      })
      .catch((error) => {
        console.error("Error fetching combo:", error);
        toast.error("Failed to load combo details");
      });
    return () => {
      active = false;
    };
  }, [comboKey]);

  // NEW: payable price for the single-product flow
  const productPayablePrice = productDetail
    ? getPayablePrice(
        productDetail.price,
        (productDetail as any).offerPrice,
        productDetail.type,
      )
    : 0;

  // NEW: subtotal that respects toonland offer pricing for both flows
  const calculateSubtotal = () => {
    if (productDetail) {
      return productPayablePrice;
    }
    if (cart.items && cart.items.length > 0) {
      return cart.items.reduce((sum, item) => {
        const payable = getPayablePrice(
          item.price,
          (item as any).offerPrice,
          item.productType,
        );
        return sum + payable * (item.quantity || 1);
      }, 0);
    }
    return 0;
  };

  const calculateMaxDiscount = () => {
    if (productDetail) {
      return (
        MAX_DISCOUNT_LIMITS[productDetail.type] || MAX_DISCOUNT_LIMITS.DEFAULT
      );
    } else if (cart.items && cart.items.length > 0) {
      return cart.items.reduce((total, item) => {
        const maxForItem =
          MAX_DISCOUNT_LIMITS[item.productType as keyof typeof ProductType] ||
          MAX_DISCOUNT_LIMITS.DEFAULT;
        return total + maxForItem;
      }, 0);
    }
    return 0;
  };

  const maxRedeemablePoints = Math.min(
    totalPoints,
    calculateMaxDiscount() * POINTS_TO_RUPEE_RATIO,
  );

  const calculateDiscountFromPoints = (points: number) => {
    return Math.min(points / POINTS_TO_RUPEE_RATIO, calculateMaxDiscount());
  };

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
        `You can only redeem up to ${maxRedeemablePoints} points for this purchase`,
      );
      return;
    }

    const discount = calculateDiscountFromPoints(redeemPoints);
    setAppliedDiscount(discount);

    toast.success(`Discount of ₹${discount.toFixed(2)} applied`);
  };

  const handleRemoveDiscount = () => {
    setRedeemPoints(0);
    setAppliedDiscount(0);
    toast.success("Discount removed");
  };

  const { getToken } = useAuth();

  const [formData] = useState({
    merchant_id: "3545043",
    order_id: `#ORD-${Date.now()}`,
    currency: "INR",
    amount: productDetail ? productPayablePrice : cart.totalPrice,
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
      ? user.phoneNumbers[0].phoneNumber.replace(/^\+\d+\s*/, "")
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

  // Final amount now built on top of the offer-price-aware subtotal
  const calculateFinalAmount = () => {
    const originalTotal = calculateSubtotal();
    return Math.max(0, originalTotal - appliedDiscount - appliedCandyDiscount);
  };

  const handleProceedToPay = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const token = await getToken();

    const formattedItems = productDetail
      ? {
          product: productDetail._id,
          quantity: 1,
          price: productPayablePrice, // offer price for toonland
          productName: productDetail.title,
          productType: productDetail.type,
          source: "mentoons",
          productImage:
            (productDetail as any).thumbnails?.[0] ??
            productDetail.productImages?.[0]?.imageUrl,
          fileUrl: (productDetail as any).data,
        }
      : cart.items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          price: getPayablePrice(
            item.price,
            (item as any).offerPrice,
            item.productType,
          ), // offer price for toonland
          productName: item.title,
          productType: item.productType,
          source: "mentoons",
          productImage: item.productImage,
          fileUrl:
            item.productType === "toonland"
              ? (item.productDetails as { fileUrl?: string } | undefined)
                  ?.fileUrl
              : undefined,
        }));

    const productInfo = productDetail
      ? `${productDetail.title} (1)`
      : cart.items.map((item) => `${item.title} (${item.quantity})`).join(", ");

    const totalAmount = calculateFinalAmount();

    const orderData = {
      user: userId,
      items: formattedItems,
      paymentDetails: {
        paymentMethod: "credit_card",
        paymentStatus: "initiated",
      },
      orderStatus: "pending",
      totalAmount,
      amount: totalAmount,
      currency: formData.currency,
      order_type: ORDER_TYPE.PRODUCT_PURCHASE,

      productInfo: productInfo,
      customerName: formData.billing_name,
      email: formData.billing_email,
      phone: formData.billing_tel,
      status: "PENDING",
      firstName: user?.firstName,
      lastName: user?.lastName,
      rewardPointsRedeemed: redeemPoints,
      discountApplied: appliedDiscount,
      orderId: formData.order_id,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/payment/initiate?type=downloads`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (redeemPoints > 0) {
        try {
          handleRedeemPoints(-redeemPoints, orderData.orderId);
          toast.success(`${redeemPoints} points redeemed successfully!`);
        } catch (error) {
          console.error("Error deducting reward points:", error);
        }
      }

      if (redeemCandyCoins > 0) {
        try {
          if (!token) {
            return;
          }
          await spendCandyCoin(
            token,
            redeemCandyCoins,
            `Redeem coin for buy porduct : ${productId ?? comboKey}`,
          );

          toast.success(`${redeemCandyCoins} Candy Coins redeemed!`);
        } catch (error) {
          console.error("Candy coin deduction failed:", error);
          toast.error("Candy coin update failed");
        }
      }

      if (productDetail && (productDetail.type as string) !== "combo") {
        rewardPurchaseProduct(productDetail._id);
      }

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = response.data;

      const form = tempDiv.querySelector("form");
      if (form) {
        document.body.appendChild(form);
        form.submit();
      } else {
        console.error("Form not found in the response HTML.");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.message || "Failed to process payment. Please try again later.",
      );
    }
  };

  /* ====================== DESIGN ONLY BELOW THIS LINE ====================== */
  return (
    <motion.div
      className="max-w-6xl p-4 mx-auto my-8 border border-white shadow-xl bg-gradient-to-br from-indigo-50 via-white to-amber-50 rounded-3xl sm:p-6 md:p-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="mb-8 text-3xl font-extrabold text-center sm:text-4xl text-slate-900"
        variants={itemVariants}
      >
        Order Summary
      </motion.h1>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* ---------------- LEFT: items + rewards ---------------- */}
        <motion.div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <motion.div
            className="p-5 bg-white border shadow-sm sm:p-6 border-slate-200 rounded-2xl"
            variants={itemVariants}
          >
            <SectionHeading
              icon="🛍️"
              title={productDetail ? "Review Your Purchase" : "Cart Products"}
              tone="bg-indigo-100"
            />
            {productDetail ? (
              <motion.div
                className="flex items-center justify-between gap-3 p-3 transition-all border border-slate-100 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {productDetail.productImages ? (
                      <img
                        src={productDetail?.productImages?.[0]?.imageUrl}
                        alt={productDetail.title}
                        className="object-cover w-16 h-16 shadow rounded-xl ring-2 ring-white"
                      />
                    ) : (productDetail as any).thumbnails?.[0] ? (
                      <img
                        src={(productDetail as any).thumbnails[0]}
                        alt={productDetail.title}
                        className="object-cover w-16 h-16 shadow rounded-xl ring-2 ring-white"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-16 h-16 font-bold bg-slate-200 text-slate-500 rounded-xl">
                        ?
                      </div>
                    )}
                  </motion.div>
                  <span className="text-base font-semibold sm:text-lg text-slate-800">
                    {productDetail.title}
                  </span>
                </div>

                {/* Show offer price for toonland, strike through original when it differs */}
                <span className="flex flex-col items-end text-lg font-bold sm:flex-row sm:items-center sm:gap-2 text-slate-900 whitespace-nowrap">
                  {productDetail.type === ProductType.TOONLAND &&
                  productPayablePrice !== productDetail.price ? (
                    <>
                      <span className="text-sm font-medium line-through text-slate-400">
                        ₹ {productDetail.price}
                      </span>
                      <span className="px-3 py-1 rounded-full text-emerald-700 bg-emerald-100">
                        ₹ {productPayablePrice}
                      </span>
                    </>
                  ) : (
                    <span>₹ {productPayablePrice}</span>
                  )}
                </span>
              </motion.div>
            ) : cart.items && cart.items.length > 0 ? (
              <ul className="space-y-3">
                {cart.items.map((item, index) => {
                  const itemPayablePrice = getPayablePrice(
                    item.price,
                    (item as any).offerPrice,
                    item.productType,
                  );
                  const isToonlandOffer =
                    item.productType === ProductType.TOONLAND &&
                    itemPayablePrice !== item.price;

                  return (
                    <motion.li
                      key={item.productId}
                      className="flex items-center justify-between gap-3 p-3 transition-all border border-slate-100 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="flex-shrink-0"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.title}
                              className="object-cover w-16 h-16 shadow rounded-xl ring-2 ring-white"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-16 h-16 font-bold bg-slate-200 text-slate-500 rounded-xl">
                              {index + 1}
                            </div>
                          )}
                        </motion.div>
                        <span className="text-base font-semibold sm:text-lg text-slate-800">
                          {item.title} x {item.quantity}
                        </span>
                      </div>

                      <span className="flex flex-col items-end text-lg font-bold sm:flex-row sm:items-center sm:gap-2 text-slate-900 whitespace-nowrap">
                        {isToonlandOffer ? (
                          <>
                            <span className="text-sm font-medium line-through text-slate-400">
                              ₹ {item.price}
                            </span>
                            <span className="px-3 py-1 rounded-full text-emerald-700 bg-emerald-100">
                              ₹ {itemPayablePrice}
                            </span>
                          </>
                        ) : (
                          <span>₹ {itemPayablePrice}</span>
                        )}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            ) : (
              <motion.p
                className="py-8 text-lg text-center border-2 border-dashed text-slate-500 border-slate-200 rounded-2xl"
                variants={itemVariants}
              >
                Your cart is empty.
              </motion.p>
            )}
          </motion.div>

          {/* Reward Points Redemption Section */}
          <motion.div
            className="p-5 bg-white border shadow-sm sm:p-6 border-slate-200 rounded-2xl"
            variants={itemVariants}
          >
            <SectionHeading
              icon="🎁"
              title="Redeem Reward Points"
              tone="bg-violet-100"
            />
            <div>
              <div className="flex items-center justify-between px-4 py-3 mb-3 bg-violet-50 rounded-xl">
                <span className="text-slate-600">Available Points:</span>
                <span className="text-lg font-extrabold text-violet-700">
                  {totalPoints}
                </span>
              </div>
              <p className="mb-4 text-sm text-slate-500">
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
                      Math.min(
                        parseInt(e.target.value) || 0,
                        maxRedeemablePoints,
                      ),
                    )
                  }
                  className="w-full px-4 py-3 transition border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-400 disabled:bg-slate-100"
                  placeholder="Enter points to redeem"
                  disabled={appliedDiscount > 0}
                />
                {appliedDiscount === 0 ? (
                  <button
                    onClick={handleApplyPoints}
                    className="px-6 py-3 font-semibold text-white transition shadow bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95"
                  >
                    Apply
                  </button>
                ) : (
                  <button
                    onClick={handleRemoveDiscount}
                    className="px-6 py-3 font-semibold text-white transition bg-red-500 shadow rounded-xl hover:bg-red-600 active:scale-95"
                  >
                    Remove
                  </button>
                )}
              </div>

              {appliedDiscount > 0 && (
                <div className="p-4 mb-2 border-l-4 text-emerald-800 bg-emerald-50 border-emerald-500 rounded-xl">
                  <p className="font-semibold">
                    Discount applied: ₹{appliedDiscount.toFixed(2)}
                  </p>
                  <p className="text-sm">{redeemPoints} points redeemed</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Candy Coins */}
          <motion.div
            className="p-5 bg-white border shadow-sm sm:p-6 border-slate-200 rounded-2xl"
            variants={itemVariants}
          >
            <SectionHeading
              icon="🍬"
              title="Redeem Candy Coins"
              tone="bg-amber-100"
            />

            <div className="flex items-center justify-between px-4 py-3 mb-3 bg-amber-50 rounded-xl">
              <span className="text-slate-600">Available Candy Coins:</span>
              <span className="text-lg font-extrabold text-amber-700">
                {coins?.currentCoins || 0}
              </span>
            </div>

            <p className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full text-slate-600 bg-slate-100">
              Max Discount: ₹5 • 1000 Coins = ₹0.75
            </p>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                min="0"
                max={Math.floor(maxRedeemableCandyCoins)}
                value={redeemCandyCoins}
                onChange={(e) =>
                  setRedeemCandyCoins(
                    Math.min(+e.target.value || 0, maxRedeemableCandyCoins),
                  )
                }
                disabled={appliedCandyDiscount > 0}
                className="w-full px-4 py-3 transition border outline-none border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 disabled:bg-slate-100"
                placeholder="Enter candy coins"
              />

              {appliedCandyDiscount === 0 ? (
                <button
                  onClick={handleApplyCandyCoins}
                  className="px-6 py-3 font-semibold text-white transition shadow bg-amber-500 rounded-xl hover:bg-amber-600 active:scale-95"
                >
                  Apply
                </button>
              ) : (
                <button
                  onClick={handleRemoveCandyDiscount}
                  className="px-6 py-3 font-semibold text-white transition bg-red-500 shadow rounded-xl hover:bg-red-600 active:scale-95"
                >
                  Remove
                </button>
              )}
            </div>

            {appliedCandyDiscount > 0 && (
              <div className="p-4 font-semibold border-l-4 text-emerald-800 bg-emerald-50 border-emerald-500 rounded-xl">
                ₹{appliedCandyDiscount.toFixed(2)} discount using{" "}
                {redeemCandyCoins} coins
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* ---------------- RIGHT: receipt + pay ---------------- */}
        <motion.aside
          className="p-6 text-white shadow-2xl lg:sticky lg:top-6 bg-slate-900 rounded-3xl"
          variants={itemVariants}
        >
          <h2 className="mb-5 text-xl font-bold sm:text-2xl">
            Payment Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">Subtotal:</span>
              <span className="font-semibold">
                ₹ {calculateSubtotal().toFixed(2)}
              </span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-300">
                <span>Points Discount:</span>
                <span>-₹ {appliedDiscount.toFixed(2)}</span>
              </div>
            )}
            {appliedCandyDiscount > 0 && (
              <div className="flex justify-between text-emerald-300">
                <span>Candy Coin Discount:</span>
                <span>-₹ {appliedCandyDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-4 mt-4 border-t-2 border-dashed border-slate-600">
              <div className="flex items-end justify-between">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-3xl font-extrabold text-amber-300">
                  ₹ {calculateFinalAmount().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleProceedToPay}
            type="button"
            className="w-full px-5 py-4 mt-6 text-lg font-bold shadow-lg bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-2xl"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            Proceed to Pay
          </motion.button>
          <p className="mt-3 text-xs text-center text-slate-400">
            🔒 Secure checkout
          </p>
        </motion.aside>
      </div>

      {/* Assessment image — commented out
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
      */}
    </motion.div>
  );
};

export default OrderSummary;
