import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn, useUser, useClerk } from "@clerk/clerk-react";
import axios from "axios";
import LoginComponent from "@/components/employee/login/LoginComponent";
import { toast } from "sonner";
import WelcomeComponent from "@/components/employee/login/WelcomeComponent";

export type Options = {
  value: string;
  label: string;
};

const departmentOptions: Options[] = [
  { value: "", label: "Select Your Job Role" },
  { value: "developer", label: "Software Development" },
  { value: "illustrator", label: "Illustration & Art" },
  { value: "designer", label: "Design & Creativity" },
  { value: "hr", label: "Human Resources (HR)" },
  { value: "marketing", label: "Marketing & Branding" },
  { value: "finance", label: "Finance & Accounts" },
  { value: "sales", label: "Sales & Business Development" },
  { value: "psychologist", label: "Mental Health" },
];

const employmentTypeOptions: Options[] = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "intern", label: "Intern" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];

const EmployeeLogin = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("welcome");
  const [jobRole, setJobRole] = useState("");
  const [jobType, setJobType] = useState("");

  const navigate = useNavigate();
  const { signIn, setActive } = useSignIn();
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user?.publicMetadata?.role === "EMPLOYEE") {
      navigate("/employee/dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (employeeId && password) {
      setIsSubmitting(true);
      setError("");
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_PROD_URL}/employee/login/${employeeId}`,
          { jobRole, jobType },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const employeeData = response.data;

        if (!signIn) {
          throw new Error("Sign in not available. Please refresh the page.");
        }

        if (isSignedIn) {
          await signOut({ redirectUrl: "" });
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const result = await signIn.create({
          identifier: employeeData.data.email,
          password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          toast.success(employeeData.message);
          navigate("/employee/dashboard");
        } else {
          setError(
            "Login incomplete. Please check your details or contact support."
          );
        }
      } catch (error: unknown) {
        console.error("Login error:", error);

        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Server error. Please try again.";

          setError(message);
          return;
        }
        if (error instanceof Error) {
          setError(error.message);
          return;
        }

        setError("Login failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const contactSupport = () => {
    alert(
      "IT Support Contact:\n\nEmail: itsupport@company.com\nPhone: +1 (555) 123-4567\nExt: 1234\n\nSupport Hours:\nMon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 2:00 PM"
    );
  };

  const closeMessage = () => {
    setShowMessage(false);
  };

  const handleBack = () => {
    setTab("welcome");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {tab === "welcome" && (
        <WelcomeComponent
          departmentOptions={departmentOptions}
          employmentTypeOptions={employmentTypeOptions}
          jobRole={jobRole}
          jobType={jobRole}
          setJobRole={setJobRole}
          setJobType={setJobType}
          setTab={setTab}
        />
      )}

      {tab === "login" && (
        <LoginComponent
          closeMessage={closeMessage}
          contactSupport={contactSupport}
          employeeId={employeeId}
          error={error}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          password={password}
          setEmployeeId={setEmployeeId}
          setError={setError}
          setPassword={setPassword}
          showMessage={showMessage}
          handleBack={handleBack}
        />
      )}
    </div>
  );
};

export default EmployeeLogin;
