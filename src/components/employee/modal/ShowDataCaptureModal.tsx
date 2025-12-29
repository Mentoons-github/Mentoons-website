import { Details } from "@/types/employee/dataCaptureTypes";
import { useRef } from "react";
import ShowDemographicDetails from "../dataCaptureComponents/ShowData/ShowDemographicDetails";
import ShowDevelopmentalAndMedicalDetails from "../dataCaptureComponents/ShowData/ShowDevelopmentalAndMedical";
import ShowBehaviouralAndEmotional from "../dataCaptureComponents/ShowData/ShowBehaviouralAndEmotional";
import ShowOtherAddictionPattern from "../dataCaptureComponents/ShowData/ShowOtherAddictionPattern";

import ShowTherapistInitialObservation from "../dataCaptureComponents/ShowData/ShowTherapistInitialObservation";
import { X } from "lucide-react";
import { handlePrint } from "@/services/employee/employeeDataCapturePrint";

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


  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white h-[650px] w-full max-w-4xl rounded-lg shadow-xl overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-orange-500"
        >
          <X />
        </button>

        {/* PRINT BUTTON */}
        <div className="p-4 flex justify-end gap-2 mr-10 no-print">
          <button
            onClick={() => handlePrint(printRef)}
            className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100"
          >
            Print All Pages
          </button>
        </div>

        <div ref={printRef} className="p-6 space-y-8">
          <div className="print-break-before print-keep-together space-y-8">
            <div className="print-first-page-header space-y-2 text-right">
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
    </div>
  );
};

export default ShowDataCaptureModal;
