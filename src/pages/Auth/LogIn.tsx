import { SignIn } from "@clerk/clerk-react";

const LogIn = () => {
  return (
    <div className=" h-screen  flex  bg-[url(/assets/images/team-background.png)] bg-no-repeat bg-cover bg-center">
      <div className="hidden flex-1 lg:block  ">
        <img
          src="/assets/home/team007.png"
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
