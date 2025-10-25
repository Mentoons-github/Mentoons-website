import React, { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  User,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, extendTask } from "@/redux/admin/task/taskApi";
import { getEmployees } from "@/redux/admin/employee/api";
import { Task } from "@/redux/admin/task/taskApi";
import { useAuth } from "@clerk/clerk-react";
import TaskAssignModal from "@/components/admin/modal/taskAssignModel";
import {
  getStatusIcon,
  getDaysRemaining,
  getPriorityColor,
  getStatusColor,
  isImage,
} from "@/utils/task/admin/taskUtils";

type ViewMode = "all" | "recent" | "overdue";

const AdminTaskDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showStatus } = useStatusModal();
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading, tasks } = useSelector(
    (state: RootState) => state.tasks
  );
  const reduxEmployeeState = useSelector((state: RootState) => state.employee);
  const employees = Array.isArray(reduxEmployeeState.employees)
    ? reduxEmployeeState.employees
    : [];
  const { loading: employeeLoading } = reduxEmployeeState;

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [employeeFilter, setEmployeeFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"createdAt" | "submittedAt" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showExtendModal, setShowExtendModal] = useState<boolean>(false);
  const [extensionDays, setExtensionDays] = useState<number>(7);
  const [extending, setExtending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (!token) {
        showStatus("error", "Please login to view this page");
        setTimeout(() => navigate("/admin/login"), 2000);
        return;
      }

      try {
        await dispatch(
          getEmployees({
            sortOrder: "asc",
            searchTerm: "",
            page: 1,
            limit: 100,
          })
        );

        await dispatch(
          fetchTasks({
            token,
            employeeId: employeeFilter,
            date: dateFilter,
            sortBy,
            sortOrder,
            status: filterStatus === "all" ? undefined : filterStatus,
            searchTerm,
          })
        );
      } catch (err) {
        console.error("Failed to fetch data:", err);
        showStatus("error", "Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, [
    dispatch,
    showStatus,
    navigate,
    getToken,
    employeeFilter,
    dateFilter,
    sortBy,
    sortOrder,
    filterStatus,
    searchTerm,
  ]);

  // Filter tasks based on view mode
  const getFilteredTasks = () => {
    let filtered = tasks;

    if (viewMode === "recent") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = tasks.filter(
        (task) => new Date(task.createdAt) >= sevenDaysAgo
      );
    } else if (viewMode === "overdue") {
      filtered = tasks.filter((task) => task.status === "overdue");
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Calculate statistics
  const recentTasksCount = tasks.filter((task) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(task.createdAt) >= sevenDaysAgo;
  }).length;

  const overdueTasksCount = tasks.filter((t) => t.status === "overdue").length;

  const handleExtendDeadline = async (taskId: number, days: number) => {
    setExtending(true);
    const token = await getToken();
    if (!token) {
      showStatus("error", "Authentication error. Please log in again.");
      return;
    }
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const currentDueDate = new Date(task.deadline);
      currentDueDate.setHours(0, 0, 0, 0);

      const baseDate =
        currentDueDate < today ? new Date(today) : new Date(currentDueDate);
      baseDate.setDate(baseDate.getDate() + days);

      const newDeadline = baseDate.toISOString();

      await dispatch(
        extendTask({ id: taskId.toString(), token, newDeadLine: newDeadline })
      ).unwrap();
      await dispatch(
        fetchTasks({
          token,
          employeeId: employeeFilter,
          date: dateFilter,
          sortBy,
          sortOrder,
          status: filterStatus === "all" ? undefined : filterStatus,
          searchTerm,
        })
      );
      showStatus("success", `Task deadline extended successfully!`);
      setShowExtendModal(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("Failed to extend deadline:", err);
      showStatus("error", "Failed to extend deadline. Please try again.");
    } finally {
      setExtending(false);
    }
  };

  const handleResetFilters = () => {
    setEmployeeFilter("");
    setDateFilter("");
    setSortBy("");
    setSortOrder("asc");
    setFilterStatus("all");
    setSearchTerm("");
    setViewMode("all");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Task Management Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Monitor and manage employee tasks and submissions
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {tasks.length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {tasks.filter((t) => t.status === "completed").length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {tasks.filter((t) => t.status === "pending").length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div
            className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setViewMode("recent")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent (7d)</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">
                  {recentTasksCount}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div
            className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setViewMode("overdue")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {overdueTasksCount}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 sm:mb-8 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setViewMode("all")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                viewMode === "all"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setViewMode("recent")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                viewMode === "recent"
                  ? "bg-purple-50 text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Recently Added ({recentTasksCount})
            </button>
            <button
              onClick={() => setViewMode("overdue")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                viewMode === "overdue"
                  ? "bg-red-50 text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Overdue ({overdueTasksCount})
            </button>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tasks or employees..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>

              <select
                id="employeeFilter"
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={employeeLoading}
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sorting and Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex gap-3 w-full sm:w-auto">
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "createdAt" | "submittedAt" | ""
                    )
                  }
                  className="w-full sm:w-40 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No Sorting</option>
                  <option value="createdAt">Created Date</option>
                  <option value="submittedAt">Submitted Date</option>
                </select>

                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "asc" | "desc")
                  }
                  className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  New Task
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredTasks.map((task) => (
            <div key={task.id}>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </h3>
              <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="relative">
                  {task.attachments.length > 0 &&
                  isImage(task.attachments[0]) ? (
                    <img
                      src={task.attachments[0].url}
                      alt={task.attachments[0].name}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={() =>
                        console.error(
                          "Image failed to load:",
                          task.attachments[0].url
                        )
                      }
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div
                    className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority.toUpperCase()}
                  </div>
                  {task.status === "overdue" && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      OVERDUE
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{task.assignedTo?.name || "Unassigned"}</span>
                        {task.assignedTo?.role && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span>{task.assignedTo.role}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(task.status)}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Assigned By:</span>
                      <span className="font-medium">
                        {task.assignedBy?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Assigned:</span>
                      <span className="font-medium">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Due Date:</span>
                      <span
                        className={`font-medium ${
                          getDaysRemaining(task.deadline) < 0
                            ? "text-red-600"
                            : getDaysRemaining(task.deadline) <= 3
                            ? "text-yellow-600"
                            : "text-gray-900"
                        }`}
                      >
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Days Remaining:</span>
                      <span
                        className={`font-medium ${
                          getDaysRemaining(task.deadline) < 0
                            ? "text-red-600"
                            : getDaysRemaining(task.deadline) <= 3
                            ? "text-yellow-600"
                            : "text-gray-900"
                        }`}
                      >
                        {getDaysRemaining(task.deadline) < 0
                          ? `${Math.abs(
                              getDaysRemaining(task.deadline)
                            )} days overdue`
                          : `${getDaysRemaining(task.deadline)} days`}
                      </span>
                    </div>
                  </div>

                  {task.submissionFailureReason && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600">
                        <strong>Reason for Delay:</strong>{" "}
                        {task.submissionFailureReason}
                      </p>
                    </div>
                  )}

                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </button>

                    {task.status !== "completed" && (
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowExtendModal(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        <Calendar className="w-4 h-4" />
                        Extend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedTask && !showExtendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {selectedTask.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {selectedTask.assignedTo?.name || "Unassigned"} -{" "}
                      {selectedTask.assignedTo?.role || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {selectedTask.attachments.length > 0 &&
                isImage(selectedTask.attachments[0]) ? (
                  <img
                    src={selectedTask.attachments[0].url}
                    alt={selectedTask.attachments[0].name}
                    className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4"
                    onError={() =>
                      console.error(
                        "Image failed to load:",
                        selectedTask.attachments[0].url
                      )
                    }
                  />
                ) : (
                  <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4 flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-gray-300" />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {selectedTask.description || "No description"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">
                        Assigned By:
                      </span>
                      <p className="font-medium">
                        {selectedTask.assignedBy?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Role:</span>
                      <p className="font-medium">
                        {selectedTask.assignedTo?.role || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Assigned Date:
                      </span>
                      <p className="font-medium">
                        {new Date(selectedTask.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Due Date:</span>
                      <p className="font-medium">
                        {new Date(selectedTask.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Priority:</span>
                      <p className="font-medium">
                        {selectedTask.priority.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <p className="font-medium">
                        {selectedTask.status.replace("-", " ").toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {selectedTask.submissionFailureReason && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Reason for Delay
                      </h3>
                      <p className="text-gray-600 bg-red-50 p-3 rounded-lg text-sm">
                        {selectedTask.submissionFailureReason}
                      </p>
                    </div>
                  )}

                  {selectedTask.attachments.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Attachments
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedTask.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            {isImage(attachment) ? (
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-gray-500 text-xs">
                                  {attachment.name.split(".").pop()}
                                </span>
                              </div>
                            )}
                            <span className="text-sm text-gray-600 truncate">
                              {attachment.name}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t bg-gray-50 flex gap-3">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showExtendModal && selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-4 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Extend Deadline
                </h2>
                <p className="text-gray-600 text-sm">
                  Task: {selectedTask.title}
                </p>
                <p className="text-gray-600 text-sm">
                  Employee: {selectedTask.assignedTo?.name || "Unassigned"}
                </p>
                <p className="text-sm text-gray-500">
                  Current Due Date:{" "}
                  {new Date(selectedTask.deadline).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extension Period (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={extensionDays}
                      onChange={(e) =>
                        setExtensionDays(parseInt(e.target.value) || 0)
                      }
                      className="w-full p-2 sm:p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>New Due Date:</strong>{" "}
                      {(() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const currentDue = new Date(selectedTask.deadline);
                        currentDue.setHours(0, 0, 0, 0);

                        const baseDate =
                          currentDue < today
                            ? new Date(today)
                            : new Date(currentDue);
                        baseDate.setDate(baseDate.getDate() + extensionDays);
                        return baseDate.toLocaleDateString();
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t bg-gray-50 flex gap-3">
                <button
                  onClick={() =>
                    handleExtendDeadline(selectedTask.id, extensionDays)
                  }
                  disabled={extending}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    extending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  {extending ? "Extending..." : "Extend Deadline"}
                </button>

                <button
                  onClick={() => {
                    setShowExtendModal(false);
                    setSelectedTask(null);
                  }}
                  className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredTasks.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600 text-sm">
              {viewMode === "recent"
                ? "No tasks created in the last 7 days."
                : viewMode === "overdue"
                ? "No overdue tasks found."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        )}
      </div>
      <TaskAssignModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default AdminTaskDashboard;
