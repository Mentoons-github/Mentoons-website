import React, { useState, useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  taskInitialValues,
  taskValidationSchema,
} from "@/utils/formik/admin/taskAssign";
import { AppDispatch, RootState } from "@/redux/store";
import { assignTask, fetchTasks, NewTask } from "@/redux/admin/task/taskApi";
import { getEmployees } from "@/redux/admin/employee/api";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { X, CheckCircle } from "lucide-react";

interface TaskAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskAssignModal: React.FC<TaskAssignModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { showStatus } = useStatusModal();

  const reduxEmployeeState = useSelector((state: RootState) => state.employee);
  const employees = Array.isArray(reduxEmployeeState.employees)
    ? reduxEmployeeState.employees
    : [];
  const { loading: employeeLoading } = reduxEmployeeState;

  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        await dispatch(
          getEmployees({
            sortOrder: "asc",
            searchTerm: "",
            page: 1,
            limit: 100,
          })
        );
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        showStatus("error", "Failed to fetch employees. Please try again.");
      }
    };

    if (isOpen) {
      fetchEmployees();
    }
  }, [dispatch, isOpen, showStatus]);

  const uniqueDepartments = Array.from(
    new Set(employees.map((emp) => emp.department))
  ).sort();

  const filteredEmployees = selectedDepartment
    ? employees.filter((emp) => emp.department === selectedDepartment)
    : employees;

  const handleDepartmentChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const dept = e.target.value;
    setSelectedDepartment(dept);
    setFieldValue("assignedTo", "");
  };

  const handleSubmit = async (
    values: NewTask,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const token = await getToken();
      if (!token) {
        showStatus("error", "Authentication error. Please log in again.");
        setSubmitting(false);
        return;
      }

      await dispatch(assignTask({ taskData: values, token })).unwrap();
      await dispatch(fetchTasks({ token }));

      setShowSuccessModal(true);

      resetForm();
      setSelectedDepartment("");
      setSubmitting(false);

      setTimeout(() => {
        setShowSuccessModal(false);
    
        setTimeout(() => {
          onClose();
        }, 300);
      }, 3000); 
    } catch (err) {
      console.error("Failed to create task:", err);
      showStatus("error", "Failed to create task. Please try again.");
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[999] bg-black/75 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-400 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">
                Assign New Task
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-6">
            <Formik
              initialValues={taskInitialValues}
              validationSchema={taskValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched, setFieldValue }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      name="title"
                      id="title"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                        errors.title && touched.title
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter task title"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  {/* Assigned By (Read-only) */}
                  <div>
                    <label
                      htmlFor="assignedBy"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Assigned By
                    </label>
                    <input
                      type="text"
                      id="assignedBy"
                      value={
                        user?.fullName ||
                        `${user?.firstName || ""} ${
                          user?.lastName || ""
                        }`.trim() ||
                        user?.username ||
                        ""
                      }
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none ${
                        errors.description && touched.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Describe the task in detail"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  {/* Department Filter (Optional) */}
                  <div>
                    <label
                      htmlFor="department"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Filter by Department (Optional)
                    </label>
                    <select
                      id="department"
                      value={selectedDepartment}
                      onChange={(e) => handleDepartmentChange(e, setFieldValue)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      disabled={employeeLoading}
                    >
                      <option value="">All Departments</option>
                      {uniqueDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assign To */}
                  <div>
                    <label
                      htmlFor="assignedTo"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Assign To <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="assignedTo"
                      id="assignedTo"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                        errors.assignedTo && touched.assignedTo
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      disabled={
                        employeeLoading || filteredEmployees.length === 0
                      }
                    >
                      <option value="">Select an employee</option>
                      {filteredEmployees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name}
                        </option>
                      ))}
                    </Field>
                    {filteredEmployees.length === 0 && selectedDepartment && (
                      <p className="mt-1 text-xs text-gray-500">
                        No employees in this department
                      </p>
                    )}
                    <ErrorMessage
                      name="assignedTo"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  {/* Priority and Deadline Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Priority <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <Field
                            type="radio"
                            name="priority"
                            value="low"
                            className="w-4 h-4 text-orange-600 focus:ring-2 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Low
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <Field
                            type="radio"
                            name="priority"
                            value="medium"
                            className="w-4 h-4 text-orange-600 focus:ring-2 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Medium
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <Field
                            type="radio"
                            name="priority"
                            value="high"
                            className="w-4 h-4 text-orange-600 focus:ring-2 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            High
                          </span>
                        </label>
                      </div>
                      <ErrorMessage
                        name="priority"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    {/* Deadline */}
                    <div>
                      <label
                        htmlFor="deadline"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Deadline <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="datetime-local"
                        name="deadline"
                        id="deadline"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                          errors.deadline && touched.deadline
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <ErrorMessage
                        name="deadline"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-900 text-white rounded-lg font-medium hover:from-blue-400 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Assigning...
                        </span>
                      ) : (
                        "Assign Task"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Task Created Successfully!
            </h2>
            <p className="text-center text-gray-600 mb-6">
              The task has been assigned and added to the task list.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                onClose();
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskAssignModal;
