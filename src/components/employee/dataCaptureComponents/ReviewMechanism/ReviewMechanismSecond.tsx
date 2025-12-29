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
      className="flex items-center gap-3 text-sm cursor-pointer select-none"
    >
      {isChecked ? (
        <FaRegSquareCheck className="text-orange-600" size={18} />
      ) : (
        <FaRegSquare className="text-gray-600" size={18} />
      )}
      <span className="text-lg font-semibold">{label}</span>
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

  const indicatorKeys: ProgressKey[] = [
    "emotionalRegulation",
    "behaviourAtHome",
    "behaviourAtSchool",
    "attentionAndFocus",
    "socialInteraction",
  ];

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
    <div className="flex justify-center bg-gray-100 print:bg-white p-2 border">
      <div
        className="
          w-[210mm] min-h-[297mm]
          bg-white
          px-[15mm] py-[10mm]
          flex flex-col
          shadow-lg
          print:shadow-none
        "
      >
        {/* HEADER DETAILS */}
        <div className=" border-b-2 border-gray-700 pb-6">
          <div className="space-y-3 text-[16px]">
            <p className="font-semibold flex gap-2">
              CHILD NAME:{" "}
              <span className="w-[60mm] border-b border-dashed border-gray-700 text-base font-normal">
                {singleData.demographic.child.name}
              </span>
            </p>

            <p className="font-semibold flex gap-2">
              AGE:{" "}
              <span className="w-[20mm] border-b border-dashed border-gray-700 text-base font-normal">
                {singleData.demographic.child.age}
              </span>
            </p>

            <p className="font-semibold flex gap-2">
              DATE:{" "}
              <span className="w-[30mm] border-b border-dashed border-gray-700 text-base font-normal">
                {singleData.reviewMechanism?.date || today}
              </span>
            </p>

            <p className="font-semibold flex gap-2">
              REVIEWER / THERAPIST:{" "}
              <span className="w-[60mm] border-b border-dashed border-gray-700 text-base font-normal">
                {singleData.psychologist?.user.name}
              </span>
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <p className="font-semibold mb-2 text-[16px]">STEP(S) TAKEN:</p>

            <input
              type="text"
              value={values.stepsTaken}
              onChange={(e) => setFieldValue("stepsTaken", e.target.value)}
              className={`w-[60mm] border-b border-dashed border-gray-700 bg-transparent focus:outline-none text-base font-normal ${
                touched.stepsTaken && errors.stepsTaken && "border-red-500"
              } `}
            />
            {touched.stepsTaken && errors.stepsTaken && (
              <p className="text-red-500 text-xs mt-1 block">
                *{errors.stepsTaken}
              </p>
            )}
          </div>
        </div>

        {/* PROGRESS EFFECTIVENESS */}
        <div className="mt-7  border-b-2 border-gray-700 pb-10">
          <h2 className="font-semibold text-xl">
            1. PROGRESS EFFECTIVENESS RATING
          </h2>
          <p className="text-base mb-4 ml-5 flex gap-2">
            (<Check />
            Tick the most appropriate option)
          </p>

          <div className="space-y-4 ml-5">
            <SquareRadio
              label="ACTION TAKEN IS WORKING WELL"
              value="ACTION TAKEN IS WORKING WELL"
              selected={values.progressEffectivenessRating}
              onChange={(val) =>
                setFieldValue("progressEffectivenessRating", val)
              }
            />
            <SquareRadio
              label="ACTION TAKEN IS WORKING 50/50 (PARTIAL EFFECTIVENESS)"
              value="ACTION TAKEN IS WORKING 50/50 (PARTIAL EFFECTIVENESS)"
              selected={values.progressEffectivenessRating}
              onChange={(val) =>
                setFieldValue("progressEffectivenessRating", val)
              }
            />
            <SquareRadio
              label="ACTION TAKEN IS NOT WORKING AT ALL"
              value="ACTION TAKEN IS NOT WORKING AT ALL"
              selected={values.progressEffectivenessRating}
              onChange={(val) =>
                setFieldValue("progressEffectivenessRating", val)
              }
            />
          </div>
          {touched.progressEffectivenessRating &&
            errors.progressEffectivenessRating && (
              <p className="text-red-500 text-xs ">
                *{errors.progressEffectivenessRating}
              </p>
            )}
        </div>

        {/* OBSERVABLE PROGRESS TABLE */}
        <div className="mt-10">
          <h2 className="font-semibold text-xl">
            2. OBSERVABLE PROGRESS INDICATORS
          </h2>
          <p className="text-base mb-4 ml-5">(Briefly note changes observed)</p>

          <table className="w-full border-collapse border-2 border-gray-700 text-base">
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
                        className="border-2 border-gray-700 p-4 cursor-pointer text-center"
                        onClick={() =>
                          handleProgressChange(key, val as ProgressValue)
                        }
                      >
                        {values.observableProgressIndicators[key] === val ? (
                          <FaRegSquareCheck className="text-orange-600" />
                        ) : (
                          <FaRegSquare />
                        )}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {hasIndicatorError && (
            <p className="text-red-500 text-xs mt-2">
              *Please select progress for all observed areas
            </p>
          )}
        </div>
        <div className="mt-8 flex  gap-2">
          <label className="block mb-2 font-semibold text-base">NOTES:</label>

          <textarea
            rows={3}
            value={values.observableProgressIndicators.notes}
            onChange={(e) =>
              setFieldValue(
                "observableProgressIndicators.notes",
                e.target.value
              )
            }
            placeholder="Write observations here..."
            className={`w-full p-3 border rounded-md border-gray-700 text-base resize-none bg-transparent focus:outline-none ${
              touched.observableProgressIndicators?.notes &&
              errors.observableProgressIndicators?.notes &&
              "border-red-500"
            }`}
          />
        </div>
        {touched.observableProgressIndicators?.notes &&
          errors.observableProgressIndicators?.notes && (
            <p className="text-red-500 text-xs mt-1 ">
              *{errors.observableProgressIndicators.notes}
            </p>
          )}
      </div>
    </div>
  );
};

export default ReviewMechanismSecond;
