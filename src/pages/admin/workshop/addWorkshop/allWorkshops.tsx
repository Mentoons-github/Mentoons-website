import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DynamicTable from "@/components/admin/dynamicTable";

// Define TypeScript interfaces based on the Mongoose schema
interface WhyChooseUs {
  heading: string;
  description: string;
}

interface Benefit {
  title: string;
  description: string;
}

interface AgeGroup {
  ageRange: string;
  image: string;
  serviceOverview: string;
  benefits: Benefit[];
}

interface Workshop {
  _id: string;
  workshopName: string;
  whyChooseUs: WhyChooseUs[];
  ageGroups: AgeGroup[];
  createdAt: string | Date;
}

interface Pagination {
  totalDocuments: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    workshops: Workshop[];
    pagination: Pagination;
  };
}
const AllWorkshops: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Workshop>("workshopName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_PROD_URL;

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `${API_BASE_URL}/workshop/all`,
          {
            params: {
              page,
              limit,
              sortBy: sortField,
              sortOrder,
              ...(searchTerm && { search: searchTerm }),
            },
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Error fetching workshops");
        }

        setWorkshops(response.data.data.workshops);
        setPagination(response.data.data.pagination);
      } catch (error) {
        console.error("Error fetching workshops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [page, sortField, sortOrder, searchTerm, limit, API_BASE_URL]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleSort = (field: string) => {
    const typedField = field as keyof Workshop;
    setSortField(typedField);
    setSortOrder((prev) =>
      prev === "asc" && field === sortField ? "desc" : "asc"
    );
    setPage(1);
  };

  // Handle view action
  const handleView = (item: Workshop) => {
    navigate(`/workshops/${item._id}`);
  };

  // Handle edit action
  const handleEdit = (item: Workshop) => {
    navigate(`/admin/add-workshop?workshopId=${item._id}`);
  };

  // Handle delete action
  const handleDelete = async (item: Workshop) => {
    if (
      window.confirm(`Are you sure you want to delete ${item.workshopName}?`)
    ) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/workshops/${item._id}`
        );

        if (response.status !== 200) {
          throw new Error("Failed to delete workshop");
        }

        // Refetch data after delete to update pagination
        // Or remove from state if on current page
        setWorkshops((prev) =>
          prev.filter((workshop) => workshop._id !== item._id)
        );
        if (workshops.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
      } catch (error) {
        console.error("Error deleting workshop:", error);
        // Optionally refetch on error
      }
    }
  };

  // Handle add action
  const handleAdd = () => {
    navigate("/workshops/add");
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && pagination && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  // Custom cell formatting
  const formatCell = (
    value: any,
    key: string,
    // item: Workshop
  ): React.ReactNode => {
    if (key === "whyChooseUs") {
      return (
        value.map((item: WhyChooseUs) => item.heading).join(", ") || "None"
      );
    }
    if (key === "ageGroups") {
      return (
        value.map((group: AgeGroup) => group.ageRange).join(", ") || "None"
      );
    }
    if (key === "createdAt") {
      return new Date(value).toLocaleDateString();
    }
    return String(value);
  };

  // Custom header formatting
  const formatHeader = (key: string): string => {
    const headers: Record<string, string> = {
      workshopName: "Workshop Name",
      whyChooseUs: "Why Choose Us",
      ageGroups: "Age Groups",
      createdAt: "Created At",
    };
    return (
      headers[key] ||
      key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Workshops</h1>
      <DynamicTable<Workshop>
        data={workshops}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        onView={handleView}
        searchTerm={searchTerm}
        onSearch={handleSearchChange}
        sortField={String(sortField)}
        sortOrder={sortOrder}
        onSort={handleSort}
        excludeColumns={["_id", "__v"]}
        maxCellLength={50}
        formatCell={formatCell}
        formatHeader={formatHeader}
        idKey="_id"
        isLoading={loading}
        itemType="product"
      />
      {pagination && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {pagination.pageSize} of {pagination.totalDocuments}{" "}
            workshops
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWorkshops;
