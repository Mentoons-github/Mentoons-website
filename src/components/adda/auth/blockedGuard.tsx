import Loader from "@/components/common/Loader";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const BlockedGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const isBlocked = user.publicMetadata?.blocked === true;

    if (isBlocked) {
      setShouldRedirect(true);
      signOut({ redirectUrl: "/blocked" }).catch(console.error);
    }
  }, [isLoaded, isSignedIn, user, signOut]);

  if (!isLoaded) return <Loader />;

  if (!isSignedIn) return <>{children}</>;

  if (user?.publicMetadata?.blocked === true || shouldRedirect) {
    return null;
  }

  return <>{children}</>;
};

export default BlockedGuard;
