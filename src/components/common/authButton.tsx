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
    <div className="w-36 md:w-40 flex justify-center items-center bg-gray-700 py-1 gap-5 cursor-pointer">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <FaUser className="bg-gray-300 rounded-full p-1 w-5 h-5 md:w-8 md:h-8" />
      </SignedOut>

      <div className="text-[10px] sm:text-xs tracking-wider text-start inter">
        <SignedOut>
          <NavLink to="/sign-in">
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
