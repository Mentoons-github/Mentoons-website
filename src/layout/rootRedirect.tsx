import { useUser } from "@clerk/clerk-react";
import Loader from "@/components/common/admin/loader";

const RootRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
};

export default RootRouteWrapper;
