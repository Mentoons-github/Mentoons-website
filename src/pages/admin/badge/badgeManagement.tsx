import { fetchBadges, deleteBadge } from "@/api/badge/badge";
import DynamicTable from "@/components/admin/dynamicTable";
import { Badge } from "@/types/adda/userProfile";
import { useAuth } from "@clerk/clerk-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ViewDetailsModal from "@/components/modals/viewDetails";
import DeleteConfirmationModal from "@/components/admin/modal/deleteConfirmation";
import SuccessDisplay from "@/components/adda/userProfile/loader/successDisplay";
import ErrorDisplay from "@/components/adda/userProfile/loader/errorDisplay";

const BadgeManagement = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [badges, setBadges] = useState<Badge[]>([]);
  const [badgeToView, setBadgeToView] = useState<Badge | null>(null);
  const [showBadge, setShowBadge] = useState(false);

  const [badgeToDelete, setBadgeToDelete] = useState<Badge | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const badgeFetch = async () => {
      try {
        const token = (await getToken()) ?? "";
        const response = await fetchBadges({ token });

        if (!response.success) {
          toast.error(response.error ?? "Failed to fetch badges");
          return;
        }

        setBadges(response.data.badges || []);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load badges");
      }
    };

    badgeFetch();
  }, [getToken]);

  const confirmDelete = useCallback(async () => {
    if (!badgeToDelete) return;

    try {
      const token = await getToken();
      if (!token) {
        toast.error("User not authorized");
        return;
      }

      const result = await deleteBadge({ badgeId: badgeToDelete._id!, token });

      console.log(result);
      if (!result?.success) {
        throw new Error(result?.error || "Failed to delete badge");
      }

      setSuccessMessage("Badge deleted successfully");
      setBadges((prev) => prev.filter((b) => b._id !== badgeToDelete._id));
      // toast.success("Badge deleted successfully");
    } catch (err: any) {
      console.error("Delete error:", err);
      const errorMsg = err.message || "Failed to delete badge";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setDeleteModalOpen(false);
      setBadgeToDelete(null);
    }
  }, [badgeToDelete, getToken]);

  const addBadge = () => {
    navigate("/admin/badge/add");
  };

  const onBadgeView = (item: Badge) => {
    setBadgeToView(item);
    setShowBadge(true);
  };

  const openDeleteModal = (item: Badge) => {
    setBadgeToDelete(item);
    setDeleteModalOpen(true);
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Badges</h1>
      </div>

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

      <DynamicTable
        data={badges}
        itemType="badges"
        onAdd={addBadge}
        onDelete={openDeleteModal}
        onView={onBadgeView}
        excludeColumns={["animation", "criteria", "image"]}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBadgeToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={badgeToDelete?.name || "this badge"}
      />

      <ViewDetailsModal
        data={badgeToView}
        isOpen={showBadge}
        onClose={() => {
          setShowBadge(false);
          setBadgeToView(null);
        }}
        title={badgeToView?.name || "Badge Details"}
        imageFields={["image"]}
        linkFields={[]}
        excludeFields={["animation", "__v", "updatedAt"]}
        actions={
          <button
            onClick={() => {
              if (badgeToView) {
                openDeleteModal(badgeToView);
                setShowBadge(false);
              }
            }}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            🗑️ Delete Badge
          </button>
        }
      />
    </div>
  );
};

export default BadgeManagement;
