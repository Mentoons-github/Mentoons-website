import AdminProtectedRoute from "@/components/admin/auth/adminRoute";
import AddProduct from "@/pages/admin/addProduct";
import AllottedCalls from "@/pages/admin/allottedCalls";
import AddNewBadge from "@/pages/admin/badge/addBadge";
import BadgeManagement from "@/pages/admin/badge/badgeManagement";
import ApplicantsTable from "@/pages/admin/candidate/candidate";
import AddCommunity from "@/pages/admin/community/addCommunity";
import AllCommunities from "@/pages/admin/community/communityManagement";
import AdminDailyReports from "@/pages/admin/dailyReport";
import DashboardAnalytics from "@/pages/admin/dashboard";
import AdminAttendanceView from "@/pages/admin/employee/attendance";
import CreateEmployee from "@/pages/admin/employee/createEmployee";
import EmployeeTable from "@/pages/admin/employee/employeeTable";
import AdminLeaveManagement from "@/pages/admin/employee/leaveManagement";
import AdminExpenses from "@/pages/admin/expense";
import Feedback from "@/pages/admin/feedback/feedback";
import GeneralQueries from "@/pages/admin/generalQueries";
import AdminHome from "@/pages/admin/home";
import CreateJob from "@/pages/admin/jobs/addJob";
import AllJobs from "@/pages/admin/jobs/all_jobs";
import ViewApplications from "@/pages/admin/jobs/viewApplication";
import AdminLoginWrapper from "@/pages/admin/login/adminLoginWrapper";
import AddMeetup from "@/pages/admin/meetups/addMeetup";
import Newsletter from "@/pages/admin/newsLetter";
import AdminNotification from "@/pages/admin/notification";
import ProductTable from "@/pages/admin/productTable";
import FreelancersTable from "@/pages/admin/professionalRecords/freelancers";
import PsychologistsTable from "@/pages/admin/professionalRecords/pychologists";
import AdminProfile from "@/pages/admin/profile";
import AddQuiz from "@/pages/admin/quiz/addQuiz";
import QuizTable from "@/pages/admin/quiz/quiz";
import RevenuePage from "@/pages/admin/revenuePage";
import Role from "@/pages/admin/roleSelection/role";
// import SalesAnalytics from "@/pages/admin/salesAnalytics/SalesAnalytics";
import AdminTaskDashboard from "@/pages/admin/taskSubmissions";
import Users from "@/pages/admin/users";
import ViewProduct from "@/pages/admin/viewProducts";
import AllWorkshops from "@/pages/admin/workshop/addWorkshop/allWorkshops";
import AllMeetups from "@/pages/admin/workshop/allMeetups/allMeetups";
import BplVerification from "@/pages/admin/workshop/BplVerification";
import AddWorkshopV3 from "@/pages/admin/workshop/v3/addWorkshop";
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
        <Route path="/login" element={<AdminLoginWrapper />} />
        <Route element={<AdminProtectedRoute />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="dashboard" element={<DashboardAnalytics />} />
          <Route path="users" element={<Users />} />

          {/*Products*/}
          <Route path="product-table" element={<ProductTable />} />
          <Route path="products/:productId" element={<ViewProduct />} />
          <Route path="add-products" element={<AddProduct />} />
          {/* <Route path="product-sales" element={<SalesAnalytics />} /> */}

          {/*Enquiry */}
          <Route path="workshop-enquiries" element={<GetWorkshopEnquiries />} />
          <Route path="enquiries/:enquiryId" element={<ViewEnquiry />} />
          <Route path="general-queries" element={<GeneralQueries />} />
          <Route path="session-enquiry" element={<AllottedCalls />} />
          <Route path="newsletter" element={<Newsletter />} />

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
          <Route path="add-workshop" element={<AddWorkshopV3 />} />
          <Route path="workshops" element={<AllWorkshops />} />
          <Route path="workshop-sessions" element={<WorkshopSessions />} />
          <Route path="bpl-verification" element={<BplVerification />} />

          {/*Meetup */}
          <Route path="add-meetup" element={<AddMeetup />} />
          <Route path="edit-meetup/:id" element={<AddMeetup />} />
          <Route path="meetups" element={<AllMeetups />} />
          <Route path="psychologists" element={<PsychologistsTable />} />
          <Route path="freelancers" element={<FreelancersTable />} />

          {/*Community Groups */}
          <Route path="/community" element={<AllCommunities />} />
          <Route path="/add-community" element={<AddCommunity />} />
          <Route path="/add-community/:id" element={<AddCommunity />} />

          {/*Badge */}
          <Route path="badge" element={<BadgeManagement />} />
          <Route path="add-badge" element={<AddNewBadge />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="notifications" element={<AdminNotification />} />
          <Route path="leave-management" element={<AdminLeaveManagement />} />
          <Route path="employee-attendance" element={<AdminAttendanceView />} />
          <Route path="add-quiz" element={<AddQuiz />} />
          <Route path="applicants" element={<ApplicantsTable />} />
          <Route path="quiz" element={<QuizTable />} />
          <Route
            path="workshop-sessions/:workshopId"
            element={<SinglePsychologistWorkshop />}
          />
          <Route path="reports-by-date" element={<AdminDailyReports />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="expense" element={<AdminExpenses />} />
        </Route>
        <Route path="/test" element={<Role />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRouter;
