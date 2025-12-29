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
import { useEffect, useState } from "react";

const DataCapture = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { data, singleData } = useAppSelector((state) => state.data_capture);
  const { getToken } = useAuth();
  const [selected, setSelected] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [viewReviewModal, setViewReviewModal] = useState(false);

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
      dispatch(fetchDataCaptureThunk(token));
    };
    fetchData();
  }, [dispatch, getToken]);

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

        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
        bg-gradient-to-r from-orange-500 to-amber-400
        text-white font-semibold shadow-md
        hover:shadow-lg hover:scale-105 transition"
        >
          + Create New Data
        </button>
      </div>

      {/* Cards Grid */}
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
        <CreateDataCaptureModal onClose={() => setCreateOpen(false)} />
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
