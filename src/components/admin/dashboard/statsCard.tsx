import { useEffect, useState } from "react";
import { FaChartLine, FaEye } from "react-icons/fa";
import { MdTrendingDown, MdTrendingUp } from "react-icons/md";

const StatCard = ({
  title,
  value,
  icon: Icon,
  onClick,
  trend,
  trendValue,
  color,
  delay = 0,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  onClick: () => void;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color: string;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <MdTrendingUp className="text-emerald-500" />;
      case "down":
        return <MdTrendingDown className="text-red-500" />;
      default:
        return <FaChartLine className="text-blue-500" />;
    }
  };

  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-indigo-600",
      bg: "from-blue-50 to-indigo-50",
      shadow: "shadow-blue-200/50 hover:shadow-blue-300/60",
      glow: "group-hover:shadow-blue-400/30",
    },
    emerald: {
      gradient: "from-emerald-500 to-teal-600",
      bg: "from-emerald-50 to-teal-50",
      shadow: "shadow-emerald-200/50 hover:shadow-emerald-300/60",
      glow: "group-hover:shadow-emerald-400/30",
    },
    purple: {
      gradient: "from-purple-500 to-violet-600",
      bg: "from-purple-50 to-violet-50",
      shadow: "shadow-purple-200/50 hover:shadow-purple-300/60",
      glow: "group-hover:shadow-purple-400/30",
    },
    orange: {
      gradient: "from-orange-500 to-red-600",
      bg: "from-orange-50 to-red-50",
      shadow: "shadow-orange-200/50 hover:shadow-orange-300/60",
      glow: "group-hover:shadow-orange-400/30",
    },
  };

  const colorClass = colorClasses[color as keyof typeof colorClasses];

  return (
    <div
      className={`group relative bg-gradient-to-br ${
        colorClass.bg
      } backdrop-blur-sm rounded-3xl shadow-lg ${
        colorClass.shadow
      } p-8 transition-all duration-500 hover:shadow-2xl hover:scale-105 cursor-pointer border border-white/20 overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      onClick={onClick}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Background decoration */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-xl"></div>
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-white/5 to-white/10 rounded-full blur-lg"></div>

      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colorClass.glow} blur-xl`}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div
            className={`bg-gradient-to-r ${colorClass.gradient} rounded-2xl p-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="text-white text-3xl" />
          </div>
          <div className="text-right">
            <p className="text-5xl font-black text-gray-800 mb-1">
              {animatedValue.toLocaleString()}
            </p>
            {trend && trendValue && (
              <div className="flex items-center justify-end space-x-2">
                {getTrendIcon()}
                <span
                  className={`text-sm font-semibold ${
                    trend === "up"
                      ? "text-emerald-600"
                      : trend === "down"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-700">{title}</h3>
          <FaEye className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
    </div>
  );
};

export default StatCard;
