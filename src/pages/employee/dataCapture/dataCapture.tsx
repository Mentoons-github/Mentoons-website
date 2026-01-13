import CreateDataCaptureModal from "@/components/employee/modal/CreateDataCaptureModal";
import ReviewMechanism from "@/components/employee/modal/ReviewMechanism";
import ShowDataCaptureModal from "@/components/employee/modal/ShowDataCaptureModal";
import ShowReviewMechanism from "@/components/employee/modal/ShowReviewMechanism";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  fetchDataCaptureThunk,
  fetchSingleDataCaptureThunk,
} from "@/redux/employee/dataCaptureRedux/dataCaptureThunk";
import { Details } from "@/types/employee/dataCaptureTypes";
import { useAuth } from "@clerk/clerk-react";
import { ChevronDown, SortAsc } from "lucide-react";
import { useEffect, useState } from "react";

const sortMap: Record<string, { sortBy: string; order: "asc" | "desc" }> = {
  newestFirst: { sortBy: "createdAt", order: "desc" },
  oldestFirst: { sortBy: "createdAt", order: "asc" },
  nameAZ: { sortBy: "demographic.child.name", order: "asc" },
  nameZA: { sortBy: "demographic.child.name", order: "desc" },
};

const DataCapture = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { data, singleData, pagination } = useAppSelector(
    (state) => state.data_capture
  );
  const { getToken } = useAuth();
  const [selected, setSelected] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [viewReviewModal, setViewReviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("newestFirst");
  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const limit = 10;

  const reviewData = () => {
    setShowDetails(false);
    setReviewModalOpen(true);
  };

  const viewReviewDetails = () => {
    setShowDetails(false);
    setViewReviewModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (!token) return;
      const { sortBy, order } = sortMap[sort];
      dispatch(
        fetchDataCaptureThunk({
          token,
          limit,
          page: currentPage,
          sortBy,
          order,
          search: debouncedSearch,
        })
      );
    };
    fetchData();
  }, [currentPage, debouncedSearch, dispatch, getToken, sort]);

  useEffect(() => {
    if (showDetails) {
      const fetchData = async () => {
        const token = await getToken();
        if (!token) return;
        dispatch(
          fetchSingleDataCaptureThunk({ token, dataCaptureId: selected })
        );
      };
      fetchData();
    }
  }, [dispatch, getToken, selected, showDetails]);

  const handleReviewModalClose = () => {
    setReviewModalOpen(false);
    setShowDetails(true);
  };

  const handleShowReviewModalClose = () => {
    setViewReviewModal(false);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Data Capture</h1>
          <p className="text-sm text-gray-600">
            Manage and review captured child details
          </p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 px-2 w-44  py-2 rounded-xl
              bg-gradient-to-r from-orange-500 to-amber-400
              text-white font-semibold shadow-md
              hover:shadow-lg hover:scale-105 transition"
          >
            + Create New Data
          </button>
          <div className="flex flex-col md:flex-row items-end md:items-center gap-3 ">
            <div className="relative h-10 w-48 ">
              {" "}
              <SortAsc className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5" />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-full pl-9 pr-8 border rounded-md appearance-none bg-white cursor-pointer"
              >
                <option value="newestFirst">Newest First</option>
                <option value="oldestFirst">Oldest First</option>
                <option value="nameAZ">Name A–Z</option>
                <option value="nameZA">Name Z–A</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4" />
            </div>

            <input
              type="text"
              value={search}
              placeholder="Search by child / parent name"
              className="h-10 border rounded-md pl-2 w-56 text-sm"
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.map((ele) => {
            const child = ele.demographic.child;
            const parent = ele.demographic.guardians;

            return (
              <div
                key={ele._id}
                onClick={() => {
                  setSelected(ele._id as string);
                  setShowDetails(true);
                }}
                className="group cursor-pointer bg-white/80 backdrop-blur-lg
            border border-gray-200 rounded-2xl p-5
            hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                {/* Child Name */}
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {child.name}
                </h3>

                {/* Age */}
                <p className="text-sm text-gray-600">
                  Age: <span className="font-medium">{child.age}</span>
                </p>

                {/* Parents */}
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <p>
                    Father:{" "}
                    <span className="font-medium">{parent.fathersName}</span>
                  </p>
                  <p>
                    Mother:{" "}
                    <span className="font-medium">{parent.mothersName}</span>
                  </p>
                </div>

                {/* Address */}
                <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                  Address: {child.adress}
                </p>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    {ele.createdAt
                      ? new Date(ele.createdAt).toLocaleDateString()
                      : "--"}
                  </p>

                  <span
                    className="text-sm text-orange-600 font-semibold
              group-hover:translate-x-1 transition"
                  >
                    View →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center mt-8 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(pagination?.totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-orange-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === pagination?.totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {showDetails && (
        <ShowDataCaptureModal
          onClose={() => setShowDetails(false)}
          singleData={singleData as Details}
          reviewData={reviewData}
          viewReviewDetails={viewReviewDetails}
        />
      )}

      {createOpen && (
        <CreateDataCaptureModal
          onClose={() => setCreateOpen(false)}
          singleData={singleData as Details}
        />
      )}

      {reviewModalOpen && (
        <ReviewMechanism
          onClose={handleReviewModalClose}
          singleData={singleData as Details}
        />
      )}

      {viewReviewModal && (
        <ShowReviewMechanism
          onClose={handleShowReviewModalClose}
          singleData={singleData as Details}
        />
      )}
    </div>
  );
};

export default DataCapture;
