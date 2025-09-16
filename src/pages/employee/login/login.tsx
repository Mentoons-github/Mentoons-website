import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (employeeId && password) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/employee/dashboard");
      }, 2000);
    }
  };

  const contactSupport = () => {
    alert(
      "IT Support Contact:\n\nEmail: itsupport@company.com\nPhone: +1 (555) 123-4567\nExt: 1234\n\nSupport Hours:\nMon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 2:00 PM"
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-[#ff6b35] via-[#ffd700] to-[#dc143c]">
      <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md border-2 border-[#ffd700]/30 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffd700] via-[#ff8c00] to-[#dc143c]"></div>
        <div className="absolute w-full h-full pointer-events-none">
          <div className="absolute w-20 h-20 bg-[#ffd700]/10 rounded-full top-[20%] right-[-20px] animate-float"></div>
          <div className="absolute w-16 h-16 bg-[#ffd700]/10 rounded-full bottom-[30%] left-[-10px] animate-[float_6s_ease-in-out_infinite_3s]"></div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#dc143c] via-[#ff6b35] to-[#ffd700] bg-clip-text text-transparent">
            CompanyPortal
          </h1>
          <p className="text-gray-600 text-lg">Employee Access</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 transition-transform duration-300 hover:scale-105">
            <label
              htmlFor="employeeId"
              className="block mb-2 text-gray-800 font-semibold text-sm"
            >
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 focus:outline-none focus:border-[#ff8c00] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,140,0,0.1)] transition-all duration-300"
            />
          </div>

          <div className="mb-6 transition-transform duration-300 hover:scale-105">
            <label
              htmlFor="password"
              className="block mb-2 text-gray-800 font-semibold text-sm"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 focus:outline-none focus:border-[#ff8c00] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,140,0,0.1)] transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 bg-gradient-to-r ${
              isSubmitting
                ? "from-gray-600 to-gray-800"
                : "from-[#ff6b35] to-[#ff8c00]"
            } text-white rounded-xl text-lg font-semibold uppercase tracking-wide transition-all duration-300 hover:from-[#dc143c] hover:to-[#ff6b35] hover:shadow-[0_8px_25px_rgba(255,107,53,0.3)] hover:-translate-y-0.5 active:translate-y-0`}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-5 border-t border-gray-200 mt-5">
          <p className="text-gray-600 text-sm mb-3">
            Need help accessing your account?
          </p>
          <button
            onClick={contactSupport}
            className="bg-gradient-to-r from-[#ffd700] to-[#ff8c00] text-gray-800 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:from-[#ff8c00] hover:to-[#ff6b35] hover:text-white hover:shadow-[0_6px_20px_rgba(255,215,0,0.3)] hover:-translate-y-0.5"
          >
            Contact IT Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
