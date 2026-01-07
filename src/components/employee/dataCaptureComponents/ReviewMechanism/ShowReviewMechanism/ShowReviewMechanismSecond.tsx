import { Details } from "@/types/employee/dataCaptureTypes";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";

type ProgressKey =
  | "emotionalRegulation"
  | "behaviourAtHome"
  | "behaviourAtSchool"
  | "attentionAndFocus"
  | "socialInteraction";

const areas: { label: string; key: ProgressKey }[] = [
  { label: "Emotional regulation", key: "emotionalRegulation" },
  { label: "Behaviour at home", key: "behaviourAtHome" },
  { label: "Behaviour at school", key: "behaviourAtSchool" },
  { label: "Attention & focus", key: "attentionAndFocus" },
  { label: "Social interaction", key: "socialInteraction" },
];

const ShowReviewMechanismSecond = ({ singleData }: { singleData: Details }) => {
  const review = singleData.reviewMechanism;

  if (!review) {
    return (
      <div className="p-6 text-center text-gray-500">
        No review mechanism available.
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-100 print:bg-white p-2 print:p-0">
      {/* PAGE */}
      <div
        className="
          w-full max-w-[1100px]
          print:w-[210mm]
          bg-white
          px-4 sm:px-6 lg:px-10 print:px-[15mm]
          py-6 sm:py-8 print:py-[10mm]
          shadow-lg print:shadow-none
        "
      >
        {/* HEADER */}
        <div className="border-b-2 border-gray-700 pb-6 space-y-3 text-sm sm:text-base print:text-[16px]">
          {[
            ["CHILD NAME", review.childName, "60mm"],
            ["AGE", review.age, "20mm"],
            ["DATE", review.date, "30mm"],
            ["REVIEWER / THERAPIST", review.psychologist, "60mm"],
            ["STEP(S) TAKEN", review.stepsTaken, "60mm"],
          ].map(([label, value, width]) => (
            <p key={label} className="font-semibold flex flex-wrap gap-2">
              {label}:
              <span
                className={`
                  border-b border-dashed border-gray-700 font-normal
                  min-w-[150px]
                  print:w-[${width}]
                `}
              >
                {value}
              </span>
            </p>
          ))}
        </div>

        {/* PROGRESS EFFECTIVENESS */}
        <div className="mt-8 border-b-2 border-gray-700 pb-10">
          <h2 className="font-semibold text-lg sm:text-xl">
            1. PROGRESS EFFECTIVENESS RATING
          </h2>

          <div className="space-y-4 mt-4 ml-2 sm:ml-5">
            {[
              "ACTION TAKEN IS WORKING WELL",
              "ACTION TAKEN IS WORKING 50/50 (PARTIAL EFFECTIVENESS)",
              "ACTION TAKEN IS NOT WORKING AT ALL",
            ].map((label) => (
              <div key={label} className="flex items-center gap-3">
                {review.progressEffectivenessRating === label ? (
                  <FaRegSquareCheck className="text-orange-600" size={18} />
                ) : (
                  <FaRegSquare className="text-gray-500" size={18} />
                )}
                <span className="font-semibold text-sm sm:text-base">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* OBSERVABLE PROGRESS */}
        <div className="mt-10">
          <h2 className="font-semibold text-lg sm:text-xl">
            2. OBSERVABLE PROGRESS INDICATORS
          </h2>

          {/* TABLE WRAPPER (mobile scroll) */}
          <div className="overflow-x-auto mt-6">
            <table className="min-w-[650px] w-full border-collapse border-2 border-gray-700 text-sm sm:text-base">
              <thead>
                <tr>
                  <th className="border-2 border-gray-700 p-3 text-left">
                    Area Observed
                  </th>
                  <th className="border-2 border-gray-700 p-3 text-center">
                    Positive Change
                  </th>
                  <th className="border-2 border-gray-700 p-3 text-center">
                    No Change
                  </th>
                  <th className="border-2 border-gray-700 p-3 text-center">
                    Negative Change
                  </th>
                </tr>
              </thead>

              <tbody>
                {areas.map(({ label, key }) => (
                  <tr key={key}>
                    <td className="border-2 border-gray-700 p-3">
                      {label}
                    </td>

                    {["Positive Change", "No Change", "Negative Change"].map(
                      (val) => (
                        <td
                          key={val}
                          className="border-2 border-gray-700 p-3 text-center"
                        >
                          {review.observableProgressIndicators?.[key] === val ? (
                            <FaRegSquareCheck className="text-orange-600 mx-auto" />
                          ) : (
                            <FaRegSquare className="text-gray-500 mx-auto" />
                          )}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* NOTES */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <p className="font-semibold whitespace-nowrap">NOTES:</p>
            <div className="border w-full p-3 rounded-md min-h-[100px]">
              {review.observableProgressIndicators?.notes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowReviewMechanismSecond;
