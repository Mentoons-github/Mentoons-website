// import ComingSoon from "@/components/common/comingSoon/comingSoon";
import { Outlet } from "react-router-dom";

const AddaOverlay = () => {
  return (
    <div className="relative">
      {/* <ComingSoon /> */}
      <Outlet />
    </div>
  );
};

export default AddaOverlay;
