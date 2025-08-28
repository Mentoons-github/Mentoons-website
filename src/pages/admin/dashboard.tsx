import React, { useState, useEffect } from "react";
import { FaBox, FaBriefcase, FaFileAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "@/components/admin/dashboard/statsCard";
import Loader from "@/components/common/admin/loader";

interface DashboardDataResponse {
  data: {
    totalUsers: number;
    totalJobs: number;
    totalJobApplications: number;
    totalProducts: number;
    completedOrdersInMonthOrder: { month: string; sales: number }[];
  };
}

const DashboardAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardDataResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState<"area" | "line" | "bar">(
    "area"
  );

  const pieData = [
    { name: "Active Jobs", value: 45, color: "#4F46E5" },
    { name: "Pending", value: 25, color: "#06B6D4" },
    { name: "Completed", value: 20, color: "#10B981" },
    { name: "Cancelled", value: 10, color: "#EF4444" },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://mentoons-backend-zlx3.onrender.com/api/v1/dashboard/analytics",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result: DashboardDataResponse = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-red-600 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  const renderChart = () => {
    const chartData = data?.completedOrdersInMonthOrder || [];

    switch (selectedChart) {
      case "line":
        return (
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              opacity={0.6}
            />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "none",
                borderRadius: "1rem",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                backdropFilter: "blur(10px)",
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#4F46E5"
              strokeWidth={4}
              dot={{ fill: "#4F46E5", strokeWidth: 2, r: 6 }}
              activeDot={{
                r: 8,
                stroke: "#4F46E5",
                strokeWidth: 2,
                fill: "#fff",
              }}
            />
          </LineChart>
        );
      case "bar":
        return (
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              opacity={0.6}
            />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "none",
                borderRadius: "1rem",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                backdropFilter: "blur(10px)",
              }}
            />
            <Bar
              dataKey="sales"
              fill="url(#colorSales)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        );
      default:
        return (
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              opacity={0.6}
            />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "none",
                borderRadius: "1rem",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                backdropFilter: "blur(10px)",
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#4F46E5"
              fillOpacity={1}
              fill="url(#colorSales)"
              strokeWidth={3}
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-6xl font-black bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Dashboard Analytics
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Real-time insights and performance metrics
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 gap-8 mb-12 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={data?.totalUsers || 0}
            icon={FaUsers}
            onClick={() => navigate("/users")}
            trend="up"
            trendValue="+3.5%"
            color="blue"
            delay={0}
          />
          <StatCard
            title="Active Jobs"
            value={data?.totalJobs || 0}
            icon={FaBriefcase}
            onClick={() => navigate("/all-jobs")}
            trend="up"
            trendValue="+8.3%"
            color="emerald"
            delay={200}
          />
          <StatCard
            title="Applications"
            value={data?.totalJobApplications || 0}
            icon={FaFileAlt}
            onClick={() => navigate("/view-applications")}
            trend="up"
            trendValue="+15.7%"
            color="purple"
            delay={400}
          />
          <StatCard
            title="Products"
            value={data?.totalProducts || 0}
            icon={FaBox}
            onClick={() => navigate("/product-table")}
            trend="up"
            trendValue="+90%"
            color="orange"
            delay={600}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Sales Performance
                </h2>
                <p className="text-gray-600">Monthly revenue trends</p>
              </div>
              <div className="flex space-x-2">
                {(["area", "line", "bar"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChart(type)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      selectedChart === type
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white/70 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Job Distribution
            </h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "1rem",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-700 font-medium">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-gray-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
