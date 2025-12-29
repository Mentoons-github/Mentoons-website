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
    <div className="flex items-center gap-3">
      {checked ? (
        <FaRegSquareCheck className="text-orange-600" size={18} />
      ) : (
        <FaRegSquare className="text-gray-700" size={18} />
      )}
      <span className="text-lg font-semibold">{label}</span>
    </div>
  );
};

const ShowReviewMechanismFourth = ({ singleData }: { singleData: Details }) => {
  const actionPlans = singleData?.reviewMechanism?.actionPlanOrNextSteps || [];

  return (
    <div className="flex justify-center bg-gray-100 print:bg-white p-2 print:!p-0 border print:!border-0">
      <div className="w-[210mm] bg-white px-[15mm] py-[10mm] print:!py-1 shadow-lg print:shadow-none">
        {/* SECTION 4 */}
        <div className="border-b-2 border-gray-700 pb-8">
          <h2 className="font-semibold text-xl mb-2">
            4. OVERALL EVALUATION SUMMARY
          </h2>

          <p className="text-base ml-5 mb-5">(Short professional judgement)</p>

          <div className="mt-5 border rounded-md p-3 min-h-[200px]">
            <p className="text-base whitespace-pre-wrap">
              {singleData?.reviewMechanism?.evaluationSummary || "-"}
            </p>
          </div>
        </div>

        {/* SECTION 5 */}
        <div className="mt-6">
          <h2 className="font-semibold text-xl mb-4">
            5. ACTION PLAN / NEXT STEPS
          </h2>

          <div className="space-y-6 ml-5">
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
          <label className="font-semibold text-xl">
            PLANED CHANGES / RECOMMENDATIONS:
          </label>

          <div className="mt-3 border rounded-md p-3 min-h-[150px]">
            <p className="text-base whitespace-pre-wrap">
              {singleData?.reviewMechanism?.plannedChangesOrRecommendations ||
                "-"}
            </p>
          </div>
        </div>

        {/* SIGNATURE */}
        <div className="space-y-3 text-[16px] mt-16">
          <p className="font-semibold flex gap-2 items-center">
            REVIEVER SIGNATURE:
            {singleData.reviewMechanism?.signature ? (
              <img
                src={singleData.reviewMechanism?.signature}
                alt="Signature"
                className="w-[40mm] h-[20mm] object-contain"
              />
            ) : (
              <div className="w-[40mm] border-b border-dashed border-gray-700" />
            )}
          </p>

          <p className="font-semibold flex gap-2">
            DATE:
            <span className="w-[30mm] border-b border-dashed border-gray-700 text-base font-normal">
              {singleData.reviewMechanism?.date}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShowReviewMechanismFourth;
