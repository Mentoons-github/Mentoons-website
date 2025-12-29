import {
  Details,
  BehaviouralEmotional,
} from "@/types/employee/dataCaptureTypes";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";
import ShowScreenAndDigitalAddictionAssessment from "./ShowScreenAndDigitalAddictionAssessment";

const OPTIONS = ["Never", "Sometimes", "Often", "Always"];

const ROWS: { key: keyof BehaviouralEmotional; label: string }[] = [
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

const RadioCell = ({ selected }: { selected: boolean }) => {
  return (
    <div className="flex justify-center items-center ">
      {selected ? (
        <FaRegSquareCheck
          className="text-orange-600 "
          size={16}
        />
      ) : (
        <FaRegSquare
          className="text-gray-400 "
          size={16}
        />
      )}
    </div>
  );
};

const ShowBehaviouralAndEmotional = ({
  singleData,
}: {
  singleData: Details | null;
}) => {
  if (!singleData || !singleData.behaviouralEmotional) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading behavioural & emotional observations...
      </div>
    );
  }

  const behavioural = singleData.behaviouralEmotional;

  return (
    <div className="border rounded-lg p-5 space-y-6">
      {/* HEADER */}
      <h2 className="text-xl font-bold text-center text-orange-600">
        BEHAVIOURAL & EMOTIONAL OBSERVATION
      </h2>

      {/* ✅ DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto print-behavioural">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100 font-semibold text-center">
              <th className="border p-2 text-left">Behaviour / Emotion</th>
              {OPTIONS.map((opt) => (
                <th key={opt} className="border p-2">
                  {opt}
                </th>
              ))}
              <th className="border p-2">Notes</th>
            </tr>
          </thead>

          <tbody>
            {ROWS.map((row) => {
              const current = behavioural[row.key] || {
                value: "",
                note: "",
              };

              return (
                <tr key={row.key} className="text-center">
                  <td className="border p-2 text-left font-medium">
                    {row.label}
                  </td>

                  {OPTIONS.map((opt) => (
                    <td
                      key={opt}
                      className={`border p-2
                        ${current.value === opt ? "bg-orange-50" : ""}`}
                    >
                      <RadioCell selected={current.value === opt} />
                    </td>
                  ))}

                  <td className="border p-2 text-left">
                    {current.note || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ✅ MOBILE CARD VIEW */}
      <div className="space-y-4 md:hidden no-print">
        {ROWS.map((row) => {
          const current = behavioural[row.key] || {
            value: "",
            note: "",
          };

          return (
            <div
              key={row.key}
              className="border rounded-xl p-4 bg-white space-y-3"
            >
              <p className="font-semibold">{row.label}</p>

              <div className="grid grid-cols-2 gap-3">
                {OPTIONS.map((opt) => {
                  const selected = current.value === opt;

                  return (
                    <div
                      key={opt}
                      className={`flex items-center gap-2 border rounded-lg px-3 py-2
                        ${
                          selected
                            ? "border-orange-600 bg-orange-50 text-orange-700 font-medium"
                            : "border-gray-300 text-gray-500"
                        }`}
                    >
                      <RadioCell selected={selected} />
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>

              <div className="text-sm">
                <p className="text-gray-500 mb-1">Notes</p>
                <div className="border rounded-md bg-gray-50 p-2">
                  {current.note || "-"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ShowScreenAndDigitalAddictionAssessment singleData={singleData} />
    </div>
  );
};

export default ShowBehaviouralAndEmotional;
