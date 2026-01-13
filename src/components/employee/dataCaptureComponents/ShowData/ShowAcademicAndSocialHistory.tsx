import { Details } from "@/types/employee/dataCaptureTypes";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";

const PERFORMANCE_OPTIONS = ["Excellent", "Good", "Average", "Needs Support"];

const ShowAcademicAndSocialHistory = ({
  singleData,
}: {
  singleData: Details | null;
}) => {
  if (!singleData || !singleData.academic) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading academic & social history...
      </div>
    );
  }

  const academic = singleData.academic;

  const Row = ({ label, value }: { label: string; value?: string }) => (
    <div className="space-y-1">
      <p className="text-sm text-gray-500 print-label">{label}</p>
      <div className="border rounded-md bg-gray-50 p-3 text-sm text-gray-800 print-box">
        {value || "-"}
      </div>
    </div>
  );

  const PerformanceBadge = ({
    options,
    value,
  }: {
    options: string[];
    value?: string;
  }) => (
    <div className="flex flex-wrap gap-2 mt-1 print-radio-wrapper">
      {options.map((opt) => {
        const selected = value === opt;

        return (
          <div
            key={opt}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm print-badge print-radio
            ${
              selected
                ? "border-orange-600 bg-orange-50 text-orange-700 font-medium print-radio-selected"
                : "border-gray-300 text-gray-500"
            }`}
          >
            {/* Icon instead of custom circle */}
            {selected ? (
              <FaRegSquareCheck className="text-orange-600" size={16} />
            ) : (
              <FaRegSquare className="text-gray-400" size={16} />
            )}

            <span className="print-badge">{opt}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className=" space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold text-center text-orange-600">
          ACADEMIC & SOCIAL HISTORY
        </h2>
      </div>

      {/* PERFORMANCE */}
      <section className="space-y-3">
        <p className="text-sm text-gray-500">Academic Performance</p>

        <div className="flex flex-wrap gap-2">
          <PerformanceBadge
            options={PERFORMANCE_OPTIONS}
            value={academic.performance}
          />
        </div>
      </section>

      {/* DETAILS */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Row
            label="Subjects the child struggles in"
            value={academic.strugglesIn}
          />

          <Row
            label="Attention / Concentration issues"
            value={academic.attentionIssues}
          />

          <Row
            label="Relationship with classmates / teachers"
            value={academic.relationship}
          />

          <Row
            label="Extracurricular participation"
            value={academic.participation}
          />

          <Row
            label="Behavioural concerns in school"
            value={academic.behaviouralConcerns}
          />
        </div>
      </section>
    </div>
  );
};

export default ShowAcademicAndSocialHistory;
