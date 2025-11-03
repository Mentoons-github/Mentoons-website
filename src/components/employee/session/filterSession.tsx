import React from "react";
import { FiltersProps } from "@/types/employee";

const Filters: React.FC<FiltersProps> = ({
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  searchFilter,
  setSearchFilter,
  activeTab,
}) => {
  return (
    <div className="bg-white p-6 flex flex-wrap gap-4 border-b border-gray-200 shadow-sm">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📋 Status Filter
        </label>
        <select
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setStatusFilter(e.target.value)
          }
          className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        >
          <option value="">All Statuses</option>
          {activeTab === "not-completed" ? (
            <>
              <option value="booked">Booked</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="aborted">Aborted</option>
            </>
          ) : (
            <option value="completed">Completed</option>
          )}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📅 Date Filter
        </label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDateFilter(e.target.value)
          }
          className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🔍 Search Client
        </label>
        <input
          type="text"
          value={searchFilter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchFilter(e.target.value)
          }
          placeholder="Search by name or phone..."
          className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>
    </div>
  );
};

export default Filters;
