import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import EmployeeLoginPanel from "@/pages/employee/login/login";
import Employeelayout from "@/layout/employee/employee";
import EmployeeDashboard from "@/pages/employee/dashboard/dashboard";
import EmployeeTasks from "@/pages/employee/tasks/tasks";
import EmployeeLeaveRequest from "@/pages/employee/leaveRequest/leaveRequest";
import EmployeeYourTeamPanel from "@/pages/employee/yourTeamPanel/teamPanel";
import EmployeeSalaryPanel from "@/pages/employee/salary/salary";

const EmployeeRouter = () => {
  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <Routes>
        <Route path="/" element={<Employeelayout />}>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="task" element={<EmployeeTasks />} />
          <Route path="request-leave" element={<EmployeeLeaveRequest />} />
          <Route path="yourteam" element={<EmployeeYourTeamPanel />} />
          <Route path="salary" element={<EmployeeSalaryPanel />} />
        </Route>
        <Route path="/login" element={<EmployeeLoginPanel />} />
      </Routes>
    </Suspense>
  );
};

export default EmployeeRouter;
