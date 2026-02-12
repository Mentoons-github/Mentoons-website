import { AttendanceStats } from "@/types/employee";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Sun,
  TrendingUp,
  Activity,
  Target,
} from "lucide-react";

interface StatsCardsProps {
  overallStats: AttendanceStats;
}

const StatsCards = ({ overallStats }: StatsCardsProps) => {
  const calculatePercentage = (value: number) => {
    if (overallStats.totalDays === 0) return 0;
    return Math.round((value / overallStats.totalDays) * 100);
  };

  const stats = [
    {
      title: "Total Days",
      value: overallStats.totalDays,
      percentage: 100,
      icon: Calendar,
      gradient: "from-blue-500 to-indigo-600",
      bg: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
      textColor: "text-blue-700",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      title: "Present Days",
      value: overallStats.presentDays,
      percentage: overallStats.presentPercentage,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-600",
      bg: "from-green-50 to-emerald-50",
      border: "border-green-200",
      textColor: "text-green-700",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
      title: "Absent Days",
      value: overallStats.absentDays,
      percentage: calculatePercentage(overallStats.absentDays),
      icon: XCircle,
      gradient: "from-red-500 to-rose-600",
      bg: "from-red-50 to-rose-50",
      border: "border-red-200",
      textColor: "text-red-700",
      iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
    },
    {
      title: "Half Days",
      value: overallStats.halfDays,
      percentage: calculatePercentage(overallStats.halfDays),
      icon: Clock,
      gradient: "from-yellow-500 to-amber-600",
      bg: "from-yellow-50 to-amber-50",
      border: "border-yellow-200",
      textColor: "text-yellow-700",
      iconBg: "bg-gradient-to-br from-yellow-500 to-amber-600",
    },
    {
      title: "On Leave",
      value: overallStats.onLeaveDays,
      percentage: calculatePercentage(overallStats.onLeaveDays),
      icon: Sun,
      gradient: "from-purple-500 to-violet-600",
      bg: "from-purple-50 to-violet-50",
      border: "border-purple-200",
      textColor: "text-purple-700",
      iconBg: "bg-gradient-to-br from-purple-500 to-violet-600",
    },
  ];

  const additionalStats = [
    {
      title: "Late Days",
      value: overallStats.lateDays,
      icon: Activity,
      gradient: "from-orange-500 to-red-600",
      bg: "from-orange-50 to-red-50",
      border: "border-orange-200",
      textColor: "text-orange-700",
      iconBg: "bg-gradient-to-br from-orange-500 to-red-600",
      description: "Days marked late",
    },
    {
      title: "Avg Work Hours",
      value: Number(overallStats.averageWorkHours.toFixed(1)),
      icon: Target,
      gradient: "from-cyan-500 to-blue-600",
      bg: "from-cyan-50 to-blue-50",
      border: "border-cyan-200",
      textColor: "text-cyan-700",
      iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600",
      description: "Hours per day",
      suffix: "hrs",
    },
    {
      title: "Attendance Rate",
      value: overallStats.presentPercentage,
      icon: TrendingUp,
      gradient: "from-indigo-500 to-purple-600",
      bg: "from-indigo-50 to-purple-50",
      border: "border-indigo-200",
      textColor: "text-indigo-700",
      iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
      description: "Overall performance",
      suffix: "%",
    },
  ];

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Detailed Statistics
          </h2>
          <p className="text-sm text-gray-600">
            Comprehensive breakdown of your attendance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`group relative bg-gradient-to-br ${stat.bg} p-5 rounded-2xl border-2 ${stat.border} hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className={`px-3 py-1 bg-white/80 backdrop-blur-sm rounded-lg ${stat.textColor} text-xs font-bold`}
                  >
                    {stat.percentage}%
                  </div>
                </div>

                <h3 className="text-xs font-semibold text-gray-600 mb-2">
                  {stat.title}
                </h3>

                <div className="flex items-end justify-between">
                  <p className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>

                <div className="mt-3 h-2 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000`}
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {additionalStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`group relative bg-gradient-to-br ${stat.bg} p-6 rounded-2xl border-2 ${stat.border} hover:shadow-2xl transition-all duration-300 overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">
                      {stat.title}
                    </h3>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <p className={`text-4xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  {stat.suffix && (
                    <p
                      className={`text-lg font-semibold ${stat.textColor} mb-1`}
                    >
                      {stat.suffix}
                    </p>
                  )}
                </div>

                {stat.title === "Attendance Rate" && (
                  <div className="mt-3">
                    {stat.value >= 90 ? (
                      <div className="flex items-center gap-2 text-xs text-green-700 bg-green-100 px-3 py-1.5 rounded-lg font-semibold">
                        <TrendingUp className="w-3 h-3" />
                        Excellent Performance!
                      </div>
                    ) : stat.value >= 75 ? (
                      <div className="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-100 px-3 py-1.5 rounded-lg font-semibold">
                        <Activity className="w-3 h-3" />
                        Good Progress
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-red-700 bg-red-100 px-3 py-1.5 rounded-lg font-semibold">
                        <Activity className="w-3 h-3" />
                        Needs Improvement
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-800 rounded-2xl p-6 text-white shadow-xl mt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Performance Summary</h3>
              <p className="text-blue-100 text-sm">
                Your overall attendance tracking overview
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-blue-100 text-xs mb-1">Working Days</p>
              <p className="text-2xl font-bold">{overallStats.totalDays}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-blue-100 text-xs mb-1">Success Rate</p>
              <p className="text-2xl font-bold">
                {overallStats.presentPercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
