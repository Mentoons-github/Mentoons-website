import React from "react";
import { Save, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormikProps } from "formik";
import { EmployeeFormData } from "@/types/employee";

interface FormActionsProps {
  formik: FormikProps<EmployeeFormData>;
  isSubmitting: boolean;
  isEditMode: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  formik,
  isSubmitting,
  isEditMode,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
      <button
        type="button"
        onClick={() => navigate("/employee-table")}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
      >
        <X size={18} className="mr-1" />
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || !formik.isValid}
        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${
          isSubmitting || !formik.isValid ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="mr-2 animate-spin" />
            {isEditMode ? "Updating..." : "Creating..."}
          </>
        ) : (
          <>
            <Save size={18} className="mr-1" />
            {isEditMode ? "Update Employee" : "Create Employee"}
          </>
        )}
      </button>
    </div>
  );
};

export default FormActions;
