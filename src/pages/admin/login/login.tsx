import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

const AdminLogin = () => {
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();
  const { isLoaded, signIn, setActive } = useSignIn();

  const loginSchema = Yup.object().shape({
    email: Yup.string().required("Email required"),
    password: Yup.string().required("Password required"),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/admin/dashboard");
      } else {
        console.log("Unexpected sign-in status:", result);
        setError("Sign-in not completed. Try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.errors?.[0]?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex justify-between items-center bg-green-700 h-screen">
      <div className="flex flex-1 items-center justify-center">
        <img
          src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
          alt="logo"
          className="w-96 h-25"
        />
      </div>
      <div className="relative h-[25rem] w-[5px] bg-white">
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 
                  border-l-[3px] border-r-[3px] border-b-[10px] 
                  border-l-transparent border-r-transparent border-b-white"
        ></div>
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 
                  border-l-[3px] border-r-[3px] border-t-[10px] 
                  border-l-transparent border-r-transparent border-t-white"
        ></div>
      </div>

      <div className="flex flex-1 justify-center items-center">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-8 p-4 rounded-md w-1/2">
              <div>
                <h1 className="text-4xl font-semibold tracking-wider text-white text-center">
                  Admin Login
                </h1>
                <p className="text-center text-base text-white">
                  Please login to your admin dashboard
                </p>
              </div>
              {error && (
                <div className="p-3 border border-red-500 rounded-xl flex justify-start items-start gap-4 bg-red-600/25">
                  <AlertTriangle className="text-red-500" />
                  <div>
                    <p className="text-red-500 text-md font-semibold">Error</p>
                    <p className="tracking-wider text-base text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-2 space-y-10">
                <div className="relative flex flex-col">
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    value={values.email}
                    className="p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-400 w-full peer bg-transparent text-white border-white"
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-2 -top-2.5 text-sm text-black transition-all duration-200 ease-in-out px-1 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-semibold peer-focus:text-black"
                  >
                    Email
                  </label>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-2 text-green-300 text-sm"
                  />
                </div>
                <div className="relative flex flex-col">
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    value={values.password}
                    className="p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-400 w-full peer bg-transparent text-white border-white"
                    placeholder=" "
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-2 -top-2.5 text-sm text-black transition-all duration-200 ease-in-out px-1 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-semibold peer-focus:text-black"
                  >
                    Password
                  </label>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-2 text-green-300 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full p-2 mt-4 text-white bg-green-700 rounded-xl border border-white hover:border-green-300 hover:bg-white hover:text-green-700 transition-all ease-in"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AdminLogin;
