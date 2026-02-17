import Loader from "@/components/common/Loader";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface BlockedGuardProps {
  children: React.ReactNode;
}

const BlockedGuard = ({ children }: BlockedGuardProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const isBlocked = user?.publicMetadata?.blocked;
    // const role = user?.publicMetadata?.role as string;

    if (isBlocked) {
      signOut({ redirectUrl: `/blocked` });
      return;
    }

    // if (role === "ADMIN" && !location.pathname.startsWith("/admin")) {
    //   navigate("/admin", { replace: true });
    //   return;
    // }

    // if (role === "EMPLOYEE" && !location.pathname.startsWith("/employee")) {
    //   navigate("/employee", { replace: true });
    //   return;
    // }
  }, [isLoaded, isSignedIn, user, signOut, navigate, location]);

  if (!isLoaded) return <Loader />;

  if (!isSignedIn) return <>{children}</>;

  if (user?.publicMetadata?.blocked) return null;

  return <>{children}</>;
};

export default BlockedGuard;
