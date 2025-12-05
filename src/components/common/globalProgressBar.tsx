import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProgressBarUpload from "../adda/progress/progressBarUpload";

const GlobalProgressBar = () => {
  const { loading, success, error } = useSelector(
    (state: RootState) => state.fileUpload
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (loading) {
      setShow(true);
    } else if (success || error) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, success, error]);

  const isActive = loading || (show && (success || error));

  return (
    <div className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none">
      <div
        className={`pointer-events-auto transition-all duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <ProgressBarUpload />
      </div>
    </div>
  );
};

export default GlobalProgressBar;
