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
    <div className="flex justify-center bg-gray-100 print:bg-white p-2 print:!p-0 border print:!border-0">
      <div className="w-[210mm]  bg-white px-[15mm] py-[10mm] shadow-lg print:shadow-none">
        {/* HEADER */}
        <div className="border-b-2 border-gray-700 pb-6 space-y-3 text-[16px]">
          <p className="font-semibold flex gap-2">
            CHILD NAME:
            <span className="w-[60mm] border-b border-dashed border-gray-700 font-normal">
              {review.childName}
            </span>
          </p>

          <p className="font-semibold flex gap-2">
            AGE:
            <span className="w-[20mm] border-b border-dashed border-gray-700 font-normal">
              {review.age}
            </span>
          </p>

          <p className="font-semibold flex gap-2">
            DATE:
            <span className="w-[30mm] border-b border-dashed border-gray-700 font-normal">
              {review.date}
            </span>
          </p>

          <p className="font-semibold flex gap-2">
            REVIEWER / THERAPIST:
            <span className="w-[60mm] border-b border-dashed border-gray-700 font-normal">
              {review.psychologist}
            </span>
          </p>

          <p className="font-semibold flex gap-2">
            STEP(S) TAKEN:
            <span className="w-[60mm] border-b border-dashed border-gray-700 font-normal">
              {review.stepsTaken}
            </span>
          </p>
        </div>

        {/* PROGRESS EFFECTIVENESS */}
        <div className="mt-7 border-b-2 border-gray-700 pb-12">
          <h2 className="font-semibold text-xl">
            1. PROGRESS EFFECTIVENESS RATING
          </h2>

          <div className="space-y-4 mt-4 ml-5">
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
                <span className="text-lg font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* OBSERVABLE PROGRESS */}
        <div className="mt-10">
          <h2 className="font-semibold text-xl">
            2. OBSERVABLE PROGRESS INDICATORS
          </h2>

          <table className="w-full border-collapse border-2 border-gray-700 text-base mt-8">
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
                  <td className="border-2 border-gray-700 p-4">{label}</td>

                  {["Positive Change", "No Change", "Negative Change"].map(
                    (val) => (
                      <td
                        key={val}
                        className="border-2 border-gray-700 p-4 text-center"
                      >
                        {review.observableProgressIndicators?.[key] === val ? (
                          <FaRegSquareCheck className="text-orange-600 mx-auto" />
                        ) : (
                          <FaRegSquare className="mx-auto text-gray-500" />
                        )}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* NOTES */}
          <div className="mt-10 gap-2 flex">
            <p className="font-semibold mb-2">NOTES:</p>
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
