import { Outlet } from "react-router-dom";
import EmployeeSidebar from "@/components/employee/sidebar";
import EmployeeHeader from "@/components/employee/header";

const Employeelayout = () => {
  return (
    <div className="flex">
      <EmployeeSidebar />
      <div className="flex flex-col flex-1">
        <EmployeeHeader />
        <div className="flex-1 p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Employeelayout;
