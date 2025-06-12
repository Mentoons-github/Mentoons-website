import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdHistory,
  MdStar,
  MdCalendarToday,
  MdShoppingBag,
  MdSort,
} from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa6";
import ReviewModal from "@/components/common/modal/reviewModal";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "@/api/axios";
import { OrderData, OrderItem } from "@/types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import InvoiceGenerator from "@/components/products/invoice/invoiceGenerator";
import Pagination from "@/components/common/pagination/pagination";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.2,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
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
        <motion.div
          className="w-20 h-20 mx-auto mb-4 relative"
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
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

const FilterLoader = () => (
  <motion.div
    className="py-16 text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      className="w-12 h-12 mx-auto mb-4 text-indigo-600"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <MdShoppingBag className="w-full h-full" />
    </motion.div>
    <p className="text-gray-600">Filtering orders...</p>
  </motion.div>
);

const OrderHistory = () => {
  const { getToken } = useAuth();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [groupedOrders, setGroupedOrders] = useState<{
    [key: string]: OrderData[];
  }>({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    productId: string;
    productName: string;
  } | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("-purchaseDate");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const sortOptions = [
    { value: "-purchaseDate", label: "Newest First" },
    { value: "purchaseDate", label: "Oldest First" },
    { value: "-amount", label: "Price: High to Low" },
    { value: "amount", label: "Price: Low to High" },
  ];

  useEffect(() => {
    const getOrders = async () => {
      try {
        if (!isFirstLoad) {
          setIsFilterLoading(true);
        }
        setError(null);

        const token = await getToken();
        if (!token) {
          console.log("No token found");
          setError("Authentication required");
          return;
        }

        const params = {
          page: currentPage,
          limit: itemsPerPage,
          year: selectedYear !== "all" ? selectedYear : undefined,
          month: selectedMonth !== "all" ? selectedMonth : undefined,
          day: selectedDay !== "all" ? selectedDay : undefined,
          sort: selectedSort,
        };

        const response = await axiosInstance.get("/order/get-order-history", {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        console.log("Backend response:", response.data);
        setGroupedOrders(response.data.groupedOrders);
        setTotalItems(response.data.totalItems);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        setError(
          error.response?.data?.message ||
            "Failed to load orders. Please try again."
        );
      } finally {
        if (isFirstLoad) {
          setTimeout(() => {
            setIsInitialLoading(false);
            setIsFirstLoad(false);
          }, 1000);
        } else {
          setIsFilterLoading(false);
        }
      }
    };

    getOrders();
  }, [
    getToken,
    currentPage,
    itemsPerPage,
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedSort,
    isFirstLoad,
  ]);

  const uniqueYears = useMemo(() => {
    const years = Object.values(groupedOrders)
      .flat()
      .map((item) => new Date(item.purchaseDate).getFullYear().toString());
    return [...new Set(years)].sort((a, b) => Number(b) - Number(a));
  }, [groupedOrders]);

  const uniqueMonths = useMemo(() => {
    const months = Object.values(groupedOrders)
      .flat()
      .filter((item) => {
        if (selectedYear === "all") return true;
        return (
          new Date(item.purchaseDate).getFullYear().toString() === selectedYear
        );
      })
      .map((item) =>
        new Date(item.purchaseDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      );
    return [...new Set(months)].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [groupedOrders, selectedYear]);

  const uniqueDays = useMemo(() => {
    const days = Object.values(groupedOrders)
      .flat()
      .filter((item) => {
        const date = new Date(item.purchaseDate);
        const yearMatch =
          selectedYear === "all" ||
          date.getFullYear().toString() === selectedYear;
        const monthMatch =
          selectedMonth === "all" ||
          date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          }) === selectedMonth;
        return yearMatch && monthMatch;
      })
      .map((item) => new Date(item.purchaseDate).getDate().toString());
    return [...new Set(days)].sort((a, b) => Number(a) - Number(b));
  }, [groupedOrders, selectedYear, selectedMonth]);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const getTotalPrice = () => {
    return Object.values(groupedOrders)
      .flat()
      .reduce((total, order) => total + order.totalAmount, 0);
  };

  const getTotalForDate = (orders: OrderData[]) => {
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  };

  const sortedDateGroups = useMemo(() => {
    const entries = Object.entries(groupedOrders);
    if (selectedSort === "purchaseDate") {
      return entries.sort(
        (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
      );
    } else if (selectedSort === "-purchaseDate") {
      return entries.sort(
        (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
      );
    } else if (selectedSort === "amount") {
      return entries.sort((a, b) => {
        const totalA = getTotalForDate(a[1]);
        const totalB = getTotalForDate(b[1]);
        return totalA - totalB;
      });
    } else if (selectedSort === "-amount") {
      return entries.sort((a, b) => {
        const totalA = getTotalForDate(a[1]);
        const totalB = getTotalForDate(b[1]);
        return totalB - totalA;
      });
    }
    return entries;
  }, [groupedOrders, selectedSort]);

  const handleReviewClick = (item: OrderItem) => {
    setSelectedItem({
      productId: item.productId,
      productName: item.productName,
    });
    setShowReviewModal(true);
  };

  const downloadInvoice = async (order: OrderData) => {
    try {
      setSelectedOrder(order);
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const invoiceElement = invoiceRef.current;
      if (!invoiceElement) {
        throw new Error("Invoice element not found in the DOM");
      }

      const noPrintElements = invoiceElement.querySelectorAll(".no-print");
      noPrintElements.forEach(
        (el) => ((el as HTMLElement).style.display = "none")
      );

      const canvas = await html2canvas(invoiceElement, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: invoiceElement.scrollWidth,
        windowHeight: invoiceElement.scrollHeight,
      });

      noPrintElements.forEach((el) => ((el as HTMLElement).style.display = ""));

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.7);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgScaledWidth = imgWidth * ratio;
      const imgScaledHeight = imgHeight * ratio;

      const xOffset = (pdfWidth - imgScaledWidth) / 2;
      const yOffset = (pdfHeight - imgScaledHeight) / 2;

      pdf.addImage(
        imgData,
        "JPEG",
        xOffset,
        yOffset,
        imgScaledWidth,
        imgScaledHeight
      );

      pdf.save(`Mentoons_Invoice_${order.orderId}.pdf`);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
      setSelectedOrder(null);
    }
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

  const resetFilters = () => {
    setSelectedYear("all");
    setSelectedMonth("all");
    setSelectedDay("all");
    setSelectedSort("-purchaseDate");
    setCurrentPage(1);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  if (isInitialLoading) {
    return <AnimatedLoader />;
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto text-center py-20">
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
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8"
          variants={titleVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MdHistory className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Purchase History
            </h1>
          </div>
          <p className="text-gray-600 text-lg ml-14">
            Track and manage all your purchases
          </p>
        </motion.div>

        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="mb-8 flex items-center gap-4 flex-wrap"
            variants={contentVariants}
          >
            <div className="flex items-center gap-2">
              <MdCalendarToday className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Filter by:
              </span>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedMonth("all");
                setSelectedDay("all");
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="all">All Years</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDay("all");
                setCurrentPage(1);
              }}
              disabled={selectedYear === "all" && uniqueMonths.length === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm disabled:opacity-50"
            >
              <option value="all">All Months</option>
              {uniqueMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedDay}
              onChange={(e) => {
                setSelectedDay(e.target.value);
                setCurrentPage(1);
              }}
              disabled={selectedMonth === "all" && uniqueDays.length === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm disabled:opacity-50"
            >
              <option value="all">All Days</option>
              {uniqueDays.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <MdSort className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Sort by:
              </span>
            </div>
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <motion.button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Filters
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-8 mb-8 shadow-lg"
            variants={contentVariants}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium opacity-90 mb-2">
                  Total Spent
                  {selectedYear !== "all" ? ` in ${selectedYear}` : ""}
                  {selectedMonth !== "all" ? ` ${selectedMonth}` : ""}
                  {selectedDay !== "all" ? ` on Day ${selectedDay}` : ""}
                </h2>
                <p className="text-3xl font-bold">
                  ₹ {getTotalPrice().toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 mb-2">Orders</p>
                <p className="text-2xl font-semibold">
                  {Object.values(groupedOrders).flat().length}
                </p>
              </div>
            </div>
          </motion.div>

          {selectedOrder && (
            <div style={{ position: "absolute", left: "-9999px" }}>
              <InvoiceGenerator order={selectedOrder} ref={invoiceRef} />
            </div>
          )}

          <AnimatePresence mode="wait">
            {isFilterLoading ? (
              <FilterLoader />
            ) : sortedDateGroups.length === 0 ? (
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
                  {selectedYear !== "all" ? ` for ${selectedYear}` : ""}
                  {selectedMonth !== "all" ? ` ${selectedMonth}` : ""}
                  {selectedDay !== "all" ? ` on Day ${selectedDay}` : ""}.
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
                {sortedDateGroups.map(([date, orders], index) => (
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
                            {orders.length} order
                            {orders.length > 1 ? "s" : ""} placed
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
                      {orders.map((order: OrderData, orderIndex: number) => (
                        <div key={order.orderId} className="p-8">
                          <div className="space-y-8">
                            {order.items.map(
                              (item: OrderItem, itemIndex: number) => (
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
                                      src={
                                        item.productImage || "/placeholder.png"
                                      }
                                      alt={item.productName}
                                      className="w-36 h-36 object-cover rounded-xl border border-gray-200"
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
                                          <span className="text-sm font-mono text-gray-800 bg-gray-50 px-2 py-1 rounded">
                                            {order.orderId}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-4 ml-auto">
                                      <motion.button
                                        onClick={() => downloadInvoice(order)}
                                        className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 active:bg-orange-800 transition-all shadow-sm min-w-[140px] justify-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <FaMoneyBill className="w-4 h-4" />
                                        Download Invoice
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
                                          item.hasReviewed
                                            ? undefined
                                            : { scale: 1.05 }
                                        }
                                        whileTap={
                                          item.hasReviewed
                                            ? undefined
                                            : { scale: 0.95 }
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
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5">
            <p className="text-sm text-gray-600 mb-2">
              Showing {sortedDateGroups.length} date groups (page {currentPage}{" "}
              of {totalPages})
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              showPageSizeSelector={true}
              pageSizeOptions={[5, 10, 20, 50]}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>

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
      </div>
    </motion.div>
  );
};

export default OrderHistory;
