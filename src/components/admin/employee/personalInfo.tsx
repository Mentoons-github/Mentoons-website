import React from "react";
import { User, Mail, Phone } from "lucide-react";
import { FormikProps } from "formik";
import { EmployeeFormData } from "@/types/employee";

interface PersonalInformationProps {
  formik: FormikProps<EmployeeFormData>;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({
  formik,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
        Personal Information
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User size={16} className="inline mr-2" />
            Full Name*
          </label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded-md ${
              formik.errors.name && formik.touched.name
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.errors.name && formik.touched.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail size={16} className="inline mr-2" />
            Email Address*
          </label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded-md ${
              formik.errors.email && formik.touched.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.errors.email && formik.touched.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone size={16} className="inline mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
