import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DynamicTable from "@/components/admin/dynamicTable";
import { useAuth } from "@clerk/clerk-react";
import DeleteConfirmationModal from "@/components/admin/modal/deleteConfirmation";

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
  const { getToken } = useAuth();
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState<Workshop | null>(
    null
  );
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_PROD_URL;

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const token = await getToken();
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `${API_BASE_URL}/workshop/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  const handleEdit = (item: Workshop) => {
    navigate(`/admin/add-workshop?workshopId=${item._id}`);
  };

  const handleDelete = (item: Workshop) => {
    setWorkshopToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (workshopToDelete) {
      try {
        const token = await getToken();
        const response = await axios.delete(
          `${API_BASE_URL}/workshop/${workshopToDelete._id}`,{
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to delete workshop");
        }

        setWorkshops((prev) =>
          prev.filter((workshop) => workshop._id !== workshopToDelete._id)
        );
        if (workshops.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
      } catch (error) {
        console.error("Error deleting workshop:", error);
      }
    }
    setIsDeleteModalOpen(false);
    setWorkshopToDelete(null);
  };

  const handleAdd = () => {
    navigate("/admin/add-workshop");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && pagination && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const formatCell = (value: any, key: string): React.ReactNode => {
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
        searchTerm={searchTerm}
        onSearch={handleSearchChange}
        sortField={String(sortField)}
        sortOrder={sortOrder}
        onSort={handleSort}
        excludeColumns={["_id", "__v", "updatedAt", "workshops", "description"]}
        maxCellLength={50}
        formatCell={formatCell}
        formatHeader={formatHeader}
        idKey="_id"
        isLoading={loading}
        itemType="workshop"
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
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={workshopToDelete ? workshopToDelete.workshopName : ""}
      />
    </div>
  );
};

export default AllWorkshops;
