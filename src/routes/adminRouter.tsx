import AdminLayout from "@/layout/admin/layout";
import AddEditEmployeePage from "@/pages/admin/addEmployee";
import AddProduct from "@/pages/admin/addProduct";
import AllottedCalls from "@/pages/admin/allottedCalls";
import DashboardAnalytics from "@/pages/admin/dashboard";
import EmployeeTable from "@/pages/admin/employee/employeeTable";
import TaskAssignmentSystem from "@/pages/admin/employeeTask";
import GeneralQueries from "@/pages/admin/generalQueries";
import AdminLoginWrapper from "@/pages/admin/login/adminLoginWrapper";
import Newsletter from "@/pages/admin/newsLetter";
import ProductSalesDashboard from "@/pages/admin/productSales";
import ProductTable from "@/pages/admin/productTable";
import AdminTaskDashboard from "@/pages/admin/taskSubmissions";
import Users from "@/pages/admin/users";
import ViewProduct from "@/pages/admin/viewProducts";
import ViewEnquiry from "@/pages/admin/workshop/viewEnquiry";
import GetWorkshopEnquiries from "@/pages/admin/workshop/workshopEnquiries";
import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const AdminRouter = () => {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Routes>
        <Route path="/login" element={<AdminLoginWrapper />} />
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardAnalytics />} />
          <Route path="users" element={<Users />} />
          <Route path="allotted-calls" element={<AllottedCalls />} />
          <Route path="product-table" element={<ProductTable />} />
          <Route path="products/:productId" element={<ViewProduct />} />
          <Route path="add-products" element={<AddProduct />} />
          <Route path="workshop-enquiries" element={<GetWorkshopEnquiries />} />
          <Route path="enquiries/:enquiryId" element={<ViewEnquiry />} />
          <Route path="general-queries" element={<GeneralQueries />} />
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="task-assign" element={<TaskAssignmentSystem />} />
          <Route path="product-sales" element={<ProductSalesDashboard />} />
          <Route path="employee/add" element={<AddEditEmployeePage />} />
          <Route path="employee-table" element={<EmployeeTable />} />
          <Route path="task-submissions" element={<AdminTaskDashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRouter;
