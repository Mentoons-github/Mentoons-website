import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import EmployeeLoginPanel from "@/pages/employee/login/login";
import Employeelayout from "@/layout/employee/employee";
import EmployeeDashboard from "@/pages/employee/dashboard/dashboard";
import EmployeeTasks from "@/pages/employee/tasks/tasks";
import EmployeeLeaveRequest from "@/pages/employee/leaveRequest/leaveRequest";
// import EmployeeYourTeamPanel from "@/pages/employee/yourTeamPanel/teamPanel";
import EmployeeSalaryPanel from "@/pages/employee/salary/salary";
import PsychologistTask from "@/pages/employee/psychologistTask/psychologistTask";
import EmployeeProtectedRoute from "@/layout/employee/protectedRoute";
// import JobReferralPortal from "@/pages/employee/referAndEarn/referAndEarn";
import EmployeeProfile from "@/pages/employee/profile";
import BirthdayCalendar from "@/pages/employee/birthday/birthdayTracker";

const EmployeeRouter = () => {
  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <Routes>
        <Route
          path="/"
          element={
            <EmployeeProtectedRoute>
              <Employeelayout />
            </EmployeeProtectedRoute>
          }
        >
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="tasks" element={<EmployeeTasks />} />
          <Route path="request-leave" element={<EmployeeLeaveRequest />} />
          {/* <Route path="your-team" element={<EmployeeYourTeamPanel />} /> */}
          <Route path="salary" element={<EmployeeSalaryPanel />} />
          <Route path="session-calls" element={<PsychologistTask />} />
          {/* <Route path="refer-and-earn" element={<JobReferralPortal />} /> */}
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="celebrations" element={<BirthdayCalendar />} />
        </Route>
        <Route path="/login" element={<EmployeeLoginPanel />} />
      </Routes>
    </Suspense>
  );
};

export default EmployeeRouter;
