import { useState, useEffect, useMemo } from "react";
import { FaBox, FaBriefcase, FaFileAlt, FaUsers } from "react-icons/fa";
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

// === Types & Interfaces ===

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  trend?: "up" | "down";
  trendValue?: string;
  color: "blue" | "emerald" | "purple" | "orange";
  delay: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface RevenueDataPoint {
  period: string;
  revenue: number;
}

interface RevenueSubCategory {
  daily: RevenueDataPoint[];
  weekly: RevenueDataPoint[];
  "3months": RevenueDataPoint[];
  "6months": RevenueDataPoint[];
  yearly: RevenueDataPoint[];
}

interface RevenueCategory {
  [subCategory: string]: RevenueSubCategory;
}

interface RevenueCategories {
  workshops: { value: string; label: string }[];
  services: { value: string; label: string }[];
  products: { value: string; label: string }[];
}

interface DashboardData {
  totalUsers: number;
  totalJobs: number;
  totalJobApplications: number;
  totalProducts: number;
  completedOrdersInMonthOrder: { month: string; sales: number }[];
}

// === Static Data ===

const pieData: PieData[] = [
  { name: "Active Jobs", value: 45, color: "#4F46E5" },
  { name: "Pending", value: 25, color: "#06B6D4" },
  { name: "Completed", value: 20, color: "#10B981" },
  { name: "Cancelled", value: 10, color: "#EF4444" },
];

const revenueCategories: RevenueCategories = {
  workshops: [
    { value: "instant-katha", label: "Instant Katha" },
    { value: "kala-kriti", label: "Kala Kriti" },
    { value: "career-corner", label: "Career Corner" },
  ],
  services: [
    { value: "personal-branding", label: "Personal Branding" },
    { value: "interview-preparation", label: "Interview Preparation" },
  ],
  products: [
    { value: "conversation-story-cards", label: "Conversation Story Cards" },
    {
      value: "conversation-starter-cards",
      label: "Conversation Starter Cards",
    },
    { value: "silent-stories", label: "Silent Stories" },
    { value: "story-reteller", label: "Story Reteller" },
    { value: "magnificent-nine", label: "Magnificent Nine" },
    { value: "mandala-art", label: "Mandala Art" },
    { value: "inventors-inventions", label: "Inventors and Inventions" },
  ],
};

const revenueData: Record<string, RevenueCategory> = {
  workshops: {
    "instant-katha": {
      daily: [
        { period: "Mon", revenue: 450 },
        { period: "Tue", revenue: 680 },
        { period: "Wed", revenue: 520 },
        { period: "Thu", revenue: 890 },
        { period: "Fri", revenue: 1200 },
        { period: "Sat", revenue: 950 },
        { period: "Sun", revenue: 780 },
      ],
      weekly: [
        { period: "Week 1", revenue: 3500 },
        { period: "Week 2", revenue: 4200 },
        { period: "Week 3", revenue: 3800 },
        { period: "Week 4", revenue: 5100 },
      ],
      "3months": [
        { period: "Month 1", revenue: 18000 },
        { period: "Month 2", revenue: 22000 },
        { period: "Month 3", revenue: 25000 },
      ],
      "6months": [
        { period: "Jan", revenue: 18000 },
        { period: "Feb", revenue: 22000 },
        { period: "Mar", revenue: 25000 },
        { period: "Apr", revenue: 28000 },
        { period: "May", revenue: 32000 },
        { period: "Jun", revenue: 35000 },
      ],
      yearly: [
        { period: "2023", revenue: 180000 },
        { period: "2024", revenue: 250000 },
      ],
    },
    "kala-kriti": {
      daily: [
        { period: "Mon", revenue: 350 },
        { period: "Tue", revenue: 480 },
        { period: "Wed", revenue: 420 },
        { period: "Thu", revenue: 690 },
        { period: "Fri", revenue: 900 },
        { period: "Sat", revenue: 750 },
        { period: "Sun", revenue: 580 },
      ],
      weekly: [
        { period: "Week 1", revenue: 2800 },
        { period: "Week 2", revenue: 3400 },
        { period: "Week 3", revenue: 3100 },
        { period: "Week 4", revenue: 4200 },
      ],
      "3months": [
        { period: "Month 1", revenue: 14000 },
        { period: "Month 2", revenue: 18000 },
        { period: "Month 3", revenue: 21000 },
      ],
      "6months": [
        { period: "Jan", revenue: 14000 },
        { period: "Feb", revenue: 18000 },
        { period: "Mar", revenue: 21000 },
        { period: "Apr", revenue: 24000 },
        { period: "May", revenue: 27000 },
        { period: "Jun", revenue: 30000 },
      ],
      yearly: [
        { period: "2023", revenue: 150000 },
        { period: "2024", revenue: 210000 },
      ],
    },
    "career-corner": {
      daily: [
        { period: "Mon", revenue: 550 },
        { period: "Tue", revenue: 780 },
        { period: "Wed", revenue: 620 },
        { period: "Thu", revenue: 990 },
        { period: "Fri", revenue: 1400 },
        { period: "Sat", revenue: 1150 },
        { period: "Sun", revenue: 880 },
      ],
      weekly: [
        { period: "Week 1", revenue: 4200 },
        { period: "Week 2", revenue: 5000 },
        { period: "Week 3", revenue: 4600 },
        { period: "Week 4", revenue: 6100 },
      ],
      "3months": [
        { period: "Month 1", revenue: 22000 },
        { period: "Month 2", revenue: 26000 },
        { period: "Month 3", revenue: 30000 },
      ],
      "6months": [
        { period: "Jan", revenue: 22000 },
        { period: "Feb", revenue: 26000 },
        { period: "Mar", revenue: 30000 },
        { period: "Apr", revenue: 34000 },
        { period: "May", revenue: 38000 },
        { period: "Jun", revenue: 42000 },
      ],
      yearly: [
        { period: "2023", revenue: 220000 },
        { period: "2024", revenue: 310000 },
      ],
    },
  },
  services: {
    "personal-branding": {
      daily: [
        { period: "Mon", revenue: 1200 },
        { period: "Tue", revenue: 1500 },
        { period: "Wed", revenue: 1350 },
        { period: "Thu", revenue: 1800 },
        { period: "Fri", revenue: 2200 },
        { period: "Sat", revenue: 1900 },
        { period: "Sun", revenue: 1600 },
      ],
      weekly: [
        { period: "Week 1", revenue: 8500 },
        { period: "Week 2", revenue: 9800 },
        { period: "Week 3", revenue: 9200 },
        { period: "Week 4", revenue: 11500 },
      ],
      "3months": [
        { period: "Month 1", revenue: 45000 },
        { period: "Month 2", revenue: 52000 },
        { period: "Month 3", revenue: 58000 },
      ],
      "6months": [
        { period: "Jan", revenue: 45000 },
        { period: "Feb", revenue: 52000 },
        { period: "Mar", revenue: 58000 },
        { period: "Apr", revenue: 64000 },
        { period: "May", revenue: 70000 },
        { period: "Jun", revenue: 76000 },
      ],
      yearly: [
        { period: "2023", revenue: 450000 },
        { period: "2024", revenue: 620000 },
      ],
    },
    "interview-preparation": {
      daily: [
        { period: "Mon", revenue: 800 },
        { period: "Tue", revenue: 1100 },
        { period: "Wed", revenue: 950 },
        { period: "Thu", revenue: 1400 },
        { period: "Fri", revenue: 1800 },
        { period: "Sat", revenue: 1500 },
        { period: "Sun", revenue: 1200 },
      ],
      weekly: [
        { period: "Week 1", revenue: 6200 },
        { period: "Week 2", revenue: 7400 },
        { period: "Week 3", revenue: 6900 },
        { period: "Week 4", revenue: 8600 },
      ],
      "3months": [
        { period: "Month 1", revenue: 32000 },
        { period: "Month 2", revenue: 38000 },
        { period: "Month 3", revenue: 44000 },
      ],
      "6months": [
        { period: "Jan", revenue: 32000 },
        { period: "Feb", revenue: 38000 },
        { period: "Mar", revenue: 44000 },
        { period: "Apr", revenue: 50000 },
        { period: "May", revenue: 56000 },
        { period: "Jun", revenue: 62000 },
      ],
      yearly: [
        { period: "2023", revenue: 350000 },
        { period: "2024", revenue: 480000 },
      ],
    },
  },
  products: {
    "conversation-story-cards": {
      daily: [
        { period: "Mon", revenue: 320 },
        { period: "Tue", revenue: 450 },
        { period: "Wed", revenue: 380 },
        { period: "Thu", revenue: 580 },
        { period: "Fri", revenue: 720 },
        { period: "Sat", revenue: 650 },
        { period: "Sun", revenue: 490 },
      ],
      weekly: [
        { period: "Week 1", revenue: 2800 },
        { period: "Week 2", revenue: 3400 },
        { period: "Week 3", revenue: 3100 },
        { period: "Week 4", revenue: 4100 },
      ],
      "3months": [
        { period: "Month 1", revenue: 15000 },
        { period: "Month 2", revenue: 18000 },
        { period: "Month 3", revenue: 21000 },
      ],
      "6months": [
        { period: "Jan", revenue: 15000 },
        { period: "Feb", revenue: 18000 },
        { period: "Mar", revenue: 21000 },
        { period: "Apr", revenue: 24000 },
        { period: "May", revenue: 27000 },
        { period: "Jun", revenue: 30000 },
      ],
      yearly: [
        { period: "2023", revenue: 160000 },
        { period: "2024", revenue: 220000 },
      ],
    },
    "conversation-starter-cards": {
      daily: [
        { period: "Mon", revenue: 280 },
        { period: "Tue", revenue: 390 },
        { period: "Wed", revenue: 330 },
        { period: "Thu", revenue: 520 },
        { period: "Fri", revenue: 650 },
        { period: "Sat", revenue: 580 },
        { period: "Sun", revenue: 440 },
      ],
      weekly: [
        { period: "Week 1", revenue: 2500 },
        { period: "Week 2", revenue: 3100 },
        { period: "Week 3", revenue: 2800 },
        { period: "Week 4", revenue: 3700 },
      ],
      "3months": [
        { period: "Month 1", revenue: 13000 },
        { period: "Month 2", revenue: 16000 },
        { period: "Month 3", revenue: 19000 },
      ],
      "6months": [
        { period: "Jan", revenue: 13000 },
        { period: "Feb", revenue: 16000 },
        { period: "Mar", revenue: 19000 },
        { period: "Apr", revenue: 22000 },
        { period: "May", revenue: 25000 },
        { period: "Jun", revenue: 28000 },
      ],
      yearly: [
        { period: "2023", revenue: 140000 },
        { period: "2024", revenue: 195000 },
      ],
    },
    "silent-stories": {
      daily: [
        { period: "Mon", revenue: 420 },
        { period: "Tue", revenue: 580 },
        { period: "Wed", revenue: 490 },
        { period: "Thu", revenue: 720 },
        { period: "Fri", revenue: 890 },
        { period: "Sat", revenue: 780 },
        { period: "Sun", revenue: 620 },
      ],
      weekly: [
        { period: "Week 1", revenue: 3500 },
        { period: "Week 2", revenue: 4200 },
        { period: "Week 3", revenue: 3900 },
        { period: "Week 4", revenue: 5100 },
      ],
      "3months": [
        { period: "Month 1", revenue: 19000 },
        { period: "Month 2", revenue: 23000 },
        { period: "Month 3", revenue: 27000 },
      ],
      "6months": [
        { period: "Jan", revenue: 19000 },
        { period: "Feb", revenue: 23000 },
        { period: "Mar", revenue: 27000 },
        { period: "Apr", revenue: 31000 },
        { period: "May", revenue: 35000 },
        { period: "Jun", revenue: 39000 },
      ],
      yearly: [
        { period: "2023", revenue: 190000 },
        { period: "2024", revenue: 270000 },
      ],
    },
    "story-reteller": {
      daily: [
        { period: "Mon", revenue: 380 },
        { period: "Tue", revenue: 520 },
        { period: "Wed", revenue: 440 },
        { period: "Thu", revenue: 660 },
        { period: "Fri", revenue: 820 },
        { period: "Sat", revenue: 720 },
        { period: "Sun", revenue: 570 },
      ],
      weekly: [
        { period: "Week 1", revenue: 3200 },
        { period: "Week 2", revenue: 3900 },
        { period: "Week 3", revenue: 3600 },
        { period: "Week 4", revenue: 4700 },
      ],
      "3months": [
        { period: "Month 1", revenue: 17000 },
        { period: "Month 2", revenue: 21000 },
        { period: "Month 3", revenue: 25000 },
      ],
      "6months": [
        { period: "Jan", revenue: 17000 },
        { period: "Feb", revenue: 21000 },
        { period: "Mar", revenue: 25000 },
        { period: "Apr", revenue: 29000 },
        { period: "May", revenue: 33000 },
        { period: "Jun", revenue: 37000 },
      ],
      yearly: [
        { period: "2023", revenue: 175000 },
        { period: "2024", revenue: 245000 },
      ],
    },
    "magnificent-nine": {
      daily: [
        { period: "Mon", revenue: 520 },
        { period: "Tue", revenue: 710 },
        { period: "Wed", revenue: 610 },
        { period: "Thu", revenue: 890 },
        { period: "Fri", revenue: 1100 },
        { period: "Sat", revenue: 970 },
        { period: "Sun", revenue: 760 },
      ],
      weekly: [
        { period: "Week 1", revenue: 4300 },
        { period: "Week 2", revenue: 5100 },
        { period: "Week 3", revenue: 4700 },
        { period: "Week 4", revenue: 6200 },
      ],
      "3months": [
        { period: "Month 1", revenue: 23000 },
        { period: "Month 2", revenue: 28000 },
        { period: "Month 3", revenue: 33000 },
      ],
      "6months": [
        { period: "Jan", revenue: 23000 },
        { period: "Feb", revenue: 28000 },
        { period: "Mar", revenue: 33000 },
        { period: "Apr", revenue: 38000 },
        { period: "May", revenue: 43000 },
        { period: "Jun", revenue: 48000 },
      ],
      yearly: [
        { period: "2023", revenue: 230000 },
        { period: "2024", revenue: 330000 },
      ],
    },
    "mandala-art": {
      daily: [
        { period: "Mon", revenue: 290 },
        { period: "Tue", revenue: 410 },
        { period: "Wed", revenue: 350 },
        { period: "Thu", revenue: 540 },
        { period: "Fri", revenue: 680 },
        { period: "Sat", revenue: 610 },
        { period: "Sun", revenue: 460 },
      ],
      weekly: [
        { period: "Week 1", revenue: 2600 },
        { period: "Week 2", revenue: 3200 },
        { period: "Week 3", revenue: 2900 },
        { period: "Week 4", revenue: 3900 },
      ],
      "3months": [
        { period: "Month 1", revenue: 14000 },
        { period: "Month 2", revenue: 17000 },
        { period: "Month 3", revenue: 20000 },
      ],
      "6months": [
        { period: "Jan", revenue: 14000 },
        { period: "Feb", revenue: 17000 },
        { period: "Mar", revenue: 20000 },
        { period: "Apr", revenue: 23000 },
        { period: "May", revenue: 26000 },
        { period: "Jun", revenue: 29000 },
      ],
      yearly: [
        { period: "2023", revenue: 145000 },
        { period: "2024", revenue: 205000 },
      ],
    },
    "inventors-inventions": {
      daily: [
        { period: "Mon", revenue: 360 },
        { period: "Tue", revenue: 490 },
        { period: "Wed", revenue: 420 },
        { period: "Thu", revenue: 620 },
        { period: "Fri", revenue: 780 },
        { period: "Sat", revenue: 690 },
        { period: "Sun", revenue: 540 },
      ],
      weekly: [
        { period: "Week 1", revenue: 3100 },
        { period: "Week 2", revenue: 3800 },
        { period: "Week 3", revenue: 3500 },
        { period: "Week 4", revenue: 4600 },
      ],
      "3months": [
        { period: "Month 1", revenue: 16000 },
        { period: "Month 2", revenue: 20000 },
        { period: "Month 3", revenue: 24000 },
      ],
      "6months": [
        { period: "Jan", revenue: 16000 },
        { period: "Feb", revenue: 20000 },
        { period: "Mar", revenue: 24000 },
        { period: "Apr", revenue: 28000 },
        { period: "May", revenue: 32000 },
        { period: "Jun", revenue: 36000 },
      ],
      yearly: [
        { period: "2023", revenue: 165000 },
        { period: "2024", revenue: 235000 },
      ],
    },
  },
};

// === Components ===

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  onClick,
  trend,
  trendValue,
  color,
  delay,
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <div
      onClick={onClick}
      className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}
        >
          <Icon className="text-white text-2xl" />
        </div>
        {trend && (
          <span className="text-emerald-600 font-semibold text-sm">
            {trendValue}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-4xl font-bold text-gray-800">
        {value.toLocaleString()}
      </p>
    </div>
  );
};

const Loader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

// === Main Component ===
const DashboardAnalytics: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState<"area" | "line" | "bar">(
    "area"
  );
  const [revenueCategory, setRevenueCategory] = useState<
    "workshops" | "services" | "products"
  >("workshops");
  const [revenueSubCategory, setRevenueSubCategory] =
    useState<string>("instant-katha");
  const [revenuePeriod, setRevenuePeriod] = useState<
    "daily" | "weekly" | "3months" | "6months" | "yearly"
  >("daily");

  // Reset subcategory when category changes
  useEffect(() => {
    const firstSubCategory = revenueCategories[revenueCategory][0].value;
    setRevenueSubCategory(firstSubCategory);
  }, [revenueCategory]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_PROD_URL}/dashboard/analytics`,
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

        const result = await response.json();
        setData(result.data as DashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute current revenue data
  const currentRevenueData = useMemo(() => {
    return (
      revenueData[revenueCategory]?.[revenueSubCategory]?.[revenuePeriod] || []
    );
  }, [revenueCategory, revenueSubCategory, revenuePeriod]);

  const totalRevenue = useMemo(() => {
    return currentRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  }, [currentRevenueData]);

  const averageRevenue = useMemo(() => {
    return currentRevenueData.length > 0
      ? Math.round(totalRevenue / currentRevenueData.length)
      : 0;
  }, [totalRevenue, currentRevenueData]);

  const peakRevenue = useMemo(() => {
    return currentRevenueData.length > 0
      ? Math.max(...currentRevenueData.map((d) => d.revenue))
      : 0;
  }, [currentRevenueData]);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-red-600 text-xl font-semibold">{error}</div>
      </div>
    );

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
            <defs>
              <linearGradient id="colorSalesBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.4} />
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
            <Bar
              dataKey="sales"
              fill="url(#colorSalesBar)"
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
            onClick={() => {}}
            trend="up"
            trendValue="+3.5%"
            color="blue"
            delay={0}
          />
          <StatCard
            title="Active Jobs"
            value={data?.totalJobs || 0}
            icon={FaBriefcase}
            onClick={() => {}}
            trend="up"
            trendValue="+8.3%"
            color="emerald"
            delay={200}
          />
          <StatCard
            title="Applications"
            value={data?.totalJobApplications || 0}
            icon={FaFileAlt}
            onClick={() => {}}
            trend="up"
            trendValue="+15.7%"
            color="purple"
            delay={400}
          />
          <StatCard
            title="Products"
            value={data?.totalProducts || 0}
            icon={FaBox}
            onClick={() => {}}
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

        {/* Revenue Analytics Section */}
        <div className="bg-white/70 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20 mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Revenue Analytics
            </h2>
            <p className="text-gray-600">
              Track revenue across different streams
            </p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={revenueCategory}
                onChange={(e) =>
                  setRevenueCategory(e.target.value as typeof revenueCategory)
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white font-medium text-gray-700"
              >
                <option value="workshops">Workshops</option>
                <option value="services">Services</option>
                <option value="products">Products</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {revenueCategory === "workshops" && "Workshop Type"}
                {revenueCategory === "services" && "Service Type"}
                {revenueCategory === "products" && "Product"}
              </label>
              <select
                value={revenueSubCategory}
                onChange={(e) => setRevenueSubCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white font-medium text-gray-700"
              >
                {revenueCategories[revenueCategory].map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time Period
              </label>
              <select
                value={revenuePeriod}
                onChange={(e) =>
                  setRevenuePeriod(e.target.value as typeof revenuePeriod)
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white font-medium text-gray-700"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
              <div className="text-sm font-semibold mb-1">Total Revenue</div>
              <div className="text-3xl font-bold">
                ₹{totalRevenue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={currentRevenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  opacity={0.6}
                />
                <XAxis
                  dataKey="period"
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fill: "#6B7280" }}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fill: "#6B7280" }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "1rem",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    backdropFilter: "blur(10px)",
                  }}
                  formatter={(value: number) => [`₹${value}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-700 font-semibold">
                  Average Revenue
                </span>
                <span className="text-2xl">Chart</span>
              </div>
              <div className="text-3xl font-bold text-blue-900">
                ₹{averageRevenue.toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-700 font-semibold">
                  Peak Revenue
                </span>
                <span className="text-2xl">Rocket</span>
              </div>
              <div className="text-3xl font-bold text-purple-900">
                ₹{peakRevenue.toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-700 font-semibold">
                  Growth Rate
                </span>
                <span className="text-2xl">Chart Up</span>
              </div>
              <div className="text-3xl font-bold text-orange-900">
                +{Math.round(Math.random() * 20 + 10)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
