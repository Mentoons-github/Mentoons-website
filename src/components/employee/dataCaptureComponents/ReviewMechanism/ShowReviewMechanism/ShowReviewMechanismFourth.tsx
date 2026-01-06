import { Details } from "@/types/employee/dataCaptureTypes";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";

const SquareCheckboxShow = ({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) => {
  return (
    <div className="flex items-start gap-3">
      {checked ? (
        <FaRegSquareCheck className="text-orange-600 mt-1" size={18} />
      ) : (
        <FaRegSquare className="text-gray-700 mt-1" size={18} />
      )}
      <span className="font-semibold text-sm sm:text-base print:text-lg">
        {label}
      </span>
    </div>
  );
};

const ShowReviewMechanismFourth = ({ singleData }: { singleData: Details }) => {
  const actionPlans = singleData?.reviewMechanism?.actionPlanOrNextSteps || [];

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
        {/* SECTION 4 */}
        <div className="border-b-2 border-gray-700 pb-8">
          <h2 className="font-semibold text-lg sm:text-xl mb-2">
            4. OVERALL EVALUATION SUMMARY
          </h2>

          <p className="text-sm sm:text-base ml-2 sm:ml-5 mb-4">
            (Short professional judgement)
          </p>

          <div className="border rounded-md p-3 min-h-[180px]">
            <p className="text-sm sm:text-base whitespace-pre-wrap">
              {singleData?.reviewMechanism?.evaluationSummary || "-"}
            </p>
          </div>
        </div>

        {/* SECTION 5 */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg sm:text-xl mb-4">
            5. ACTION PLAN / NEXT STEPS
          </h2>

          <div className="space-y-4 ml-2 sm:ml-5">
            {[
              "CONTINUE INTERVENTION AS IS",
              "MODIFY INTERVENTION APPROACH",
              "INCREASE FREQUENCY / INTENSITY",
              "PROVIDE CAREGIVER GUIDENCE",
              "PAUSE & REASSESS GOALS",
              "REFFER TO SPECIALIST (IF REQUIRED)",
            ].map((item) => (
              <SquareCheckboxShow
                key={item}
                label={item}
                checked={actionPlans.includes(item)}
              />
            ))}
          </div>
        </div>

        {/* PLANNED CHANGES */}
        <div className="mt-6">
          <label className="font-semibold text-lg sm:text-xl">
            PLANNED CHANGES / RECOMMENDATIONS:
          </label>

          <div className="mt-3 border rounded-md p-3 min-h-[150px]">
            <p className="text-sm sm:text-base whitespace-pre-wrap">
              {singleData?.reviewMechanism?.plannedChangesOrRecommendations ||
                "-"}
            </p>
          </div>
        </div>

        {/* SIGNATURE */}
        <div className="mt-12 space-y-4 text-sm sm:text-base print:text-[16px]">
          <p className="font-semibold flex gap-2 items-center">
            REVIEWER SIGNATURE:
            {singleData.reviewMechanism?.signature ? (
              <img
                src={singleData.reviewMechanism.signature}
                alt="Signature"
                className="
                  h-[20mm]
                  w-auto
                  max-w-[160px]
                  object-contain
                "
              />
            ) : (
              <div className="print:w-[40mm] w-[160px] border-b border-dashed border-gray-700" />
            )}
          </p>

          <p className="font-semibold flex flex-wrap gap-2">
            DATE:
            <span className="print:w-[30mm] min-w-[120px] border-b border-dashed border-gray-700 font-normal">
              {singleData.reviewMechanism?.date}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShowReviewMechanismFourth;
