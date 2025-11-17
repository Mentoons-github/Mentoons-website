import { Award } from "lucide-react";
import { TaskStats } from "@/redux/employee/api";

interface EmployeePerformanceTabProps {
  tasks: TaskStats;
}

const EmployeePerformanceTab = ({ tasks }: EmployeePerformanceTabProps) => {
  const submittedPct = tasks.assigned
    ? (tasks.submitted / tasks.assigned) * 100
    : 0;
  const completionRate = tasks.assigned
    ? ((tasks.submitted / tasks.assigned) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Task Statistics</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />{" "}
              <span className="font-semibold text-gray-700">
                Total Assigned
              </span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {tasks.assigned}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />{" "}
              <span className="font-semibold text-gray-700">Submitted</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {tasks.submitted}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${submittedPct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />{" "}
              <span className="font-semibold text-gray-700">Pending</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {tasks.assigned - tasks.submitted}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-orange-500 h-3 rounded-full transition-all"
              style={{ width: `${100 - submittedPct}%` }}
            />
          </div>
        </div>

        <div className="mt-8 p-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">
                Overall Completion Rate
              </p>
              <p className="text-5xl font-bold">{completionRate}%</p>
            </div>
            <Award size={64} className="text-blue-200 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePerformanceTab;
