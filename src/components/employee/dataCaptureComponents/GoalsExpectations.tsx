import { Details } from "@/types/employee/dataCaptureTypes";
import { TextArea } from "./FormInputs";

type Props = {
  details: Details;
  setDetails: React.Dispatch<React.SetStateAction<Details>>;
  handleNext: () => void;
  handlePrevious: () => void;
};

const GoalsExpectations = ({
  details,
  setDetails,
  handleNext,
  handlePrevious,
}: Props) => {
  const goals = details.goalsAndExpectations;

  // ✅ Update array values (Parents / Child)
  const handleArrayChange = (
    field: "parentsGoals" | "childsGoals",
    index: number,
    value: string
  ) => {
    const updated = [...goals[field]];
    updated[index] = value;

    setDetails((prev: Details) => ({
      ...prev,
      goalsAndExpectations: {
        ...prev.goalsAndExpectations,
        [field]: updated,
      },
    }));
  };

  return (
    <div className="py-6 px-6">
      <h1 className="text-center font-bold text-xl mb-6 text-orange-500">
        GOALS & EXPECTATIONS
      </h1>

      <form className="space-y-8">
        {/* ✅ Parents Goals */}
        <div className="space-y-2">
          <h2 className="font-semibold ">PARENT’S GOALS *</h2>

          {[0, 1, 2].map((i) => (
            <TextArea
              key={i}
              label={`${i + 1})`}
              value={goals.parentsGoals[i] || ""}
              onChange={(val) => handleArrayChange("parentsGoals", i, val)}
            />
          ))}
        </div>

        {/* ✅ Child’s Goals */}
        <div className="space-y-2">
          <h2 className="font-semibold ">CHILD’S GOALS *</h2>

          {[0, 1, 2].map((i) => (
            <TextArea
              key={i}
              label={`${i + 1})`}
              value={goals.childsGoals[i] || ""}
              onChange={(val) => handleArrayChange("childsGoals", i, val)}
            />
          ))}
        </div>

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

export default GoalsExpectations;
