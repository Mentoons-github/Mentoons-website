import { fetchMeetups, meetupDelete } from "@/api/meetups";
import ErrorDisplay from "@/components/adda/userProfile/loader/errorDisplay";
import SuccessDisplay from "@/components/adda/userProfile/loader/successDisplay";
import DynamicTable from "@/components/admin/dynamicTable";
import { EXCLUDE_MEETUPS } from "@/constant/admin";
import { MeetupFormValues } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const AllMeetups = () => {
  const [meetups, setMeetups] = useState<MeetupFormValues[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchMeetups(searchTerm);

      if (!response.success) {
        throw new Error((response.data as string) || "Error fetching meetups");
      }

      if (Array.isArray(response.data)) {
        const processedMeetups = response.data.map(
          (meetup: MeetupFormValues) => ({
            ...meetup,
            venue: meetup.isOnline ? meetup.platform : meetup.place,
          })
        );
        setMeetups(processedMeetups);
        setError(null);
        setSuccessMessage(null);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching meetups:", error);
      setError(String(error) || "Failed to fetch meetups");
      setSuccessMessage(null);
      setMeetups([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteMeetup = useCallback(async (item: MeetupFormValues) => {
    if (window.confirm(`Are you sure you want to delete ${item.title}?`)) {
      try {
        const response = await meetupDelete(item._id!);
        if (!response?.success) {
          throw new Error(response?.data || "Failed to delete meetup");
        }
        setSuccessMessage(response?.data || "Meetup deleted successfully");
        setError(null);
        setMeetups((prev) => prev.filter((meetup) => meetup._id !== item._id));
      } catch (error) {
        console.error("Error deleting meetup:", error);
        setError(String(error) || "Failed to delete meetup");
        setSuccessMessage(null);
      }
    }
  }, []);

  const editMeetup = useCallback(
    (item: MeetupFormValues) => {
      console.log("item data :", item);
      navigate(`/admin/edit-meetup/${item._id}`);
    },
    [navigate]
  );

  const addMeetup = useCallback(() => {
    navigate("/admin/add-meetup");
  }, [navigate]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const formatCell = (
    value: any,
    key: string,
    item: MeetupFormValues
  ): React.ReactNode => {
    if (key === "venue") {
      return item.isOnline ? item.platform : item.place;
    }
    if (key === "dateTime") {
      try {
        return format(new Date(value), "MMMM d, yyyy, h:mm a");
      } catch (e) {
        return "-";
      }
    }
    if (value === null || value === undefined) return "-";
    const stringValue = String(value);
    return stringValue.length > 50
      ? `${stringValue.substring(0, 50)}...`
      : stringValue;
  };

  const formatHeader = (key: string): string => {
    if (key === "venue") return "Venue";
    if (key === "dateTime") return "Date & Time";
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">All Meetups</h1>

      {error && <ErrorDisplay message="Meetup Deletion" description={error} />}
      {successMessage && (
        <SuccessDisplay message="Meetup Deleted" description={successMessage} />
      )}

      <DynamicTable<MeetupFormValues>
        data={meetups}
        itemType="meetups"
        onDelete={deleteMeetup}
        onEdit={editMeetup}
        onAdd={addMeetup}
        searchTerm={searchTerm}
        onSearch={handleSearchChange}
        excludeColumns={[...EXCLUDE_MEETUPS, "place", "platform"]}
        formatCell={formatCell}
        formatHeader={formatHeader}
        idKey="_id"
        isLoading={loading}
      />
    </div>
  );
};

export default AllMeetups;
