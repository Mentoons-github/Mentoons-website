import { FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const AuthButton = () => {
  const { user } = useUser();

  return (
    <div className="flex gap-2 justify-center items-center py-1 w-36 bg-gray-700 cursor-pointer sm:w-44 md:w-48">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <FaUser className="p-1 w-4 h-4 bg-gray-300 rounded-full sm:w-5 sm:h-5 md:w-8 md:h-8" />
      </SignedOut>

      <div className="text-[8px] sm:text-xs tracking-wider text-start inter">
        <SignedOut>
          <NavLink to="/sign-in" state={{ from: window.location.pathname }}>
            <button className="font-medium text-[10px] sm:text-[12px]">
              LOG IN / SIGN UP
            </button>
          </NavLink>
        </SignedOut>

        <SignedIn>
          <span className="text-[13px] sm:text-sm font-medium whitespace-normal">
            {user?.fullName || user?.firstName || "My Account"}
          </span>
          <br />
          <SignOutButton>
            <button className="font-medium text-[11px] sm:text-[10px]">
              LOG OUT
            </button>
          </SignOutButton>
        </SignedIn>
      </div>
    </div>
  );
};

export default AuthButton;
