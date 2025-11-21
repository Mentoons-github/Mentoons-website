import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import ProgressBarUpload from "../adda/progress/progressBarUpload";

const GlobalProgressBar = () => {
  const { loading, success, error } = useSelector(
    (state: RootState) => state.fileUpload
  );

  const isActive = loading || success || error;

  return (
    <div className="fixed top-0 left-5670 right-0 z-[999999] pointer-events-none">
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
