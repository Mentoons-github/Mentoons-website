import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "@/components/common/Loader";

const EmployeeProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return <Loader />;
  }

  if (!isSignedIn) {
    return <Navigate to="/employee/login" state={{ from: location }} replace />;
  }

  const role = user?.publicMetadata?.role;
  if (role !== "EMPLOYEE" && role !== "ADMIN") {
    return <Navigate to="/adda" replace />;
  }

  return <>{children}</>;
};

export default EmployeeProtectedRoute;
