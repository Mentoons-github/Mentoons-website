import { Details } from "@/types/employee/dataCaptureTypes";
import { RadioGroup, TextArea } from "./FormInputs";

type Props = {
  details: Details;
  setDetails: React.Dispatch<React.SetStateAction<Details>>;
  handleNext: () => void;
  handlePrevious: () => void;
};

const FamilyAndEnvironmentalObservation = ({
  details,
  setDetails,
  handleNext,
  handlePrevious,
}: Props) => {
  const familyEnvironmental = details.familyEnvironmental;

  // ✅ SINGLE HANDLER FOR DEVELOPMENTAL ONLY
  const handleChange = (field: string, value: string) => {
    setDetails((prev: Details) => ({
      ...prev,
      familyEnvironmental: {
        ...prev.familyEnvironmental,
        [field]: value,
      },
    }));
  };

  return (
    <div className="py-6 px-6">
      <h1 className="text-center font-bold text-xl mb-6 text-orange-500">
        FAMILY & ENVIRONMENTAL OBSERVATION
      </h1>

      <form className="space-y-4">
        {/* ✅ RADIO FIELDS */}
        <RadioGroup
          label="Parenting Style *"
          value={familyEnvironmental.parentingStyle}
          options={["Strict", "Balanced", "Lenient", "Uncertain"]}
          onChange={(val) => handleChange("parentingStyle", val)}
        />

        <RadioGroup
          label="Social Interaction *"
          value={familyEnvironmental.socialInteraction}
          options={["Supportive", "Stressful", "Conflicting", "Not Sure"]}
          onChange={(val) => handleChange("socialInteraction", val)}
        />

        <RadioGroup
          label="How often do you have quarrels/fights at home? *"
          value={familyEnvironmental.fightsAtHome}
          options={["Rarely", "Sometimes", "Often"]}
          onChange={(val) => handleChange("fightsAtHome", val)}
        />

        <TextArea
          label="Screen exposure at home (TV / Mobile / Laptop ) *"
          value={familyEnvironmental.screenExposure}
          onChange={(val) => handleChange("screenExposure", val)}
        />

        <TextArea
          label="Any major recent life events (relocation, loss, separation, trauma) *"
          value={familyEnvironmental.recentLifeEvents}
          onChange={(val) => handleChange("recentLifeEvents", val)}
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

export default FamilyAndEnvironmentalObservation;
