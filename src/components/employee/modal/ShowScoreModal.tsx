import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { resetDataCaptureSlice } from "@/redux/employee/dataCaptureRedux/dataCaptureSlice";
import { SessionScoringType } from "@/types/workshopsV2/workshopBatchTypes";
import { SCROING_SYSTEM } from "@/constant/employee/scoringSystemQuestions";
import AddScoringModal from "./AddScoringModal";

const ShowScoreModal = ({
  onClose,
  clickedSession,
  candidateName,
  studentId,
}: {
  onClose: () => void;
  clickedSession: SessionScoringType;
  candidateName: string;
  studentId: string;
}) => {
  const dispatch = useAppDispatch();
  const { message, error, success } = useAppSelector(
    (state) => state.data_capture,
  );

  const sessionName = clickedSession.sessionName;

  const sessionIndex: number =
    sessionName === "teenCamp"
      ? 0
      : sessionName === "instantKatha"
        ? 1
        : sessionName === "kalakrithi"
          ? 2
          : sessionName === "hasyaras"
            ? 3
            : 4;

  const currentSessionObj = SCROING_SYSTEM[sessionIndex];
  const sessionKey = Object.keys(currentSessionObj)[0];
  const sessionConfig = currentSessionObj[sessionKey];

  const printRef = useRef<HTMLDivElement>(null);

  const [clickMore, setClickMore] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(resetDataCaptureSlice());
      onClose();
    }
    if (error) {
      toast.error(error);
      dispatch(resetDataCaptureSlice());
    }
  }, [success, error, message, dispatch, onClose]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${candidateName}-Review`,
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm;
      }
      
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .no-print {
          display: none !important;
        }
        
        .print-container {
          max-width: 100% !important;
          height: auto !important;
          overflow: visible !important;
        }
      }
    `,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      {clickMore && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setClickMore(false)}
        />
      )}

      <div className="relative z-50 bg-white h-[650px] w-full max-w-3xl rounded-lg overflow-auto p-6 space-y-6">
        {/* Top Action Buttons - Hidden on Print */}
        <div className="absolute top-3 right-3 flex items-center gap-3 no-print z-50">
          <div className="relative">
            <BsThreeDots
              size={20}
              onClick={() => setClickMore((p) => !p)}
              className="cursor-pointer text-gray-400 hover:text-orange-500"
            />

            {clickMore && (
              <div className="absolute top-full mt-2 right-0 w-56 rounded-md bg-gray-700 text-white shadow-xl p-4 space-y-3 z-50">
                <button
                  onClick={() => setClickMore(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>

                <button
                  onClick={() => {
                    handlePrint();
                    setClickMore(false);
                  }}
                  className="w-full rounded-md border px-4 py-2 text-sm hover:bg-gray-100 hover:text-black"
                >
                  Print Details
                </button>

                <button
                  onClick={() => {
                    setClickMore(false);
                    setEdit(true);
                  }}
                  className="w-full rounded-md border px-4 py-2 text-sm hover:bg-gray-100 hover:text-black"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-orange-500"
          >
            <X />
          </button>
        </div>

        {/* Printable Content */}
        <div ref={printRef} className="print-container">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-6">
            <img
              src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
              alt="Mentoons Logo"
              className="w-36 object-contain"
            />

            <div className="text-right space-y-1">
              <p className="text-sm text-gray-600">
                Psychologist: {clickedSession?.psychologist?.user?.name}
              </p>
              <p className="text-sm text-gray-600">
                Stuent Name: {candidateName}
              </p>
              <p className="text-sm text-gray-600">
                Date:{" "}
                {new Date(
                  clickedSession?.sessionDate as string,
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  weekday: "long",
                })}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-center mb-2">
              SCORING SYSTEM,{" "}
              <span>SESSION: {clickedSession.sessionNumber}</span>
            </h2>
            <h2 className="text-2xl font-bold text-center mb-4">
              {clickedSession.sessionName.toUpperCase()}
            </h2>
          </div>

          {/* CATEGORIES */}
          <div className="space-y-4">
            {clickedSession.scors.headings.map((main, mainIdx) => (
              <div
                key={mainIdx}
                className="border rounded-lg p-4 space-y-4 break-inside-avoid"
              >
                {/* MAIN HEADER */}
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">
                    {mainIdx + 1}. {sessionConfig[mainIdx].heading}
                  </h2>
                  <span className="text-sm font-semibold text-blue-600">
                    {main.headingScore} / {sessionConfig[mainIdx].point}
                  </span>
                </div>

                <div className="ml-4 space-y-2">
                  {main.questions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="flex justify-between items-center text-sm text-gray-700"
                    >
                      <p className="flex-1">
                        {qIdx + 1}.{" "}
                        {sessionConfig[mainIdx]?.questions[qIdx]?.question}
                      </p>
                      <p className="font-semibold text-xs whitespace-nowrap ml-2">
                        {q.score} /{" "}
                        {sessionConfig[mainIdx].questions[qIdx]?.point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL SCORE */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center mt-6 break-inside-avoid">
            <div>
              <p className="text-xs uppercase font-semibold text-blue-900">
                Total Score
              </p>
              <p className="text-xs text-blue-700">Overall evaluation result</p>
            </div>

            <p className="text-3xl font-bold text-blue-900">
              {clickedSession.scors.totalScore}
              <span className="text-base font-medium text-blue-700">
                {" "}
                / {100}
              </span>
            </p>
          </div>
        </div>

        {edit && (
          <AddScoringModal
            onClose={() => setEdit(false)}
            currentSession={clickedSession}
            studentId={studentId}
          />
        )}
      </div>

      {/* Print-specific styles */}
      <style >{`
        @media print {
          @page {
            size: A4;
            margin: mm;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .no-print {
            display: none !important;
          }

          .print-container {
            max-width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            padding: 0 !important;
          }

          .fixed {
            position: relative !important;
          }

          /* Avoid page breaks inside elements */
          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          /* Keep content together as much as possible */
          h2,
          h3 {
            break-after: avoid;
            page-break-after: avoid;
          }

          /* Ensure backgrounds and borders print */
          .bg-blue-50,
          .border,
          .border-gray-300,
          .border-blue-200 {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Optimize spacing for print */
          .space-y-4 > * + * {
            margin-top: 1rem !important;
          }

          .space-y-2 > * + * {
            margin-top: 0.5rem !important;
          }

          /* Ensure rounded corners are visible in print */
          .rounded-lg {
            border-radius: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ShowScoreModal;
