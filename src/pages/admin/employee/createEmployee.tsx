import React, { useEffect, useState } from "react";
import { useSubmissionModal } from "@/context/adda/commonModalContext";
import { Formik, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { EmployeeInterface } from "@/types/employee";
import { EmploymentType } from "@/types/employee/employee";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const validationSchema = Yup.object({
  department: Yup.string().required("Department is required"),
  employmentType: Yup.string()
    .oneOf(["full-time", "part-time", "intern", "contract", "freelance"])
    .required("Employment type is required"),
  salary: Yup.number()
    .typeError("Salary must be a number")
    .positive("Salary must be positive")
    .required("Salary is required"),
  active: Yup.boolean(),
  jobRole: Yup.string().required("Role is required"),
  user: Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    gender: Yup.string()
      .oneOf(["male", "female", "other"])
      .required("Gender is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .test("is-valid-phone", "Invalid phone number", (value) => {
        if (!value) return false;
        return /^\+?[1-9]\d{1,14}$/.test(value);
      }),
  }),
});

interface FormValues {
  department: string;
  employmentType: EmploymentType;
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

const CreateEmployee: React.FC = () => {
  const { getToken } = useAuth();
  const { showModal, hideModal } = useSubmissionModal();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [initialValues, setInitialValues] = useState<FormValues>({
    department: "",
    employmentType: "full-time",
    salary: "",
    active: true,
    jobRole: "",
    user: {
      name: "",
      email: "",
      role: "EMPLOYEE",
      gender: "male",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (isEdit) {
      const fetchEmployee = async () => {
        try {
          const token = await getToken();
          const response = await axios.get(
            `${import.meta.env.VITE_PROD_URL}/employee/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const emp = response.data.data.fullDetails;

          setInitialValues({
            department: emp.department || "",
            employmentType: emp.employmentType || "full-time",
            salary: emp.salary?.toString() || "",
            active: emp.active ?? true,
            jobRole: emp.jobRole || "",
            user: {
              name: emp.user?.name || emp.name || "",
              email: emp.user?.email || emp.email || "",
              role: "EMPLOYEE",
              gender: emp.user?.gender || "male",
              phoneNumber: emp.user?.phoneNumber
                ? `+${emp.user.phoneNumber}`
                : "",
            },
          });
        } catch (err) {
          toast.error("Failed to load employee data");
          navigate("/admin/employee-table");
        }
      };
      fetchEmployee();
    }
  }, [id, isEdit, getToken, navigate]);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    showModal({
      isSubmitting: true,
      currentStep: "saving",
      message: isEdit ? "Updating employee..." : "Creating employee...",
    });

    try {
      const token = await getToken();

      const payload: Partial<EmployeeInterface> = {
        department: values.department as EmployeeInterface["department"],
        employmentType: values.employmentType,
        salary: Number(values.salary),
        active: values.active,
        jobRole: values.jobRole,
        user: {
          name: values.user.name,
          email: values.user.email,
          role: "EMPLOYEE" as const,
          gender: values.user.gender as "male" | "female" | "other",
          phoneNumber: values.user.phoneNumber
            ? Number(values.user.phoneNumber.replace(/\D/g, "")) || null
            : null,
          dob: null,
        },
      };

      const url = isEdit
        ? `${import.meta.env.VITE_PROD_URL}/admin/update-employee/${id}`
        : `${import.meta.env.VITE_PROD_URL}/admin/create-employee`;

      const method = isEdit ? axios.put : axios.post;

      const response = await method(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      showModal({
        isSubmitting: false,
        currentStep: "success",
        message:
          response.data.message ||
          (isEdit ? "Employee updated!" : "Employee created!"),
      });

      toast.success(
        response.data.message ||
          (isEdit ? "Employee updated!" : "Employee created!")
      );

      setTimeout(() => {
        hideModal();
        if (isEdit) navigate("/admin/employee-table");
      }, 2000);
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (isEdit ? "Failed to update employee" : "Failed to create employee");

      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: errorMessage,
      });

      toast.error(errorMessage);
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
    { value: "psychologist", label: "Mental Health" },
  ];

  const employmentTypeOptions = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "intern", label: "Intern" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Employee" : "Create Employee"}
            </h2>
            <p className="text-gray-500 mt-2">
              {isEdit
                ? "Update employee details"
                : "Fill in the employee details below"}
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
              <form onSubmit={handleSubmit} className="space-y-8">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="IN"
                        placeholder="Enter phone number"
                        value={values.user.phoneNumber}
                        onChange={(value) =>
                          setFieldValue("user.phoneNumber", value || "")
                        }
                        className="phone-input"
                      />
                      <ErrorMessage
                        name="user.phoneNumber"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Select country code and enter number
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      >
                        {departmentOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
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
                        htmlFor="employmentType"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Employment Type *
                      </label>
                      <Field
                        as="select"
                        name="employmentType"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      >
                        {employmentTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="employmentType"
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
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                  >
                    {isSubmitting
                      ? isEdit
                        ? "Updating Employee..."
                        : "Creating Employee..."
                      : isEdit
                      ? "Update Employee"
                      : "Create Employee"}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>

      <style>{`
        .phone-input .PhoneInputInput {
          height: 48px;
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 16px;
          background: white;
        }
        .phone-input .PhoneInputInput:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .phone-input .PhoneInputCountry {
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default CreateEmployee;
