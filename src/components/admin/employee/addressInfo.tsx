import React from "react";
import { MapPin } from "lucide-react";
import { FormikProps } from "formik";
import { EmployeeFormData } from "@/types/employee";
import CountryDropdown from "./countryDropDown";

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface AddressInformationProps {
  formik: FormikProps<EmployeeFormData>;
  countries: Country[];
  countriesLoading: boolean;
  countriesError: string | null;
  countrySearchTerm: string;
  setCountrySearchTerm: (term: string) => void;
  isCountryDropdownOpen: boolean;
  setIsCountryDropdownOpen: (open: boolean) => void;
}

const AddressInformation: React.FC<AddressInformationProps> = ({
  formik,
  countries,
  countriesLoading,
  countriesError,
  countrySearchTerm,
  setCountrySearchTerm,
  isCountryDropdownOpen,
  setIsCountryDropdownOpen,
}) => {
  const getFieldError = (fieldPath: string): string | undefined => {
    const path = fieldPath.split(".");
    let error: any = formik.errors;
    let touched: any = formik.touched;
    for (const segment of path) {
      if (!error || !touched) return undefined;
      error = error[segment];
      touched = touched[segment];
    }
    return touched && error ? error : undefined;
  };

  const isFieldTouched = (fieldPath: string): boolean => {
    const path = fieldPath.split(".");
    let touched: any = formik.touched;
    for (const segment of path) {
      if (!touched) return false;
      touched = touched[segment];
    }
    return !!touched;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
        <MapPin size={16} className="inline mr-2" />
        Address Information
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            House/Building Name
          </label>
          <input
            type="text"
            name="place.houseName"
            value={formik.values.place.houseName}
            onChange={formik.handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street
          </label>
          <input
            type="text"
            name="place.street"
            value={formik.values.place.street}
            onChange={formik.handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City*
          </label>
          <input
            type="text"
            name="place.city"
            value={formik.values.place.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded-md ${
              getFieldError("place.city") && isFieldTouched("place.city")
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {getFieldError("place.city") && isFieldTouched("place.city") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("place.city")}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District
          </label>
          <input
            type="text"
            name="place.district"
            value={formik.values.place.district}
            onChange={formik.handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State*
          </label>
          <input
            type="text"
            name="place.state"
            value={formik.values.place.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded-md ${
              getFieldError("place.state") && isFieldTouched("place.state")
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {getFieldError("place.state") && isFieldTouched("place.state") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("place.state")}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode*
          </label>
          <input
            type="text"
            name="place.pincode"
            value={formik.values.place.pincode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded-md ${
              getFieldError("place.pincode") && isFieldTouched("place.pincode")
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {getFieldError("place.pincode") &&
            isFieldTouched("place.pincode") && (
              <p className="text-red-500 text-sm mt-1">
                {getFieldError("place.pincode")}
              </p>
            )}
        </div>
        <CountryDropdown
          formik={formik}
          countries={countries}
          countriesLoading={countriesLoading}
          countriesError={countriesError}
          countrySearchTerm={countrySearchTerm}
          setCountrySearchTerm={setCountrySearchTerm}
          isCountryDropdownOpen={isCountryDropdownOpen}
          setIsCountryDropdownOpen={setIsCountryDropdownOpen}
        />
      </div>
    </div>
  );
};

export default AddressInformation;
