import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";

interface PasswordForm {
  new: string;
  confirm: string;
}

interface PasswordModalProps {
  showPasswordModal: boolean;
  setShowPasswordModal: () => void;
  onChangePassword: (newPassword: string) => void;
}

interface ValidationState {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  passwordsMatch: boolean;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  showPasswordModal,
  setShowPasswordModal,
  onChangePassword,
}) => {
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    new: "",
    confirm: "",
  });

  const [validation, setValidation] = useState<ValidationState>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    passwordsMatch: false,
  });

  useEffect(() => {
    const newPassword = passwordForm.new;
    const confirmPassword = passwordForm.confirm;

    setValidation({
      hasMinLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      passwordsMatch: newPassword.length > 0 && newPassword === confirmPassword,
    });
  }, [passwordForm.new, passwordForm.confirm]);

  const validationCriteria = [
    { key: "hasMinLength", label: "At least 8 characters" },
    { key: "hasUpperCase", label: "One uppercase letter" },
    { key: "hasLowerCase", label: "One lowercase letter" },
    { key: "hasNumber", label: "One number" },
    { key: "passwordsMatch", label: "Passwords match" },
  ];

  const completedValidations = Object.values(validation).filter(Boolean).length;
  const totalValidations = validationCriteria.length;
  const progressPercentage = (completedValidations / totalValidations) * 100;

  const isFormValid = Object.values(validation).every(Boolean);

  const handleChangePassword = () => {
    if (isFormValid) {
      onChangePassword(passwordForm.new);
      setShowPasswordModal();
      setPasswordForm({ new: "", confirm: "" });
    }
  };

  if (!showPasswordModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Change Password
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Update your account password
            </p>
          </div>
          <button
            onClick={() => {
              setShowPasswordModal();
              setPasswordForm({ new: "", confirm: "" });
            }}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.new}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, new: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirm}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirm: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Confirm new password"
            />
          </div>

          {passwordForm.new && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">
                  Password Strength
                </span>
                <span
                  className={`font-bold ${
                    progressPercentage === 100
                      ? "text-green-600"
                      : progressPercentage >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {completedValidations}/{totalValidations}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressPercentage === 100
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : progressPercentage >= 60
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                      : "bg-gradient-to-r from-red-500 to-red-600"
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="space-y-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
                {validationCriteria.map((criterion) => {
                  const isValid =
                    validation[criterion.key as keyof ValidationState];
                  return (
                    <div
                      key={criterion.key}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        isValid ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {isValid ? (
                        <Check className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className={isValid ? "font-medium" : ""}>
                        {criterion.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleChangePassword}
            disabled={!isFormValid}
            className={`flex-1 px-6 py-3 rounded-xl font-medium shadow-lg transition-all ${
              isFormValid
                ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Update Password
          </button>
          <button
            onClick={() => {
              setShowPasswordModal();
              setPasswordForm({ new: "", confirm: "" });
            }}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
