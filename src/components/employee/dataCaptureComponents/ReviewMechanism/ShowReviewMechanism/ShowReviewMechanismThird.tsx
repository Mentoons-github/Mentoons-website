import { Details } from "@/types/employee/dataCaptureTypes";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";

const SquareCheckboxView = ({
  label,
  checked,
  children,
}: {
  label: string;
  checked: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-3 select-none">
      {checked ? (
        <FaRegSquareCheck className="text-orange-600" size={18} />
      ) : (
        <FaRegSquare className="text-gray-700" size={18} />
      )}
      <span className="text-lg font-semibold">{label}</span>
      {checked && children}
    </div>
  );
};

const ShowReviewMechanismThird = ({ singleData }: { singleData: Details }) => {
  const review = singleData.reviewMechanism;

  if (!review) {
    return (
      <div className="p-6 text-center text-gray-500">
        No review mechanism available.
      </div>
    );
  }

  const provider = review.whyInventionsWorking.relatedToMentoonsProvider;
  const child = review.whyInventionsWorking.relatedToChild;

  const providerOptions = [
    "INTERVENTION NOT DELIVERED CONSISTENTLY",
    "METHOD NOT AGE-APPROPRIATE",
    "INSUFFICIENT ENGAGEMENT OR RAPPORT",
    "LACK OF FOLLOW-UP OR REINFORCEMENT",
    "ENVIRONMENT NOT SUPPORTIVE FOR INTERVENTION",
    "INTERVENTION GOALS NOT CLEARLY DEFINED",
  ];

  const childOptions = [
    "LOW MOTIVATION OR RESISTANCE",
    "INCONSISTENT PARTICIPATION",
    "EMOTIONAL DISTRESS / ANXIETY",
    "DIFFICULTY UNDERSTANDING INSTRUCTIONS",
    "EXTERNAL STRESSORS (FAMILY, SCHOOL, PEERS)",
    "DEVELOPMENTAL OR COGNITIVE LIMITATIONS",
  ];

  return (
    <div className="flex justify-center bg-gray-100 print:bg-white p-2 print:!p-0 border print:!border-0">
      <div className="w-[210mm] bg-white px-[15mm] py-[10mm] print:py-[3mm] shadow-lg print:shadow-none">
        {/* SECTION A */}
        <div className="border-b-2 border-gray-700 pb-12">
          <h2 className="font-semibold text-xl mb-2">
            3. REASONS WHY THE INTERVENTION IS / IS NOT WORKING
          </h2>

          <p className="text-lg ml-5">
            A. FACTORS RELATED TO MENTORS / INTERVENTION PROVIDER
          </p>


          <div className="space-y-4 ml-5 mt-4">
            {providerOptions.map((item) => (
              <SquareCheckboxView
                key={item}
                label={item}
                checked={provider.reasons.includes(item)}
              />
            ))}

            <SquareCheckboxView
              label="OTHERS: "
              checked={provider.reasons.includes("OTHERS_PROVIDER")}
            >
              <span className="ml-2 w-[350px] border-b border-dashed border-gray-700 text-base">
                {provider.otherReason}
              </span>
            </SquareCheckboxView>
          </div>

          <div className="mt-6 flex gap-2 ml-5">
            <label className="font-semibold text-base">REMARKS:</label>
            <div className="w-full p-3 border  rounded-md min-h-[100px]">
              {provider.remarks}
            </div>
          </div>
        </div>

        {/* SECTION B */}
        <div className="mt-4">
          <p className="text-lg ml-5">B. FACTORS RELATED TO THE CHILD</p>

          <div className="space-y-4 ml-5 mt-4">
            {childOptions.map((item) => (
              <SquareCheckboxView
                key={item}
                label={item}
                checked={child.reasons.includes(item)}
              />
            ))}

            <SquareCheckboxView
              label="OTHERS:"
              checked={child.reasons.includes("OTHERS_CHILD")}
            >
              <span className="ml-2 w-[350px] border-b border-dashed border-gray-700 text-base">
                {child.otherReason}
              </span>
            </SquareCheckboxView>
          </div>

          <div className="mt-6 flex gap-2 ml-5">
            <label className="font-semibold text-base">REMARKS:</label>
            <div className="w-full p-3 border  rounded-md min-h-[100px]">
              {child.remarks}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowReviewMechanismThird;
