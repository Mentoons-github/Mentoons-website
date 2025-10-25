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
} from "lucide-react";

interface FileAttachment {
  id: string;
  file?: File;
  url?: string;
  type: "file" | "link";
  name: string;
  size?: number;
}

const Tasks: React.FC = () => {
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
  const { showStatus } = useStatusModal();

  const MAX_FILES = 10;
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  useEffect(() => {
    const loadTasks = async () => {
      const token = await getToken();
      if (!token) {
        console.error("No token found");
        showStatus("error", "Authentication error. Please log in again.");
        return;
      }
      await dispatch(fetchTasks({token}));
    };
    loadTasks();


    const interval = setInterval(loadTasks, 30000);
    return () => clearInterval(interval);
  }, [dispatch, getToken]);

  useEffect(() => {
    if (error) {
      showStatus("error", error);
    }
  }, [error]);

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
          await dispatch(fetchTasks({token}));
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
          await dispatch(fetchTasks({token}));
        } else {
          const errMsg =
            resultAction.payload ||
            "Failed to complete task. Please try again.";
          showStatus("error", errMsg);
        }
      }
    } catch (err) {
      console.error("Error submitting task:", err);
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
        return { color: "bg-rose-500", ring: "ring-rose-200" };
      case "medium":
        return { color: "bg-orange-500", ring: "ring-orange-200" };
      default:
        return { color: "bg-slate-400", ring: "ring-slate-200" };
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            All caught up!
          </h3>
          <p className="text-slate-600">No tasks assigned at the moment.</p>
        </div>
      </div>
    );
  }

  const statusCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter(
      (t) =>
        t.status === "overdue" ||
        (t.status !== "completed" && new Date(t.deadline) < new Date())
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Tasks
              </h1>
              <p className="text-slate-600">
                Manage and complete your assigned tasks
              </p>
            </div>
            <div className="flex gap-2">
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

          {/* Stats Cards */}
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

        {/* Tasks Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredTasks?.map((task: Task) => {
            const statusConfig = getStatusConfig(task.status);
            const priorityConfig = getPriorityConfig(task.priority);
            const StatusIcon = statusConfig.icon;
            const isOverdue = isTaskOverdue(task);

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border ${
                  isOverdue ? "border-red-500 border-2" : "border-slate-100"
                } group`}
              >
                {/* Priority Bar */}
                <div className={`h-2 ${priorityConfig.color}`} />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {task.title}
                      </h3>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.lightBg} ${statusConfig.lightText}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {task.status.charAt(0).toUpperCase() +
                          task.status.slice(1).replace("-", " ")}
                        {isOverdue && (
                          <span className="ml-2 text-red-600 font-bold">
                            (Overdue)
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${priorityConfig.color} ring-4 ${priorityConfig.ring}`}
                    />
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span
                          className={`font-medium ${
                            isOverdue ? "text-red-600" : ""
                          }`}
                        >
                          {new Date(task.deadline).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">
                          {task.assignedTo?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submitted Files */}
                  {task.attachments && task.attachments.length > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-semibold text-green-900">
                          Submitted Files
                        </p>
                      </div>
                      <div className="space-y-2">
                        {task.attachments.map((file, index) => (
                          <a
                            key={index}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-green-700 hover:text-green-900 bg-white px-3 py-2 rounded-lg hover:shadow-md transition-all"
                          >
                            {getFileIcon(file.name)}
                            <span className="truncate font-medium">
                              {file.name}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submission Failure Reason */}
                  {task.submissionFailureReason && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <h4 className="text-sm font-semibold text-red-900">
                          Submission Failure Reason
                        </h4>
                      </div>
                      <p className="text-sm text-red-800">
                        {task.submissionFailureReason}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {!task.submissionFailureReason &&
                    task.status !== "completed" && (
                      <div className="space-y-3">
                        {isOverdue || task.status === "overdue" ? (
                          <>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                              <h4 className="text-sm font-semibold text-red-900">
                                Submission Failure Reason
                              </h4>
                            </div>
                            <textarea
                              value={failureReason}
                              onChange={(e) => setFailureReason(e.target.value)}
                              placeholder="Explain why the task could not be completed on time..."
                              className="w-full p-3 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm outline-none resize-none h-24"
                            />
                            <button
                              onClick={() => handleCompleteTask(task.id, true)}
                              disabled={
                                uploadingTask === task.id ||
                                !failureReason.trim()
                              }
                              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-200 transition-all disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed disabled:shadow-none font-semibold text-base"
                            >
                              {uploadingTask === task.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                  <span>Submitting Reason...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-5 h-5" />
                                  <span>Submit Failure Reason</span>
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
                                  onChange={(e) => handleFileSelect(e, task.id)}
                                  className="hidden"
                                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                                />
                                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all font-medium">
                                  <Upload className="w-4 h-4" />
                                  <span className="text-sm">Upload Files</span>
                                </div>
                              </label>

                              <button
                                onClick={() => {
                                  setShowLinkInput(!showLinkInput);
                                  setSelectedTask(task.id);
                                }}
                                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all"
                              >
                                <Link className="w-4 h-4" />
                              </button>
                            </div>

                            {showLinkInput && selectedTask === task.id && (
                              <div className="flex gap-2 animate-in slide-in-from-top-2">
                                <input
                                  type="url"
                                  value={linkInput}
                                  onChange={(e) => setLinkInput(e.target.value)}
                                  placeholder="https://example.com/file"
                                  className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm outline-none"
                                />
                                <button
                                  onClick={() => handleAddLink(task.id)}
                                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm font-medium"
                                >
                                  Add
                                </button>
                              </div>
                            )}

                            {selectedTask === task.id &&
                              attachments.length > 0 && (
                                <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                  <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-semibold text-slate-900">
                                      Ready to Upload
                                    </p>
                                    <span className="text-xs text-slate-500">
                                      {attachments.length}/{MAX_FILES}
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {attachments.map((att) => (
                                      <div
                                        key={att.id}
                                        className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200"
                                      >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                          <div className="flex-shrink-0">
                                            {att.type === "link" ? (
                                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Link className="w-4 h-4 text-purple-600" />
                                              </div>
                                            ) : (
                                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                {getFileIcon(att.name)}
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">
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
                                          className="ml-2 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                          <X className="w-4 h-4 text-red-500" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                            <button
                              onClick={() => handleCompleteTask(task.id, false)}
                              disabled={
                                uploadingTask === task.id ||
                                (selectedTask === task.id &&
                                  attachments.length === 0)
                              }
                              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-xl hover:shadow-emerald-200 transition-all disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed disabled:shadow-none font-semibold text-base"
                            >
                              {uploadingTask === task.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                  <span>Submitting Task...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-5 h-5" />
                                  <span>
                                    {selectedTask === task.id &&
                                    attachments.length === 0
                                      ? "Add Attachments to Submit"
                                      : "Complete Task"}
                                  </span>
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    )}

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                      Created{" "}
                      {new Date(task.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
