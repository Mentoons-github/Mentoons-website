import { Phone, Calendar, User } from "lucide-react";
import { EmployeeInterface } from "@/types/employee";

interface EmployeeOverviewTabProps {
  employee: EmployeeInterface;
}

const EmployeeOverviewTab = ({ employee }: EmployeeOverviewTabProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Personal Information
      </h3>
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <Phone className="text-blue-600 mt-1" size={22} />
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">
              Phone Number
            </label>
            <p className="text-gray-900 font-medium">
              {employee.user.phoneNumber || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <Calendar className="text-blue-600 mt-1" size={22} />
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">
              Date of Birth
            </label>
            <p className="text-gray-900 font-medium">
              {employee.user.dob
                ? new Date(employee.user.dob).toLocaleDateString()
                : "Please update your Date of Birth"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <User className="text-blue-600 mt-1" size={22} />
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">
              Job Role
            </label>
            <p className="text-gray-900 font-medium">{employee.jobRole}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <User className="text-blue-600 mt-1" size={22} />
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">
              Role
            </label>
            <p className="text-gray-900 font-medium">{employee.user.role}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Work Details</h3>
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <label className="text-sm font-semibold text-blue-900 block mb-2">
            Department
          </label>
          <p className="text-lg text-blue-700 font-bold capitalize">
            {employee.department || "N/A"}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <label className="text-sm font-semibold text-green-900 block mb-2">
            Annual Salary
          </label>
          <p className="text-lg text-green-700 font-bold">
            ₹{employee.salary.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-100">
          <label className="text-sm font-semibold text-yellow-900 block mb-2">
            Status
          </label>
          <p className="text-lg text-yellow-700 font-bold">
            {employee.active ? "Active" : "Inactive"}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default EmployeeOverviewTab;
