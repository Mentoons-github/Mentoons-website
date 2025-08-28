import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaEnvelope,
  FaFilter,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { MdMessage, MdPendingActions } from "react-icons/md";
import { errorToast, successToast } from "@/utils/toastResposnse";

interface Query {
  _id: string;
  name: string;
  email: string;
  phone: string;
  queryType: string;
  message: string;
  status: "pending" | "in-progress" | "resolved" | "closed";
  responseMessage?: string;
  respondedBy?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

const GeneralQueries = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [status, setStatus] = useState<
    "pending" | "in-progress" | "resolved" | "closed"
  >("pending");
  const [originalQueries, setOriginalQueries] = useState<Query[]>([]);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://mentoons-backend-zlx3.onrender.com/api/v1/query"
        );
        console.log(response.data);
        setQueries(response.data.data);
        setOriginalQueries(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch queries");
        setLoading(false);
        console.error(err);
      }
    };

    fetchQueries();
  }, []);

  const handleQueryClick = (query: Query) => {
    setSelectedQuery(query);
    setStatus(query.status);
    setResponseMessage(query.responseMessage || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuery(null);
  };

  const handleSubmitResponse = async () => {
    if (!selectedQuery) return;

    try {
      const response = await axios.post(
        "https://mentoons-backend-zlx3.onrender.com/api/v1/email/sendQueryResponseEmail",
        {
          id: selectedQuery._id,
          name: selectedQuery.name,
          email: selectedQuery.email,
          message: selectedQuery.message,
          queryType: selectedQuery.queryType,
          status,
          responseMessage,
        }
      );

      if (response.status === 200) {
        // Update both queries and originalQueries to maintain consistency
        const updatedQuery = { ...selectedQuery, status, responseMessage };
        setQueries(
          queries.map((q) => (q._id === selectedQuery._id ? updatedQuery : q))
        );
        setOriginalQueries(
          originalQueries.map((q) =>
            q._id === selectedQuery._id ? updatedQuery : q
          )
        );
        closeModal();
        successToast("Query updated successfully");
      }
    } catch (err) {
      console.error("Failed to update query:", err);
      errorToast(
        `Failed to update query: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff9800]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-[#ff9800] pb-2">
        All Queries
      </h1>
      <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center">
        <div className="flex items-center">
          <FaFilter className="mr-2 text-[#ffb74d]" />
          <label
            htmlFor="queryTypeFilter"
            className="text-lg font-semibold text-gray-800"
          >
            Filter Queries:
          </label>
        </div>
        <div className="relative w-full md:w-64">
          <select
            id="queryTypeFilter"
            className="w-full p-2 pl-4 pr-10 text-gray-700 bg-white border border-[#ffb74d] rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#ffb74d] focus:border-transparent transition-all duration-300"
            onChange={(e) => {
              const filterValue = e.target.value;
              console.log(filterValue);
              if (filterValue === "all") {
                // Reset to original queries from the API response
                setQueries(originalQueries || []);
              } else {
                // Filter the original queries to maintain the complete dataset
                setQueries(
                  (originalQueries || []).filter(
                    (query) => query.queryType === filterValue
                  )
                );
              }
            }}
          >
            <option value="all">All Queries</option>
            {["general", "assessment", "product", "workshop"].map((item) => (
              <option
                key={item}
                value={item}
                className="text-gray-700 capitalize"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <FaChevronDown className="text-[#ffb74d]" />
          </div>
        </div>
      </div>
      {queries?.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No queries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {queries?.map((query) => (
            <div
              key={query._id}
              className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg"
              onClick={() => handleQueryClick(query)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-gray-800 capitalize truncate">
                    {query?.queryType || "No Subject"}
                  </h2>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      query.status
                    )}`}
                  >
                    {query.status}
                  </span>
                </div>

                <div className="flex items-center mb-2 text-gray-600">
                  <FaUser className="mr-2 text-[#ff9800]" />
                  <span className="truncate">{query.name || "Anonymous"}</span>
                </div>

                <div className="flex items-center mb-2 text-gray-600">
                  <FaEnvelope className="mr-2 text-[#ff9800]" />
                  <span className="truncate">
                    {query.email || "No email provided"}
                  </span>
                </div>

                <div className="pt-3 mt-3 border-t">
                  <p className="text-gray-700 line-clamp-2">{query.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedQuery.queryType.charAt(0).toUpperCase() +
                    selectedQuery.queryType.slice(1) || "No Subject"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                <div className="flex items-center">
                  <FaUser className="mr-2 text-[#ff9800]" />
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">
                    {selectedQuery.name || "Anonymous"}
                  </span>
                </div>

                <div className="flex items-center">
                  <FaEnvelope className="mr-2 text-[#ff9800]" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">
                    {selectedQuery.email || "No email provided"}
                  </span>
                </div>

                <div className="flex items-center">
                  <FaPhone className="mr-2 text-[#ff9800]" />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">
                    {selectedQuery.phone || "No phone provided"}
                  </span>
                </div>

                <div className="flex items-center">
                  <MdPendingActions className="mr-2 text-[#ff9800]" />
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedQuery.status
                    )}`}
                  >
                    {selectedQuery.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-start mb-2">
                  <MdMessage className="mr-2 text-[#ff9800] mt-1" />
                  <span className="font-medium">Message:</span>
                </div>
                <div className="p-4 whitespace-pre-wrap rounded-lg bg-gray-50">
                  {selectedQuery.message}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="mb-3 text-lg font-semibold">Response</h3>

                <div className="mb-4">
                  <label className="block mb-2 text-gray-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as
                          | "pending"
                          | "in-progress"
                          | "resolved"
                          | "closed"
                      )
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#ff9800] focus:border-[#ff9800]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-gray-700">
                    Response Message
                  </label>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#ff9800] focus:border-[#ff9800]"
                    placeholder="Enter your response..."
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 mr-2 text-gray-800 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitResponse}
                    className="px-4 py-2 bg-[#ff9800] text-white rounded-lg hover:bg-[#f57c00] transition-colors"
                  >
                    Submit Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralQueries;
