import { ArrowLeft } from "lucide-react";

type LoginComponentProps = {
  showMessage: boolean;
  closeMessage: () => void;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  employeeId: string;
  setEmployeeId: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  isSubmitting: boolean;
  contactSupport: () => void;
  handleBack: () => void;
};

const LoginComponent = ({
  closeMessage,
  error,
  showMessage,
  handleSubmit,
  employeeId,
  setEmployeeId,
  setError,
  contactSupport,
  isSubmitting,
  password,
  setPassword,
  handleBack,
}: LoginComponentProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-400">
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-0 -left-48 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl bottom-0 -right-48 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-orange-200/50">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-md hover:shadow-lg hover:scale-105
                     active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 "
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Success Message Banner */}
        {showMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <button
                onClick={closeMessage}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Error Message Banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-600 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-3">
            <img
              src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
              alt="Company Logo"
              className="w-full h-full object-contain rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h1
            className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-1"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Employee Portal
          </h1>
          <p className="text-amber-600 text-xs font-medium tracking-widest uppercase mb-2">
            Welcome Back
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group">
            <label
              htmlFor="employeeId"
              className="block mb-2 text-orange-700 font-bold text-sm tracking-wide uppercase"
            >
              Your Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              placeholder="Enter your ID number"
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-base bg-white/50 focus:outline-none focus:border-orange-400 focus:bg-white focus:shadow-lg focus:shadow-orange-200/50 transition-all duration-300 group-hover:border-orange-300"
              style={{ fontFamily: "Arial, sans-serif" }}
            />
          </div>

          <div className="group">
            <label
              htmlFor="password"
              className="block mb-2 text-orange-700 font-bold text-sm tracking-wide uppercase"
            >
              Your Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your secure password"
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-base bg-white/50 focus:outline-none focus:border-orange-400 focus:bg-white focus:shadow-lg focus:shadow-orange-200/50 transition-all duration-300 group-hover:border-orange-300"
              style={{ fontFamily: "Arial, sans-serif" }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-3 bg-gradient-to-r ${
              isSubmitting
                ? "from-gray-400 to-gray-500"
                : "from-orange-500 via-amber-500 to-yellow-500"
            } text-white rounded-xl text-lg font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:shadow-orange-300/50 hover:-translate-y-1 active:translate-y-0 disabled:cursor-not-allowed transform`}
            style={{ fontFamily: "Verdana, sans-serif" }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging In...
              </span>
            ) : (
              "Access Portal"
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-orange-200/50 mt-5">
          <p
            className="text-gray-600 text-sm mb-3"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          >
            Having trouble logging in?
          </p>
          <button
            onClick={contactSupport}
            className="text-orange-600 font-semibold text-sm hover:text-orange-700 underline hover:no-underline transition-all duration-200"
          >
            Get Help from IT Support
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default LoginComponent;
