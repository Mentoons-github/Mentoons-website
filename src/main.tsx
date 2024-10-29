import { ClerkProvider } from "@clerk/clerk-react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { store } from "./redux/store.ts";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log(PUBLISHABLE_KEY,'PUBLISHABLE_KEY')

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    afterSignOutUrl="/"
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
        <App />
      </Provider>
    </BrowserRouter>
  </ClerkProvider>
);
