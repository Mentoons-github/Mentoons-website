import { ReviewMechanismFormValues } from "@/types/employee/dataCaptureTypes";
import { useFormikContext } from "formik";
import { Check } from "lucide-react";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";

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
        <span className="text-lg font-semibold">{label}</span>
      </div>

      {/* Inline input */}
      {isChecked && children}
    </div>
  );
};

const ReviewMechanismThird = () => {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<ReviewMechanismFormValues>();

  const providerReasons =
    values.whyInventionsWorking.relatedToMentoonsProvider.reasons;

  const childReasons = values.whyInventionsWorking.relatedToChild.reasons;

  const toggleReason = (
    value: string,
    fieldPath: string,
    current: string[]
  ) => {
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    setFieldValue(fieldPath, updated);
  };

  return (
    <div className="flex justify-center bg-gray-100 print:bg-white p-2 border">
      <div className="w-[210mm] min-h-[297mm] bg-white px-[15mm] py-[10mm] shadow-lg print:shadow-none">
        {/* SECTION A */}
        <div className="border-b-2 border-gray-700 pb-8">
          <h2 className="font-semibold text-xl mb-2">
            3. REASONS WHY THE INTERVENTION IS / IS NOT WORKING
          </h2>

          <p className="text-lg ml-5 mb-">
            A. FACTORS RELATED TO MENTORS / INTERVENTION PROVIDER
          </p>
          <p className="text-base ml-5 mb-5 flex gap-2">
            (<Check /> Tick all that apply and add remarks)
          </p>

          <div className="space-y-4 ml-5">
            {[
              "INTERVENTION NOT DELIVERED CONSISTENTLY",
              "METHOD NOT AGE-APPROPRIATE",
              "INSUFFICIENT ENGAGEMENT OR RAPPORT",
              "LACK OF FOLLOW-UP OR REINFORCEMENT",
              "ENVIRONMENT NOT SUPPORTIVE FOR INTERVENTION",
              "INTERVENTION GOALS NOT CLEARLY DEFINED",
            ].map((item) => (
              <SquareCheckbox
                key={item}
                label={item}
                value={item}
                selected={providerReasons}
                onChange={(val) =>
                  toggleReason(
                    val,
                    "whyInventionsWorking.relatedToMentoonsProvider.reasons",
                    providerReasons
                  )
                }
              />
            ))}
            <SquareCheckbox
              label="OTHERS (SPECIFY):"
              value="OTHERS_PROVIDER"
              selected={providerReasons}
              onChange={(val) =>
                toggleReason(
                  val,
                  "whyInventionsWorking.relatedToMentoonsProvider.reasons",
                  providerReasons
                )
              }
            >
              <input
                type="text"
                value={
                  values.whyInventionsWorking.relatedToMentoonsProvider
                    .otherReason
                }
                onChange={(e) =>
                  setFieldValue(
                    "whyInventionsWorking.relatedToMentoonsProvider.otherReason",
                    e.target.value
                  )
                }
                placeholder="Specify..."
                className="ml-2 w-[350px] border-b border-dashed border-gray-700 bg-transparent focus:outline-none text-base"
              />
            </SquareCheckbox>
          </div>

          {touched.whyInventionsWorking?.relatedToMentoonsProvider?.reasons &&
            errors.whyInventionsWorking?.relatedToMentoonsProvider?.reasons && (
              <p className="text-red-500 text-xs mt-1 block">
                *
                {
                  errors.whyInventionsWorking?.relatedToMentoonsProvider
                    ?.reasons
                }
              </p>
            )}

          <div className="mt-6 flex gap-2 ml-5">
            <label className="font-semibold text-base">REMARKS:</label>
            <textarea
              rows={3}
              value={
                values.whyInventionsWorking.relatedToMentoonsProvider.remarks
              }
              onChange={(e) =>
                setFieldValue(
                  "whyInventionsWorking.relatedToMentoonsProvider.remarks",
                  e.target.value
                )
              }
              className={`w-full p-3 border border-gray-700 resize-none bg-transparent focus:outline-none rounded-md *:
                ${
                  touched.whyInventionsWorking?.relatedToMentoonsProvider
                    ?.remarks &&
                  errors.whyInventionsWorking?.relatedToMentoonsProvider
                    ?.remarks &&
                  "border-red-500"
                }
                `}
            />
          </div>
          {touched.whyInventionsWorking?.relatedToMentoonsProvider?.remarks &&
            errors.whyInventionsWorking?.relatedToMentoonsProvider?.remarks && (
              <p className="text-red-500 text-xs mt-1 block">
                *
                {
                  errors.whyInventionsWorking?.relatedToMentoonsProvider
                    ?.remarks
                }
              </p>
            )}
        </div>

        {/* SECTION B */}
        <div className="mt-4">
          <p className="text-lg ml-5 mb-">B. FACTORS RELATED TO THE CHILD</p>
          <p className="text-base ml-5 mb-5 flex gap-2">
            (<Check /> Tick all that apply and add remarks)
          </p>

          <div className="space-y-4 ml-5">
            {[
              "LOW MOTIVATION OR RESISTANCE",
              "INCONSISTENT PARTICIPATION",
              "EMOTIONAL DISTRESS / ANXIETY",
              "DIFFICULTY UNDERSTANDING INSTRUCTIONS",
              "EXTERNAL STRESSORS (FAMILY, SCHOOL, PEERS)",
              "DEVELOPMENTAL OR COGNITIVE LIMITATIONS",
            ].map((item) => (
              <SquareCheckbox
                key={item}
                label={item}
                value={item}
                selected={childReasons}
                onChange={(val) =>
                  toggleReason(
                    val,
                    "whyInventionsWorking.relatedToChild.reasons",
                    childReasons
                  )
                }
              />
            ))}
            <SquareCheckbox
              label="OTHERS (SPECIFY):"
              value="OTHERS_CHILD"
              selected={childReasons}
              onChange={(val) =>
                toggleReason(
                  val,
                  "whyInventionsWorking.relatedToChild.reasons",
                  childReasons
                )
              }
            >
              <input
                type="text"
                value={values.whyInventionsWorking.relatedToChild.otherReason}
                onChange={(e) =>
                  setFieldValue(
                    "whyInventionsWorking.relatedToChild.otherReason",
                    e.target.value
                  )
                }
                placeholder="Specify..."
                className="ml-2 w-[350px] border-b border-dashed border-gray-700 bg-transparent focus:outline-none text-base"
              />
            </SquareCheckbox>
          </div>
          {touched.whyInventionsWorking?.relatedToChild?.reasons &&
            errors.whyInventionsWorking?.relatedToChild?.reasons && (
              <p className="text-red-500 text-xs mt-1 block">
                *{errors.whyInventionsWorking?.relatedToChild?.reasons}
              </p>
            )}

          <div className="mt-6 flex gap-2 ml-5">
            <label className="font-semibold text-base">REMARKS:</label>
            <textarea
              rows={3}
              value={values.whyInventionsWorking.relatedToChild.remarks}
              onChange={(e) =>
                setFieldValue(
                  "whyInventionsWorking.relatedToChild.remarks",
                  e.target.value
                )
              }
              className={`w-full p-3 border border-gray-700 resize-none bg-transparent focus:outline-none rounded-md
                  ${
                    touched.whyInventionsWorking?.relatedToChild?.remarks &&
                    errors.whyInventionsWorking?.relatedToChild?.remarks &&
                    "border-red-500"
                  }
                `}
            />
          </div>
          {touched.whyInventionsWorking?.relatedToChild?.remarks &&
            errors.whyInventionsWorking?.relatedToChild?.remarks && (
              <p className="text-red-500 text-xs mt-1 block">
                *{errors.whyInventionsWorking?.relatedToChild?.remarks}
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReviewMechanismThird;
