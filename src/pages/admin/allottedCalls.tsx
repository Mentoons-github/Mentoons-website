import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";
import { motion } from "framer-motion";
import {
  ArrowPathIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Pagination from "@/components/admin/pagination";
import { toast } from "sonner";
import { FaClock, FaEye, FaUserMd } from "react-icons/fa";
import PsychologistDetails, {
  Psychologist,
} from "@/components/admin/modal/psychologistDetails";

interface Call {
  _id: string;
  name: string;
  phone: string;
  email: string;
  time: string;
  date: string;
  status: keyof typeof statusConfig;
  psychologist: Psychologist;
}

type StatusConfigType = {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
    label: string;
    icon?: string;
  };
};

const statusConfig: StatusConfigType = {
  "reached out": {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    label: "Reached Out",
  },
  completed: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    label: "completed",
    icon: "✅",
  },
  "awaiting outreach": {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
    label: "Awaiting Outreach",
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
    label: "Cancelled",
    icon: "❌",
  },
};

const AllottedCalls = () => {
  const { getToken } = useAuth();
  const [showDetailModal, setDetailModal] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] =
    useState<Psychologist | null>(null);
  const [allottedCalls, setAllottedCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Call>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showingSampleData, setShowingSampleData] = useState<boolean>(false);
  const [expandedCards, setExpandedCards] = useState<{
    [key: string]: boolean;
  }>({});

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchAllottedCalls = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PROD_URL
        }/admin/sessioncalls?search=${searchTerm}&sortField=${sortField}&sortOrder=${sortDirection}&page=${currentPage}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      console.log(response);

      const fetchedCalls = response.data.data.allocatedCalls;

      if (fetchedCalls && fetchedCalls.length > 0) {
        setAllottedCalls(fetchedCalls);
        setShowingSampleData(false);

        setTotalItems(response.data.data.totalItems || fetchedCalls.length);
        setTotalPages(
          response.data.data.totalPages ||
            Math.ceil(fetchedCalls.length / limit)
        );
      }
    } catch (error) {
      console.error("Error fetching allotted calls:", error);
      toast.error("Error fetching allotted calls");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePsychologistClick = async (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist);
    setDetailModal(true);
  };

  useEffect(() => {
    fetchAllottedCalls();
  }, [currentPage, limit, sortField, sortDirection]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSort = (field: keyof Call) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const toggleExpandCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredCalls = allottedCalls.filter((call) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      call.name.toLowerCase().includes(searchLower) ||
      call.phone.toLowerCase().includes(searchLower) ||
      call.email.toLowerCase().includes(searchLower) ||
      (statusConfig[call.status]?.label.toLowerCase() || "").includes(
        searchLower
      )
    );
  });

  const sortedCalls = [...filteredCalls].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const refreshData = () => {
    fetchAllottedCalls();
  };

  const handleSearch = () => {
    fetchAllottedCalls();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 text-blue-500"
        >
          <ArrowPathIcon className="w-full h-full" />
        </motion.div>
      </div>
    );
  }

  if (allottedCalls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-64 gap-4"
      >
        <div className="text-center text-2xl font-bold text-gray-900">
          No allotted calls
        </div>
        <button
          onClick={refreshData}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Refresh
        </button>
      </motion.div>
    );
  }

  const renderMobileCards = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 lg:hidden"
      >
        {sortedCalls.map((call) => (
          <motion.div
            key={call._id}
            className="bg-white rounded-lg shadow overflow-hidden"
            variants={itemVariants}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleExpandCard(call._id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-lg font-medium">
                      {call.name ? call.name.charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {call.name}
                    </p>
                    <div className="mt-1">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          statusConfig[call.status]?.bg || "bg-gray-100"
                        } ${
                          statusConfig[call.status]?.text || "text-gray-800"
                        } ${
                          statusConfig[call.status]?.border || "border-gray-200"
                        } border`}
                      >
                        <span className="mr-1">
                          {statusConfig[call.status]?.icon}
                        </span>
                        {statusConfig[call.status]?.label || call.status}
                      </motion.span>
                    </div>
                  </div>
                </div>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedCards[call._id] ? "transform rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {expandedCards[call._id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-4 pt-2 border-t border-gray-200"
              >
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center">
                      <PhoneIcon className="w-4 h-4 text-gray-500" />
                      <span className="ml-2 text-xs text-gray-500">Phone</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-900">{call.phone}</p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                      <span className="ml-2 text-xs text-gray-500">Email</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-900 break-all">
                      {call.email}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <FaUserMd className="w-4 h-4 text-gray-500" />
                      <span className="ml-2 text-xs text-gray-500">
                        Psychologist
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-900 break-all flex items-center gap-3">
                      {call.psychologist.name}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePsychologistClick(call.psychologist);
                        }}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FaEye />
                      </button>
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <FaClock className="w-4 h-4 text-gray-500" />
                      <span className="ml-2 text-xs text-gray-500">
                        Scheduled At
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-900 break-all">
                      {moment(call.time, "HH:mm").format("h:mm A")}{" "}
                      &nbsp;|&nbsp; {moment(call.date).format("MMMM D, YYYY")}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderDesktopTable = () => {
    return (
      <div className="hidden lg:block overflow-hidden">
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-1" />
                    Caller Name
                    {sortField === "name" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("phone")}
                >
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-1" />
                    Phone
                    {sortField === "phone" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-4 h-4 mr-1" />
                    Email
                    {sortField === "email" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("psychologist")}
                >
                  <div className="flex items-center">
                    <FaUserMd className="w-4 h-4 mr-1" />
                    Psychologist
                    {sortField === "psychologist" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("time")}
                >
                  <div className="flex items-center">
                    <FaClock className="w-4 h-4 mr-1" />
                    Scheduled
                    {sortField === "time" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === "status" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <motion.tbody
              className="bg-white divide-y divide-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sortedCalls.map((call) => (
                <motion.tr
                  key={call._id}
                  className="hover:bg-gray-50 transition-colors"
                  variants={itemVariants}
                >
                  <td className="px-3 sm:px-1 xl:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm lg:text-md xl:text-lg font-medium">
                          {call.name ? call.name.charAt(0).toUpperCase() : "?"}
                        </span>
                      </div>
                      <div className="ml-2 sm:ml-4">
                        <div className="text-xs lg:text-[13px] xl:text-sm font-medium text-gray-900">
                          {call.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-1 xl:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-xs lg:text-[13px] xl:text-sm text-gray-900">
                      {call.phone}
                    </div>
                  </td>
                  <td className="px-3 sm:px-1 xl:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-xs lg:text-[13px] xl:text-sm text-gray-900">
                      <span className="truncate max-w-[150px] xl:max-w-none">
                        {call.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-1 xl:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 sm:gap-5 text-xs lg:text-[13px] xl:text-sm text-gray-900">
                      <span className="truncate max-w-[100px] xl:max-w-none">
                        {call.psychologist.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePsychologistClick(call.psychologist);
                        }}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 sm:px-1 xl:px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col xl:flex-row xl:items-center text-xs lg:text-[13px] xl:text-sm text-gray-900">
                      <div className="flex items-center">
                        {moment(call.time, "HH:mm").format("h:mm A")}
                      </div>
                      <span className="hidden xl:inline mx-1">|</span>
                      <div className="mt-1 xl:mt-0">
                        {moment(call.date).format("MMM D, YYYY")}
                      </div>
                    </div>
                  </td>

                  <td className="px-3 sm:px-1 xl:px-6 py-4 whitespace-nowrap">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs lg:text-[13px] xl:text-sm ${
                        statusConfig[call.status]?.bg || "bg-gray-100"
                      } ${statusConfig[call.status]?.text || "text-gray-800"} ${
                        statusConfig[call.status]?.border || "border-gray-200"
                      } border`}
                    >
                      <span className="mr-1">
                        {statusConfig[call.status]?.icon}
                      </span>
                      {statusConfig[call.status]?.label || call.status}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="px-2 sm:px-6 py-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Allotted Calls
          </h1>
          {showingSampleData && (
            <p className="text-xs sm:text-sm text-amber-600 mt-1">
              Showing sample data. No actual calls found.
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search calls..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <button
              onClick={handleSearch}
              className="p-2 flex-1 sm:flex-none bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              title="Search"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            <button
              onClick={refreshData}
              className="p-2 flex-1 sm:flex-none bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              title="Refresh data"
              aria-label="Refresh data"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-transparent rounded-lg">
        {renderMobileCards()}
        {renderDesktopTable()}
      </div>

      <div className="mt-4 overflow-x-auto">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-2 sm:mt-4 text-center text-xs sm:text-sm text-gray-500"
      >
        Showing {sortedCalls.length} of {totalItems} calls
        {showingSampleData && " (sample data)"}
      </motion.div>
      {showDetailModal && selectedPsychologist && (
        <PsychologistDetails
          onClose={() => setDetailModal(false)}
          psychologist={selectedPsychologist!}
        />
      )}
    </div>
  );
};
export default AllottedCalls;
