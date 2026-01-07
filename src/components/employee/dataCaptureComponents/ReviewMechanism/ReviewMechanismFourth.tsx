import { ReviewMechanismFormValues } from "@/types/employee/dataCaptureTypes";
import { useFormikContext } from "formik";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";

type Props = {
  uploadFile: (file: File) => Promise<string | null>;
};

const SquareCheckbox = ({
  label,
  value,
  selected,
  onChange,
  children,
}: {
  label: string;
  value: string;
  selected: string[];
  onChange: (val: string) => void;
  children?: React.ReactNode;
}) => {
  const isChecked = selected.includes(value);

  return (
    <div className="flex items-center gap-3 cursor-pointer select-none">
      <div onClick={() => onChange(value)} className="flex items-center gap-3">
        {isChecked ? (
          <FaRegSquareCheck className="text-orange-600" size={18} />
        ) : (
          <FaRegSquare className="text-gray-700" size={18} />
        )}
        <span className=" md:text-lg font-semibold">{label}</span>
      </div>

      {/* Inline input */}
      {isChecked && children}
    </div>
  );
};

const ReviewMechanismFourth = ({ uploadFile }: Props) => {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<ReviewMechanismFormValues>();

  const toggleValue = (value: string, fieldPath: string, current: string[]) => {
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    setFieldValue(fieldPath, updated);
  };

  return (
    <div className="flex justify-center bg-gray-100 print:bg-white p-2 border">
      <div className="w-[210mm] min-h-[297mm] bg-white px-4 md:px-[15mm] py-[10mm] shadow-lg print:shadow-none">
        {/* SECTION A */}
        <div className="border-b-2 border-gray-700 pb-8">
          <h2 className="font-semibold text-lg md:text-xl md:mb-2">
            4. OVERALL EVALUATION SUMMARY
          </h2>

          <p className="text-base ml-5 mb-5">(Short professional judgement)</p>

          <div className="mt-5 ">
            <textarea
              rows={8}
              value={values.evaluationSummary}
              onChange={(e) =>
                setFieldValue("evaluationSummary", e.target.value)
              }
              className={`w-full p-3 border border-gray-700 resize-none bg-transparent focus:outline-none rounded-md ${
                touched.evaluationSummary &&
                errors.evaluationSummary &&
                "border-red-500"
              }`}
            />
          </div>
          {touched.evaluationSummary && errors.evaluationSummary && (
            <p className="text-red-500 text-xs mt-1 block">
              *{errors.evaluationSummary}
            </p>
          )}
        </div>

        {/* SECTION B */}
        <div className="mt-4">
          <h2 className="font-semibold text-lg md:text-xl mb-4">
            5. ACTION PLAN / NEXT STEPS
          </h2>

          <div className="space-y-6 ml-2 md:ml-5">
            {[
              "CONTINUE INTERVENTION AS IS",
              "MODIFY INTERVENTION APPROACH",
              "INCREASE FREQUENCY / INTENSITY",
              "PROVIDE CAREGIVER GUIDENCE",
              "PAUSE & REASSESS GOALS",
              "REFFER TO SPECIALIST (IF REQUIRED)",
            ].map((item) => (
              <SquareCheckbox
                key={item}
                label={item}
                value={item}
                selected={values.actionPlanOrNextSteps}
                onChange={(val) =>
                  toggleValue(
                    val,
                    "actionPlanOrNextSteps",
                    values.actionPlanOrNextSteps
                  )
                }
              />
            ))}
          </div>
          {touched.actionPlanOrNextSteps && errors.actionPlanOrNextSteps && (
            <p className="text-red-500 text-xs mt-1 block">
              *{errors.actionPlanOrNextSteps}
            </p>
          )}
        </div>
        <div className="mt-6 ">
          <label className="font-semibold text-lg md:text-xl">
            PLANED CHANGES / RECOMMENDATIONS:
          </label>
          <textarea
            rows={5}
            value={values.plannedChangesOrRecommendations}
            onChange={(e) =>
              setFieldValue("plannedChangesOrRecommendations", e.target.value)
            }
            className={`w-full mt-3 p-3 border border-gray-700 resize-none bg-transparent focus:outline-none rounded-md
              ${
                touched.plannedChangesOrRecommendations &&
                errors.plannedChangesOrRecommendations &&
                "border-red-500"
              }
              `}
          />
        </div>
        {touched.plannedChangesOrRecommendations &&
          errors.plannedChangesOrRecommendations && (
            <p className="text-red-500 text-xs mt-1 block">
              *{errors.plannedChangesOrRecommendations}
            </p>
          )}

        <div className="space-y-4 text-[16px] mt-16">
          {/* SIGNATURE */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <span className="font-semibold whitespace-nowrap">
              REVIEWER SIGNATURE:
            </span>

            {/* Signature Preview / Placeholder */}
            {values?.signature ? (
              <img
                src={values.signature}
                alt="Signature"
                className="
          h-[18mm]
          w-auto
          max-w-[160px]
          object-contain
        "
              />
            ) : (
              <div className="print:w-[40mm] w-full sm:w-[160px] border-b border-dashed border-gray-700" />
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              id="signatureUpload"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  await uploadFile(file);
                }
              }}
            />

            {/* Upload Button */}
            <label
              htmlFor="signatureUpload"
              className="
        inline-block
        px-4 py-2
        bg-orange-500
        text-white
        rounded
        cursor-pointer
        hover:bg-orange-600
        text-sm
        w-fit
      "
            >
              Select Signature
            </label>
          </div>

          {/* DATE */}
          <div className="font-semibold flex items-center gap-2">
            <span>DATE:</span>
            <div className="w-[40mm] border-b border-dashed border-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewMechanismFourth;
