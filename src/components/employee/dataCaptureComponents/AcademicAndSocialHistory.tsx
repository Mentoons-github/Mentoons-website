import { Details } from "@/types/employee/dataCaptureTypes";
import { RadioGroup, TextArea } from "./FormInputs";

type Props = {
  details: Details;
  setDetails: React.Dispatch<React.SetStateAction<Details>>;
  handleNext: () => void;
  handlePrevious: () => void;
};

const AcademicAndSocialHistory = ({
  details,
  setDetails,
  handleNext,
  handlePrevious,
}: Props) => {
  const academic = details.academic;

  // ✅ SINGLE HANDLER FOR DEVELOPMENTAL ONLY
  const handleChange = (field: string, value: string) => {
    setDetails((prev: Details) => ({
      ...prev,
      academic: {
        ...prev.academic,
        [field]: value,
      },
    }));
  };

  return (
    <div className="py-6 px-6">
      <h1 className="text-center font-bold text-xl mb-6 text-orange-500">
        ACADEMIC & SOCIAL HISTORY
      </h1>

      <form className="space-y-4">
        <RadioGroup
          label="Academic Performance *"
          value={academic.performance}
          options={["Excellent", "Good", "Average", "Needs Support"]}
          onChange={(val) => handleChange("performance", val)}
        />

        <TextArea
          label="Subject child struggles in *"
          value={academic.strugglesIn}
          onChange={(val) => handleChange("strugglesIn", val)}
        />

        <TextArea
          label="Attention / Concentration issues *"
          value={academic.attentionIssues}
          onChange={(val) => handleChange("attentionIssues", val)}
        />

        <TextArea
          label="Relationship with classmates / teachers *"
          value={academic.relationship}
          onChange={(val) => handleChange("relationship", val)}
        />

        <TextArea
          label="Participation in extracurricular activities *"
          value={academic.participation}
          onChange={(val) => handleChange("participation", val)}
        />

        <TextArea
          label="Any behavioural concerns in school? (Fights, Withdrawal, Disobedience etc) *"
          value={academic.behaviouralConcerns}
          onChange={(val) => handleChange("behaviouralConcerns", val)}
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

export default AcademicAndSocialHistory;
