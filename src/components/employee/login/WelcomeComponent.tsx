import { Options } from "@/pages/employee/login/login";

type WelcomeComponentProps = {
  jobRole: string;
  jobType: string;
  departmentOptions: Options[];
  employmentTypeOptions: Options[];
  setJobType: React.Dispatch<React.SetStateAction<string>>;
  setJobRole: React.Dispatch<React.SetStateAction<string>>;
  setTab: React.Dispatch<React.SetStateAction<string>>;
};

const WelcomeComponent = ({
  departmentOptions,
  jobRole,
  jobType,
  employmentTypeOptions,
  setJobRole,
  setJobType,
  setTab,
}: WelcomeComponentProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-400">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-orange-200/50">
        {/* Heading */}

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-3">
            <img
              src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
              alt="Company Logo"
              className="w-full h-full object-contain rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
            Welcome
          </h1>
          <p className="text-sm text-amber-600 mt-1 font-medium tracking-wide uppercase">
            Employee Panel
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto rounded-full mt-3"></div>
        </div>

        {/* Job Role */}
        <div className="mb-4">
          <label className="block mb-2 text-orange-700 font-bold text-sm uppercase">
            Job Role
          </label>
          <select
            value={jobRole}
            onChange={(e) => {
              setJobRole(e.target.value);
              setJobType("");
            }}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400"
          >
            {departmentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type – ALWAYS visible */}
        <div className="mb-6">
          <label className="block mb-2 text-orange-700 font-bold text-sm uppercase">
            Job Type
          </label>

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            disabled={!jobRole}
            className={`w-full p-3 border-2 rounded-xl focus:outline-none transition
                  ${
                    jobRole
                      ? "border-gray-200 focus:border-orange-400 bg-white"
                      : "border-gray-200 bg-gray-100 cursor-not-allowed text-gray-400"
                  }
                `}
          >
            <option value="">
              {jobRole ? "Select Type" : "Select role first"}
            </option>

            {employmentTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Continue Button */}
        <button
          disabled={!jobRole || !jobType}
          onClick={() => setTab("login")}
          className="w-full p-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-xl font-bold uppercase tracking-wide hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Login
        </button>
      </div>
    </div>
  );
};

export default WelcomeComponent;
