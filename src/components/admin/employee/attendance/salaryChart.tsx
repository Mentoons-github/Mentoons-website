import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { AdminSalaryData } from "@/types/employee";

interface SalaryChartProps {
  salaryData: AdminSalaryData | null;
  salaryChartData: any[];
}

const SalaryChart: React.FC<SalaryChartProps> = ({
  salaryData,
  salaryChartData,
}) => {
  if (!salaryData || salaryChartData.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        {salaryData.dailySalaries &&
        Array.isArray(salaryData.dailySalaries) &&
        salaryData.dailySalaries.length > 0
          ? "Daily Salary Progression"
          : "Monthly Salary Overview"}
      </h2>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salaryChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={
                salaryData.dailySalaries &&
                Array.isArray(salaryData.dailySalaries) &&
                salaryData.dailySalaries.length > 0
                  ? "cumulativeSalary"
                  : "salaryAmount"
              }
              name={
                salaryData.dailySalaries &&
                Array.isArray(salaryData.dailySalaries) &&
                salaryData.dailySalaries.length > 0
                  ? "Cumulative Salary"
                  : "Salary Amount"
              }
              stroke="#4ADE80"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalaryChart;
