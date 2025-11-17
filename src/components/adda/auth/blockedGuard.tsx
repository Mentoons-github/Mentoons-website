import Loader from "@/components/common/Loader";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BlockedGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) return;

    const isBlocked = user?.publicMetadata?.blocked === true;
    const role = user?.publicMetadata?.role as string;

    if (role === "ADMIN" || role === "EMPLOYEE" || !isBlocked) return;

    signOut({ redirectUrl: `/blocked` });

    if (location.pathname !== "/blocked") {
      navigate("/blocked", { replace: true });
    }
  }, [isLoaded, isSignedIn, user, signOut, navigate, location]);

  if (!isLoaded) return <Loader />;

  if (!isSignedIn) return <>{children}</>;

  const isBlocked = user?.publicMetadata?.blocked === true;
  const role = user?.publicMetadata?.role as string;

  if (role === "ADMIN" || role === "EMPLOYEE" || !isBlocked) {
    return <>{children}</>;
  }

  return null; // blocked user → never render anything
};

export default BlockedGuard;
