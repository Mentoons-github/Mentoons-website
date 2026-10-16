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

/*
  Comic theme tokens (shared with the Cart page)
  page   #FFFFFF   white background
  ink    #000      outlines + hard shadows
  yellow #FFD93B   summary panel / badges
  red    #FF4D3D   primary action
  blue   #2D6BFF   secondary accents
  mint   #BDF5D0   success / offer price

  Mobile (< lg): thinner borders, smaller shadows, no tilt, sticky pay bar.
  Desktop (lg+): tilted summary card pinned on the right.
*/
const comicCss = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700;900&display=swap');

.comic-page { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; background: #fff; color: #000; }
.comic-title { font-family: 'Bangers', 'Impact', sans-serif; letter-spacing: 0.04em; }

.comic-panel { border: 3px solid #000; box-shadow: 4px 4px 0 #000; }
.comic-btn {
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
  transition: transform 0.08s ease, box-shadow 0.08s ease;
}
.comic-btn:active { transform: translate(3px, 3px); box-shadow: 0 0 0 #000; }
.comic-btn:focus-visible { outline: 4px dashed #2D6BFF; outline-offset: 3px; }

.comic-input { border: 3px solid #000; }
.comic-input:focus { outline: 4px dashed #2D6BFF; outline-offset: 2px; }
.comic-input:disabled { background: #e5e5e5; }

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

@media (prefers-reduced-motion: reduce) {
  .comic-pop { animation: none; }
  .comic-btn { transition: none; }
}
`;

// Small presentational helper for the section headings (design only)
const SectionHeading: React.FC<{
  icon: string;
  title: string;
  tone: string;
}> = ({ icon, title, tone }) => (
  <div className="mb-5 flex items-center gap-3">
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px] border-black text-xl shadow-[3px_3px_0_#000] ${tone}`}
    >
      {icon}
    </span>
    <h2 className="comic-title text-3xl leading-none text-black sm:text-4xl">
      {title}
    </h2>
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
  const itemCount = productDetail ? 1 : cart.items?.length || 0;

  return (
    <div className="comic-page min-h-screen">
      <style>{comicCss}</style>

      <motion.div
        className="mx-auto max-w-6xl p-4 pb-32 md:p-10 md:pb-36 lg:py-12 lg:pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="comic-title mb-8 border-b-4 border-black pb-3 text-center text-5xl leading-[1.05] text-[#FFD93B] [text-shadow:3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000] sm:text-6xl lg:mb-10 lg:border-b-8 lg:pb-4 lg:text-8xl lg:[text-shadow:4px_4px_0_#000,-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000]"
          variants={itemVariants}
        >
          Order Summary
        </motion.h1>

        <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
          {/* ---------------- LEFT: items + rewards ---------------- */}
          <motion.div className="space-y-6 lg:col-span-2 lg:space-y-8">
            {/* Items */}
            <motion.div
              className="comic-panel rounded-2xl bg-white p-4 sm:p-6"
              variants={itemVariants}
            >
              <SectionHeading
                icon="🛍️"
                title={productDetail ? "Review Your Purchase" : "Cart Products"}
                tone="bg-[#FFD93B]"
              />
              {productDetail ? (
                <motion.div
                  className="flex items-center justify-between gap-3 rounded-2xl border-[3px] border-black bg-white p-3"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <motion.div
                      className="flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {productDetail.productImages ? (
                        <img
                          src={productDetail?.productImages?.[0]?.imageUrl}
                          alt={productDetail.title}
                          className="h-16 w-16 rounded-xl border-[3px] border-black object-cover"
                        />
                      ) : (productDetail as any).thumbnails?.[0] ? (
                        <img
                          src={(productDetail as any).thumbnails[0]}
                          alt={productDetail.title}
                          className="h-16 w-16 rounded-xl border-[3px] border-black object-cover"
                        />
                      ) : (
                        <div className="comic-title flex h-16 w-16 items-center justify-center rounded-xl border-[3px] border-black bg-[#FFD93B] text-3xl">
                          ?
                        </div>
                      )}
                    </motion.div>
                    <span className="text-base font-black sm:text-xl">
                      {productDetail.title}
                    </span>
                  </div>

                  {/* Show offer price for toonland, strike through original when it differs */}
                  <span className="flex flex-col items-end whitespace-nowrap text-lg font-black sm:flex-row sm:items-center sm:gap-2">
                    {productDetail.type === ProductType.TOONLAND &&
                    productPayablePrice !== productDetail.price ? (
                      <>
                        <span className="text-sm font-bold text-gray-500 line-through">
                          ₹ {productDetail.price}
                        </span>
                        <span className="rounded-full border-[3px] border-black bg-[#BDF5D0] px-3 py-0.5">
                          ₹ {productPayablePrice}
                        </span>
                      </>
                    ) : (
                      <span>₹ {productPayablePrice}</span>
                    )}
                  </span>
                </motion.div>
              ) : cart.items && cart.items.length > 0 ? (
                <ul className="space-y-4">
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
                        className="flex items-center justify-between gap-3 rounded-2xl border-[3px] border-black bg-white p-3"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <motion.div
                            className="flex-shrink-0"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.title}
                                className="h-16 w-16 rounded-xl border-[3px] border-black object-cover"
                              />
                            ) : (
                              <div className="comic-title flex h-16 w-16 items-center justify-center rounded-xl border-[3px] border-black bg-[#FFD93B] text-3xl">
                                {index + 1}
                              </div>
                            )}
                          </motion.div>
                          <span className="text-base font-black sm:text-xl">
                            {item.title} x {item.quantity}
                          </span>
                        </div>

                        <span className="flex flex-col items-end whitespace-nowrap text-lg font-black sm:flex-row sm:items-center sm:gap-2">
                          {isToonlandOffer ? (
                            <>
                              <span className="text-sm font-bold text-gray-500 line-through">
                                ₹ {item.price}
                              </span>
                              <span className="rounded-full border-[3px] border-black bg-[#BDF5D0] px-3 py-0.5">
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
                  className="comic-title rounded-2xl border-[3px] border-dashed border-black py-8 text-center text-3xl text-[#2D6BFF]"
                  variants={itemVariants}
                >
                  Your cart is empty.
                </motion.p>
              )}
            </motion.div>

            {/* Reward Points Redemption Section */}
            <motion.div
              className="comic-panel rounded-2xl bg-white p-4 sm:p-6"
              variants={itemVariants}
            >
              <SectionHeading
                icon="🎁"
                title="Redeem Reward Points"
                tone="bg-[#2D6BFF]"
              />
              <div>
                <div className="mb-3 flex items-center justify-between rounded-xl border-[3px] border-black bg-[#E6EEFF] px-4 py-3">
                  <span className="font-bold">Available Points:</span>
                  <span className="comic-title text-3xl leading-none text-[#2D6BFF]">
                    {totalPoints}
                  </span>
                </div>
                <p className="mb-4 text-sm font-bold">
                  {`You can redeem up to ${maxRedeemablePoints} points for a discount of ₹${(
                    maxRedeemablePoints / POINTS_TO_RUPEE_RATIO
                  ).toFixed(2)}`}
                </p>

                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                    className="comic-input w-full rounded-xl bg-white px-4 py-3 font-bold placeholder:font-normal placeholder:text-gray-500"
                    placeholder="Enter points to redeem"
                    disabled={appliedDiscount > 0}
                  />
                  {appliedDiscount === 0 ? (
                    <button
                      onClick={handleApplyPoints}
                      className="comic-btn comic-title rounded-xl bg-[#2D6BFF] px-8 py-2.5 text-2xl text-white [text-shadow:2px_2px_0_#000]"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={handleRemoveDiscount}
                      className="comic-btn comic-title rounded-xl bg-[#FF4D3D] px-8 py-2.5 text-2xl text-white [text-shadow:2px_2px_0_#000]"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedDiscount > 0 && (
                  <div className="mb-2 rounded-xl border-[3px] border-black bg-[#BDF5D0] p-4">
                    <p className="font-black">
                      Discount applied: ₹{appliedDiscount.toFixed(2)}
                    </p>
                    <p className="text-sm font-bold">
                      {redeemPoints} points redeemed
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Candy Coins */}
            <motion.div
              className="comic-panel rounded-2xl bg-white p-4 sm:p-6"
              variants={itemVariants}
            >
              <SectionHeading
                icon="🍬"
                title="Redeem Candy Coins"
                tone="bg-[#FF4D3D]"
              />

              <div className="mb-3 flex items-center justify-between rounded-xl border-[3px] border-black bg-[#FFF3B8] px-4 py-3">
                <span className="font-bold">Available Candy Coins:</span>
                <span className="comic-title text-3xl leading-none">
                  {coins?.currentCoins || 0}
                </span>
              </div>

              <p className="mb-4 inline-block rounded-full border-[3px] border-black bg-white px-3 py-1 text-xs font-black">
                Max Discount: ₹5 • 1000 Coins = ₹0.75
              </p>

              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                  className="comic-input w-full rounded-xl bg-white px-4 py-3 font-bold placeholder:font-normal placeholder:text-gray-500"
                  placeholder="Enter candy coins"
                />

                {appliedCandyDiscount === 0 ? (
                  <button
                    onClick={handleApplyCandyCoins}
                    className="comic-btn comic-title rounded-xl bg-[#FFD93B] px-8 py-2.5 text-2xl text-black"
                  >
                    Apply
                  </button>
                ) : (
                  <button
                    onClick={handleRemoveCandyDiscount}
                    className="comic-btn comic-title rounded-xl bg-[#FF4D3D] px-8 py-2.5 text-2xl text-white [text-shadow:2px_2px_0_#000]"
                  >
                    Remove
                  </button>
                )}
              </div>

              {appliedCandyDiscount > 0 && (
                <div className="rounded-xl border-[3px] border-black bg-[#BDF5D0] p-4 font-black">
                  ₹{appliedCandyDiscount.toFixed(2)} discount using{" "}
                  {redeemCandyCoins} coins
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* ---------------- RIGHT: receipt + pay ---------------- */}
          <motion.aside
            className="relative lg:sticky lg:top-6"
            variants={itemVariants}
          >
            <div className="comic-panel rounded-3xl bg-[#FFD93B] p-5 lg:rotate-1 lg:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="comic-title text-4xl leading-none">
                  Payment Summary
                </h2>
                {/* Starburst sits inside the card header so it never overlaps the page title */}
                <div className="comic-burst comic-pop hidden h-20 w-20 shrink-0 items-center justify-center bg-[#FF4D3D] text-center lg:flex">
                  <span className="comic-title -rotate-6 text-lg leading-none text-white [text-shadow:2px_2px_0_#000]">
                    Last
                    <br />
                    step!
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Subtotal:</span>
                  <span className="font-black">
                    ₹ {calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between rounded-lg border-[3px] border-black bg-[#BDF5D0] px-3 py-1.5 font-black">
                    <span>Points Discount:</span>
                    <span>-₹ {appliedDiscount.toFixed(2)}</span>
                  </div>
                )}
                {appliedCandyDiscount > 0 && (
                  <div className="flex justify-between rounded-lg border-[3px] border-black bg-[#BDF5D0] px-3 py-1.5 font-black">
                    <span>Candy Coin Discount:</span>
                    <span>-₹ {appliedCandyDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="mt-4 border-t-4 border-dashed border-black pt-4">
                  <div className="flex items-end justify-between">
                    <span className="comic-title text-3xl">Total:</span>
                    <span className="comic-title text-5xl leading-none text-black">
                      ₹ {calculateFinalAmount().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop pay button (mobile uses the sticky bar) */}
              <button
                onClick={handleProceedToPay}
                type="button"
                className="comic-btn comic-title mt-6 hidden w-full rounded-2xl bg-[#FF4D3D] px-5 py-3 text-4xl text-white [text-shadow:2px_2px_0_#000] lg:block"
              >
                Proceed to Pay
              </button>
              <p className="mt-4 text-center text-sm font-black lg:mt-3">
                🔒 Secure checkout
              </p>
            </div>
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

      {/* Mobile-only sticky pay bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-black bg-[#FFD93B] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_0_#000] lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div className="leading-none">
            <p className="text-sm font-bold text-black">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
            <p className="comic-title mt-1 text-3xl text-black">
              ₹{calculateFinalAmount().toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleProceedToPay}
            type="button"
            className="comic-btn comic-title flex-1 rounded-xl bg-[#FF4D3D] py-3 text-2xl text-white [text-shadow:2px_2px_0_#000] sm:max-w-xs"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
