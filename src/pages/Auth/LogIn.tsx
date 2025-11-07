import { SignIn } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
const LogIn = () => {
  const location = useLocation();
  const previousUrl = location.state?.from || "/";
  console.log(previousUrl);

  return (
    <div className=" h-screen  flex  bg-[url(/assets/images/team-background.png)] bg-no-repeat bg-cover bg-center">
      <div className="hidden flex-1 lg:block">
        <img
          src="https://mentoons-products.s3.ap-northeast-1.amazonaws.com/1234/team+Illustration+3.png"
          alt=""
          className="object-contain w-full"
        />
      </div>
      <div className="flex flex-1 justify-center items-center">
        <SignIn signUpUrl="/sign-up" forceRedirectUrl={previousUrl} />
      </div>
    </div>
  );
};

export default LogIn;
