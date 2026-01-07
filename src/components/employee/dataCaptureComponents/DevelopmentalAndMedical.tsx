import { Details } from "@/types/employee/dataCaptureTypes";
import { RadioGroup, TextArea } from "./FormInputs";

type Props = {
  details: Details;
  setDetails: React.Dispatch<React.SetStateAction<Details>>;
  handleNext: () => void;
  handlePrevious: () => void;
};

const DevelopmentalAndMedical = ({
  details,
  setDetails,
  handleNext,
  handlePrevious,
}: Props) => {
  const developmental = details.developmental;

  // ✅ SINGLE HANDLER FOR DEVELOPMENTAL ONLY
  const handleChange = (field: string, value: string) => {
    setDetails((prev: Details) => ({
      ...prev,
      developmental: {
        ...prev.developmental,
        [field]: value,
      },
    }));
  };

  return (
    <div className="py-6 px-6">
      <h1 className="text-center font-bold text-xl mb-6 text-orange-500">
        DEVELOPMENTAL & MEDICAL DETAILS
      </h1>

      <form className="space-y-4">
        {/* ✅ RADIO FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RadioGroup
            label="Speech Development *"
            value={developmental.speech}
            options={["On-time", "Delayed"]}
            onChange={(val) => handleChange("speech", val)}
          />

          <RadioGroup
            label="Motor Skills *"
            value={developmental.motorSkills}
            options={["On-time", "Delayed"]}
            onChange={(val) => handleChange("motorSkills", val)}
          />

          <RadioGroup
            label="Social Interaction *"
            value={developmental.socialInteraction}
            options={["On-time", "Delayed"]}
            onChange={(val) => handleChange("socialInteraction", val)}
          />
        </div>

        {/* ✅ LAST 4 AS TEXTAREA */}
        <TextArea
          label="Previous medical illnesses or ongoing treatment *"
          value={developmental.medicalIllness}
          onChange={(val) => handleChange("medicalIllness", val)}
        />

        <TextArea
          label="Any learning disability diagnosed/noticed *"
          value={developmental.learningDisability}
          onChange={(val) => handleChange("learningDisability", val)}
        />

        <TextArea
          label="Current Medications *"
          value={developmental.currentMedication}
          onChange={(val) => handleChange("currentMedication", val)}
        />

        <TextArea
          label="Sleep patterns (duration, disturbances, late sleeping) *"
          value={developmental.sleepPattenrn}
          onChange={(val) => handleChange("sleepPattenrn", val)}
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
            type="button"
            className="py-2 px-3 bg-orange-600 rounded-md"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default DevelopmentalAndMedical;
