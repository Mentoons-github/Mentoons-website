import { Calendar } from "lucide-react";

interface AttendanceViewToggleProps {
  calendarView: boolean;
  onToggleView: () => void;
}

const AttendanceViewToggle: React.FC<AttendanceViewToggleProps> = ({
  calendarView,
  onToggleView,
}) => {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={onToggleView}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <Calendar className="w-4 h-4" />
        {calendarView ? "Show Charts" : "Show Calendar"}
      </button>
    </div>
  );
};

export default AttendanceViewToggle;
