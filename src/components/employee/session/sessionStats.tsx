import React from "react";
import { StatsBarProps } from "@/types/employee";

const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const statItems = [
    {
      label: "Total Sessions",
      value: stats.total,
      icon: "📊",
      color: "text-blue-600",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: "⏳",
      color: "text-orange-600",
    },
    {
      label: "Today",
      value: stats.today,
      icon: "📅",
      color: "text-purple-600",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: "✅",
      color: "text-green-600",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 flex flex-wrap justify-around border-b border-gray-200">
      {statItems.map((stat, index) => (
        <div key={index} className="text-center mb-4 sm:mb-0">
          <div className="text-3xl mb-1">{stat.icon}</div>
          <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-sm uppercase text-gray-600 tracking-wide font-medium">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
