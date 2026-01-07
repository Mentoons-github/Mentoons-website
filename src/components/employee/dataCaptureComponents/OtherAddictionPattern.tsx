import {
  AddictionPatternItem,
  Details,
  OtherAddictionPatternTypes,
} from "@/types/employee/dataCaptureTypes";

type Props = {
  details: Details;
  setDetails: React.Dispatch<React.SetStateAction<Details>>;
  handleNext: () => void;
  handlePrevious: () => void;
};

const frequencyOptions = ["Low", "Moderate", "High"];

const rows: {
  key: keyof OtherAddictionPatternTypes;
  label: string;
}[] = [
  { key: "gamingAddiction", label: "Gaming Addiction" },
  { key: "youtubeOrOttBinge", label: "YouTube / OTT Binge" },
  { key: "sugarOrJunkFoodCravings", label: "Sugar / Junk Food Cravings" },
  { key: "nailBaitingOrHairPulling", label: "Nail Biting / Hair Pulling" },
  { key: "socialMediaScrolling", label: "Social Media Scrolling" },
  {
    key: "pornExposure",
    label: "Early signs of porn exposure (Handle sensitively)",
  },
];

const OtherAddictionPattern = ({
  details,
  setDetails,
  handleNext,
  handlePrevious,
}: Props) => {
  const data = details.otherAddictionPattern;

  const updateField = <
    K extends keyof OtherAddictionPatternTypes,
    F extends keyof AddictionPatternItem
  >(
    key: K,
    field: F,
    value: AddictionPatternItem[F]
  ) => {
    setDetails((prev) => ({
      ...prev,
      otherAddictionPattern: {
        ...prev.otherAddictionPattern,
        [key]: {
          ...prev.otherAddictionPattern[key],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold text-center mb-6 text-orange-500">
        OTHER ADDICTION / BEHAVIOURAL PATTERNS
      </h2>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border p-2 text-left">Habit / Activity</th>
              <th className="border p-2">Present?</th>
              <th className="border p-2">Frequency</th>
              <th className="border p-2">Duration</th>
              <th className="border p-2">Observations</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const current = data[row.key];

              return (
                <tr key={row.key}>
                  <td className="border p-2 font-medium">{row.label}</td>

                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={current.present}
                      onChange={(e) =>
                        updateField(row.key, "present", e.target.checked)
                      }
                      className="accent-orange-600 cursor-pointer"
                    />
                  </td>

                  <td className="border p-2">
                    <select
                      value={current.frequency}
                      onChange={(e) =>
                        updateField(row.key, "frequency", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                      //   disabled={!current.present}
                    >
                      <option value="">Select</option>
                      {frequencyOptions.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="border p-2">
                    <input
                      type="text"
                      value={current.duration}
                      onChange={(e) =>
                        updateField(row.key, "duration", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                      //   disabled={!current.present}
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      type="text"
                      value={current.observations}
                      onChange={(e) =>
                        updateField(row.key, "observations", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                      //   disabled={!current.present}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="space-y-4 md:hidden">
        {rows.map((row) => {
          const current = data[row.key];

          return (
            <div
              key={row.key}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              <p className="font-semibold mb-3">{row.label}</p>

              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={current.present}
                  onChange={(e) =>
                    updateField(row.key, "present", e.target.checked)
                  }
                  className="accent-orange-600"
                />
                Present
              </label>

              <select
                value={current.frequency}
                onChange={(e) =>
                  updateField(row.key, "frequency", e.target.value)
                }
                // disabled={!current.present}
                className="w-full border rounded-lg px-3 py-2 mb-3"
              >
                <option value="">Frequency</option>
                {frequencyOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Duration"
                value={current.duration}
                onChange={(e) =>
                  updateField(row.key, "duration", e.target.value)
                }
                // disabled={!current.present}
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />

              <input
                type="text"
                placeholder="Observations"
                value={current.observations}
                onChange={(e) =>
                  updateField(row.key, "observations", e.target.value)
                }
                // disabled={!current.present}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-end mt-4">
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

export default OtherAddictionPattern;
