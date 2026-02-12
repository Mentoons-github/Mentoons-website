import { Details } from "@/types/employee/dataCaptureTypes";
import { useRef, useState } from "react";
import ShowDemographicDetails from "../dataCaptureComponents/ShowData/ShowDemographicDetails";
import ShowDevelopmentalAndMedicalDetails from "../dataCaptureComponents/ShowData/ShowDevelopmentalAndMedical";
import ShowBehaviouralAndEmotional from "../dataCaptureComponents/ShowData/ShowBehaviouralAndEmotional";
import ShowOtherAddictionPattern from "../dataCaptureComponents/ShowData/ShowOtherAddictionPattern";

import ShowTherapistInitialObservation from "../dataCaptureComponents/ShowData/ShowTherapistInitialObservation";
import { X } from "lucide-react";
import { handlePrint } from "@/services/employee/employeeDataCapturePrint";
import { BsThreeDots } from "react-icons/bs";
import CreateDataCaptureModal from "./CreateDataCaptureModal";
import AddScoringModal from "./AddScoringModal";
import ShowScoreModal from "./ShowScoreModal";

const ShowDataCaptureModal = ({
  onClose,
  singleData,
  reviewData,
  viewReviewDetails,
}: {
  onClose: () => void;
  singleData: Details;
  reviewData: () => void;
  viewReviewDetails: () => void;
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [clickMore, setClickMore] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [addScoring, setAddScoring] = useState<boolean>(false);
  const [showScore, setShowScore] = useState<boolean>(false);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex justify-center items-center p-2 md:p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white h-[650px] w-full max-w-4xl rounded-lg shadow-xl overflow-y-auto relative ${
          clickMore && "overflow-y-hidden"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-orange-500"
        >
          <X />
        </button>

        {clickMore && (
          <div
            onClick={() => setClickMore(false)}
            className="absolute inset-0 z-40 bg-black/50 "
          />
        )}

        {/* PRINT BUTTON */}
        <div className="p-4 flex justify-end gap-2 mr-10 no-print relative">
          <BsThreeDots
            size={20}
            onClick={() => setClickMore(true)}
            className="text-gray-400 hover:text-orange-500"
          />

          {clickMore && (
            <div className="absolute top-5 flex flex-col gap-3 bg-gray-700 text-white z-50 rounded-md px-4 pb-4 pt-10 w-56">
              <button
                onClick={() => setClickMore(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-orange-500"
              >
                <X />
              </button>
              <button
                onClick={() => {
                  handlePrint(printRef);
                  setClickMore(false);
                }}
                className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100 hover:text-black"
              >
                Print Details
              </button>
              <button
                onClick={() => {
                  setEdit(true);
                  setClickMore(false);
                }}
                className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100 hover:text-black"
              >
                Edit
              </button>
              {singleData.scoringSystem ? (
                <button
                  onClick={() => {
                    setShowScore(true);
                    setClickMore(false);
                  }}
                  className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100 hover:text-black"
                >
                  Show Score
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAddScoring(true);
                    setClickMore(false);
                  }}
                  className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100 hover:text-black"
                >
                  Add Scoring
                </button>
              )}
            </div>
          )}
        </div>

        {addScoring && (
          <AddScoringModal
            onClose={() => setAddScoring(false)}
            singleData={singleData}
          />
        )}

        {showScore && (
          <ShowScoreModal
            onClose={() => setShowScore(false)}
            singleData={singleData}
          />
        )}

        {edit ? (
          <CreateDataCaptureModal
            from="edit"
            singleData={singleData}
            onClose={() => {
              setEdit(false);
              setClickMore(false);
            }}
          />
        ) : (
          <div>
            <div ref={printRef} className={`p-3 md:p-6 space-y-8 `}>
              <div className="print-break-before print-keep-together space-y-8">
                <div className="flex justify-between print-first-page-header">
                  <div className="  flex justify-center flex-shrink-0 ">
                    <img
                      src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
                      alt="Mentoons Logo"
                      className={`object-contain transition-all duration-300 w-36`}
                    />
                  </div>
                  <div className=" space-y-2 text-right">
                    <p className="font-semibold">
                      Psychologist: {singleData?.psychologist?.user?.name}
                    </p>
                    <p>
                      Date:{" "}
                      {(() => {
                        const d = new Date(singleData?.createdAt as string);
                        const day = String(d.getDate()).padStart(2, "0");
                        const month = String(d.getMonth() + 1).padStart(2, "0");
                        const year = d.getFullYear();
                        const weekday = d.toLocaleDateString("en-GB", {
                          weekday: "long",
                        });
                        return `${day}/${month}/${year} (${weekday})`;
                      })()}
                    </p>
                  </div>
                </div>
                <ShowDemographicDetails singleData={singleData} />
              </div>
              <div className="print-break-before print-keep-together space-y-8">
                <ShowDevelopmentalAndMedicalDetails singleData={singleData} />
              </div>
              <div className="print-break-before print-keep-together space-y-8">
                <ShowBehaviouralAndEmotional singleData={singleData} />
              </div>
              <div className="print-break-before print-keep-together space-y-8">
                <ShowOtherAddictionPattern singleData={singleData} />
              </div>
              <div className="print-break-before print-keep-together space-y-8">
                <ShowTherapistInitialObservation singleData={singleData} />
              </div>
            </div>
            <div className="float-end p-6">
              {singleData?.reviewMechanism ? (
                <button
                  className="py-2 px-3 bg-orange-500 rounded-md font-semibold text-white"
                  onClick={viewReviewDetails}
                >
                  View Review
                </button>
              ) : (
                <button
                  className="py-2 px-3 bg-orange-500 rounded-md font-semibold text-white"
                  onClick={reviewData}
                >
                  Add Review
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowDataCaptureModal;
