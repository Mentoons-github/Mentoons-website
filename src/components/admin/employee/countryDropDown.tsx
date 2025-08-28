import React, { useRef } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { FormikProps } from "formik";
import { EmployeeFormData } from "@/types/employee";

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface CountryDropdownProps {
  formik: FormikProps<EmployeeFormData>;
  countries: Country[];
  countriesLoading: boolean;
  countriesError: string | null;
  countrySearchTerm: string;
  setCountrySearchTerm: (term: string) => void;
  isCountryDropdownOpen: boolean;
  setIsCountryDropdownOpen: (open: boolean) => void;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  formik,
  countries,
  countriesLoading,
  countriesError,
  countrySearchTerm,
  setCountrySearchTerm,
  isCountryDropdownOpen,
  setIsCountryDropdownOpen,
}) => {
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const handleCountrySelect = (country: string) => {
    formik.setFieldValue("place.country", country);
    setCountrySearchTerm("");
    setIsCountryDropdownOpen(false);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

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
    <div className="relative" ref={countryDropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Country*
      </label>
      <div
        className={`flex items-center w-full p-2 border rounded-md cursor-pointer ${
          getFieldError("place.country") && isFieldTouched("place.country")
            ? "border-red-500"
            : "border-gray-300"
        }`}
        onClick={() =>
          countriesError
            ? null
            : setIsCountryDropdownOpen(!isCountryDropdownOpen)
        }
      >
        <span className="flex-grow text-gray-900">
          {formik.values.place.country || "Select a country"}
        </span>
        <ChevronDown size={18} className="text-gray-600" />
      </div>
      {getFieldError("place.country") && isFieldTouched("place.country") && (
        <p className="text-red-500 text-sm mt-1">
          {getFieldError("place.country")}
        </p>
      )}
      {isCountryDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search countries..."
              value={countrySearchTerm}
              onChange={(e) => setCountrySearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {countriesLoading ? (
            <div className="p-2 text-center text-gray-500 flex items-center justify-center">
              <Loader2 size={18} className="animate-spin mr-2" />
              Loading countries...
            </div>
          ) : countriesError ? (
            <div className="p-2 text-center text-red-500">
              Failed to load countries
            </div>
          ) : filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <div
                key={index}
                className={`flex items-center p-2 hover:bg-blue-50 cursor-pointer ${
                  formik.values.place.country === country.name
                    ? "bg-blue-100"
                    : ""
                }`}
                onClick={() => handleCountrySelect(country.name)}
              >
                <img
                  src={country.flag}
                  alt={`${country.name} flag`}
                  className="w-5 h-5 mr-2 object-cover"
                />
                <span>{country.name}</span>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">
              No countries found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;
