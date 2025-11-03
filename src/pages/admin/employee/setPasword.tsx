import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";

interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
}

interface ErrorResponse {
  message?: string;
}

const AddPasswordPage = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [hasValidKey, setHasValidKey] = useState<boolean>(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key");

  useEffect(() => {
    if (!key) {
      setMessage(
        "Invalid or missing invitation link. Please request a new invitation from HR."
      );
    } else {
      setHasValidKey(true);
    }
  }, [key]);

  const getPasswordStrength = (pass: string): PasswordStrength => {
    if (pass.length === 0) return { strength: 0, label: "", color: "" };
    if (pass.length < 6)
      return { strength: 25, label: "Weak", color: "bg-red-500" };

    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.length >= 12) strength += 25;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 12.5;

    if (strength <= 25) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength <= 50)
      return { strength, label: "Fair", color: "bg-orange-500" };
    if (strength <= 75)
      return { strength, label: "Good", color: "bg-yellow-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!key) {
      setMessage("Invalid invitation link. Please request a new one from HR.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/admin/set-password`,
        { key, password }
      );

      console.log(data);

      setIsSuccess(true);
      setMessage("Password set successfully! Redirecting to Employee login...");
      const infoMessage = "Please visit your email to find your employeeId";
      navigate(`/employee/login?message=${encodeURIComponent(infoMessage)}`);
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Server error. Please try again later.";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasValidKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="text-white" size={32} />
              </div>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Invalid Link
              </h2>
              <p className="text-gray-600">
                The invitation link is invalid or missing.
              </p>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle
                className="text-red-600 mr-3 flex-shrink-0 mt-0.5 inline"
                size={20}
              />
              <p className="text-sm text-red-800 inline">{message}</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full mt-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-[1.02]"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Icon Header */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Lock className="text-white" size={32} />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Set Your Password
            </h2>
            <p className="text-gray-600">
              Create a strong password to secure your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600">
                      Password Strength:
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.strength <= 25
                          ? "text-red-600"
                          : passwordStrength.strength <= 50
                          ? "text-orange-600"
                          : passwordStrength.strength <= 75
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Use at least 8 characters with uppercase, lowercase, numbers
                    & symbols
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="flex items-center mt-2 text-sm">
                  {password === confirmPassword ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-1" />
                      <span>Passwords match</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <AlertCircle size={16} className="mr-1" />
                      <span>Passwords do not match</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
            >
              {isLoading ? (
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
                  Setting Password...
                </span>
              ) : isSuccess ? (
                "Success! Redirecting..."
              ) : (
                "Set Password"
              )}
            </button>
          </form>

          {/* Message Alert */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-lg flex items-start ${
                isSuccess
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {isSuccess ? (
                <CheckCircle
                  className="text-green-600 mr-3 flex-shrink-0 mt-0.5"
                  size={20}
                />
              ) : (
                <AlertCircle
                  className="text-red-600 mr-3 flex-shrink-0 mt-0.5"
                  size={20}
                />
              )}
              <p
                className={`text-sm ${
                  isSuccess ? "text-green-800" : "text-red-800"
                }`}
              >
                {message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPasswordPage;
