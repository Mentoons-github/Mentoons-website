import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { getPsychologistWorkshopBatchesThunk } from "@/redux/workshop/workshopBatches/workshopBatchThunk";

const statusColor = {
  ongoing: "bg-green-200 text-green-700",
  completed: "bg-gray-200 text-gray-700",
  upcoming: "bg-yellow-200 text-yellow-700",
  draft: "bg-blue-200 text-blue-700",
};

const PsychologistWorkshops = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();

  const { psychologistBatches, psychologistPagination } = useAppSelector(
    (state) => state.workshop_batch,
  );

  const [filter, setFilter] = useState("ongoing");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const limit = 12;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchBatches = async () => {
      const token = await getToken();

      dispatch(
        getPsychologistWorkshopBatchesThunk({
          token: token as string,
          filter,
          search: debouncedSearch,
          sort,
          page,
          limit,
        }),
      );
    };

    fetchBatches();
  }, [dispatch, getToken, filter, debouncedSearch, sort, page]);

  return (
    <div className="md:p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workshop Sessions</h1>

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* FILTER + SEARCH */}
      <div className="md:flex space-y-5 md:space-y-0 justify-between mb-6">
        <div className="flex gap-4 md:gap-6 lg:gap-10">
          {["ongoing", "upcoming", "completed"].map((status) => (
            <div
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className={`cursor-pointer ${
                status === filter
                  ? "border-b-[3px] border-blue-600 font-medium"
                  : ""
              }`}
            >
              {status}
            </div>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="border rounded-md h-10 w-64 p-3"
        />
      </div>

      {/* EMPTY STATE */}
      {psychologistBatches.length === 0 && (
        <div className="min-h-[400px] flex items-center justify-center">
          <h2 className="text-gray-500 text-lg">
            No {filter} Workshop Batches available
          </h2>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mt-3">
        {psychologistBatches.map((workshop) => (
          <div
            key={workshop._id}
            onClick={() => navigate(workshop._id)}
            className="cursor-pointer rounded-xl border p-4 hover:shadow-md transition"
          >
            <img
              src={workshop.workshopId.image}
              alt={workshop.workshopId.name}
              className="md:h-60 lg:h-72 w-full rounded-lg object-cover"
            />

            <div className="mt-3 space-y-3">
              <div className="flex justify-between">
                <div className="flex items-center gap-2 font-semibold text-[#11b5e1]">
                  <BookOpen size={18} />
                  {workshop.workshopId.name}
                </div>
                <div>{workshop.workshopId.duration}</div>
              </div>

              <div className="flex justify-between">
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    statusColor[workshop.status]
                  }`}
                >
                  {workshop.status}
                </span>
                <span className="text-xs text-gray-500">
                  Age: {workshop.workshopId.age}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}

      {psychologistPagination && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-4 py-2">
            {page} / {psychologistPagination.totalPages}
          </span>

          <button
            disabled={page === psychologistPagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PsychologistWorkshops;
