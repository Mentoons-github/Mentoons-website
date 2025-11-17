import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CompleteSessionModalProps } from "@/types/employee";

const validationSchema = Yup.object({
  symptoms: Yup.string().trim().required("Symptoms are required"),
  remedies: Yup.string().trim().required("Remedies are required"),
});

interface ExtendedCompleteSessionModalProps extends CompleteSessionModalProps {
  message: { type: "success" | "error" | null; message: string };
}

const CompleteSessionModal: React.FC<ExtendedCompleteSessionModalProps> = ({
  isOpen,
  onClose,
  currentSession,
  onSubmit,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        <Formik
          initialValues={{
            psychologistId: "",
            symptoms: "",
            remedies: "",
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isValid, isSubmitting }) => (
            <Form>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  ✅ Complete Session
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ❌
                </button>
              </div>
              {message.type && (
                <div
                  className={`p-4 rounded-lg mb-6 ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {message.message}
                </div>
              )}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-100">
                  <h4 className="text-lg font-bold text-blue-800 mb-4">
                    👥 Session Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        👤 Patient Name
                      </label>
                      <input
                        type="text"
                        value={currentSession?.name || ""}
                        readOnly
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        👨‍⚕️ Psychologist <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="psychologistId"
                        placeholder="Enter psychologist's name or ID"
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                      <ErrorMessage
                        name="psychologistId"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-5 rounded-xl border-2 border-red-100">
                  <label className="block text-lg font-bold text-red-800 mb-3">
                    🩺 Patient Symptoms <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="symptoms"
                    placeholder="Describe the patient's symptoms, concerns, and observations in detail..."
                    className="w-full min-h-[120px] p-4 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-y transition-all"
                  />
                  <ErrorMessage
                    name="symptoms"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-100">
                  <label className="block text-lg font-bold text-green-800 mb-3">
                    💊 Prescribed Treatment & Remedies{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="remedies"
                    placeholder="Enter prescribed medications, therapy recommendations, lifestyle changes, follow-up instructions, and treatment plan..."
                    className="w-full min-h-[140px] p-4 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-y transition-all"
                  />
                  <ErrorMessage
                    name="remedies"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-semibold shadow-md"
                  >
                    ❌ Cancel
                  </button>
                  {isValid && (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      ✅ Complete Session
                    </button>
                  )}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CompleteSessionModal;
