import { Details } from "@/types/employee/dataCaptureTypes";
import { Input, RadioGroup, TextArea } from "./FormInputs";

type Props = {
  details: Details;
  setDetails: React.Dispatch<React.SetStateAction<Details>>;
  handleSubmit: (e: React.FormEvent) => void;
  handlePrevious: () => void;
  loading: boolean;
};

const TherapistInitialObservation = ({
  details,
  setDetails,
  handleSubmit,
  handlePrevious,
  loading,
}: Props) => {
  const therapistInitialObservation = details.therapistInitialObservation;

  // ✅ SINGLE HANDLER FOR DEVELOPMENTAL ONLY
  const handleChange = (field: string, value: string) => {
    setDetails((prev: Details) => ({
      ...prev,
      therapistInitialObservation: {
        ...prev.therapistInitialObservation,
        [field]: value,
      },
    }));
  };

  return (
    <div className="py-6 px-6">
      <h1 className="text-center font-bold text-xl mb-6 text-orange-500">
        THERAPIST INITIAL OBSERVATION
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* ✅ RADIO FIELDS */}
        <RadioGroup
          label="Rapport building level *"
          value={therapistInitialObservation.reportBuildingLevel}
          options={["Easy", "Neutral", " Difficult"]}
          onChange={(val) => handleChange("reportBuildingLevel", val)}
        />

        <TextArea
          label="Child’s behaviour during session (eye contact, engagement, mood) *"
          value={therapistInitialObservation.childBehaviourDuringSession}
          onChange={(val) => handleChange("childBehaviourDuringSession", val)}
        />

        <TextArea
          label="Initial impression regarding screen dependency/addiction risks *"
          value={therapistInitialObservation.initialImpressionRisks}
          onChange={(val) => handleChange("initialImpressionRisks", val)}
        />

        <TextArea
          label="Recommended Intervention Plan *"
          value={therapistInitialObservation.recomentedInventionPlan}
          onChange={(val) => handleChange("recomentedInventionPlan", val)}
        />

        <Input
          type="number"
          label="Sessions Required (approx) *"
          value={therapistInitialObservation.sessionRequired}
          onChange={(val) => handleChange("sessionRequired", val.target.value)}
        />

        <TextArea
          label="Activities/Modules Suggested *"
          value={therapistInitialObservation.activitiesOrModulesSuggested}
          onChange={(val) => handleChange("activitiesOrModulesSuggested", val)}
        />

        <TextArea
          label="Parental Guidance/Boundaries needed *"
          value={therapistInitialObservation.parentalGuidanceOrBoundariesNeeded}
          onChange={(val) =>
            handleChange("parentalGuidanceOrBoundariesNeeded", val)
          }
        />

        <div className="flex justify-between">
          <button
            type="button"
            className="py-2 px-3 bg-orange-600 rounded-md"
            onClick={handlePrevious}
          >
            Previous
          </button>
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-3 bg-orange-600 rounded-md disabled:bg-slate-700"
          >
            {loading ? "Submitting details" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TherapistInitialObservation;
