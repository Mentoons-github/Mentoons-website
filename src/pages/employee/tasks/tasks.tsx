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
  Filter,
  Search,
  TrendingUp,
  Target,
  Zap,
  Sparkles,
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
    (state: RootState) => state.tasks,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    taskId: number,
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
          }),
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
              uploadFile({ file: attachment.file, getToken }),
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
          }),
        );

        if (uploadedAttachments.length === 0) {
          showStatus(
            "error",
            "Please attach the completed task file before submitting.",
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
          }),
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
          gradient: "from-emerald-500 to-green-600",
        };
      case "in-progress":
        return {
          bg: "bg-blue-500",
          text: "text-white",
          lightBg: "bg-blue-50",
          lightText: "text-blue-700",
          icon: Clock,
          gradient: "from-blue-500 to-indigo-600",
        };
      case "overdue":
        return {
          bg: "bg-red-500",
          text: "text-white",
          lightBg: "bg-red-50",
          lightText: "text-red-700",
          icon: AlertTriangle,
          gradient: "from-red-500 to-rose-600",
        };
      default:
        return {
          bg: "bg-amber-500",
          text: "text-white",
          lightBg: "bg-amber-50",
          lightText: "text-amber-700",
          icon: AlertCircle,
          gradient: "from-amber-500 to-orange-600",
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          color: "bg-rose-500",
          ring: "ring-rose-200",
          text: "High",
          glow: "shadow-rose-200",
        };
      case "medium":
        return {
          color: "bg-orange-500",
          ring: "ring-orange-200",
          text: "Medium",
          glow: "shadow-orange-200",
        };
      default:
        return {
          color: "bg-slate-400",
          ring: "ring-slate-200",
          text: "Low",
          glow: "shadow-slate-200",
        };
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
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
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
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "overdue"
        ? task.status === "overdue" ||
          (task.status !== "completed" && new Date(task.deadline) < new Date())
        : task.status === filterStatus);

    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
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
          (t.status !== "completed" && new Date(t.deadline) < new Date()),
      ).length || 0,
  };

  const completionRate = tasks?.length
    ? Math.round((statusCounts.completed / tasks.length) * 100)
    : 0;

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
          className={`px-3 py-1.5 mx-1 rounded-lg text-sm font-medium transition-all
            ${
              i === currentPage
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
            }
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    My Tasks
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Stay productive and organized
                    {selectedDate && (
                      <span className="ml-2 text-blue-600 font-medium">
                        • {new Date(selectedDate).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium mb-1">
                        Total Tasks
                      </p>
                      <p className="text-3xl font-bold">{statusCounts.all}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium mb-1">
                        Completion
                      </p>
                      <p className="text-3xl font-bold">{completionRate}%</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white shadow-lg col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium mb-1">
                        Overdue
                      </p>
                      <p className="text-3xl font-bold">
                        {statusCounts.overdue}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className={`p-3 rounded-xl transition-all shadow-lg ${
                  isRefreshing
                    ? "bg-blue-100 text-blue-600 cursor-wait"
                    : "bg-white text-slate-600 hover:bg-blue-50 hover:shadow-xl hover:scale-105"
                }`}
                title="Refresh tasks"
              >
                <RotateCcw
                  className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all shadow-lg ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200 scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all shadow-lg ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200 scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks by title or description..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  showFilters
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-3 mb-4">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-700">
                    Filter by Date:
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateFilterChange(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />

                  <button
                    onClick={handleTodayFilter}
                    className={`px-6 py-2.5 rounded-xl transition-all font-semibold ${
                      selectedDate === todayStr
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Today
                  </button>

                  <button
                    onClick={handleClearDateFilter}
                    className={`px-6 py-2.5 rounded-xl transition-all font-semibold ${
                      !selectedDate
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Tasks
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {Object.entries(statusCounts).map(([status, count]) => {
              const statusConfig = getStatusConfig(status);
              const StatusIcon = statusConfig.icon;

              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`p-4 rounded-2xl transition-all transform hover:scale-105 ${
                    filterStatus === status
                      ? `bg-gradient-to-br ${statusConfig.gradient} text-white shadow-xl scale-105`
                      : "bg-white hover:shadow-lg border-2 border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <StatusIcon
                      className={`w-5 h-5 ${
                        filterStatus === status
                          ? "text-white"
                          : statusConfig.lightText
                      }`}
                    />
                    <span
                      className={`text-2xl font-bold ${
                        filterStatus === status ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      filterStatus === status
                        ? "text-white/90"
                        : "text-gray-600"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() +
                      status.slice(1).replace("-", " ")}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {loading && !tasks && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-slate-700 font-semibold text-lg">
                Loading your tasks...
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Please wait a moment
              </p>
            </div>
          </div>
        )}

        {!loading && (!tasks || tasks.length === 0) && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {selectedDate ? "No tasks for this date" : "All caught up!"}
              </h3>
              <p className="text-slate-600 text-lg mb-6">
                {selectedDate
                  ? `No tasks found for ${new Date(
                      selectedDate,
                    ).toLocaleDateString()}`
                  : "Great job! You have no pending tasks at the moment."}
              </p>
              {selectedDate && (
                <button
                  onClick={handleClearDateFilter}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                >
                  View All Tasks
                </button>
              )}
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
                    className={`group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 transform hover:-translate-y-1 ${
                      isOverdue
                        ? "border-red-400 bg-gradient-to-br from-red-50/50 to-white"
                        : task.status === "completed"
                          ? "border-green-400 bg-gradient-to-br from-green-50/50 to-white"
                          : "border-blue-200 hover:border-blue-300"
                    }`}
                  >
                    <div
                      className={`h-2 bg-gradient-to-r ${priorityConfig.color} relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>

                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white ${priorityConfig.color} shadow-lg ${priorityConfig.glow} flex items-center gap-1.5`}
                      >
                        <Flag className="w-3 h-3" />
                        {priorityConfig.text}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 pr-20 leading-tight group-hover:text-blue-600 transition-colors">
                          {task.title}
                        </h3>
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                            statusConfig.lightBg
                          } ${statusConfig.lightText} border-2 ${
                            isOverdue
                              ? "border-red-300 shadow-lg shadow-red-100"
                              : task.status === "completed"
                                ? "border-green-300 shadow-lg shadow-green-100"
                                : "border-transparent"
                          }`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {task.status.charAt(0).toUpperCase() +
                            task.status.slice(1).replace("-", " ")}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 mb-4 border border-slate-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              Deadline
                            </div>
                            <div className="font-bold text-gray-900">
                              {new Date(task.deadline).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </div>
                            <div
                              className={`text-xs font-bold ${
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

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                              <User className="w-4 h-4 text-purple-600" />
                              Assigned
                            </div>
                            <div className="font-bold text-gray-900 truncate">
                              {task.assignedTo?.name}
                            </div>
                            <div className="text-xs text-slate-600">
                              {task.status === "completed"
                                ? "✓ Completed"
                                : "In Progress"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                          {task.description}
                        </p>
                      </div>

                      {task.attachments && task.attachments.length > 0 && (
                        <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FileCheck className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-bold text-green-900">
                                {task.attachments.length} File
                                {task.attachments.length > 1 ? "s" : ""}{" "}
                                Submitted
                              </span>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="space-y-2">
                            {task.attachments.slice(0, 2).map((file, index) => (
                              <a
                                key={index}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-green-700 hover:text-green-900 bg-white px-3 py-2 rounded-lg hover:shadow-md transition-all group"
                              >
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                  {getFileIcon(file.name)}
                                </div>
                                <span className="truncate font-medium flex-1">
                                  {file.name}
                                </span>
                              </a>
                            ))}
                            {task.attachments.length > 2 && (
                              <div className="text-sm text-green-600 font-semibold pl-3">
                                +{task.attachments.length - 2} more file
                                {task.attachments.length - 2 > 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {task.submissionFailureReason && (
                        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <h4 className="text-sm font-bold text-red-900">
                              Failure Reason
                            </h4>
                          </div>
                          <p className="text-sm text-red-800 leading-relaxed">
                            {task.submissionFailureReason}
                          </p>
                        </div>
                      )}

                      {!task.submissionFailureReason &&
                        task.status !== "completed" && (
                          <div className="space-y-3">
                            {isOverdue || task.status === "overdue" ? (
                              <>
                                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-red-100 to-rose-100 rounded-xl border border-red-200">
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
                                  className="w-full p-4 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm outline-none resize-none h-24"
                                />
                                <button
                                  onClick={() =>
                                    handleCompleteTask(task.id, true)
                                  }
                                  disabled={
                                    uploadingTask === task.id ||
                                    !failureReason.trim()
                                  }
                                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-200 transition-all disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed disabled:shadow-none font-bold"
                                >
                                  {uploadingTask === task.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>
                                      <span>Submitting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-5 h-5" />
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
                                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-200 transition-all font-semibold">
                                      <Upload className="w-5 h-5" />
                                      <span>Upload Files</span>
                                    </div>
                                  </label>

                                  <button
                                    onClick={() => {
                                      setShowLinkInput(!showLinkInput);
                                      setSelectedTask(task.id);
                                    }}
                                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-purple-200 transition-all"
                                  >
                                    <Link className="w-5 h-5" />
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
                                      className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm outline-none"
                                    />
                                    <button
                                      onClick={() => handleAddLink(task.id)}
                                      className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
                                    >
                                      Add
                                    </button>
                                  </div>
                                )}

                                {selectedTask === task.id &&
                                  attachments.length > 0 && (
                                    <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200">
                                      <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-bold text-slate-900">
                                          Files Ready ({attachments.length}/
                                          {MAX_FILES})
                                        </p>
                                      </div>
                                      <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {attachments.map((att) => (
                                          <div
                                            key={att.id}
                                            className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 hover:shadow-md transition-all"
                                          >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                              <div className="flex-shrink-0">
                                                {att.type === "link" ? (
                                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                                                    <Link className="w-5 h-5 text-purple-600" />
                                                  </div>
                                                ) : (
                                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                                    {getFileIcon(att.name)}
                                                  </div>
                                                )}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 truncate">
                                                  {att.name}
                                                </p>
                                                {att.size && (
                                                  <p className="text-xs text-slate-500">
                                                    {formatFileSize(att.size)}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                            <button
                                              onClick={() =>
                                                removeAttachment(att.id)
                                              }
                                              className="ml-2 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                              <X className="w-4 h-4 text-red-500" />
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
                                  className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-xl hover:shadow-emerald-200 transition-all disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed disabled:shadow-none font-bold text-base"
                                >
                                  {uploadingTask === task.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>
                                      <span>Submitting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-5 h-5" />
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

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400">
                          Created on{" "}
                          {new Date(task.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                <div className="text-sm text-gray-700 font-medium">
                  Showing{" "}
                  <span className="font-bold text-blue-600">
                    {(currentPage - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-blue-600">
                    {Math.min(currentPage * pagination.limit, pagination.total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900">
                    {pagination.total}
                  </span>{" "}
                  tasks
                </div>

                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2
                      ${
                        currentPage === 1 || loading
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white border-2 border-gray-200 hover:border-transparent shadow-md hover:shadow-lg"
                      }
                    `}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  <div className="hidden sm:flex">{renderPageNumbers()}</div>

                  <div className="sm:hidden px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg">
                    {currentPage} / {pagination.totalPages}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages || loading}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2
                      ${
                        currentPage === pagination.totalPages || loading
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white border-2 border-gray-200 hover:border-transparent shadow-md hover:shadow-lg"
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
