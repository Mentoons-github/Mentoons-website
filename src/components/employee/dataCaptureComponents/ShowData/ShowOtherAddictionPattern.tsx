import {
  Details,
  OtherAddictionPatternTypes,
} from "@/types/employee/dataCaptureTypes";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";
import ShowChildsSelfPerception from "./ShowChildSelfPerception";
import ShowGoalsExpectations from "./ShowGoalsExpectations";

type Props = {
  singleData: Details | null;
};

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
    label: "Early signs of porn exposure",
  },
];

const ValueBox = ({ value }: { value?: string }) => (
  <div className="border rounded-md bg-gray-50 px-3 py-2 text-sm">
    {value || "-"}
  </div>
);

const StatusBadge = ({ present }: { present: boolean }) => (
  <div className="status-badge">
    {present ? (
      <span className="flex items-center justify-center gap-1">
        <FaRegSquareCheck className="text-orange-600 " size={16} /> Present
      </span>
    ) : (
      <span className="flex items-center justify-center gap-1">
        <FaRegSquare className="text-gray-400 " size={16} /> Present
      </span>
    )}
  </div>
);

const ShowOtherAddictionPattern = ({ singleData }: Props) => {
  if (!singleData?.otherAddictionPattern) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading other addiction patterns...
      </div>
    );
  }

  const data = singleData.otherAddictionPattern;

  return (
    <div className="border rounded-xl p-5 space-y-6">
      <h2 className="text-xl font-bold text-center text-orange-600">
        OTHER ADDICTION / BEHAVIOURAL PATTERNS
      </h2>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto print-other-addiction">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Habit / Activity</th>
              <th className="border p-2 text-center">Status</th>
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
                    <StatusBadge present={current.present} />
                  </td>

                  <td className="border p-2">
                    <ValueBox value={current.frequency} />
                  </td>

                  <td className="border p-2">
                    <ValueBox value={current.duration} />
                  </td>

                  <td className="border p-2">
                    <ValueBox value={current.observations} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-4 md:hidden no-print">
        {rows.map((row) => {
          const current = data[row.key];

          return (
            <div
              key={row.key}
              className="border rounded-xl p-4 bg-white shadow-sm space-y-3"
            >
              <p className="font-semibold">{row.label}</p>

              <StatusBadge present={current.present} />

              <div>
                <p className="text-xs text-gray-500 mb-1">Frequency</p>
                <ValueBox value={current.frequency} />
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <ValueBox value={current.duration} />
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Observations</p>
                <ValueBox value={current.observations} />
              </div>
            </div>
          );
        })}
      </div>

      <ShowChildsSelfPerception singleData={singleData} />
      <ShowGoalsExpectations singleData={singleData} />
    </div>
  );
};

export default ShowOtherAddictionPattern;
