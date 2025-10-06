import React, { useState } from "react";
import { Formik, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Upload, User } from "lucide-react";
import { EmployeeInterface } from "@/types/employee";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { AppDispatch } from "@/redux/store";
import { uploadFile } from "@/redux/fileUploadSlice";
import { useDispatch } from "react-redux";

const validationSchema = Yup.object({
  department: Yup.string().required("Department is required"),
  salary: Yup.number()
    .positive("Salary must be positive")
    .required("Salary is required"),
  active: Yup.boolean(),
  user: Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string().required("Role is required"),
    picture: Yup.string()
      .url("Invalid URL")
      .required("Picture URL is required"),
    gender: Yup.string()
      .oneOf(["male", "female", "other"])
      .required("Gender is required"),
  }),
});

const initialValues: EmployeeInterface = {
  department: "",
  salary: 0,
  active: false,
  user: {
    name: "",
    email: "",
    role: "",
    picture: "",
    gender: "male",
  },
};

const CreateEmployee: React.FC = () => {
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [previewImage, setPreviewImage] = useState<string>("");

  const handleSubmit = async (
    values: EmployeeInterface,
    { setSubmitting }: FormikHelpers<EmployeeInterface>
  ) => {
    try {
      const token = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/admin/create-employee`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      toast.success("Employee created successfully!");
    } catch (error: any) {
      console.error("Error creating employee:", error);
      toast.error(error?.response?.data?.error || "Employee creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewImage(imageUrl);
      };
      reader.readAsDataURL(selectedFile);

      try {
        const resultAction = await dispatch(
          uploadFile({ file: selectedFile, getToken })
        );

        if (uploadFile.fulfilled.match(resultAction)) {
          const uploadedUrl = resultAction.payload.data.fileDetails?.url;
          if (uploadedUrl) {
            setFieldValue("user.picture", uploadedUrl);
            toast.success("Image uploaded successfully!");
          }
        } else {
          toast.error("Failed to upload image");
          setPreviewImage("");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
        setPreviewImage("");
      }
    }
  };

  const departmentOptions = [
    { value: "", label: "Select Department" },
    { value: "developer", label: "Developer" },
    { value: "illustrator", label: "Illustrator" },
    { value: "designer", label: "Designer" },
    { value: "hr", label: "HR" },
    { value: "marketing", label: "Marketing" },
    { value: "finance", label: "Finance" },
    { value: "sales", label: "Sales" },
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
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values, handleSubmit }) => (
              <div className="space-y-8">
                {/* Profile Picture Upload */}
                <div className="flex justify-center">
                  <div className="relative">
                    <input
                      type="file"
                      id="picture-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setFieldValue)}
                    />
                    <label
                      htmlFor="picture-upload"
                      className="cursor-pointer block"
                    >
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg hover:shadow-xl transition-shadow">
                        {previewImage || values.user.picture ? (
                          <img
                            src={previewImage || values.user.picture}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <User size={40} className="mb-1" />
                            <Upload size={20} />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                        <Upload size={20} className="text-white" />
                      </div>
                    </label>
                  </div>
                </div>

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
                        htmlFor="user.role"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Job Role *
                      </label>
                      <Field
                        name="user.role"
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Senior Developer"
                      />
                      <ErrorMessage
                        name="user.role"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                  >
                    {isSubmitting ? "Creating Employee..." : "Create Employee"}
                  </button>
                </div>
              </div>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;
