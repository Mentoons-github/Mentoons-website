import React, { useState } from "react";
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Plus,
  User,
} from "lucide-react";

interface Task {
  id: number;
  employeeName: string;
  employeeId: string;
  role: string;
  taskTitle: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  submissionDate: string | null;
  status: "completed" | "pending" | "needs_improvement";
  image: string;
  priority: "high" | "medium" | "low";
  feedback: string;
  completionPercentage: number;
}

const AdminTaskDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      employeeName: "Dhanashekar",
      employeeId: "EMP001",
      role: "Illustrator",
      taskTitle: "Brand Identity Design",
      description:
        "Create complete brand identity package including logo, color palette, and visual guidelines for new client project.",
      assignedDate: "2025-08-01",
      dueDate: "2025-08-20",
      submissionDate: "2025-08-18",
      status: "completed",
      image:
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=200&fit=crop",
      priority: "high",
      feedback:
        "Excellent work on the brand identity. The color palette is perfect for the client's vision.",
      completionPercentage: 100,
    },
    {
      id: 2,
      employeeName: "Jasim",
      employeeId: "EMP002",
      role: "Web Developer",
      taskTitle: "Payment Integration",
      description:
        "Complete Mentoons Mythos hiring page and payment integration on the assessment page",
      assignedDate: "2025-08-05",
      dueDate: "2025-08-25",
      submissionDate: null,
      status: "pending",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop",
      priority: "medium",
      feedback: "",
      completionPercentage: 75,
    },
    {
      id: 3,
      employeeName: "Devan",
      employeeId: "EMP003",
      role: "Web Developer",
      taskTitle: "API Development & Integration",
      description:
        "Build RESTful APIs for product adding on backend and integrate with third-party services.",
      assignedDate: "2025-08-10",
      dueDate: "2025-08-28",
      submissionDate: "2025-08-26",
      status: "needs_improvement",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
      priority: "high",
      feedback:
        "API endpoints need better error handling and documentation. Please revise and resubmit.",
      completionPercentage: 85,
    },
    {
      id: 4,
      employeeName: "Sofiya",
      employeeId: "EMP004",
      role: "Illustrator",
      taskTitle: "Murder Mystery",
      description:
        "Create custom illustrations and icons for the new game Murder mystery",
      assignedDate: "2025-08-12",
      dueDate: "2025-08-30",
      submissionDate: null,
      status: "pending",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
      priority: "medium",
      feedback: "",
      completionPercentage: 60,
    },
    {
      id: 5,
      employeeName: "Jasim",
      employeeId: "EMP002",
      role: "Web Developer",
      taskTitle: "Website Performance Optimization",
      description: "Optimize website loading speed and refactor code",
      assignedDate: "2025-08-15",
      dueDate: "2025-09-01",
      submissionDate: "2025-08-29",
      status: "completed",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
      priority: "high",
      feedback: "Great optimization work! Page load times improved by 60%.",
      completionPercentage: 100,
    },
    {
      id: 6,
      employeeName: "Dhanashekar",
      employeeId: "EMP001",
      role: "Illustrator",
      taskTitle: "Pocket book series",
      description: "Design a Characters for the the new pocket book series.",
      assignedDate: "2025-08-18",
      dueDate: "2025-09-05",
      submissionDate: null,
      status: "pending",
      image:
        "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=200&fit=crop",
      priority: "medium",
      feedback: "",
      completionPercentage: 40,
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showExtendModal, setShowExtendModal] = useState<boolean>(false);
  const [extensionDays, setExtensionDays] = useState<number>(7);

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesSearch =
      task.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateTaskStatus = (
    taskId: number,
    newStatus: Task["status"],
    feedback: string = ""
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, feedback: feedback }
          : task
      )
    );
    setSelectedTask(null);
  };

  const extendDeadline = (taskId: number, days: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const currentDueDate = new Date(task.dueDate);
          currentDueDate.setDate(currentDueDate.getDate() + days);
          return {
            ...task,
            dueDate: currentDueDate.toISOString().split("T")[0],
          };
        }
        return task;
      })
    );
    setShowExtendModal(false);
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "needs_improvement":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Task["status"]): string => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "needs_improvement":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: Task["priority"]): string => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysRemaining = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Task Management Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage employee tasks and submissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.filter((t) => t.status === "completed").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tasks.filter((t) => t.status === "pending").length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Need Improvement
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {tasks.filter((t) => t.status === "needs_improvement").length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tasks or employees..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="needs_improvement">Needs Improvement</option>
              </select>
            </div>

            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Assign New Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={task.image}
                  alt={task.taskTitle}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div
                  className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority.toUpperCase()}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {task.taskTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{task.employeeName}</span>
                      <span className="text-gray-400">•</span>
                      <span>{task.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(task.status)}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {task.description}
                </p>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700">
                      Progress
                    </span>
                    <span className="text-xs text-gray-500">
                      {task.completionPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Employee ID:</span>
                    <span className="font-medium">{task.employeeId}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Assigned:</span>
                    <span className="font-medium">
                      {new Date(task.assignedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Due Date:</span>
                    <span
                      className={`font-medium ${
                        getDaysRemaining(task.dueDate) < 0
                          ? "text-red-600"
                          : getDaysRemaining(task.dueDate) <= 3
                          ? "text-yellow-600"
                          : "text-gray-900"
                      }`}
                    >
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {task.submissionDate && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Submitted:</span>
                      <span className="font-medium text-green-600">
                        {new Date(task.submissionDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Days Remaining:</span>
                    <span
                      className={`font-medium ${
                        getDaysRemaining(task.dueDate) < 0
                          ? "text-red-600"
                          : getDaysRemaining(task.dueDate) <= 3
                          ? "text-yellow-600"
                          : "text-gray-900"
                      }`}
                    >
                      {getDaysRemaining(task.dueDate) < 0
                        ? `${Math.abs(
                            getDaysRemaining(task.dueDate)
                          )} days overdue`
                        : `${getDaysRemaining(task.dueDate)} days`}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                {task.feedback && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Feedback:</strong> {task.feedback}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Review
                  </button>

                  {task.status === "pending" && (
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
          ))}
        </div>

        {selectedTask && !showExtendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedTask.taskTitle}
                    </h2>
                    <p className="text-gray-600">
                      {selectedTask.employeeName} - {selectedTask.role}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <img
                  src={selectedTask.image}
                  alt={selectedTask.taskTitle}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600">{selectedTask.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">
                        Employee ID:
                      </span>
                      <p className="font-medium">{selectedTask.employeeId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Role:</span>
                      <p className="font-medium">{selectedTask.role}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Assigned Date:
                      </span>
                      <p className="font-medium">
                        {new Date(
                          selectedTask.assignedDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Due Date:</span>
                      <p className="font-medium">
                        {new Date(selectedTask.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedTask.submissionDate && (
                      <div>
                        <span className="text-sm text-gray-500">
                          Submission Date:
                        </span>
                        <p className="font-medium text-green-600">
                          {new Date(
                            selectedTask.submissionDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-500">Progress:</span>
                      <p className="font-medium">
                        {selectedTask.completionPercentage}%
                      </p>
                    </div>
                  </div>

                  {selectedTask.feedback && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Current Feedback
                      </h3>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedTask.feedback}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Feedback
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter your feedback here..."
                      id="feedback-input"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex gap-3">
                {selectedTask.status !== "completed" && (
                  <button
                    onClick={() => {
                      const feedbackElement = document.getElementById(
                        "feedback-input"
                      ) as HTMLTextAreaElement;
                      const feedback = feedbackElement?.value || "";
                      updateTaskStatus(selectedTask.id, "completed", feedback);
                    }}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                )}

                {selectedTask.status !== "needs_improvement" && (
                  <button
                    onClick={() => {
                      const feedbackElement = document.getElementById(
                        "feedback-input"
                      ) as HTMLTextAreaElement;
                      const feedback = feedbackElement?.value || "";
                      if (feedback.trim()) {
                        updateTaskStatus(
                          selectedTask.id,
                          "needs_improvement",
                          feedback
                        );
                      } else {
                        alert("Please provide feedback for improvement");
                      }
                    }}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Request Changes
                  </button>
                )}

                <button
                  onClick={() => setSelectedTask(null)}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
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
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  Extend Deadline
                </h2>
                <p className="text-gray-600">Task: {selectedTask.taskTitle}</p>
                <p className="text-gray-600">
                  Employee: {selectedTask.employeeName}
                </p>
                <p className="text-sm text-gray-500">
                  Current Due Date:{" "}
                  {new Date(selectedTask.dueDate).toLocaleDateString()}
                </p>
              </div>

              <div className="p-6">
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
                        setExtensionDays(parseInt(e.target.value))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>New Due Date:</strong>{" "}
                      {(() => {
                        const newDate = new Date(selectedTask.dueDate);
                        newDate.setDate(newDate.getDate() + extensionDays);
                        return newDate.toLocaleDateString();
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex gap-3">
                <button
                  onClick={() => extendDeadline(selectedTask.id, extensionDays)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Extend Deadline
                </button>

                <button
                  onClick={() => {
                    setShowExtendModal(false);
                    setSelectedTask(null);
                  }}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTaskDashboard;
