import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  Download,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { AppDispatch, RootState } from "@/redux/store";
import {
  assignTask,
  extendTask,
  fetchTasks,
  NewTask,
  Task,
  deleteTask,
  removeImage,
  updateTaskStatus,
} from "@/redux/admin/task/taskApi";
import { getEmployees } from "@/redux/admin/employee/api";
import { clearError } from "@/redux/admin/task/taskSlice";
import { useStatusModal } from "@/context/adda/statusModalContext";

const TaskAssignmentSystem: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const { user } = useUser();
  const reduxTaskState = useSelector((state: RootState) => state.tasks);
  const reduxEmployeeState = useSelector((state: RootState) => state.employee);

  const employees = Array.isArray(reduxEmployeeState.employees)
    ? reduxEmployeeState.employees
    : [];
  const tasks = Array.isArray(reduxTaskState.tasks) ? reduxTaskState.tasks : [];
  const { loading: taskLoading, error: taskError } = reduxTaskState;
  const { loading: employeeLoading, error: employeeError } = reduxEmployeeState;
  const loading = taskLoading || employeeLoading;
  const error = taskError || employeeError;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(
    null
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showExtendStatusModal, setShowExtendStatusModal] = useState(false);
  const [extendStatusMessage, setExtendStatusMessage] = useState<string>("");
  const [extendStatusSuccess, setExtendStatusSuccess] = useState<boolean>(true);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "medium",
  });
  const [extendTaskId, setExtendTaskId] = useState<string | null>(null);
  const [newDeadline, setNewDeadline] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const { showStatus } = useStatusModal();

  // === Data Fetching ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          showStatus("error", "Authentication error. Please log in again.");
          return;
        }
        await dispatch(
          getEmployees({
            sortOrder: "asc",
            searchTerm: "",
            page: 1,
            limit: 100,
          })
        );
        await dispatch(fetchTasks({ token }));
      } catch (err) {
        console.error("Failed to fetch data:", err);
        showStatus("error", "Failed to fetch data. Please try again.");
      }
    };
    fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [dispatch, getToken]);

  useEffect(() => {
    if (user) {
      setNewTask((prev) => ({ ...prev, assignedBy: user.id }));
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      showStatus("error", error);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch, showStatus]);

  // === Helper Functions ===
  const getAvatar = (role?: string): string => {
    switch (role?.toLowerCase()) {
      case "developer":
        return "Developer";
      case "illustrator":
        return "Illustrator";
      case "designer":
        return "Designer";
      default:
        return "User";
    }
  };

  const uniqueDepartments = Array.from(
    new Set(employees.map((emp) => emp.department))
  ).sort();
  const filteredEmployees = selectedDepartment
    ? employees.filter((emp) => emp.department === selectedDepartment)
    : employees;

  const isImage = (name: string): boolean => {
    const ext = name.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "");
  };

  const getAttachmentIcon = (name: string, isLink: boolean = false) => {
    if (isLink) return <LinkIcon className="w-5 h-5 text-blue-500" />;

    const ext = name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")) {
      return <Image className="w-5 h-5 text-gray-500" />;
    }
    if (["mp4", "avi", "mov", "wmv"].includes(ext || "")) {
      return <Video className="w-5 h-5 text-gray-500" />;
    }
    if (["pdf", "doc", "docx", "txt"].includes(ext || "")) {
      return <FileText className="w-5 h-5 text-gray-500" />;
    }
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
    }
  };

  const isOverdue = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    return deadlineDate < new Date() && !isNaN(deadlineDate.getTime());
  };

  const handleDownloadImage = (imageUrl: string, imageName: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageName || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // === Task Actions ===
  const handleCreateTask = async () => {
    if (newTask.title && newTask.assignedTo && newTask.deadline) {
      try {
        const token = await getToken();
        if (!token) {
          showStatus("error", "Authentication error. Please log in again.");
          return;
        }
        await dispatch(assignTask({ taskData: newTask, token })).unwrap();
        await dispatch(fetchTasks({ token }));
        setNewTask({
          title: "",
          description: "",
          assignedTo: "",
          deadline: "",
          priority: "medium",
        });
        setSelectedDepartment("");
        setShowSuccessModal(true);
      } catch (err) {
        showStatus("error", "Failed to create task. Please try again.");
      }
    } else {
      showStatus("error", "Please fill in all required fields.");
    }
  };

  const handleExtendTask = async (taskId: string, newDeadline: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication error.");
      await dispatch(
        extendTask({ id: taskId, token, newDeadLine: newDeadline })
      ).unwrap();
      await dispatch(fetchTasks({ token }));
      setExtendStatusMessage("Task deadline extended successfully!");
      setExtendStatusSuccess(true);
      setShowExtendStatusModal(true);
    } catch (err: any) {
      const message =
        err.response?.status === 401
          ? "Unauthorized: Please log in as an admin"
          : err.response?.status === 403
          ? "Forbidden: Admin access required"
          : "Failed to extend task deadline";
      setExtendStatusMessage(message);
      setExtendStatusSuccess(false);
      setShowExtendStatusModal(true);
    } finally {
      setExtendTaskId(null);
      setNewDeadline("");
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dept = e.target.value;
    setSelectedDepartment(dept);
    setNewTask((prev) => ({ ...prev, assignedTo: "" }));
  };

  const handleDeleteTask = (taskId: number) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete !== null) {
      try {
        const token = await getToken();
        if (!token) {
          showStatus("error", "Authentication error.");
          return;
        }
        await dispatch(deleteTask({ taskId: taskToDelete, token })).unwrap();
        await dispatch(fetchTasks({ token }));
        setShowDeleteConfirmModal(false);
        setShowDeleteSuccessModal(true);
        setTaskToDelete(null);
      } catch (err) {
        showStatus("error", "Failed to delete task.");
        setShowDeleteConfirmModal(false);
        setTaskToDelete(null);
      }
    }
  };

  const handleUpdateTaskStatus = async (
    taskId: number,
    status: Task["status"]
  ) => {
    try {
      const token = await getToken();
      if (!token) {
        showStatus("error", "Authentication error.");
        return;
      }
      await dispatch(updateTaskStatus({ id: taskId, status, token })).unwrap();
      await dispatch(fetchTasks({ token }));
    } catch (err) {
      showStatus("error", "Failed to update task status.");
    }
  };

  const handleRemoveImage = async (taskId: number, imageId: number) => {
    try {
      const token = await getToken();
      if (!token) {
        showStatus("error", "Authentication error.");
        return;
      }
      await dispatch(removeImage({ taskId, imageId, token })).unwrap();
      await dispatch(fetchTasks({ token }));
    } catch (err) {
      showStatus("error", "Failed to remove image.");
    }
  };

  // === Loading State ===
  if (loading && tasks.length === 0 && employees.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-yellow-50 to-amber-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-orange-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // === Main Render ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-amber-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-4 shadow-lg">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Task Assignment System
          </h1>
        </div>

        {/* Error Alert */}
        {error && error !== "Request failed with status code 500" && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={() => dispatch(clearError())}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        {showSuccessModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Task Created Successfully!
              </h2>
              <p className="text-center text-gray-600 mb-6">
                The task has been assigned and added to the task list.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showDeleteConfirmModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirmModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center mb-4">
                <Trash2 className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Delete Task?
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={confirmDeleteTask}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-all transform hover:scale-105 shadow-lg"
                >
                  No, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteSuccessModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteSuccessModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Task Deleted Successfully!
              </h2>
              <p className="text-center text-gray-600 mb-6">
                The task has been removed from the task list.
              </p>
              <button
                onClick={() => setShowDeleteSuccessModal(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showExtendStatusModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExtendStatusModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center mb-4">
                {extendStatusSuccess ? (
                  <CheckCircle className="w-12 h-12 text-green-500" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-red-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                {extendStatusSuccess ? "Success" : "Error"}
              </h2>
              <p className="text-center text-gray-600 mb-6">
                {extendStatusMessage}
              </p>
              <button
                onClick={() => setShowExtendStatusModal(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div
          className={`grid gap-8 ${
            tasks.length === 0
              ? "grid-cols-1 max-w-2xl mx-auto"
              : "grid-cols-1 lg:grid-cols-3"
          }`}
        >
          {/* Task Creation Form */}
          <div className={tasks.length === 0 ? "" : "lg:col-span-1"}>
            <div
              className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden ${
                tasks.length > 0 ? "sticky top-6" : ""
              }`}
            >
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Plus className="w-6 h-6" /> Create New Task
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assigned By
                  </label>
                  <input
                    type="text"
                    value={
                      user?.fullName ||
                      `${user?.firstName || ""} ${
                        user?.lastName || ""
                      }`.trim() ||
                      user?.username ||
                      ""
                    }
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                    placeholder="Task description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department (Optional)
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    disabled={employeeLoading}
                  >
                    <option value="">All Departments</option>
                    {uniqueDepartments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign to *
                  </label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) =>
                      setNewTask({ ...newTask, assignedTo: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    disabled={employeeLoading || filteredEmployees.length === 0}
                  >
                    <option value="">Select employee</option>
                    {filteredEmployees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {getAvatar(emp.role)} {emp.name} - {emp.role || "N/A"}
                      </option>
                    ))}
                  </select>
                  {filteredEmployees.length === 0 && selectedDepartment && (
                    <p className="text-xs text-gray-500 mt-1">
                      No employees in this department
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          priority: e.target.value as "low" | "medium" | "high",
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    value={newTask.deadline}
                    onChange={(e) =>
                      setNewTask({ ...newTask, deadline: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>

                <button
                  onClick={handleCreateTask}
                  disabled={
                    loading ||
                    !newTask.title ||
                    !newTask.assignedTo ||
                    !newTask.deadline
                  }
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </span>
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Task List */}
          {tasks.length > 0 && (
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Active Tasks ({tasks.length})
                  </h3>
                </div>

                <div className="grid gap-6">
                  {tasks
                    .filter((task) => task.id !== undefined)
                    .map((task) => {
                      const assignedTo = employees.find(
                        (emp) => emp._id === task.assignedTo?._id
                      );
                      const overdue = isOverdue(task.deadline);
                      const isCompleted = task.status === "completed";
                      const images = Array.isArray(task.attachments)
                        ? task.attachments
                        : [];

                      return (
                        <div
                          key={task.id}
                          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-gray-300 overflow-hidden hover:shadow-xl transition-all"
                        >
                          <div className="h-2 bg-gradient-to-r from-orange-400 to-amber-600" />
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-xl font-bold text-gray-800">
                                    {task.title}
                                  </h4>
                                  {getStatusIcon(task.status)}
                                </div>

                                {task.description && (
                                  <p className="text-gray-600 mb-3 leading-relaxed">
                                    {task.description}
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">
                                      {getAvatar(assignedTo?.role)}{" "}
                                      {assignedTo?.name || "Unknown"}
                                    </span>
                                    <span className="text-gray-400">
                                      ({assignedTo?.role || "User"})
                                    </span>
                                  </div>

                                  <div
                                    className={`flex items-center gap-2 text-sm ${
                                      overdue ? "text-red-600" : "text-gray-600"
                                    }`}
                                  >
                                    <Calendar className="w-4 h-4" />
                                    <span
                                      className={overdue ? "font-semibold" : ""}
                                    >
                                      {new Date(
                                        task.deadline
                                      ).toLocaleDateString()}{" "}
                                      at{" "}
                                      {new Date(
                                        task.deadline
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                    {overdue && (
                                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                                        OVERDUE
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {task.submissionFailureReason && (
                                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-sm text-red-800">
                                      <span className="font-semibold">
                                        Reason for Delay:
                                      </span>{" "}
                                      {task.submissionFailureReason}
                                    </p>
                                  </div>
                                )}

                                <div className="flex items-center gap-3 mb-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                                      task.priority
                                    )}`}
                                  >
                                    {task.priority.toUpperCase()} Priority
                                  </span>

                                  <select
                                    value={task.status}
                                    onChange={(e) =>
                                      handleUpdateTaskStatus(
                                        task.id,
                                        e.target.value as Task["status"]
                                      )
                                    }
                                    className="px-3 py-1 border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">
                                      In Progress
                                    </option>
                                    <option value="completed">Completed</option>
                                    <option value="overdue">Overdue</option>
                                  </select>
                                </div>

                                <div className="flex items-center gap-3">
                                  <input
                                    type="datetime-local"
                                    value={
                                      extendTaskId === task.id.toString()
                                        ? newDeadline
                                        : ""
                                    }
                                    onChange={(e) => {
                                      setExtendTaskId(task.id.toString());
                                      setNewDeadline(e.target.value);
                                    }}
                                    disabled={isCompleted}
                                    className={`px-3 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                                      isCompleted
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : ""
                                    }`}
                                  />
                                  <button
                                    onClick={() =>
                                      handleExtendTask(
                                        task.id.toString(),
                                        newDeadline
                                      )
                                    }
                                    disabled={
                                      isCompleted || !newDeadline || loading
                                    }
                                    className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Extend Deadline
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                  title="Delete Task"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {images.length > 0 && (
                              <div className="border-t border-gray-200 pt-4">
                                <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                  <Eye className="w-4 h-4" /> Submitted
                                  Attachments ({images.length})
                                </h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {images.map((attachment) => (
                                    <div
                                      key={attachment.id}
                                      className="relative group"
                                    >
                                      {isImage(attachment.name) ? (
                                        <div className="relative">
                                          <img
                                            src={attachment.url}
                                            alt={attachment.name}
                                            onClick={() => {
                                              setSelectedImage(attachment.url);
                                              setSelectedImageName(
                                                attachment.name
                                              );
                                            }}
                                            className="w-full h-20 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-orange-500 transition-all z-10"
                                            onError={() =>
                                              console.error(
                                                "Thumbnail failed:",
                                                attachment.url
                                              )
                                            }
                                          />
                                          <button
                                            onClick={() =>
                                              handleRemoveImage(
                                                task.id,
                                                attachment.id
                                              )
                                            }
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20"
                                          >
                                            ×
                                          </button>
                                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center z-0 pointer-events-none">
                                            <span className="text-white text-xs opacity-0 group-hover:opacity-100 text-center p-1 font-medium">
                                              {attachment.name}
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        <a
                                          href={attachment.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex flex-col items-center p-3 bg-gray-100 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-all relative"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {getAttachmentIcon(
                                            attachment.name,
                                            attachment.url.startsWith("http")
                                          )}
                                          <span className="text-xs text-gray-600 mt-2 truncate w-full text-center">
                                            {attachment.name}
                                          </span>
                                          <button
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleRemoveImage(
                                                task.id,
                                                attachment.id
                                              );
                                            }}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                          >
                                            ×
                                          </button>
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Image Preview Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
              onClick={() => {
                setSelectedImage(null);
                setSelectedImageName(null);
              }}
            >
              <div
                className="relative bg-white rounded-lg p-4 max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt={selectedImageName || "Preview"}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  onError={() => {
                    setSelectedImage(null);
                    setSelectedImageName(null);
                  }}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() =>
                      handleDownloadImage(
                        selectedImage,
                        selectedImageName || "image"
                      )
                    }
                    className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-all"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setSelectedImageName(null);
                    }}
                    className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-600 transition-all"
                    title="Close"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                {selectedImageName && (
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                    {selectedImageName}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskAssignmentSystem;
