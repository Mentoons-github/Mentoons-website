import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import {
  Attachment,
  fetchTasks,
  submitTask,
  Task,
} from "@/redux/admin/task/taskApi";
import { uploadFile } from "@/redux/fileUploadSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useStatusModal } from "@/context/adda/statusModalContext";
import {
  Upload,
  X,
  FileText,
  Image,
  Video,
  CheckCircle,
  Clock,
  AlertCircle,
  Link,
  Calendar,
  User,
  Send,
  LayoutGrid,
  List,
  AlertTriangle,
  RotateCcw,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flag,
  FileCheck,
} from "lucide-react";

interface FileAttachment {
  id: string;
  file?: File;
  url?: string;
  type: "file" | "link";
  name: string;
  size?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const Tasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const { loading, error, tasks } = useSelector(
    (state: RootState) => state.tasks
  );

  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [failureReason, setFailureReason] = useState("");
  const [uploadingTask, setUploadingTask] = useState<number | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const { showStatus } = useStatusModal();

  const MAX_FILES = 10;
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  const loadTasks = async (date?: string, page?: number) => {
    const token = await getToken();
    if (!token) {
      showStatus("error", "Authentication error. Please log in again.");
      return;
    }

    const params: any = { token, page: page || currentPage, limit };
    if (date) params.date = date;

    const result = await dispatch(fetchTasks(params)).unwrap();
    if (result.pagination) {
      setPagination(result.pagination);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    setCurrentPage(1);
    loadTasks(today, 1);
  }, [dispatch, getToken, showStatus]);

  useEffect(() => {
    if (error) {
      showStatus("error", error);
    }
  }, [error, showStatus]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    const token = await getToken();
    if (!token) {
      showStatus("error", "Authentication error. Please log in again.");
      setIsRefreshing(false);
      return;
    }

    try {
      const dateToUse = selectedDate || new Date().toISOString().split("T")[0];
      const params: any = { token, page: currentPage, limit };
      if (dateToUse) params.date = dateToUse;

      const result = await dispatch(fetchTasks(params)).unwrap();
      if (result.pagination) {
        setPagination(result.pagination);
      }
      showStatus("success", "Tasks refreshed successfully!");
    } catch (err) {
      showStatus("error", "Failed to refresh tasks. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDateFilterChange = async (date: string) => {
    setSelectedDate(date);
    setCurrentPage(1);
    if (date) {
      await loadTasks(date, 1);
    } else {
      await loadTasks(undefined, 1);
    }
  };

  const handleTodayFilter = async () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    setCurrentPage(1);
    await loadTasks(today, 1);
  };

  const handleClearDateFilter = async () => {
    setSelectedDate("");
    setCurrentPage(1);
    await loadTasks(undefined, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && !loading) {
      setCurrentPage(newPage);
      loadTasks(selectedDate || undefined, newPage);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    taskId: number
  ) => {
    const files = Array.from(e.target.files || []);

    if (attachments.length + files.length > MAX_FILES) {
      showStatus("error", `Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        showStatus("error", `${file.name} exceeds 50MB limit`);
        return false;
      }
      return true;
    });

    const newAttachments: FileAttachment[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: "file",
      name: file.name,
      size: file.size,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    setSelectedTask(taskId);
  };

  const handleAddLink = (taskId: number) => {
    if (!linkInput.trim()) {
      showStatus("error", "Please enter a valid link");
      return;
    }

    if (attachments.length >= MAX_FILES) {
      showStatus("error", `Maximum ${MAX_FILES} attachments allowed`);
      return;
    }

    const newLink: FileAttachment = {
      id: Math.random().toString(36).substr(2, 9),
      url: linkInput,
      type: "link",
      name: linkInput,
    };

    setAttachments((prev) => [...prev, newLink]);
    setSelectedTask(taskId);
    setLinkInput("");
    setShowLinkInput(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleCompleteTask = async (taskId: number, isOverdue: boolean) => {
    const token = await getToken();
    if (!token) {
      showStatus("error", "Authentication error. Please log in again.");
      return;
    }

    setUploadingTask(taskId);

    try {
      if (isOverdue) {
        if (!failureReason.trim()) {
          showStatus("error", "Please provide a submission failure reason.");
          setUploadingTask(null);
          return;
        }

        const resultAction = await dispatch(
          submitTask({
            taskId,
            attachments: [],
            status: "overdue",
            failureReason,
            token,
          })
        );

        if (submitTask.fulfilled.match(resultAction)) {
          setFailureReason("");
          setSelectedTask(null);
          setAttachments([]);
          showStatus("success", "Overdue task submitted with failure reason.");
          loadTasks(selectedDate || undefined, currentPage);
        } else {
          const errMsg =
            resultAction.payload || "Failed to submit overdue task.";
          showStatus("error", errMsg);
        }
      } else {
        const uploadedUrls: string[] = [];

        for (const attachment of attachments) {
          if (attachment.type === "file" && attachment.file) {
            const resultAction = await dispatch(
              uploadFile({ file: attachment.file, getToken })
            );

            if (uploadFile.fulfilled.match(resultAction)) {
              const uploadedUrl = resultAction.payload.data.fileDetails?.url;
              if (uploadedUrl) {
                uploadedUrls.push(uploadedUrl);
              }
            }
          } else if (attachment.type === "link" && attachment.url) {
            uploadedUrls.push(attachment.url);
          }
        }

        const uploadedAttachments: Attachment[] = uploadedUrls.map(
          (url, index) => ({
            id: index,
            name: attachments[index]?.name || `Link ${index + 1}`,
            url,
            uploadedAt: new Date().toISOString(),
          })
        );

        if (uploadedAttachments.length === 0) {
          showStatus(
            "error",
            "Please attach the completed task file before submitting."
          );
          setUploadingTask(null);
          return;
        }

        const resultAction = await dispatch(
          submitTask({
            taskId,
            attachments: uploadedAttachments,
            status: "completed",
            token,
          })
        );

        if (submitTask.fulfilled.match(resultAction)) {
          setAttachments([]);
          setSelectedTask(null);
          showStatus("success", "Task completed successfully");
          loadTasks(selectedDate || undefined, currentPage);
        } else {
          const errMsg =
            resultAction.payload ||
            "Failed to complete task. Please try again.";
          showStatus("error", errMsg);
        }
      }
    } catch (err) {
      showStatus("error", "Failed to submit task");
    } finally {
      setUploadingTask(null);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")) {
      return <Image className="w-4 h-4" />;
    }
    if (["mp4", "avi", "mov", "wmv"].includes(ext || "")) {
      return <Video className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-emerald-500",
          text: "text-white",
          lightBg: "bg-emerald-50",
          lightText: "text-emerald-700",
          icon: CheckCircle,
        };
      case "in-progress":
        return {
          bg: "bg-blue-500",
          text: "text-white",
          lightBg: "bg-blue-50",
          lightText: "text-blue-700",
          icon: Clock,
        };
      case "overdue":
        return {
          bg: "bg-red-500",
          text: "text-white",
          lightBg: "bg-red-50",
          lightText: "text-red-700",
          icon: AlertTriangle,
        };
      default:
        return {
          bg: "bg-amber-500",
          text: "text-white",
          lightBg: "bg-amber-50",
          lightText: "text-amber-700",
          icon: AlertCircle,
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return { color: "bg-rose-500", ring: "ring-rose-200", text: "High" };
      case "medium":
        return {
          color: "bg-orange-500",
          ring: "ring-orange-200",
          text: "Medium",
        };
      default:
        return { color: "bg-slate-400", ring: "ring-slate-200", text: "Low" };
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffMs < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        text: `${overdueDays}d overdue`,
        isUrgent: true,
        isOverdue: true,
      };
    }
    if (diffDays === 0) {
      return { text: `${diffHours}h left`, isUrgent: true, isOverdue: false };
    }
    if (diffDays === 1) {
      return { text: "Tomorrow", isUrgent: true, isOverdue: false };
    }
    if (diffDays <= 3) {
      return {
        text: `${diffDays} days left`,
        isUrgent: true,
        isOverdue: false,
      };
    }
    return { text: `${diffDays} days left`, isUrgent: false, isOverdue: false };
  };

  const filteredTasks = tasks?.filter((task) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "overdue")
      return (
        task.status === "overdue" ||
        (task.status !== "completed" && new Date(task.deadline) < new Date())
      );
    return task.status === filterStatus;
  });

  const isTaskOverdue = (task: Task) =>
    task.status !== "completed" && new Date(task.deadline) < new Date();

  const statusCounts = {
    all: tasks?.length || 0,
    pending: tasks?.filter((t) => t.status === "pending").length || 0,
    "in-progress": tasks?.filter((t) => t.status === "in-progress").length || 0,
    completed: tasks?.filter((t) => t.status === "completed").length || 0,
    overdue:
      tasks?.filter(
        (t) =>
          t.status === "overdue" ||
          (t.status !== "completed" && new Date(t.deadline) < new Date())
      ).length || 0,
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisible - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={loading}
          className={`px-3 py-1.5 mx-1 rounded-lg text-sm font-medium transition-colors
            ${
              i === currentPage
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Tasks
              </h1>
              <p className="text-slate-600">
                Manage and complete your assigned tasks
                {selectedDate && (
                  <span className="ml-2 text-blue-600 font-medium">
                    (Due: {new Date(selectedDate).toLocaleDateString()})
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className={`p-3 rounded-xl transition-all ${
                  isRefreshing
                    ? "bg-blue-100 text-blue-600 cursor-wait"
                    : "bg-white text-slate-600 hover:bg-slate-50 hover:shadow-lg"
                }`}
                title="Refresh tasks"
              >
                <RotateCcw
                  className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">
                  Filter by Date:
                </span>
              </div>

              <div className="flex gap-2 flex-1 w-full sm:w-auto">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateFilterChange(e.target.value)}
                  className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />

                <button
                  onClick={handleTodayFilter}
                  className={`px-4 py-2 rounded-xl transition-colors font-medium ${
                    selectedDate === todayStr
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Today
                </button>

                <button
                  onClick={handleClearDateFilter}
                  className={`px-4 py-2 rounded-xl transition-colors font-medium ${
                    !selectedDate
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Tasks
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`p-4 rounded-2xl transition-all ${
                  filterStatus === status
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-200 scale-105"
                    : "bg-white hover:shadow-lg hover:scale-105"
                }`}
              >
                <div className="text-sm font-medium opacity-90 mb-1">
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("-", " ")}
                </div>
                <div className="text-3xl font-bold">{count}</div>
              </button>
            ))}
          </div>
        </div>

        {loading && !tasks && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Loading tasks...</p>
            </div>
          </div>
        )}

        {!loading && (!tasks || tasks.length === 0) && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedDate ? "No tasks for this date" : "All caught up!"}
              </h3>
              <p className="text-slate-600 mb-6">
                {selectedDate
                  ? `No tasks found for ${new Date(
                      selectedDate
                    ).toLocaleDateString()}`
                  : "No tasks assigned at the moment."}
              </p>
            </div>
          </div>
        )}

        {!loading && filteredTasks && filteredTasks.length > 0 && (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredTasks.map((task: Task) => {
                const statusConfig = getStatusConfig(task.status);
                const priorityConfig = getPriorityConfig(task.priority);
                const StatusIcon = statusConfig.icon;
                const isOverdue = isTaskOverdue(task);
                const timeRemaining = getTimeRemaining(task.deadline);

                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                      isOverdue
                        ? "border-red-500 bg-red-50/30"
                        : task.status === "completed"
                        ? "border-green-500 bg-green-50/20"
                        : "border-blue-200"
                    } group`}
                  >
                    {/* Priority & Status Header Bar */}
                    <div className={`h-3 ${priorityConfig.color} relative`}>
                      <div className="absolute top-0 right-0 px-3 py-0.5 bg-white/90 backdrop-blur-sm rounded-bl-lg text-[10px] font-bold uppercase tracking-wider text-gray-700">
                        {priorityConfig.text} Priority
                      </div>
                    </div>

                    <div className="p-5">
                      {/* Title & Status Row - Always Visible */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                            {task.title}
                          </h3>
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${
                              statusConfig.lightBg
                            } ${statusConfig.lightText} border-2 ${
                              isOverdue
                                ? "border-red-300"
                                : task.status === "completed"
                                ? "border-green-300"
                                : "border-transparent"
                            }`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {task.status.charAt(0).toUpperCase() +
                              task.status.slice(1).replace("-", " ")}
                          </div>
                        </div>
                        <Flag
                          className={`w-6 h-6 ${
                            priorityConfig.color === "bg-rose-500"
                              ? "text-rose-500"
                              : priorityConfig.color === "bg-orange-500"
                              ? "text-orange-500"
                              : "text-slate-400"
                          }`}
                        />
                      </div>

                      {/* Quick Info Panel - Critical Details */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100">
                        <div className="grid grid-cols-2 gap-3">
                          {/* Deadline with countdown */}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span className="font-medium">Deadline</span>
                            </div>
                            <div className="font-bold text-sm text-gray-900">
                              {new Date(task.deadline).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            <div
                              className={`text-xs font-semibold mt-0.5 ${
                                timeRemaining.isOverdue
                                  ? "text-red-600"
                                  : timeRemaining.isUrgent
                                  ? "text-orange-600"
                                  : "text-green-600"
                              }`}
                            >
                              {timeRemaining.text}
                            </div>
                          </div>

                          {/* Assigned To */}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                              <User className="w-3.5 h-3.5" />
                              <span className="font-medium">Assigned To</span>
                            </div>
                            <div className="font-bold text-sm text-gray-900 truncate">
                              {task.assignedTo?.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {task.status === "completed"
                                ? "✓ Done"
                                : "In Progress"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description - Visible at first sight */}
                      <div className="mb-4">
                        <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                          {task.description}
                        </p>
                      </div>

                      {/* Attachments Status */}
                      {task.attachments && task.attachments.length > 0 && (
                        <div className="mb-4 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-bold text-green-900">
                                {task.attachments.length} File
                                {task.attachments.length > 1 ? "s" : ""}{" "}
                                Submitted
                              </span>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="mt-2 space-y-1">
                            {task.attachments.slice(0, 2).map((file, index) => (
                              <a
                                key={index}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-green-700 hover:text-green-900 bg-white px-2 py-1.5 rounded-lg hover:shadow transition-all"
                              >
                                {getFileIcon(file.name)}
                                <span className="truncate font-medium flex-1">
                                  {file.name}
                                </span>
                              </a>
                            ))}
                            {task.attachments.length > 2 && (
                              <div className="text-xs text-green-600 font-medium pl-2">
                                +{task.attachments.length - 2} more file
                                {task.attachments.length - 2 > 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {task.submissionFailureReason && (
                        <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <h4 className="text-xs font-bold text-red-900">
                              Failure Reason
                            </h4>
                          </div>
                          <p className="text-xs text-red-800 leading-relaxed">
                            {task.submissionFailureReason}
                          </p>
                        </div>
                      )}

                      {/* Action Section */}
                      {!task.submissionFailureReason &&
                        task.status !== "completed" && (
                          <div className="space-y-3">
                            {isOverdue || task.status === "overdue" ? (
                              <>
                                <div className="flex items-center gap-2 p-2 bg-red-100 rounded-lg">
                                  <AlertTriangle className="w-5 h-5 text-red-600" />
                                  <h4 className="text-sm font-bold text-red-900">
                                    Explain Why Task is Overdue
                                  </h4>
                                </div>
                                <textarea
                                  value={failureReason}
                                  onChange={(e) =>
                                    setFailureReason(e.target.value)
                                  }
                                  placeholder="Explain why the task could not be completed on time..."
                                  className="w-full p-3 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm outline-none resize-none h-20"
                                />
                                <button
                                  onClick={() =>
                                    handleCompleteTask(task.id, true)
                                  }
                                  disabled={
                                    uploadingTask === task.id ||
                                    !failureReason.trim()
                                  }
                                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-200 transition-all disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed disabled:shadow-none font-bold text-sm"
                                >
                                  {uploadingTask === task.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                      <span>Submitting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-4 h-4" />
                                      <span>Submit Reason</span>
                                    </>
                                  )}
                                </button>
                              </>
                            ) : (
                              <>
                                <div className="flex gap-2">
                                  <label className="flex-1 cursor-pointer">
                                    <input
                                      type="file"
                                      multiple
                                      onChange={(e) =>
                                        handleFileSelect(e, task.id)
                                      }
                                      className="hidden"
                                      accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                                    />
                                    <div className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all font-semibold text-sm">
                                      <Upload className="w-4 h-4" />
                                      <span>Upload</span>
                                    </div>
                                  </label>

                                  <button
                                    onClick={() => {
                                      setShowLinkInput(!showLinkInput);
                                      setSelectedTask(task.id);
                                    }}
                                    className="px-3 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all"
                                  >
                                    <Link className="w-4 h-4" />
                                  </button>
                                </div>

                                {showLinkInput && selectedTask === task.id && (
                                  <div className="flex gap-2 animate-in slide-in-from-top-2">
                                    <input
                                      type="url"
                                      value={linkInput}
                                      onChange={(e) =>
                                        setLinkInput(e.target.value)
                                      }
                                      placeholder="https://example.com/file"
                                      className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm outline-none"
                                    />
                                    <button
                                      onClick={() => handleAddLink(task.id)}
                                      className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm font-semibold"
                                    >
                                      Add
                                    </button>
                                  </div>
                                )}

                                {selectedTask === task.id &&
                                  attachments.length > 0 && (
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-bold text-slate-900">
                                          Files Ready ({attachments.length}/
                                          {MAX_FILES})
                                        </p>
                                      </div>
                                      <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {attachments.map((att) => (
                                          <div
                                            key={att.id}
                                            className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200"
                                          >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                              <div className="flex-shrink-0">
                                                {att.type === "link" ? (
                                                  <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <Link className="w-3.5 h-3.5 text-purple-600" />
                                                  </div>
                                                ) : (
                                                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    {getFileIcon(att.name)}
                                                  </div>
                                                )}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-900 truncate">
                                                  {att.name}
                                                </p>
                                                {att.size && (
                                                  <p className="text-[10px] text-slate-500">
                                                    {formatFileSize(att.size)}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                            <button
                                              onClick={() =>
                                                removeAttachment(att.id)
                                              }
                                              className="ml-2 p-1 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                              <X className="w-3.5 h-3.5 text-red-500" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                <button
                                  onClick={() =>
                                    handleCompleteTask(task.id, false)
                                  }
                                  disabled={
                                    uploadingTask === task.id ||
                                    (selectedTask === task.id &&
                                      attachments.length === 0)
                                  }
                                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-xl hover:shadow-emerald-200 transition-all disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed disabled:shadow-none font-bold text-sm"
                                >
                                  {uploadingTask === task.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                      <span>Submitting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-4 h-4" />
                                      <span>
                                        {selectedTask === task.id &&
                                        attachments.length === 0
                                          ? "Add Files First"
                                          : "Complete Task"}
                                      </span>
                                    </>
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        )}

                      {/* Footer with created date */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400">
                          Created on{" "}
                          {new Date(task.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 bg-white p-4 rounded-2xl shadow-sm">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-bold text-blue-600">
                    {(currentPage - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-blue-600">
                    {Math.min(currentPage * pagination.limit, pagination.total)}
                  </span>{" "}
                  of <span className="font-bold">{pagination.total}</span> tasks
                </div>

                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1
                      ${
                        currentPage === 1 || loading
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 hover:border-blue-300"
                      }
                    `}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  <div className="hidden sm:flex">{renderPageNumbers()}</div>

                  <div className="sm:hidden px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">
                    {currentPage} / {pagination.totalPages}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages || loading}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1
                      ${
                        currentPage === pagination.totalPages || loading
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 hover:border-blue-300"
                      }
                    `}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tasks;
