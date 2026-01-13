import { Details } from "@/types/employee/dataCaptureTypes";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";

type Props = {
  singleData: Details | null;
};

const InfoBox = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="space-y-1">
    <p className="text-sm text-gray-500 print-label">{label}</p>
    <div className="border rounded-md bg-gray-50 p-3 text-sm text-gray-800 print-box">
      {value || "-"}
    </div>
  </div>
);

const RadioOptions = ({
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

const ShowTherapistInitialObservation = ({ singleData }: Props) => {
  if (!singleData?.therapistInitialObservation) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading therapist initial observation...
      </div>
    );
  }

  const obs = singleData.therapistInitialObservation;

  return (
    <div className="border rounded-xl p-5 space-y-6">
      <h2 className="text-xl font-bold text-center text-orange-600">
        THERAPIST INITIAL OBSERVATION
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Rapport Building Level</p>
          <RadioOptions
            options={["Easy", "Neutral", "Difficult"]}
            value={obs.reportBuildingLevel}
          />
        </div>
        <InfoBox
          label="Child’s behaviour during session (eye contact, engagement, mood)"
          value={obs.childBehaviourDuringSession}
        />
        <InfoBox
          label="Initial impression regarding screen dependency/addiction risks"
          value={obs.initialImpressionRisks}
        />
        <InfoBox
          label="Recommended Intervention Plan"
          value={obs.recomentedInventionPlan}
        />
        <InfoBox
          label="Sessions Required (approx)"
          value={obs.sessionRequired}
        />
        <InfoBox
          label="Activities/Modules Suggested"
          value={obs.activitiesOrModulesSuggested}
        />
        <InfoBox
          label="Parental Guidance/Boundaries needed"
          value={obs.parentalGuidanceOrBoundariesNeeded}
        />
      </div>
    </div>
  );
};

export default ShowTherapistInitialObservation;
