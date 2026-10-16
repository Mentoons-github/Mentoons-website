import { useState, useEffect } from "react";
import MeetupHeader from "../meetupHeader";
import MeetupCarousel from "../meetupCarousal";
import MeetupPreviewCards from "../meetupPreview";
import axios from "axios";

const HALFTONE_BG = {
  backgroundColor: "#F5F5F4",
  backgroundImage: "radial-gradient(#d6d3d1 1.2px, transparent 1.2px)",
  backgroundSize: "16px 16px",
};

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
        },
      );

      const { data, pagination: paginationData } = response.data;
      setMeetups(data);
      setPagination(paginationData);
      setCurrentIndex(0);
      setLoading(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch meetups. Please try again later.",
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
    return (
      <div className="my-10 text-center">
        <p className="font-comic inline-block rotate-1 rounded-2xl border-2 border-gray-900 bg-[#FFD93D] px-6 py-3 text-2xl tracking-wide text-gray-900 shadow-[5px_5px_0_0_#111827]">
          Loading meetups...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-10 text-center">
        <p className="font-comic inline-block -rotate-1 rounded-2xl border-2 border-gray-900 bg-[#FF5D8F] px-6 py-3 text-2xl tracking-wide text-white shadow-[5px_5px_0_0_#111827]">
          {error}
        </p>
      </div>
    );
  }

  const pagerBtn =
    "font-comic-chip rounded-xl border-2 border-gray-900 bg-[#FFD93D] px-5 py-2 text-base tracking-wide text-gray-900 shadow-[4px_4px_0_0_#111827] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#111827] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-60 disabled:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0";

  return (
    <div
      style={HALFTONE_BG}
      className="mx-auto my-10 max-w-7xl rounded-2xl border-2 border-gray-900 px-4 py-8 shadow-[8px_8px_0_0_#111827] sm:px-8"
    >
      <div className="mb-6">
        <MeetupHeader active={active} handleTabChange={handleTabChange} />
        <div className="mt-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search meetups..."
            value={search}
            onChange={handleSearch}
            className="w-full max-w-xs rounded-xl border-2 border-gray-900 bg-white px-4 py-2 font-semibold text-gray-900 shadow-[3px_3px_0_0_#111827] placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-[#FFD93D]"
          />
          {active === "online" && (
            <select
              value={platform}
              onChange={handlePlatformFilter}
              className="rounded-xl border-2 border-gray-900 bg-white px-4 py-2 font-semibold text-gray-900 shadow-[3px_3px_0_0_#111827] focus:outline-none focus:ring-4 focus:ring-[#FFD93D]"
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
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={!pagination.hasPrevPage}
          className={pagerBtn}
        >
          Previous
        </button>
        <span className="font-comic rounded-xl border-2 border-gray-900 bg-white px-4 py-1 text-xl tracking-wide text-gray-900 shadow-[3px_3px_0_0_#111827]">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={!pagination.hasNextPage}
          className={pagerBtn}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LetsRevive;