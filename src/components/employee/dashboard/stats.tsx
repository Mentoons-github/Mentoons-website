import { AttendanceStats } from "@/types/employee";

interface StatsCardsProps {
  overallStats: AttendanceStats;
}

const StatsCards = ({ overallStats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mt-6">
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
        <h3 className="text-sm md:text-lg font-medium text-gray-500">
          Total Days
        </h3>
        <div className="flex justify-between items-end mt-2">
          <p className="text-xl md:text-2xl font-bold text-gray-800">
            {overallStats.totalDays}
          </p>
          <span className="text-xs md:text-sm text-blue-500 font-medium">
            100%
          </span>
        </div>
      </div>
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
        <h3 className="text-sm md:text-lg font-medium text-gray-500">
          Present Days
        </h3>
        <div className="flex justify-between items-end mt-2">
          <p className="text-xl md:text-2xl font-bold text-green-600">
            {overallStats.presentDays}
          </p>
          <span className="text-xs md:text-sm text-green-500 font-medium">
            {overallStats.presentPercentage}%
          </span>
        </div>
      </div>
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
        <h3 className="text-sm md:text-lg font-medium text-gray-500">
          Absent Days
        </h3>
        <div className="flex justify-between items-end mt-2">
          <p className="text-xl md:text-2xl font-bold text-red-600">
            {overallStats.absentDays}
          </p>
          <span className="text-xs md:text-sm text-red-500 font-medium">
            {overallStats.totalDays > 0
              ? Math.round(
                  (overallStats.absentDays / overallStats.totalDays) * 100
                )
              : 0}
            %
          </span>
        </div>
      </div>
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
        <h3 className="text-sm md:text-lg font-medium text-gray-500">
          Half Days
        </h3>
        <div className="flex justify-between items-end mt-2">
          <p className="text-xl md:text-2xl font-bold text-yellow-600">
            {overallStats.halfDays}
          </p>
          <span className="text-xs md:text-sm text-yellow-500 font-medium">
            {overallStats.totalDays > 0
              ? Math.round(
                  (overallStats.halfDays / overallStats.totalDays) * 100
                )
              : 0}
            %
          </span>
        </div>
      </div>
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
        <h3 className="text-sm md:text-lg font-medium text-gray-500">
          On Leave
        </h3>
        <div className="flex justify-between items-end mt-2">
          <p className="text-xl md:text-2xl font-bold text-purple-600">
            {overallStats.onLeaveDays}
          </p>
          <span className="text-xs md:text-sm text-purple-500 font-medium">
            {overallStats.totalDays > 0
              ? Math.round(
                  (overallStats.onLeaveDays / overallStats.totalDays) * 100
                )
              : 0}
            %
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
