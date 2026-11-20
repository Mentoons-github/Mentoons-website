import { SignIn } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";
import { getSafeRedirect } from "@/utils/authRedirect";

const LogIn = () => {
  const [params] = useSearchParams();
  const previousUrl = getSafeRedirect(params.get("redirect_url"));

  return (
    <div className="h-screen flex bg-[url(/assets/images/team-background.png)] bg-no-repeat bg-cover bg-center">
      <div className="hidden flex-1 lg:block">
        <img
          src="https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1783594514947-27275b14-8f64-4d0f-810a-b8442e6db018.png"
          alt="team-illustration"
          className="object-contain w-full"
        />
      </div>
      <div className="flex flex-1 justify-center items-center">
        <SignIn
          signUpUrl={`/sign-up?redirect_url=${encodeURIComponent(previousUrl)}`}
          forceRedirectUrl={previousUrl}
        />
      </div>
    </div>
  );
};

export default LogIn;
