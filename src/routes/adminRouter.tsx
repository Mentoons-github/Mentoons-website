import AdminProtectedRoute from "@/components/admin/auth/adminRoute";
// import MentoonsAdminPanel from "@/components/common/admin/adminSelect";
// import AddEditEmployeePage from "@/pages/admin/addEmployee";
import AddProduct from "@/pages/admin/addProduct";
import AllottedCalls from "@/pages/admin/allottedCalls";
// import AllottedCalls from "@/pages/admin/allottedCalls";
import DashboardAnalytics from "@/pages/admin/dashboard";
import AdminAttendanceView from "@/pages/admin/employee/attendance";
import CreateEmployee from "@/pages/admin/employee/createEmployee";
import EmployeeTable from "@/pages/admin/employee/employeeTable";
import AdminLeaveManagement from "@/pages/admin/employee/leaveManagement";
import Feedback from "@/pages/admin/feedback/feedback";
// import TaskAssignmentSystem from "@/pages/admin/employeeTask";
import GeneralQueries from "@/pages/admin/generalQueries";
import CreateJob from "@/pages/admin/jobs/addJob";
import AllJobs from "@/pages/admin/jobs/all_jobs";
import ViewApplications from "@/pages/admin/jobs/viewApplication";
import AdminLoginWrapper from "@/pages/admin/login/adminLoginWrapper";
import AddMeetup from "@/pages/admin/meetups/addMeetup";
import Newsletter from "@/pages/admin/newsLetter";
import AdminNotification from "@/pages/admin/notification";
import ProductSalesDashboard from "@/pages/admin/productSales";
import ProductTable from "@/pages/admin/productTable";
import FreelancersTable from "@/pages/admin/professionalRecords/freelancers";
import PsychologistsTable from "@/pages/admin/professionalRecords/pychologists";
import AdminProfile from "@/pages/admin/profile";
import AddQuiz from "@/pages/admin/quiz/addQuiz";
import QuizTable from "@/pages/admin/quiz/quiz";
import Role from "@/pages/admin/roleSelection/role";
// import SessionEnquiries from "@/pages/admin/sessionAllocation/session";
import AdminTaskDashboard from "@/pages/admin/taskSubmissions";
import Users from "@/pages/admin/users";
import ViewProduct from "@/pages/admin/viewProducts";
import AddWorkshop from "@/pages/admin/workshop/addWorkshop/addWorkshop";
import AllWorkshops from "@/pages/admin/workshop/addWorkshop/allWorkshops";
import AllMeetups from "@/pages/admin/workshop/allMeetups/allMeetups";
import ViewEnquiry from "@/pages/admin/workshop/viewEnquiry";
import GetWorkshopEnquiries from "@/pages/admin/workshop/workshopEnquiries";
import WorkshopSessions from "@/pages/admin/workshop/WorkshopSessions";
import SinglePsychologistWorkshop from "@/pages/employee/workshops/SinglePsychologistWorkshop";
import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const AdminRouter = () => {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Routes>
        {/* <Route path="admin-select" element={<MentoonsAdminPanel />} /> */}
        <Route path="/login" element={<AdminLoginWrapper />} />
        <Route element={<AdminProtectedRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardAnalytics />} />
          <Route path="users" element={<Users />} />

          {/*Products*/}
          {/* <Route path="allotted-calls" element={<AllottedCalls />} /> */}
          <Route path="product-table" element={<ProductTable />} />
          <Route path="products/:productId" element={<ViewProduct />} />
          <Route path="add-products" element={<AddProduct />} />

          {/*Enquiry */}
          <Route path="workshop-enquiries" element={<GetWorkshopEnquiries />} />
          <Route path="enquiries/:enquiryId" element={<ViewEnquiry />} />
          <Route path="general-queries" element={<GeneralQueries />} />
          <Route path="session-enquiry" element={<AllottedCalls />} />
          <Route path="newsletter" element={<Newsletter />} />
          {/* <Route path="task-assign" element={<TaskAssignmentSystem />} /> */}
          <Route path="product-sales" element={<ProductSalesDashboard />} />

          {/*Employee */}
          <Route path="employee/add" element={<CreateEmployee />} />
          <Route path="employee/edit/:id" element={<CreateEmployee />} />
          <Route path="employee-table" element={<EmployeeTable />} />
          <Route path="task-submissions" element={<AdminTaskDashboard />} />

          {/*Job */}
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="hiring-form" element={<CreateJob />} />
          <Route path="view-applications" element={<ViewApplications />} />

          {/*Workshop */}
          <Route path="add-workshop" element={<AddWorkshop />} />
          <Route path="workshops" element={<AllWorkshops />} />
          <Route path="workshop-sessions" element={<WorkshopSessions />} />

          {/*Meetup */}
          <Route path="add-meetup" element={<AddMeetup />} />
          <Route path="edit-meetup/:id" element={<AddMeetup />} />
          <Route path="meetups" element={<AllMeetups />} />
          <Route path="psychologists" element={<PsychologistsTable />} />
          <Route path="freelancers" element={<FreelancersTable />} />

          <Route path="profile" element={<AdminProfile />} />
          <Route path="notifications" element={<AdminNotification />} />
          <Route path="leave-management" element={<AdminLeaveManagement />} />
          <Route path="employee-attendance" element={<AdminAttendanceView />} />
          <Route path="add-quiz" element={<AddQuiz />} />
          <Route path="quiz" element={<QuizTable />} />
          <Route
            path="workshop-sessions/:workshopId"
            element={<SinglePsychologistWorkshop />}
          />
          <Route path="feedback" element={<Feedback />} />
        </Route>
        <Route path="/test" element={<Role />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRouter;
