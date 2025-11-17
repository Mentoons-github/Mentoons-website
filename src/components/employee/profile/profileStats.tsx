import { CheckCircle, Clock, TrendingUp } from "lucide-react";
import { TaskStats } from "@/redux/employee/api";

interface EmployeeQuickStatsProps {
  tasks: TaskStats;
}

const EmployeeQuickStats = ({ tasks }: EmployeeQuickStatsProps) => {
  const completionRate = tasks.assigned
    ? ((tasks.submitted / tasks.assigned) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <CheckCircle size={20} />{" "}
          <span className="text-sm font-medium">Completed</span>
        </div>
        <p className="text-2xl font-bold text-blue-700">{tasks.completed}</p>
      </div>
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
        <div className="flex items-center gap-2 text-orange-600 mb-1">
          <Clock size={20} />{" "}
          <span className="text-sm font-medium">In Progress</span>
        </div>
        <p className="text-2xl font-bold text-orange-700">{tasks.inProgress}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
        <div className="flex items-center gap-2 text-purple-600 mb-1">
          <TrendingUp size={20} />{" "}
          <span className="text-sm font-medium">Success Rate</span>
        </div>
        <p className="text-2xl font-bold text-purple-700">{completionRate}%</p>
      </div>
    </div>
  );
};

export default EmployeeQuickStats;
