import { useAuthModal } from "@/context/adda/authModalContext";
import { useUser } from "@clerk/clerk-react";

export const useProtectedAction = () => {
  const { user } = useUser();
  const { openAuthModal } = useAuthModal();

  const run = (callback: () => void) => {
    if (!user) {
      openAuthModal("sign-in");
      return;
    }

    callback();
  };

  return { run, isLoggedIn: !!user };
};
