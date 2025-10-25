import React from "react";
import { useSubmissionModal } from "@/context/adda/commonModalContext";
import { Formik, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { EmployeeInterface } from "@/types/employee";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

const validationSchema = Yup.object({
  department: Yup.string().required("Department is required"),
  salary: Yup.number()
    .typeError("Salary must be a number")
    .positive("Salary must be positive")
    .required("Salary is required"),
  active: Yup.boolean(),
  jobRole: Yup.string().required("Role is required"),
  user: Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string().required("Role is required"),
    gender: Yup.string()
      .oneOf(["male", "female", "other"])
      .required("Gender is required"),
    phoneNumber: Yup.string()
      .matches(
        /^\+?[1-9]\d{1,14}$/,
        "Invalid phone number format (use E.164 format, e.g., +1234567890)"
      )
      .required("Phone number is required"),
  }),
});

interface FormValues {
  department: string;
  salary: string;
  active: boolean;
  jobRole: string;
  user: {
    name: string;
    email: string;
    role: string;
    gender: string;
    phoneNumber: string;
  };
}

const initialValues: FormValues = {
  department: "developer",
  salary: "",
  active: false,
  jobRole: "",
  user: {
    name: "",
    email: "",
    role: "EMPLOYEE",
    gender: "male",
    phoneNumber: "",
  },
};

const CreateEmployee: React.FC = () => {
  const { getToken } = useAuth();
  const { showModal, hideModal } = useSubmissionModal();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    console.log("submitting employee");

    showModal({
      isSubmitting: true,
      currentStep: "saving",
      message: "Creating employee...",
    });

    try {
      const payload: EmployeeInterface = {
        department: values.department as any,
        salary: values.salary ? Number(values.salary) : 0,
        active: values.active,
        jobRole: values.jobRole,
        user: {
          ...values.user,
          phoneNumber: values.user.phoneNumber || null,
        } as EmployeeInterface["user"],
      };

      const token = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/admin/create-employee`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showModal({
        isSubmitting: false,
        currentStep: "success",
        message: response.data.message || "Employee created successfully!",
      });

      toast.success(response.data.message || "Employee created successfully!");

      setTimeout(() => {
        hideModal();
      }, 3000);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; message?: string } };
      };

      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: err?.response?.data?.error || "Failed to Create employee",
        error: err?.response?.data?.message || "An unexpected error occurred",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const departmentOptions = [
    { value: "", label: "Select Your Department" },
    { value: "developer", label: "Software Development" },
    { value: "illustrator", label: "Illustration & Art" },
    { value: "designer", label: "Design & Creativity" },
    { value: "hr", label: "Human Resources (HR)" },
    { value: "marketing", label: "Marketing & Branding" },
    { value: "finance", label: "Finance & Accounts" },
    { value: "sales", label: "Sales & Business Development" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Create Employee
            </h2>
            <p className="text-gray-500 mt-2">
              Fill in the employee details below
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleSubmit }) => (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="user.name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <Field
                        name="user.name"
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                      <ErrorMessage
                        name="user.name"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="user.email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <Field
                        name="user.email"
                        type="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="john.doe@company.com"
                      />
                      <ErrorMessage
                        name="user.email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="user.phoneNumber"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number *
                      </label>
                      <Field
                        name="user.phoneNumber"
                        type="tel"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="+911234567890"
                      />
                      <ErrorMessage
                        name="user.phoneNumber"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Include country code (e.g., +91 for India)
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="user.gender"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Gender *
                      </label>
                      <Field
                        as="select"
                        name="user.gender"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Field>
                      <ErrorMessage
                        name="user.gender"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="jobRole"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Job Role *
                      </label>
                      <Field
                        name="jobRole"
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Senior Developer"
                      />
                      <ErrorMessage
                        name="jobRole"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Employment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="department"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Department *
                      </label>
                      <Field
                        as="select"
                        name="department"
                        className="w-full px-4 py-3 rounded-lg border border-<gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      >
                        {departmentOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="department"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="salary"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Annual Salary *
                      </label>
                      <Field
                        name="salary"
                        type="number"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="50000"
                      />
                      <ErrorMessage
                        name="salary"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <Field
                        name="active"
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Active Employee
                      </span>
                    </label>
                    <ErrorMessage
                      name="active"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                  >
                    {isSubmitting ? "Creating Employee..." : "Create Employee"}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;
