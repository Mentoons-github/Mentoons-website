import React from "react";
import { Briefcase, Calendar } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { FormikProps } from "formik";
import { EmployeeFormData } from "@/types/employee";

const roleOptions = [
  "psychologist",
  "marketing",
  "developer",
  "illustrator",
  "animator",
  "video editor",
];

interface EmploymentDetailsProps {
  formik: FormikProps<EmployeeFormData>;
}

const EmploymentDetails: React.FC<EmploymentDetailsProps> = ({ formik }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
        Employment Details
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Briefcase size={16} className="inline mr-2" />
            Department*
          </label>
          <select
            name="department"
            value={formik.values.department}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded-md ${
              formik.errors.department && formik.touched.department
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            <option value="">Select Department</option>
            {roleOptions.map((role, idx) => (
              <option key={idx} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
          {formik.errors.department && formik.touched.department && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.department}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaRupeeSign size={16} className="inline mr-2" />
            Salary*
          </label>
          <input
            type="number"
            name="salary"
            value={formik.values.salary}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded-md ${
              formik.errors.salary && formik.touched.salary
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.errors.salary && formik.touched.salary && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.salary}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar size={16} className="inline mr-2" />
            Join Date
          </label>
          <input
            type="date"
            name="joinDate"
            value={formik.values.joinDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formik.values.isActive}
            onChange={formik.handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Active Employee
          </label>
        </div>
      </div>
    </div>
  );
};

export default EmploymentDetails;
