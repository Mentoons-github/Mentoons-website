import { SignUp } from "@clerk/clerk-react";
const Register = () => {
  return (
    <div className="h-screen flex ">
      <div className="hidden  flex-1 lg:block ">
        <img
          src="/assets/images/team-Illustration.png"
          alt=""
          className=" object-cover"
        />
      </div>
      <div className=" flex-1 flex items-center justify-center">
        <SignUp signInUrl="/sign-in" />
      </div>
    </div>
  );
};

export default Register;
