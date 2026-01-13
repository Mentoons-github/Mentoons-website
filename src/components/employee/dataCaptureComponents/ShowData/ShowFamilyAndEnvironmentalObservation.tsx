import { Details } from "@/types/employee/dataCaptureTypes";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";

const PARENTING_STYLE_OPTIONS = ["Strict", "Balanced", "Lenient", "Uncertain"];

const SOCIAL_INTERACTION_OPTIONS = [
  "Supportive",
  "Stressful",
  "Conflicting",
  "Not Sure",
];

const FIGHTS_OPTIONS = ["Rarely", "Sometimes", "Often"];

const OptionBadge = ({
  options,
  value,
}: {
  options: string[];
  value?: string;
}) => (
  <div className="flex flex-wrap gap-2 mt-1 print-radio-wrapper">
    {options.map((opt) => {
      const selected = value === opt;

      return (
        <div
          key={opt}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm print-badge print-radio
            ${
              selected
                ? "border-orange-600 bg-orange-50 text-orange-700 font-medium print-radio-selected"
                : "border-gray-300 text-gray-500"
            }`}
        >
          {/* Icon instead of custom circle */}
          {selected ? (
            <FaRegSquareCheck className="text-orange-600" size={16} />
          ) : (
            <FaRegSquare className="text-gray-400" size={16} />
          )}

          <span className="print-badge">{opt}</span>
        </div>
      );
    })}
  </div>
);

const InfoBlock = ({ label, value }: { label: string; value?: string }) => (
  <div className="space-y-1">
    <p className="text-sm text-gray-500 print-label">{label}</p>
    <div className="border rounded-md bg-gray-50 p-3 text-sm text-gray-800 print-box">
      {value || "-"}
    </div>
  </div>
);

const ShowFamilyAndEnvironmentalObservation = ({
  singleData,
}: {
  singleData: Details | null;
}) => {
  if (!singleData || !singleData.familyEnvironmental) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading family & environmental observations...
      </div>
    );
  }

  const family = singleData.familyEnvironmental;

  return (
    <div className=" space-y-6">
      {/* HEADER */}
      <h2 className="text-xl font-bold text-center text-orange-600">
        FAMILY & ENVIRONMENTAL OBSERVATION
      </h2>

      {/* PARENTING STYLE */}
      <section className="space-y-2">
        <p className="text-sm text-gray-500">Parenting Style</p>
        <div className="flex flex-wrap gap-2">
          <OptionBadge
            options={PARENTING_STYLE_OPTIONS}
            value={family.parentingStyle}
          />
        </div>
      </section>

      {/* SOCIAL INTERACTION */}
      <section className="space-y-2">
        <p className="text-sm text-gray-500">Social Interaction</p>
        <div className="flex flex-wrap gap-2">
          <OptionBadge
            options={SOCIAL_INTERACTION_OPTIONS}
            value={family.socialInteraction}
          />
        </div>
      </section>

      {/* FIGHTS AT HOME */}
      <section className="space-y-2">
        <p className="text-sm text-gray-500">
          Frequency of quarrels / fights at home
        </p>
        <div className="flex flex-wrap gap-2">
          <OptionBadge options={FIGHTS_OPTIONS} value={family.fightsAtHome} />
        </div>
      </section>

      {/* TEXT DETAILS */}
      <section className="grid grid-cols-1 gap-4">
        <InfoBlock
          label="Screen exposure at home (TV / Mobile / Laptop)"
          value={family.screenExposure}
        />

        <InfoBlock
          label="Major recent life events"
          value={family.recentLifeEvents}
        />
      </section>
    </div>
  );
};

export default ShowFamilyAndEnvironmentalObservation;
