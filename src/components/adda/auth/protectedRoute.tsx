import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import LoginModal from "@/components/common/modal/loginModal";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="w-10 h-10 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    if (!showLoginModal) setShowLoginModal(true);

    return (
      <>
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            isOpen={showLoginModal}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
