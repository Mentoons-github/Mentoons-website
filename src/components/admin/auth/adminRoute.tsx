import AdminLayout from "@/layout/admin/layout";
import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const { isSignedIn, user } = useUser();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isSignedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user?.publicMetadata?.role || user.publicMetadata.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminProtectedRoute;
