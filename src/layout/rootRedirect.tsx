import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "@/components/common/admin/loader";

const RootRouteWrapper = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn || !user) {
      setRedirectPath("/adda");
      return;
    }

    // const role = user.publicMetadata?.role as string | undefined;


    // if (role === "EMPLOYEE") {
    //   setRedirectPath("/employee/dashboard");
    // } else if (role === "ADMIN") {
    //   setRedirectPath("/admin/dashboard");
    // } else {
      setRedirectPath("/adda");
    // }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || redirectPath === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return <Navigate to={redirectPath} replace />;
};

export default RootRouteWrapper;
