import { Toaster } from "sonner"
import Router from "./Routes"
import ScrollToTop from "./components/comics/ScrollToTop"

const App = () => {
return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" closeButton />
      <Router />
    </>
  );
}

export default App
