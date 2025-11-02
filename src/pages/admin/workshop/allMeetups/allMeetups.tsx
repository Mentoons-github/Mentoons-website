import { fetchMeetups, meetupDelete } from "@/api/meetups";
import ErrorDisplay from "@/components/adda/userProfile/loader/errorDisplay";
import SuccessDisplay from "@/components/adda/userProfile/loader/successDisplay";
import DynamicTable from "@/components/admin/dynamicTable";
import DeleteConfirmationModal from "@/components/admin/modal/deleteConfirmation";
import ViewDetailsModal from "@/components/modals/meetupModal";
import { EXCLUDE_MEETUPS } from "@/constant/admin";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@clerk/clerk-react";

// Unified type from API (recommended)
export interface MeetupFromAPI {
  _id: string;
  title: string;
  dateTime: string;
  duration: string;
  maxCapacity: number;
  place?: string;
  platform?: string;
  meetingLink?: string;
  description: string;
  detailedDescription: string;
  speakerName: string;
  speakerImage: string;
  topics: string[];
  tags: string[];
  isOnline: boolean;
  venue?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const AllMeetups = () => {
  const [meetups, setMeetups] = useState<MeetupFromAPI[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [meetupToDelete, setMeetupToDelete] = useState<MeetupFromAPI | null>(
    null
  );

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [meetupToView, setMeetupToView] = useState<MeetupFromAPI | null>(null);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchMeetups(searchTerm);

      if (!response.success) {
        throw new Error((response.data as string) || "Error fetching meetups");
      }

      if (Array.isArray(response.data)) {
        const processed: MeetupFromAPI[] = response.data.map(
          (m: any): MeetupFromAPI => {
            const dateTime =
              m.dateTime ||
              (m.date && m.time
                ? `${m.date}T${m.time}`
                : new Date().toISOString());

            return {
              _id: m._id!,
              title: m.title || "Untitled",
              dateTime,
              duration: m.duration || "-",
              maxCapacity: m.maxCapacity || 0,
              place: m.place,
              platform: m.platform,
              meetingLink: m.meetingLink,
              description: m.description || "",
              detailedDescription: m.detailedDescription || "",
              speakerName: m.speakerName || "Unknown",
              speakerImage: m.speakerImageUrl || m.speakerImage || "",
              topics: (m.topics || "")
                .toString()
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean),
              tags: (m.tags || "")
                .toString()
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean),
              isOnline: m.isOnline || false,
              venue: m.isOnline ? m.platform : m.place,
              createdAt: m.createdAt || "",
              updatedAt: m.updatedAt || "",
              __v: m.__v || 0,
            };
          }
        );

        setMeetups(processed);
        setError(null);
        setSuccessMessage(null);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err: any) {
      console.error("Error fetching meetups:", err);
      setError(err.message || "Failed to fetch meetups");
      setMeetups([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openDeleteModal = (item: MeetupFromAPI) => {
    setMeetupToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = useCallback(async () => {
    if (!meetupToDelete) return;

    const token = await getToken();
    if (!token) {
      setError("Authentication token missing");
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      const result = await meetupDelete(token, meetupToDelete._id);
      if (!result?.success) {
        throw new Error((result?.data as string) || "Failed to delete meetup");
      }

      setSuccessMessage("Meetup deleted successfully");
      setError(null);
      setMeetups((prev) => prev.filter((m) => m._id !== meetupToDelete._id));
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete meetup");
    } finally {
      setIsDeleteModalOpen(false);
      setMeetupToDelete(null);
    }
  }, [meetupToDelete, getToken]);

  const editMeetup = useCallback(
    (item: MeetupFromAPI) => {
      navigate(`/admin/edit-meetup/${item._id}`);
    },
    [navigate]
  );

  const addMeetup = useCallback(() => {
    navigate("/admin/add-meetup");
  }, [navigate]);

  const viewMeetup = useCallback((item: MeetupFromAPI) => {
    setMeetupToView(item);
    setIsViewModalOpen(true);
  }, []);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const formatCell = (
    value: any,
    key: string,
    item: MeetupFromAPI
  ): React.ReactNode => {
    if (key === "venue") return item.isOnline ? item.platform : item.place;
    if (key === "dateTime") {
      try {
        return format(new Date(value), "MMMM d, yyyy, h:mm a");
      } catch {
        return "-";
      }
    }
    if (value == null) return "-";
    const str = String(value);
    return str.length > 50 ? `${str.substring(0, 50)}...` : str;
  };

  const formatHeader = (key: string): string => {
    if (key === "venue") return "Venue";
    if (key === "dateTime") return "Date & Time";
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">All Meetups</h1>

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

      <DynamicTable<MeetupFromAPI>
        data={meetups}
        itemType="meetups"
        onDelete={openDeleteModal}
        onEdit={editMeetup}
        onAdd={addMeetup}
        onView={viewMeetup}
        searchTerm={searchTerm}
        onSearch={handleSearchChange}
        excludeColumns={[...EXCLUDE_MEETUPS, "place", "platform"]}
        formatCell={formatCell}
        formatHeader={formatHeader}
        idKey="_id"
        isLoading={loading}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMeetupToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={meetupToDelete?.title || "this meetup"}
      />

      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setMeetupToView(null);
        }}
        meetup={meetupToView}
      />
    </div>
  );
};

export default AllMeetups;
