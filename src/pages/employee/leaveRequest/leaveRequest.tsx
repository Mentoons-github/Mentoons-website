import { Form, Formik, Field, ErrorMessage } from "formik";
import { useState } from "react";
import getLeaveFormConfig from "@/utils/formik/leaveForm";
import { FormikHelpers } from "formik";

interface LeaveValues {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface LeaveData {
  taken: number;
  available: number | string;
}

interface LeaveStatsData {
  [key: string]: LeaveData;
}

const EmployeeLeaveRequest = () => {
  const { initialVlues, validationSchema } = getLeaveFormConfig();
  const [leaveStats] = useState<LeaveStatsData>({
    informed: { taken: 5, available: 7 },
    sick: { taken: 2, available: 8 },
    unInformed: { taken: 12, available: 8 },
    unpaid: { taken: 0, available: "Unlimited" },
  });

  const leaveTypes = [
    { value: "informed", label: "informed Leave" },
    { value: "sick", label: "Sick Leave" },
    { value: "unInformed", label: "unInformed Leave" },
    { value: "unpaid", label: "Unpaid Leave" },
  ];

  const handleSubmit = (
    values: LeaveValues,
    { setSubmitting, resetForm }: FormikHelpers<LeaveValues>
  ) => {
    console.log("Form values:", values);

    setTimeout(() => {
      alert("Leave request submitted successfully!");
      resetForm();
      setSubmitting(false);
    }, 1000);
  };

  const today = new Date().toISOString().split("T")[0];

  const calculateDaysBetween = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-start mb-8">
          <h1 className="text-3xl font-bold text-black">Leave Portal</h1>
          <p className="text-gray-600 mt-2">Manage your time off with ease</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Available Leave
              </h2>

              <div className="space-y-4">
                {Object.entries(leaveStats).map(
                  ([type, { taken, available }]) => (
                    <div key={type} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-700 font-medium capitalize group-hover:text-indigo-600 transition-colors">
                          {type} Leave
                        </span>
                        <span className="text-sm font-bold text-indigo-600">
                          {available === "Unlimited" ? "∞" : available}
                        </span>
                      </div>

                      {available !== "Unlimited" && (
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{
                              width: `${
                                100 -
                                (typeof available === "number"
                                  ? (available / (available + taken)) * 100
                                  : 0)
                              }%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 max-h-80 overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Recent Requests
              </h2>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white border border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">Sick Leave</h3>
                      <p className="text-sm text-gray-500">
                        Apr 15 - Apr 16, 2025
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-l-4 border-green-500 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        informed Leave
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mar 10 - Mar 12, 2025
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Approved
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-l-4 border-red-500 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        unInformed Leave
                      </h3>
                      <p className="text-sm text-gray-500">
                        Feb 22 - Feb 25, 2025
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Rejected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Request Time Off
              </h2>

              <Formik
                initialValues={initialVlues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, errors, touched }) => (
                  <Form className="space-y-5">
                    <div>
                      <label
                        htmlFor="leaveType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Leave Type
                      </label>
                      <Field
                        as="select"
                        id="leaveType"
                        name="leaveType"
                        className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.leaveType && touched.leaveType
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                      >
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="leaveType"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          From
                        </label>
                        <Field
                          type="date"
                          id="startDate"
                          name="startDate"
                          min={today}
                          className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.startDate && touched.startDate
                              ? "border-red-400"
                              : "border-gray-200"
                          }`}
                        />
                        <ErrorMessage
                          name="startDate"
                          component="div"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          To
                        </label>
                        <Field
                          type="date"
                          id="endDate"
                          name="endDate"
                          min={values.startDate || today}
                          className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.endDate && touched.endDate
                              ? "border-red-400"
                              : "border-gray-200"
                          }`}
                        />
                        <ErrorMessage
                          name="endDate"
                          component="div"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="reason"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Reason for Leave
                      </label>
                      <Field
                        as="textarea"
                        id="reason"
                        name="reason"
                        rows="4"
                        className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.reason && touched.reason
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                        placeholder="Please explain the reason for your leave request..."
                      />
                      <ErrorMessage
                        name="reason"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
                    </div>

                    {values.startDate && values.endDate && (
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-sm text-indigo-700">
                          <span className="font-medium">Duration: </span>
                          {(() => {
                            const diffDays = calculateDaysBetween(
                              values.startDate,
                              values.endDate
                            );
                            return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
                          })()}
                        </p>
                      </div>
                    )}

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          "Submit Leave Request"
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveRequest;
