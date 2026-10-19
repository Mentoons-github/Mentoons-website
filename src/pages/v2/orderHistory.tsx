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

/* ------------------------------------------------------------------
   COMIC STYLE TOKENS
   font-comic       -> Bangers      (body / labels / buttons)
   font-comic-chip  -> Luckiest Guy (big headings / chips)
   Both are defined in your global CSS.
------------------------------------------------------------------- */
const comicShadow = "shadow-[4px_4px_0_#000]";
const comicShadowSm = "shadow-[3px_3px_0_#000]";

// halftone dots background (comic book print look)
const halftoneBg: React.CSSProperties = {
  backgroundColor: "#FFF1DC",
  backgroundImage:
    "radial-gradient(rgba(255,148,46,0.35) 1.5px, transparent 1.5px)",
  backgroundSize: "18px 18px",
};

const comicSelect = `w-full px-4 py-2 text-base tracking-wider text-black bg-white border-[3px] border-black rounded-full outline-none cursor-pointer font-comic ${comicShadowSm} focus:ring-4 focus:ring-orange-300`;

const comicBtnBase = `font-comic-chip tracking-wider border-[3px] border-black rounded-full ${comicShadowSm} transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`;

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
    className="fixed inset-0 flex items-center justify-center z-[99999] bg-[#FF942E]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="px-4 text-center">
      <motion.div
        className={`relative inline-flex items-center justify-center w-28 h-28 mb-6 bg-white border-4 border-black rounded-full ${comicShadow}`}
        animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <MdShoppingBag className="w-14 h-14 text-orange-600" />
      </motion.div>

      <h3 className="mb-2 text-3xl tracking-widest text-white sm:text-4xl font-comic-chip drop-shadow-[3px_3px_0_#000]">
        Loading Your Orders
      </h3>
      <p className="text-lg tracking-wider text-black font-comic">
        Hang tight! Fetching your order history...
      </p>

      <div className="flex justify-center mt-5 space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-yellow-300 border-2 border-black rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

const FilterLoader = () => (
  <motion.div
    className="px-4 py-16 text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-orange-600 bg-white border-4 border-black rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <MdShoppingBag className="w-8 h-8" />
    </motion.div>
    <p className="text-xl tracking-wider text-black font-comic-chip">
      Filtering orders...
    </p>
  </motion.div>
);

const OrderHistory: React.FC = () => {
  const { getToken } = useAuth();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const productsContainerRef = useRef<HTMLDivElement>(null);
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [allYears, setAllYears] = useState<string[]>([]);
  const [allMonths, setAllMonths] = useState<string[]>([]);
  const [allDays, setAllDays] = useState<string[]>([]);

  const sortOptions = [
    { value: "-purchaseDate", label: "Newest First" },
    { value: "purchaseDate", label: "Oldest First" },
    { value: "-amount", label: "Price: High to Low" },
    { value: "amount", label: "Price: Low to High" },
  ];

  useEffect(() => {
    const fetchOrderDates = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.log("No token found for dates");
          return;
        }

        const response = await axiosInstance.get("/order/get-order-dates", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { success, years, months, days, message } = response.data;

        if (!success) {
          throw new Error(message || "Failed to fetch order dates");
        }

        setAllYears(years || []);
        setAllMonths(months || []);
        setAllDays(days || []);
      } catch (error: unknown) {
        console.error("Error fetching order dates:", error);
      }
    };

    fetchOrderDates();
  }, [getToken]);

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

        const validPage =
          isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
        const validLimit =
          isNaN(itemsPerPage) || itemsPerPage < 1 ? 5 : itemsPerPage;

        const params = {
          page: validPage,
          limit: validLimit,
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

        const {
          success,
          groupedOrders: backendOrders = {},
          totalItems: backendTotalItems = 0,
          currentPage: serverPage,
          itemsPerPage: serverLimit,
          message,
        } = response.data;

        if (!success) {
          throw new Error(message || "Failed to fetch orders");
        }

        setGroupedOrders(backendOrders);
        setTotalItems(backendTotalItems);
        setCurrentPage(
          isNaN(serverPage) || serverPage < 1 ? validPage : Number(serverPage),
        );
        setItemsPerPage(
          isNaN(serverLimit) || serverLimit < 1
            ? validLimit
            : Number(serverLimit),
        );
      } catch (error: unknown) {
        console.error("Error fetching orders:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load orders. Please try again.",
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

  const uniqueYears = useMemo(
    () => [...new Set(allYears)].sort((a, b) => Number(b) - Number(a)),
    [allYears],
  );
  const uniqueMonths = useMemo(
    () =>
      [...new Set(allMonths)].sort(
        (a, b) =>
          new Date(`1 ${b} 2000`).getTime() - new Date(`1 ${a} 2000`).getTime(),
      ),
    [allMonths],
  );
  const uniqueDays = useMemo(
    () => [...new Set(allDays)].sort((a, b) => Number(a) - Number(b)),
    [allDays],
  );

  const totalPages = useMemo(
    () => Math.ceil(totalItems / (itemsPerPage || 5)),
    [totalItems, itemsPerPage],
  );

  const getTotalPrice = () => {
    if (!groupedOrders || typeof groupedOrders !== "object") return 0;
    return Object.values(groupedOrders)
      .flat()
      .reduce(
        (total: number, order: OrderData) => total + order.totalAmount,
        0,
      );
  };

  const getTotalForDate = (orders: OrderData[]) => {
    if (!Array.isArray(orders)) return 0;
    return orders.reduce(
      (total: number, order: OrderData) => total + order.totalAmount,
      0,
    );
  };

  const sortedDateGroups = useMemo(() => {
    if (!groupedOrders || typeof groupedOrders !== "object") return [];
    const entries = Object.entries(groupedOrders);
    if (selectedSort === "purchaseDate") {
      return entries.sort(
        (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
      );
    } else if (selectedSort === "-purchaseDate") {
      return entries.sort(
        (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
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

  useEffect(() => {
    if (!isFilterLoading && !isInitialLoading && sortedDateGroups.length > 0) {
      requestAnimationFrame(() => {
        if (productsContainerRef.current) {
          productsContainerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }
  }, [isFilterLoading, isInitialLoading, sortedDateGroups]);

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
        (el) => ((el as HTMLElement).style.display = "none"),
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
        imgScaledHeight,
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
            item.productId === productId
              ? { ...item, hasReviewed: true }
              : item,
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
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setIsFilterLoading(true);
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (size > 0 && size !== itemsPerPage) {
      setIsFilterLoading(true);
      setItemsPerPage(size);
      setCurrentPage(1);
    }
  };

  if (isInitialLoading) {
    return <AnimatedLoader />;
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen p-4 sm:p-6"
        style={halftoneBg}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-xl mx-auto py-16">
          <div
            className={`p-8 text-center bg-white border-4 border-black rounded-3xl ${comicShadow}`}
          >
            <motion.div
              className="flex items-center justify-center w-20 h-20 mx-auto mb-4 text-white bg-red-500 border-4 border-black rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <MdShoppingBag className="w-10 h-10" />
            </motion.div>
            <h2 className="mb-2 text-3xl tracking-widest text-orange-600 sm:text-4xl font-comic-chip">
              Oops! Something went wrong
            </h2>
            <p className="px-2 mb-6 text-lg tracking-wider text-gray-800 font-comic">
              {error}
            </p>
            <motion.button
              onClick={handleRetry}
              className={`px-8 py-3 text-xl text-white bg-orange-600 hover:bg-orange-500 ${comicBtnBase}`}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6"
      style={halftoneBg}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        {/* ---------- TITLE ---------- */}
        <motion.div className="mb-6 sm:mb-8" variants={titleVariants}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2 bg-yellow-300 border-4 border-black rounded-2xl -rotate-6 ${comicShadowSm}`}
            >
              <MdHistory className="w-7 h-7 sm:w-9 sm:h-9 text-black" />
            </div>
            <h1 className="relative inline-block pb-1 text-3xl sm:text-4xl lg:text-5xl tracking-[0.12em] uppercase text-black font-comic-chip drop-shadow-[3px_3px_0_rgba(255,255,255,0.9)] after:absolute after:left-0 after:bottom-0 after:h-1.5 after:w-full after:rounded-full after:bg-black after:content-['']">
              Purchase History
            </h1>
          </div>
          <p className="ml-1 text-lg tracking-wider text-gray-800 sm:ml-2 sm:text-xl font-comic">
            Track and manage all your purchases
          </p>
        </motion.div>

        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ---------- FILTERS ---------- */}
          <motion.div
            className={`p-4 mb-6 space-y-4 bg-white border-4 border-black sm:p-6 sm:mb-8 rounded-3xl ${comicShadow}`}
            variants={contentVariants}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-orange-600 border-2 border-black rounded-full">
                <MdCalendarToday className="w-4 h-4 text-white" />
              </span>
              <span className="text-xl tracking-wider text-orange-600 font-comic-chip">
                Filter by:
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setCurrentPage(1);
                }}
                className={comicSelect}
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
                  setCurrentPage(1);
                }}
                className={comicSelect}
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
                className={comicSelect}
              >
                <option value="all">All Days</option>
                {uniqueDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center flex-1 gap-2">
                <span className="flex items-center justify-center w-8 h-8 bg-orange-600 border-2 border-black rounded-full shrink-0">
                  <MdSort className="w-4 h-4 text-white" />
                </span>
                <span className="text-xl tracking-wider text-orange-600 whitespace-nowrap font-comic-chip">
                  Sort by:
                </span>
                <select
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 ${comicSelect}`}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <motion.button
                onClick={resetFilters}
                className={`px-6 py-2 text-lg text-black bg-yellow-300 hover:bg-yellow-200 whitespace-nowrap ${comicBtnBase}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Reset Filters
              </motion.button>
            </div>
          </motion.div>

          {/* ---------- TOTAL SPENT ---------- */}
          <motion.div
            className={`relative p-4 mb-6 text-white bg-orange-600 border-4 border-black sm:p-6 lg:p-8 sm:mb-8 rounded-3xl ${comicShadow}`}
            variants={contentVariants}
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <h2 className="mb-2 text-xl tracking-widest sm:text-2xl font-comic-chip drop-shadow-[2px_2px_0_#000]">
                  Total Spent
                  {selectedYear !== "all" ? ` in ${selectedYear}` : ""}
                  {selectedMonth !== "all" ? ` ${selectedMonth}` : ""}
                  {selectedDay !== "all" ? ` on Day ${selectedDay}` : ""}
                </h2>
                <p className="text-4xl tracking-wider sm:text-5xl font-comic-chip drop-shadow-[3px_3px_0_#000]">
                  ₹ {getTotalPrice().toLocaleString()}
                </p>
              </div>
              <div
                className={`px-6 py-3 text-center text-black bg-yellow-300 border-4 border-black rounded-2xl rotate-3 ${comicShadowSm}`}
              >
                <p className="text-lg tracking-wider font-comic">Orders</p>
                <p className="text-3xl tracking-wider sm:text-4xl font-comic-chip">
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

          {/* ---------- ORDERS ---------- */}
          <AnimatePresence mode="wait">
            {isFilterLoading ? (
              <FilterLoader />
            ) : sortedDateGroups.length === 0 ? (
              <motion.div
                className={`px-4 py-12 mx-auto text-center bg-white border-4 border-black max-w-xl rounded-3xl ${comicShadow}`}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.div
                  className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-yellow-300 border-4 border-black rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <MdShoppingBag className="w-10 h-10 text-black" />
                </motion.div>
                <p className="text-2xl tracking-wider text-black font-comic-chip">
                  No orders found
                  {selectedYear !== "all" ? ` for ${selectedYear}` : ""}
                  {selectedMonth !== "all" ? ` ${selectedMonth}` : ""}
                  {selectedDay !== "all" ? ` on Day ${selectedDay}` : ""}.
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-8 sm:space-y-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                ref={productsContainerRef}
              >
                {sortedDateGroups.map(([date, orders], index) => (
                  <motion.div
                    key={date}
                    className={`overflow-hidden bg-white border-4 border-black rounded-3xl ${comicShadow}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Date header strip */}
                    <div className="p-4 bg-[#FF942E] border-b-4 border-black sm:p-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                          <div>
                            <h3 className="mb-1 text-2xl tracking-widest text-white sm:text-3xl font-comic-chip drop-shadow-[2px_2px_0_#000]">
                              {date}
                            </h3>
                            <span className="inline-block px-3 py-0.5 text-base tracking-wider text-black bg-white border-2 border-black rounded-full font-comic">
                              {orders.length} order
                              {orders.length > 1 ? "s" : ""} placed
                            </span>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="mb-1 text-base tracking-wider text-black sm:text-lg font-comic">
                              Total for {date}
                            </p>
                            <p
                              className={`inline-block px-4 py-1 text-2xl tracking-wider text-black bg-yellow-300 border-[3px] border-black rounded-full font-comic-chip ${comicShadowSm}`}
                            >
                              ₹ {getTotalForDate(orders).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          {orders.map((order) => (
                            <motion.button
                              key={order.orderId}
                              onClick={() => downloadInvoice(order)}
                              className={`flex items-center gap-2 px-4 py-1.5 text-base text-white bg-black hover:bg-gray-800 ${comicBtnBase}`}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <FaMoneyBill className="w-4 h-4" />
                              Invoice #{order.orderId.slice(-4)}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="divide-y-4 divide-black divide-dashed">
                      {orders.map((order: OrderData, orderIndex: number) => (
                        <div key={order.orderId} className="p-4 sm:p-6 lg:p-8">
                          <div className="space-y-4 sm:space-y-6">
                            {order.items.map(
                              (item: OrderItem, itemIndex: number) => (
                                <motion.div
                                  key={`${order.orderId}-${item.productId}`}
                                  className={`flex flex-col items-start gap-4 p-4 bg-[#FFF8EC] border-4 border-black sm:flex-row sm:gap-6 sm:p-5 rounded-2xl ${comicShadowSm} transition-transform duration-200 hover:-translate-y-1`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    delay:
                                      index * 0.1 +
                                      orderIndex * 0.05 +
                                      itemIndex * 0.03,
                                    duration: 0.4,
                                  }}
                                >
                                  <div className="flex-shrink-0 w-full p-1.5 bg-white border-4 border-black sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-xl">
                                    <img
                                      src={
                                        item.productImage || "/placeholder.png"
                                      }
                                      alt={item.productName}
                                      className="object-cover w-full h-full rounded-lg"
                                    />
                                  </div>

                                  <div className="flex flex-col items-start justify-between flex-1 w-full gap-4 sm:flex-row sm:gap-6">
                                    <div className="flex-1">
                                      <h4 className="mb-2 text-xl leading-tight tracking-wider text-black sm:text-2xl font-comic-chip">
                                        {item.productName}
                                      </h4>
                                      <p
                                        className={`inline-block px-3 py-0.5 mb-3 text-2xl tracking-wider text-white bg-orange-600 border-[3px] border-black rounded-full font-comic-chip ${comicShadowSm}`}
                                      >
                                        ₹ {item.price.toLocaleString()}
                                      </p>
                                      <div className="mb-2 space-y-2">
                                        <p className="text-lg tracking-wider text-gray-800 font-comic">
                                          <span className="text-orange-600">
                                            Quantity:
                                          </span>{" "}
                                          {item.quantity}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className="text-lg tracking-wider text-orange-600 font-comic">
                                            Order ID:
                                          </span>
                                          <span className="px-2 py-0.5 text-sm tracking-wider text-black bg-white border-2 border-black rounded-lg font-comic break-all">
                                            {order.orderId}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-col w-full gap-3 ml-auto sm:w-auto">
                                      <motion.button
                                        onClick={() => handleReviewClick(item)}
                                        disabled={item.hasReviewed}
                                        className={`flex items-center justify-center w-full gap-2 px-6 py-2.5 text-lg sm:min-w-[160px] ${comicBtnBase} ${
                                          item.hasReviewed
                                            ? "bg-yellow-200 text-gray-700 cursor-not-allowed !shadow-none opacity-80"
                                            : "bg-green-500 text-white hover:bg-green-400"
                                        }`}
                                        whileHover={
                                          item.hasReviewed
                                            ? undefined
                                            : { y: -2 }
                                        }
                                        whileTap={
                                          item.hasReviewed
                                            ? undefined
                                            : { scale: 0.97 }
                                        }
                                      >
                                        <MdStar className="w-5 h-5" />
                                        {item.hasReviewed
                                          ? "Reviewed"
                                          : "Write Review"}
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              ),
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

          {/* ---------- PAGINATION ---------- */}
          <div className="mt-6 sm:mt-8">
            <p className="inline-block px-4 py-1 mb-3 text-base tracking-wider text-black bg-white border-[3px] border-black rounded-full sm:text-lg font-comic">
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

          {/* ---------- REVIEW MODAL ---------- */}
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
