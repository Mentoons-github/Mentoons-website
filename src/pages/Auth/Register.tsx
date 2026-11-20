import { SignUp, useSignUp } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getSafeRedirect, withQueryParam } from "@/utils/authRedirect";

const Register = () => {
  const { signUp } = useSignUp();
  const [params] = useSearchParams();
  const previousUrl = getSafeRedirect(params.get("redirect_url"));

  // Return to the original page, with openModal=true so your welcome popup still shows
  const afterSignUpUrl = withQueryParam(previousUrl, "openModal", "true");

  // Handle successful signup
  useEffect(() => {
    if (!signUp) return;

    if (signUp.status === "complete") {
      handleSendPDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signUp?.status]);

  const handleSendPDF = async () => {
    try {
      // Add your PDF sending logic here
      // await fetch('/api/send-welcome-pdf', {
      //   method: 'POST',
      //   body: JSON.stringify({ email: signUp?.emailAddress }),
      // });
      console.log("User registration complete");
      localStorage.setItem("Signed up", "true");

      // Full reload so Router re-reads openModal / "Signed up" and shows the popup
      window.location.href = afterSignUpUrl;
    } catch (error) {
      console.error("Error sending PDF:", error);
    }
  };

  return (
    <div className="h-screen flex bg-[url(/assets/images/team-background.png)] bg-cover bg-center bg-no-repeat">
      <div className="hidden flex-1 lg:block">
        <img
          src="https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1783594514947-27275b14-8f64-4d0f-810a-b8442e6db018.png"
          alt="team-illustration"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 justify-center items-center">
        <SignUp
          signInUrl={`/sign-in?redirect_url=${encodeURIComponent(previousUrl)}`}
          forceRedirectUrl={afterSignUpUrl}
        />
      </div>
    </div>
  );
};

export default Register;
