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
      console.log("hello world");
      localStorage.setItem("Signed up", "true");
    } catch (error) {
      console.error("Error sending PDF:", error);
    }
  };

  return (
    <div className="h-screen flex  bg-[url(/assets/images/team-background.png)] bg-cover bg-center bg-no-repeat">
      <div className="hidden flex-1 lg:block ">
        <img
          src="/assets/images/team-Illustration.png"
          alt=""
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex items-center justify-center ">
        <SignUp signInUrl="/sign-in" forceRedirectUrl="/?openModal=true" />
      </div>
    </div>
  );
};

export default Register;
