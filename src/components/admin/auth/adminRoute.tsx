import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const AdminRouter = ({ children }: { children: JSX.Element }) => {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) return <Navigate to={"/admin/login"} replace />;

  if (!user?.publicMetadata?.role || user.publicMetadata.role !== "ADMIN")
    return <Navigate to={"/admin/login"} replace />;

  return children;
};

export default AdminRouter;
