import Loader from "@/components/common/admin/loader";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RootRedirect = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    const role = user?.publicMetadata?.role;
    console.log(role);

    if (role === "EMPLOYEE") {
      navigate("/employee/dashboard", { replace: true });
    } else if (role === "ADMIN") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/adda", { replace: true });
    }
  }, [isLoaded, user, navigate]);

  if (!isLoaded) {
    return <Loader />;
  }

  return null;
};

export default RootRedirect;
