import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdAutorenew,
  MdStar,
  MdCalendarToday,
  MdShoppingBag,
} from "react-icons/md";
import ReviewModal from "../common/modal/reviewModal";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "@/api/axios";
import { OrderData, OrderItem } from "@/types";
import { useNavigate } from "react-router-dom";

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1,
    },
  },
};

const AnimatedLoader = () => (
  <motion.div
    className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-[99999]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-center">
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Animated Shopping Bag */}
        <motion.div
          className="w-20 h-20 mx-auto mb-4 relative"
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <MdShoppingBag className="w-full h-full text-indigo-600" />
        </motion.div>

        <motion.div
          className="absolute inset-0 w-24 h-24 mx-auto border-4 border-indigo-200 border-t-indigo-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Loading Your Orders
        </h3>
        <p className="text-gray-600">
          Please wait while we fetch your order history...
        </p>
      </motion.div>

      {/* Animated Dots */}
      <motion.div
        className="flex justify-center mt-4 space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-indigo-600 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  </motion.div>
);

const OrderedItems = () => {
  const navigate = useNavigate();

  const [groupedOrders, setGroupedOrders] = useState<{
    [key: string]: OrderData[];
  }>({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    productId: string;
    productName: string;
  } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const getOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = await getToken();
        if (!token) {
          console.log("No token found");
          setError("Authentication required");
          return;
        }

        const response = await axiosInstance.get("/order/get-order-history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Backend response:", response.data);
        setGroupedOrders(response.data.groupedOrders);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        setError(
          error.response?.data?.message ||
            "Failed to load orders. Please try again."
        );
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    getOrders();
  }, [getToken]);

  const getMonthYear = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const uniqueMonths = useMemo(() => {
    const months = Object.values(groupedOrders)
      .flat()
      .map((item) => getMonthYear(item.purchaseDate));
    return [...new Set(months)].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [groupedOrders]);

  const filteredOrders = useMemo(() => {
    if (selectedMonth === "all") {
      return groupedOrders;
    }
    const filtered: { [key: string]: OrderData[] } = {};
    Object.keys(groupedOrders).forEach((dateKey) => {
      const orders = groupedOrders[dateKey].filter(
        (order) => getMonthYear(order.purchaseDate) === selectedMonth
      );
      if (orders.length > 0) {
        filtered[dateKey] = orders;
      }
    });
    return filtered;
  }, [groupedOrders, selectedMonth]);

  const getTotalPrice = () => {
    return Object.values(filteredOrders)
      .flat()
      .reduce((total, order) => total + order.totalAmount, 0);
  };

  const getTotalForDate = (orders: OrderData[]) => {
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  };

  const handleReviewClick = (item: OrderItem) => {
    setSelectedItem({
      productId: item.productId,
      productName: item.productName,
    });
    setShowReviewModal(true);
  };

  const handleBuyAgain = (productId: string) => {
    navigate(`/mentoons-store/product/${productId}`);
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setSelectedItem(null);
  };

  const handleSubmitReview = (productId: string) => {
    setGroupedOrders((prev) => {
      const updated: { [key: string]: OrderData[] } = {};
      Object.keys(prev).forEach((dateKey) => {
        updated[dateKey] = prev[dateKey].map((order) => ({
          ...order,
          items: order.items.map((item) =>
            item.productId === productId ? { ...item, hasReviewed: true } : item
          ),
        }));
      });
      return updated;
    });
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <AnimatedLoader />;
  }

  if (error) {
    return (
      <motion.div
        className="max-w-6xl mx-auto p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-20">
          <motion.div
            className="w-16 h-16 mx-auto mb-6 text-red-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <MdShoppingBag className="w-full h-full" />
          </motion.div>
          <motion.h2
            className="text-2xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Oops! Something went wrong
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {error}
          </motion.p>
          <motion.button
            onClick={handleRetry}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-8 flex items-center gap-4 flex-wrap"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2">
          <MdCalendarToday className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Filter by month:
          </span>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        >
          <option value="all">All Months</option>
          {uniqueMonths.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </motion.div>

      <motion.div
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-8 mb-8 shadow-lg"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium opacity-90 mb-2">
              {selectedMonth === "all"
                ? "Total Spent (All Time)"
                : `Total Spent in ${selectedMonth}`}
            </h2>
            <p className="text-3xl font-bold">
              ₹ {getTotalPrice().toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90 mb-2">Orders</p>
            <p className="text-2xl font-semibold">
              {Object.values(filteredOrders).flat().length}
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {Object.keys(filteredOrders).length === 0 ? (
          <motion.div
            className="text-center py-16 text-gray-600"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <MdShoppingBag className="w-full h-full" />
            </motion.div>
            <p className="text-lg font-medium">
              No orders found
              {selectedMonth !== "all" ? ` for ${selectedMonth}` : ""}.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {Object.entries(filteredOrders)
              .sort(
                ([dateA], [dateB]) =>
                  new Date(dateB).getTime() - new Date(dateA).getTime()
              )
              .map(([date, orders], index) => (
                <motion.div
                  key={date}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {date}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {orders.length} order{orders.length > 1 ? "s" : ""}{" "}
                          placed
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">
                          Total for {date}
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          ₹ {getTotalForDate(orders).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {orders.map((order, orderIndex) => (
                      <div key={order.orderId} className="p-8">
                        <div className="space-y-8">
                          {order.items.map((item, itemIndex) => (
                            <motion.div
                              key={`${order.orderId}-${item.productId}`}
                              className="flex items-start gap-8 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay:
                                  index * 0.1 +
                                  orderIndex * 0.05 +
                                  itemIndex * 0.03,
                                duration: 0.4,
                              }}
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="flex-shrink-0">
                                <img
                                  src={item.productImage || "/placeholder.png"}
                                  alt={item.productName}
                                  className="w-36 h-36 object-cover rounded-xl border border-gray-200 shadow-sm"
                                />
                              </div>

                              <div className="flex-1 flex items-start justify-between gap-6">
                                <div className="flex-1">
                                  <h4 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                                    {item.productName}
                                  </h4>
                                  <p className="text-2xl font-bold text-indigo-600 mb-3">
                                    ₹ {item.price.toLocaleString()}
                                  </p>
                                  <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">
                                        Quantity:
                                      </span>{" "}
                                      {item.quantity}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-600 font-medium">
                                        Order ID:
                                      </span>
                                      <span className="text-sm font-mono text-gray-800 bg-gray-200 px-2 py-1 rounded">
                                        {order.orderId}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-4 ml-auto">
                                  <motion.button
                                    onClick={() =>
                                      handleBuyAgain(item.productId)
                                    }
                                    className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 active:bg-orange-800 transition-all shadow-sm min-w-[140px] justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <MdAutorenew className="w-4 h-4" />
                                    Buy Again
                                  </motion.button>

                                  <motion.button
                                    onClick={() => handleReviewClick(item)}
                                    disabled={item.hasReviewed}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-sm min-w-[140px] justify-center ${
                                      item.hasReviewed
                                        ? "bg-yellow-100 text-yellow-700 cursor-not-allowed"
                                        : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
                                    }`}
                                    whileHover={
                                      !item.hasReviewed ? { scale: 1.05 } : {}
                                    }
                                    whileTap={
                                      !item.hasReviewed ? { scale: 0.95 } : {}
                                    }
                                  >
                                    <MdStar className="w-4 h-4" />
                                    {item.hasReviewed
                                      ? "Reviewed"
                                      : "Write Review"}
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReviewModal && selectedItem && (
          <ReviewModal
            title={selectedItem.productName}
            productId={selectedItem.productId}
            onClose={handleCloseModal}
            onSubmit={handleSubmitReview}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderedItems;
