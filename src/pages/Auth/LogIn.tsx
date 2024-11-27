import { SignIn } from "@clerk/clerk-react";

const LogIn = () => {

  return (
    <div className="h-screen flex ">
      <div className="hidden flex-1 lg:block ">
        <img
          src="/assets/images/team-Illustration.png"
          alt=""
          className="w-full  object-contain"
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <SignIn signUpUrl="/sign-up" />
      </div>
    </div>
  );
};

export default LogIn;
