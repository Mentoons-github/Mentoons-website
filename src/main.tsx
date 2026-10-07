import { ClerkProvider } from "@clerk/clerk-react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { store } from "./redux/store.ts";
import { AuthModalProvider } from "./context/adda/authModalContext.tsx";
import { StatusModalProvider } from "./context/adda/statusModalContext.tsx";
// import CustomCursor from "./components/common/customCursor/customCursor.tsx";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
import { gsap } from "gsap";
import { Flip, ScrollTrigger, SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, Flip, ScrollTrigger, SplitText);

import { ReactNode, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setGetToken } from "./api/axios.ts";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();

  useEffect(() => {
    setGetToken(getToken);
  }, [getToken]);

  return children;
};

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    afterSignOutUrl={null}
    appearance={{
      layout: {
        unsafe_disableDevelopmentModeWarnings: true,
      },
      variables: {
        colorPrimary: "#EC9700",
        colorText: "black",
      },
      signUp: {
        variables: {
          fontSize: "1rem",
          fontWeight: {
            bold: 700,
          },
        },
      },
      signIn: {
        variables: {
          fontSize: "1rem",
          fontWeight: {
            bold: 700,
          },
        },
      },
    }}
  >
    <BrowserRouter>
      <Provider store={store}>
        <AuthModalProvider>
          <StatusModalProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
            {/* <CustomCursor /> */}
          </StatusModalProvider>
        </AuthModalProvider>
      </Provider>
    </BrowserRouter>
  </ClerkProvider>,
);
