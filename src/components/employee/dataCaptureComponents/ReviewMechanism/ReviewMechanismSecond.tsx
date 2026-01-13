import {
  Details,
  ReviewMechanismFormValues,
} from "@/types/employee/dataCaptureTypes";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";
import { useFormikContext } from "formik";
import { Check } from "lucide-react";

const today = new Date().toLocaleDateString("en-GB");

type ProgressValue = "Positive Change" | "No Change" | "Negative Change";
type ProgressKey =
  | "emotionalRegulation"
  | "behaviourAtHome"
  | "behaviourAtSchool"
  | "attentionAndFocus"
  | "socialInteraction";

const SquareRadio = ({
  label,
  value,
  selected,
  onChange,
}: {
  label: string;
  value: string;
  selected: string;
  onChange: (val: string) => void;
}) => {
  const isChecked = selected === value;

  return (
    <div
      onClick={() => onChange(value)}
      className="flex items-start gap-3 cursor-pointer select-none"
    >
      {isChecked ? (
        <FaRegSquareCheck className="text-orange-600 mt-1" size={18} />
      ) : (
        <FaRegSquare className="text-gray-600 mt-1" size={18} />
      )}
      <span className="font-semibold text-sm sm:text-base print:text-lg">
        {label}
      </span>
    </div>
  );
};

const areas: { label: string; key: ProgressKey }[] = [
  { label: "Emotional regulation", key: "emotionalRegulation" },
  { label: "Behaviour at home", key: "behaviourAtHome" },
  { label: "Behaviour at school", key: "behaviourAtSchool" },
  { label: "Attention & focus", key: "attentionAndFocus" },
  { label: "Social interaction", key: "socialInteraction" },
];

const ReviewMechanismSecond = ({ singleData }: { singleData: Details }) => {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<ReviewMechanismFormValues>();

  const indicatorKeys: ProgressKey[] = areas.map((a) => a.key);

  const hasIndicatorError =
    touched.observableProgressIndicators &&
    indicatorKeys.some(
      (k) =>
        touched.observableProgressIndicators?.[k] &&
        errors.observableProgressIndicators?.[k]
    );

  const handleProgressChange = (key: ProgressKey, value: ProgressValue) => {
    const current = values.observableProgressIndicators[key];
    setFieldValue(
      `observableProgressIndicators.${key}`,
      current === value ? "" : value
    );
  };

  return (
    <div className="flex justify-center bg-gray-100 print:bg-white p-2">
      {/* PAGE */}
      <div
        className="
          w-full max-w-[1100px]
          print:w-[210mm] print:min-h-[297mm]
          bg-white
          px-4 sm:px-6 lg:px-10 print:px-[15mm]
          py-6 sm:py-8 print:py-[10mm]
          shadow-lg print:shadow-none
        "
      >
        {/* HEADER */}
        <div className="border-b-2 border-gray-700 pb-6 space-y-3">
          <p className="font-semibold text-sm sm:text-base flex flex-wrap gap-2">
            CHILD NAME:
            <span className="print:w-[60mm] min-w-[180px] border-b border-dashed border-gray-700 font-normal">
              {singleData.demographic.child.name}
            </span>
          </p>

          <p className="font-semibold text-sm sm:text-base flex gap-2">
            AGE:
            <span className="print:w-[20mm] min-w-[60px] border-b border-dashed border-gray-700 font-normal">
              {singleData.demographic.child.age}
            </span>
          </p>

          <p className="font-semibold text-sm sm:text-base flex gap-2">
            DATE:
            <span className="print:w-[30mm] min-w-[100px] border-b border-dashed border-gray-700 font-normal">
              {singleData.reviewMechanism?.date || today}
            </span>
          </p>

          <p className="font-semibold text-sm sm:text-base flex flex-wrap gap-2">
            REVIEWER / THERAPIST:
            <span className="print:w-[60mm] min-w-[180px] border-b border-dashed border-gray-700 font-normal">
              {singleData.psychologist?.user.name}
            </span>
          </p>

          {/* STEPS */}
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="font-semibold text-sm sm:text-base">
              STEP(S) TAKEN:
            </label>
            <input
              type="text"
              value={values.stepsTaken}
              onChange={(e) => setFieldValue("stepsTaken", e.target.value)}
              className={`
                w-full sm:max-w-[300px] print:w-[60mm]
                border-b border-dashed border-gray-700
                bg-transparent focus:outline-none
                ${touched.stepsTaken && errors.stepsTaken && "border-red-500"}
              `}
            />
          </div>
          {touched.stepsTaken && errors.stepsTaken && (
            <p className="text-red-500 text-xs">*{errors.stepsTaken}</p>
          )}
        </div>

        {/* EFFECTIVENESS */}
        <div className="mt-6 border-b-2 border-gray-700 pb-8">
          <h2 className="font-semibold text-lg sm:text-xl">
            1. PROGRESS EFFECTIVENESS RATING
          </h2>

          <p className="text-sm sm:text-base ml-2 sm:ml-5 flex gap-2 items-center">
            <Check size={16} /> Tick the most appropriate option
          </p>

          <div className="space-y-4 ml-2 sm:ml-5 mt-4">
            {[
              "ACTION TAKEN IS WORKING WELL",
              "ACTION TAKEN IS WORKING 50/50 (PARTIAL EFFECTIVENESS)",
              "ACTION TAKEN IS NOT WORKING AT ALL",
            ].map((opt) => (
              <SquareRadio
                key={opt}
                label={opt}
                value={opt}
                selected={values.progressEffectivenessRating}
                onChange={(val) =>
                  setFieldValue("progressEffectivenessRating", val)
                }
              />
            ))}
          </div>

          {touched.progressEffectivenessRating &&
            errors.progressEffectivenessRating && (
              <p className="text-red-500 text-xs mt-2">
                *{errors.progressEffectivenessRating}
              </p>
            )}
        </div>

        {/* TABLE */}
        <div className="mt-8">
          <h2 className="font-semibold text-lg sm:text-xl">
            2. OBSERVABLE PROGRESS INDICATORS
          </h2>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-[620px] w-full border-2 border-gray-700 text-sm sm:text-base">
              <thead>
                <tr>
                  <th className="border p-3 text-left">Area Observed</th>
                  <th className="border p-3 text-center">Positive</th>
                  <th className="border p-3 text-center">No Change</th>
                  <th className="border p-3 text-center">Negative</th>
                </tr>
              </thead>

              <tbody>
                {areas.map(({ label, key }) => (
                  <tr key={key}>
                    <td className="border p-3">{label}</td>
                    {["Positive Change", "No Change", "Negative Change"].map(
                      (val) => (
                        <td
                          key={val}
                          className="border p-3 text-center cursor-pointer"
                          onClick={() =>
                            handleProgressChange(key, val as ProgressValue)
                          }
                        >
                          {values.observableProgressIndicators[key] === val ? (
                            <FaRegSquareCheck className="text-orange-600 mx-auto" />
                          ) : (
                            <FaRegSquare className="mx-auto" />
                          )}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasIndicatorError && (
            <p className="text-red-500 text-xs mt-2">
              *Please select progress for all observed areas
            </p>
          )}
        </div>

        {/* NOTES */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <label className="font-semibold text-sm sm:text-base">NOTES:</label>
          <textarea
            rows={3}
            value={values.observableProgressIndicators.notes}
            onChange={(e) =>
              setFieldValue(
                "observableProgressIndicators.notes",
                e.target.value
              )
            }
            className={`
              w-full p-3 border rounded-md resize-none
              ${errors.observableProgressIndicators?.notes && "border-red-500"}
            `}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewMechanismSecond;
