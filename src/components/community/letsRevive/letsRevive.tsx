import { useState, useEffect } from "react";
import MeetupHeader from "../meetupHeader";
import MeetupCarousel from "../meetupCarousal";
import MeetupPreviewCards from "../meetupPreview";
import axios from "axios";

const LetsRevive = () => {
  const [active, setActive] = useState<"online" | "offline">("online");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [meetups, setMeetups] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");

  const fetchMeetups = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/meetup`,
        {
          params: {
            page,
            limit: pagination.limit,
            sort: "-createdAt",
            search,
            platform: active === "online" ? platform : undefined,
            isOnline: active === "online" ? "true" : "false",
          },
        }
      );

      const { data, pagination: paginationData } = response.data;
      setMeetups(data);
      setPagination(paginationData);
      setCurrentIndex(0);
      setLoading(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch meetups. Please try again later."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchMeetups(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [active, search, platform]);

  const handleTabChange = (newActive: "offline" | "online") => {
    setActive(newActive);
    setSearch("");
    setPlatform("");
    setCurrentIndex(0);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchMeetups(newPage);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePlatformFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlatform(e.target.value);
  };

  const currentMeetup = meetups[currentIndex];

  if (loading) {
    return <div className="text-center my-10">Loading meetups...</div>;
  }

  if (error) {
    return <div className="text-center my-10 text-red-500">{error}</div>;
  }

  return (
    <div className="my-10 mt-10 max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <MeetupHeader active={active} handleTabChange={handleTabChange} />
        <div className="flex gap-4 mt-4">
          <input
            type="text"
            placeholder="Search meetups..."
            value={search}
            onChange={handleSearch}
            className="border rounded px-3 py-2 w-full max-w-xs"
          />
          {active === "online" && (
            <select
              value={platform}
              onChange={handlePlatformFilter}
              className="border rounded px-3 py-2"
            >
              <option value="">All Platforms</option>
              <option value="Zoom">Zoom</option>
              <option value="Google Meet">Google Meet</option>
              <option value="Discord">Discord</option>
            </select>
          )}
        </div>
      </div>
      <MeetupCarousel
        currentMeetup={currentMeetup}
        currentMeetups={meetups}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        active={active}
      />
      <MeetupPreviewCards
        currentMeetups={meetups}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={!pagination.hasPrevPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={!pagination.hasNextPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LetsRevive;
