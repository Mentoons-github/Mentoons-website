import {
  BehaviouralEmotional,
  Details,
} from "@/types/employee/dataCaptureTypes";

type Props = {
  details: Details;
  setDetails: React.Dispatch<React.SetStateAction<Details>>;
  handleNext: () => void;
  handlePrevious: () => void;
};

const BehaviouralAndEmotional = ({
  details,
  setDetails,
  handleNext,
  handlePrevious
}: Props) => {
  const options = ["Never", "Sometimes", "Often", "Always"];

  const handleValueChange = (
    field: keyof BehaviouralEmotional,
    value: string
  ) => {
    setDetails((prev) => ({
      ...prev,
      behaviouralEmotional: {
        ...prev.behaviouralEmotional,
        [field]: {
          ...prev.behaviouralEmotional[field],
          value,
        },
      },
    }));
  };

  const handleNoteChange = (
    field: keyof BehaviouralEmotional,
    note: string
  ) => {
    setDetails((prev) => ({
      ...prev,
      behaviouralEmotional: {
        ...prev.behaviouralEmotional,
        [field]: {
          ...prev.behaviouralEmotional[field],
          note,
        },
      },
    }));
  };

  const rows: { key: keyof BehaviouralEmotional; label: string }[] = [
    { key: "aggressionOrTemper", label: "Aggression / Temper issues" },
    { key: "anxietyOrWorry", label: "Anxiety / Worry" },
    { key: "moodSwings", label: "Mood Swings" },
    { key: "withdrawalOrIsolation", label: "Withdrawal / Isolation" },
    {
      key: "hyperactivityOrRestlessness",
      label: "Hyperactivity / Restlessness",
    },
    { key: "lyingOrStealing", label: "Lying / Stealing tendencies" },
    { key: "bullyingOrGetsBullied", label: "Bullying / Gets Bullied" },
  ];

  return (
    <div className="py-6 px-4">
      <h1 className="text-center font-bold text-xl mb-6 text-orange-500">
        BEHAVIOURAL & EMOTIONAL OBSERVATION
      </h1>

      {/* ✅ DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100 font-semibold text-center">
              <th className="border p-2 text-left">Behaviour / Emotion</th>
              {options.map((opt) => (
                <th key={opt} className="border p-2">
                  {opt}
                </th>
              ))}
              <th className="border p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const current = details.behaviouralEmotional[row.key] || {
                value: "",
                note: "",
              };
              return (
                <tr key={row.key} className="text-center">
                  <td className="border p-2 text-left font-medium">
                    {row.label}
                  </td>

                  {options.map((opt) => (
                    <td key={opt} className="border p-2">
                      <input
                        type="radio"
                        name={`desktop-${row.key}`}
                        value={opt}
                        checked={current.value === opt}
                        onChange={() => handleValueChange(row.key, opt)}
                        className="accent-orange-600 cursor-pointer w-4 h-4"
                      />
                    </td>
                  ))}

                  <td className="border p-2">
                    <input
                      type="text"
                      value={current.note || ""}
                      placeholder="Enter note"
                      onChange={(e) =>
                        handleNoteChange(row.key, e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ✅ MOBILE CARD VIEW */}
      <div className="space-y-4 md:hidden">
        {rows.map((row) => {
          const current = details.behaviouralEmotional[row.key] || {
            value: "",
            note: "",
          };

          return (
            <div
              key={row.key}
              className="border rounded-xl p-4 shadow-sm bg-white"
            >
              <p className="font-semibold mb-3">{row.label}</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                {options.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition-colors
                      ${
                        current.value === opt
                          ? "border-orange-600 bg-orange-50 text-orange-700 font-medium"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`mobile-${row.key}`}
                      value={opt}
                      checked={current.value === opt}
                      onChange={() => handleValueChange(row.key, opt)}
                      className="accent-orange-600 w-4 h-4"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>

              <input
                type="text"
                value={current.note || ""}
                onChange={(e) => handleNoteChange(row.key, e.target.value)}
                placeholder="Enter note"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-4">
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
    </div>
  );
};

export default BehaviouralAndEmotional;
