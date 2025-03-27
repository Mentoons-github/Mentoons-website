import { FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";

const AuthButton = () => {
  return (
    <div className="flex gap-5 justify-center items-center py-1 w-36 bg-gray-700 cursor-pointer md:w-40">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <FaUser className="p-1 w-5 h-5 bg-gray-300 rounded-full md:w-8 md:h-8" />
      </SignedOut>

      <div className="text-[10px] sm:text-xs tracking-wider text-start inter">
        <SignedOut>
          <NavLink 
            to="/sign-in"
            state={{ from: window.location.pathname }}
          >
            <button className="font-medium text-[12px]">
              LOG IN / SIGN UP
            </button>
          </NavLink>
        </SignedOut>

        <SignedIn>
          <span>My Account</span>
          <br />
          <SignOutButton>
            <button className="font-medium text-[10px]">LOG OUT</button>
          </SignOutButton>
        </SignedIn>
      </div>
    </div>
  );
};

export default AuthButton;
