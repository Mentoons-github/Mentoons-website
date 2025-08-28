import { useEffect, useState } from "react";
import { useUser, useSignIn, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "./login";

const AdminLoginWrapper = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { isLoaded } = useSignIn();
  const { signOut } = useClerk();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const handleSessionCheck = async () => {
      if (isSignedIn) {
        if (user?.publicMetadata?.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          await signOut();
        }
      }
      setReady(true);
    };

    handleSessionCheck();
  }, [isLoaded, isSignedIn, user, navigate, signOut]);

  if (!ready) return <p>Loading...</p>;

  return <AdminLogin />;
};

export default AdminLoginWrapper;
