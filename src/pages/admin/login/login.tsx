import { useState } from "react";
import { AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [error, setError] = useState<null | string>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setError(null);
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate login success/failure
      if (
        formData.email === "admin@example.com" &&
        formData.password === "password123"
      ) {
        alert("Login successful! Redirecting to dashboard...");
      } else {
        setError("Invalid credentials. Please check your email and password.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-between p-4 lg:p-8">
      {/* Logo Section */}
      <div className="hidden lg:flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="w-80 h-32 mx-auto mb-6 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <img
              src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
              alt="logo"
              className="w-96 h-25"
            />
          </div>
          <p className="text-white/80 text-lg max-w-md mx-auto">
            Secure admin portal for managing your platform
          </p>
        </div>
      </div>

      {/* Decorative Divider */}
      <div className="hidden lg:block relative h-96 w-[2px] bg-white/30">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[12px] border-l-transparent border-r-transparent border-b-white/60"></div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[12px] border-l-transparent border-r-transparent border-t-white/60"></div>
      </div>

      {/* Login Form Section */}
      <div className="flex flex-1 justify-center items-center">
        <div className="w-full max-w-md">
          <div className="space-y-6 bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-2xl">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white">Admin Login</h1>
              <p className="text-white/80">Access your admin dashboard</p>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden text-center pb-4">
              <div className="w-32 h-16 mx-auto bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold">LOGO</span>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-4 border border-red-400/50 rounded-xl flex items-start gap-3 bg-red-500/10 backdrop-blur-sm">
                <AlertTriangle
                  className="text-red-400 mt-0.5 flex-shrink-0"
                  size={20}
                />
                <div>
                  <p className="text-red-300 font-medium">
                    Authentication Error
                  </p>
                  <p className="text-red-200/90 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Email Field */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-lg border bg-white/5 backdrop-blur-sm text-white placeholder-white/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${
                      errors.email
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 hover:border-white/50"
                    }`}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute -top-2 left-3 px-2 text-sm font-medium text-white bg-green-700 rounded"
                  >
                    Email Address
                  </label>
                </div>
                {errors.email && (
                  <div className="text-red-300 text-sm ml-1">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full p-3 pr-12 rounded-lg border bg-white/5 backdrop-blur-sm text-white placeholder-white/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${
                      errors.password
                        ? "border-red-400 focus:ring-red-400"
                        : "border-white/30 hover:border-white/50"
                    }`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute -top-2 left-3 px-2 text-sm font-medium text-white bg-green-700 rounded"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-red-300 text-sm ml-1">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full p-3 mt-6 text-green-700 bg-white rounded-lg font-semibold transition-all duration-200 hover:bg-white/90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={20} />}
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
