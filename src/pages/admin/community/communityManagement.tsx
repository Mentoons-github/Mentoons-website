import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import ErrorDisplay from "@/components/adda/userProfile/loader/errorDisplay";
import SuccessDisplay from "@/components/adda/userProfile/loader/successDisplay";
import DynamicTable from "@/components/admin/dynamicTable";
import DeleteConfirmationModal from "@/components/admin/modal/deleteConfirmation";
import ViewDetailsModal from "@/components/modals/viewDetails";

import {
  fetchCommunities,
  approveCommunity,
  rejectCommunity,
  deleteCommunity,
} from "@/api/groups/community";
import { toast } from "sonner";

export interface CommunityFromAPI {
  _id: string;
  name: string;
  details: {
    subTitle: string;
    description: string;
  };
  members: string[];
  profileImage: string;
  groupCreationStatus: "pending" | "approved" | "rejected";
  createdBy: string;
  createdByRole: "User" | "Admin";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const AllCommunities = () => {
  const [communities, setCommunities] = useState<CommunityFromAPI[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [communityToDelete, setCommunityToDelete] =
    useState<CommunityFromAPI | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [communityToView, setCommunityToView] =
    useState<CommunityFromAPI | null>(null);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        toast.error("User not authorized");
        return;
      }

      const response = await fetchCommunities(debouncedSearchTerm, token);

      if (!response.success) {
        throw new Error(
          (response.data as string) || "Error fetching communities",
        );
      }

      if (Array.isArray(response.data.allGroups)) {
        const processed: CommunityFromAPI[] = response.data.allGroups.map(
          (c: any): CommunityFromAPI => ({
            _id: c._id!,
            name: c.name || "Untitled Community",
            details: {
              subTitle: c.details?.subTitle || "",
              description: c.details?.description || "",
            },
            members: Array.isArray(c.members) ? c.members : [],
            profileImage: c.profileImage || "",
            groupCreationStatus: c.groupCreationStatus || "pending",
            createdBy: c.createdBy || "",
            createdByRole: c.createdByRole || "User",
            createdAt: c.createdAt || "",
            updatedAt: c.updatedAt || "",
            __v: c.__v || 0,
          }),
        );

        setCommunities(processed);
        setError(null);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err: any) {
      console.error("Error fetching communities:", err);
      setError(err.message || "Failed to fetch communities");
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, getToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = useCallback(
    async (item: CommunityFromAPI) => {
      try {
        const token = await getToken();
        if (!token) {
          toast.error("User not authorized");
          return;
        }
        const result = await approveCommunity(item._id, token);

        if (!result?.success) {
          throw new Error(
            (result?.data as string) || "Failed to approve community",
          );
        }

        setSuccessMessage(`Community "${item.name}" approved successfully`);
        fetchData();
      } catch (err: any) {
        console.error("Approve error:", err);
        setError(err.message || "Failed to approve community");
      }
    },
    [getToken, fetchData],
  );

  const handleReject = useCallback(
    async (item: CommunityFromAPI) => {
      try {
        const token = await getToken();
        if (!token) {
          toast.error("User not authorized");
          return;
        }
        const result = await rejectCommunity(item._id, token);

        if (!result?.success) {
          throw new Error(
            (result?.data as string) || "Failed to reject community",
          );
        }

        setSuccessMessage(`Community "${item.name}" rejected successfully`);
        fetchData();
      } catch (err: any) {
        console.error("Reject error:", err);
        setError(err.message || "Failed to reject community");
      }
    },
    [getToken, fetchData],
  );

  const openDeleteModal = (item: CommunityFromAPI) => {
    setCommunityToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const onEdit = (community: CommunityFromAPI) => {
    navigate(`/admin/add-community/${community._id}`);
  };

  const confirmDelete = useCallback(async () => {
    if (!communityToDelete) return;

    try {
      const token = await getToken();
      if (!token) {
        toast.error("User not authorized");
        return;
      }
      const result = await deleteCommunity(communityToDelete._id, token);

      if (!result?.success) {
        throw new Error(
          (result?.data as string) || "Failed to delete community",
        );
      }

      setSuccessMessage("Community deleted successfully");
      setCommunities((prev) =>
        prev.filter((c) => c._id !== communityToDelete._id),
      );
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete community");
    } finally {
      setIsDeleteModalOpen(false);
      setCommunityToDelete(null);
    }
  }, [communityToDelete, getToken]);

  const addCommunity = useCallback(() => {
    navigate("/admin/add-community");
  }, [navigate]);

  const viewCommunity = useCallback((item: CommunityFromAPI) => {
    setCommunityToView(item);
    setIsViewModalOpen(true);
  }, []);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const formatCell = (
    value: any,
    key: string,
    item: CommunityFromAPI,
  ): React.ReactNode => {
    if (key === "details") {
      return (
        <div className="max-w-xs">
          <div className="font-medium">{item.details.subTitle}</div>
          <div className="text-xs text-gray-500 line-clamp-2 mt-1">
            {item.details.description.length > 80
              ? `${item.details.description.substring(0, 80)}...`
              : item.details.description}
          </div>
        </div>
      );
    }

    if (key === "groupCreationStatus") {
      const status = item.groupCreationStatus;
      let badgeClass = "bg-yellow-100 text-yellow-700";
      let label = "Pending";

      if (status === "approved") {
        badgeClass = "bg-green-100 text-green-700";
        label = "Approved";
      } else if (status === "rejected") {
        badgeClass = "bg-red-100 text-red-700";
        label = "Rejected";
      }

      return (
        <span
          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${badgeClass}`}
        >
          {label}
        </span>
      );
    }

    if (key === "members") {
      return `${item.members.length} members`;
    }

    if (value == null) return "-";
    const str = String(value);
    return str.length > 50 ? `${str.substring(0, 50)}...` : str;
  };

  const formatHeader = (key: string): string => {
    if (key === "groupCreationStatus") return "Status";
    if (key === "details") return "Details";
    if (key === "profileImage") return "Profile Image";
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">All Communities</h1>

      {successMessage && (
        <SuccessDisplay
          message="Success"
          description={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {error && (
        <ErrorDisplay
          message="Error"
          description={error}
          onClose={() => setError(null)}
        />
      )}

      <DynamicTable<CommunityFromAPI>
        data={communities}
        itemType="communities"
        onDelete={openDeleteModal}
        onAdd={addCommunity}
        onView={viewCommunity}
        onEdit={onEdit}
        searchTerm={searchTerm}
        onSearch={handleSearchChange}
        excludeColumns={[
          "members",
          "createdBy",
          "createdByRole",
          "__v",
          "polls",
          "message",
          "updatedAt",
          "_id",
          "profileImage",
        ]}
        formatCell={formatCell}
        formatHeader={formatHeader}
        idKey="_id"
        isLoading={loading}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCommunityToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={communityToDelete?.name || "this community"}
      />

      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setCommunityToView(null);
        }}
        title={
          communityToView
            ? `Community: ${communityToView.name}`
            : "Community Details"
        }
        data={communityToView}
        excludeFields={[
          "__v",
          "updatedAt",
          "createdByRole",
          "polls",
          "message",
          "details",
          "members",
        ]}
        imageFields={["profileImage"]}
        linkFields={[]}
        actions={
          communityToView && (
            <div className="flex flex-wrap gap-3">
              {communityToView.groupCreationStatus === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(communityToView);
                      setIsViewModalOpen(false);
                    }}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                  >
                    ✅ Approve
                  </button>

                  <button
                    onClick={() => {
                      handleReject(communityToView);
                      setIsViewModalOpen(false);
                    }}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                  >
                    ❌ Reject
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  openDeleteModal(communityToView);
                  setIsViewModalOpen(false);
                }}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
              >
                🗑️ Delete
              </button>
            </div>
          )
        }
      />
    </div>
  );
};

export default AllCommunities;
