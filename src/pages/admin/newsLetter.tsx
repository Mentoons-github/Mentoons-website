import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaCalendarAlt, FaEnvelope, FaFilter, FaSearch } from "react-icons/fa";
import Loader from "@/components/common/admin/loader";
import Pagination from "@/components/admin/pagination";

interface SubscriberData {
  _id: string;
  email: string;
  name: string;
  status: "active" | "inactive" | "Unsubscribed";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [limit, setLimit] = useState<number>(10);

  // Apply debounce to search term - 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get(
        // `http://localhost:4000/api/v1/email/newsletter-subscribers`,
        `${import.meta.env.VITE_PROD_URL}/email/newsletter-subscribers`,
        {
          params: {
            page: currentPage,
            limit,
            search: debouncedSearchTerm,
            status: activeFilter !== "all" ? activeFilter : undefined,
          },
        }
      );
      console.log("response", response.data);
      setSubscribers(response.data.data.data || []);
      setTotalPages(response.data.data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      setError("Failed to load newsletter subscribers");
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, debouncedSearchTerm, activeFilter]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // We'll keep this to reset to page 1 when search changes
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page on limit change
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "Unsubscribed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) return <Loader />;

  if (error && subscribers.length === 0) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container min-h-screen px-4 py-8 mx-auto bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-start justify-between mb-6 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Newsletter Subscribers
          </h1>
          <div className="mt-2 text-sm text-gray-500 sm:mt-0">
            Total: <span className="font-medium">{subscribers.length}</span>{" "}
            subscribers
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-4 mb-6 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-start space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center text-sm font-medium text-gray-700">
                <FaFilter className="mr-2 text-blue-500" /> Filter:
              </span>
              <div className="flex flex-wrap gap-2">
                {["all", "active", "inactive", "Unsubscribed"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      activeFilter === filter
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search subscribers..."
                className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchTerm && searchTerm !== debouncedSearchTerm && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subscribers List */}
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Date Subscribed
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 text-blue-500 bg-blue-100 rounded-full">
                            <FaEnvelope className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {subscriber.name || "Subscriber"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {subscriber.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {formatDate(subscriber.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                            subscriber.status
                          )}`}
                        >
                          {subscriber.status.charAt(0).toUpperCase() +
                            subscriber.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 bg-gray-50 sm:px-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={subscribers.length * totalPages}
                limit={limit}
                onLimitChange={handleLimitChange}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
