import { Details } from "@/types/employee/dataCaptureTypes";
import { TextArea } from "./FormInputs";

type Props = {
  details: Details;
  setDetails: React.Dispatch<React.SetStateAction<Details>>;
  handleNext: () => void;
  handlePrevious: () => void;
};

const ChildsSelfPerception = ({ details, setDetails, handleNext, handlePrevious }: Props) => {
  const self = details.childsSelfPerception;

  // ✅ Update array values (i, ii, iii)
  const handleArrayChange = (
    field: "likesThemselves" | "wantToImprove",
    index: number,
    value: string
  ) => {
    const updated = [...self[field]];
    updated[index] = value;

    setDetails((prev: Details) => ({
      ...prev,
      childsSelfPerception: {
        ...prev.childsSelfPerception,
        [field]: updated,
      },
    }));
  };

  // ✅ Update single text fields
  const handleChange = (field: string, value: string) => {
    setDetails((prev: Details) => ({
      ...prev,
      childsSelfPerception: {
        ...prev.childsSelfPerception,
        [field]: value,
      },
    }));
  };

  return (
    <div className="py-6 px-6">
      <h1 className="text-center font-bold text-xl mb-6 text-orange-500">
        CHILD'S SELF-PERCEPTION
      </h1>

      <form className="space-y-6">

        {/* ✅ Likes About Themselves */}
        <div className="space-y-2">
          <label className="font-semibold">
            Three things the child likes about themselves *
          </label>

          {[0, 1, 2].map((i) => (
            <input
              key={i}
              placeholder={`${i + 1})`}
              value={self.likesThemselves[i] || ""}
              onChange={(e) =>
                handleArrayChange(
                  "likesThemselves",
                  i,
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          ))}
        </div>

        {/* ✅ Want To Improve */}
        <div className="space-y-2">
          <label className="font-semibold">
            Three things they want to improve *
          </label>

          {[0, 1, 2].map((i) => (
            <input
              key={i}
              placeholder={`${i + 1})`}
              value={self.wantToImprove[i] || ""}
              onChange={(e) =>
                handleArrayChange(
                  "wantToImprove",
                  i,
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          ))}
        </div>

        {/* ✅ Happy / Relaxed */}
        <TextArea
          label="What makes them happy / relaxed? *"
          value={self.makeThemHappy}
          onChange={(val) => handleChange("makeThemHappy", val)}
        />

        {/* ✅ Fears / Worries */}
        <TextArea
          label="Any fears or worries? *"
          value={self.fearOrWorries}
          onChange={(val) => handleChange("fearOrWorries", val)}
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

export default ChildsSelfPerception;
