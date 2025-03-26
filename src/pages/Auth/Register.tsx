import { SignUp, useSignUp } from "@clerk/clerk-react";
import { useEffect } from "react";

const Register = () => {
  const { signUp } = useSignUp();

  // Handle successful signup
  useEffect(() => {
    if (!signUp) return;

    if (signUp.status === "complete") {
      handleSendPDF();
    }

    // No need for cleanup since we're not using listeners
  }, [signUp?.status]);

  const handleSendPDF = async () => {
    try {
      // Add your PDF sending logic here
      // Example:
      // await fetch('/api/send-welcome-pdf', {
      //   method: 'POST',
      //   body: JSON.stringify({ email: signUp.emailAddress }),
      // });
      console.log("User registration complete");
      localStorage.setItem("Signed up", "true");
      // Redirect to home with openModal parameter
      window.location.href = "/?openModal=true";
    } catch (error) {
      console.error("Error sending PDF:", error);
    }
  };

  return (
    <div className="h-screen flex  bg-[url(/assets/images/team-background.png)] bg-cover bg-center bg-no-repeat">
      <div className="hidden flex-1 lg:block">
        <img src="/assets/home/team007.png" alt="" className="object-cover" />
      </div>
      <div className="flex flex-1 justify-center items-center">
        <SignUp
          signInUrl="/sign-in"
          redirectUrl={
            window.location.search
              ? window.location.pathname + window.location.search
              : "/?openModal=true"
          }
        />
      </div>
    </div>
  );
};

export default Register;
