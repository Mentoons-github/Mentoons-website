import React from "react";
import { Mail, Phone, Edit2, User, CheckCircle } from "lucide-react";
import { Admin } from "@/types/admin";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { adminValidationSchema } from "@/utils/formik/admin/admin";
import { useStatusModal } from "@/context/adda/statusModalContext";

interface ProfileInfoProps {
  adminData: Admin;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditProfile: (values: Partial<Admin>) => Promise<void>;
  onVerifyEmail?: () => void; // Optional callback for email verification
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  adminData,
  isEditing,
  setIsEditing,
  handleEditProfile,
  onVerifyEmail,
}) => {
  const { showStatus } = useStatusModal();

  const initialValue: Partial<Admin> = {
    name: adminData.name || "",
    email: adminData.email || "",
    phoneNumber: adminData.phoneNumber || "",
  };

  const handleVerifyEmailClick = () => {
    if (onVerifyEmail) {
      onVerifyEmail();
    } else {
      showStatus("info", "Verification email sent! Please check your inbox.");
    }
  };

  return (
    <div className="px-6 md:px-10 pb-10">
      <div className="space-y-8">
        {!isEditing ? (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Added Name Field */}
              <div className="group">
                <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {adminData.name || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Email Address
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {adminData.email || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Phone Number
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {adminData.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={initialValue}
            validationSchema={adminValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              console.log("Form submitted with values:", values);
              try {
                await handleEditProfile(values);
                showStatus("success", "Profile updated successfully!");
              } catch (error: any) {
                console.error("Edit profile failed:", error);
                showStatus(
                  "error",
                  error.message || "Failed to update profile. Please try again."
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Edit Profile Information
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Field
                      name="name"
                      type="text"
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 focus:outline-none transition-colors disabled:bg-gray-100 ${
                        errors.name && touched.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email Address
                      </label>
                      <button
                        type="button"
                        onClick={handleVerifyEmailClick}
                        className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Verify Email
                      </button>
                    </div>
                    <Field
                      name="email"
                      type="email"
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 focus:outline-none transition-colors disabled:bg-gray-100 ${
                        errors.email && touched.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Field
                      name="phoneNumber"
                      type="tel"
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 focus:outline-none transition-colors disabled:bg-gray-100 ${
                        errors.phoneNumber && touched.phoneNumber
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200 mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-xl"
                    }`}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}

        {!isEditing && (
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
