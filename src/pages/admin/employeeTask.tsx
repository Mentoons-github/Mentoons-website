import React, { useState } from "react";
import {
  Plus,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  deadline: string;
  createdAt: string;
  submittedImages: Image[];
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
}

interface Image {
  id: number;
  name: string;
  url: string;
  uploadedAt: string;
}

interface NewTask {
  title: string;
  description: string;
  assignee: string;
  deadline: string;
  priority: "low" | "medium" | "high";
}

const TaskAssignmentSystem: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    assignee: "",
    deadline: "",
    priority: "medium",
  });

  const employees: Employee[] = [
    {
      id: "dhanashekar",
      name: "Dhanashekar",
      role: "Illustrator",
      avatar: "🎨",
    },
    { id: "jasim", name: "Jasim", role: "Developer", avatar: "💻" },
    { id: "devan", name: "Devan", role: "Developer", avatar: "⚡" },
    { id: "sofia", name: "Sofia", role: "Illustrator", avatar: "🖌️" },
  ];

  const createTask = () => {
    if (newTask.title && newTask.assignee && newTask.deadline) {
      const task: Task = {
        id: Date.now(),
        ...newTask,
        createdAt: new Date().toISOString(),
        submittedImages: [],
        status: "pending",
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: "",
        description: "",
        assignee: "",
        deadline: "",
        priority: "medium",
      });
    }
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const updateTaskStatus = (taskId: number, status: Task["status"]) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
  };

  const removeImage = (taskId: number, imageId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              submittedImages: task.submittedImages.filter(
                (img) => img.id !== imageId
              ),
            }
          : task
      )
    );
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
      default:
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
    }
  };

  const isOverdue = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    return (
      deadlineDate instanceof Date &&
      !isNaN(deadlineDate.getTime()) &&
      deadlineDate < new Date()
    );
  };

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
                  <Plus className="w-6 h-6" />
                  Create New Task
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
                    Assign to *
                  </label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) =>
                      setNewTask({ ...newTask, assignee: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.avatar} {emp.name} - {emp.role}
                      </option>
                    ))}
                  </select>
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
                  onClick={createTask}
                  disabled={
                    !newTask.title || !newTask.assignee || !newTask.deadline
                  }
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Display */}
          {tasks.length > 0 && (
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Active Tasks ({tasks.length})
                  </h3>
                </div>

                <div className="grid gap-6">
                  {tasks.map((task) => {
                    const assignee = employees.find(
                      (emp) => emp.id === task.assignee
                    );
                    const overdue = isOverdue(task.deadline);

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
                                    {assignee?.avatar} {assignee?.name}
                                  </span>
                                  <span className="text-gray-400">
                                    ({assignee?.role})
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
                                    {new Date(task.deadline).toLocaleTimeString(
                                      [],
                                      { hour: "2-digit", minute: "2-digit" }
                                    )}
                                  </span>
                                  {overdue && (
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                                      OVERDUE
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
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
                                    updateTaskStatus(
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
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Commented-out file input and upload button */}
                              {/* <input
                                ref={(el) =>
                                  (fileInputRefs.current[task.id] = el)
                                }
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageUpload(task.id, file);
                                    e.target.value = "";
                                  }
                                }}
                                className="hidden"
                              />
                              <button
                                onClick={() =>
                                  fileInputRefs.current[task.id]?.click()
                                }
                                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all"
                              >
                                <Upload className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  Upload
                                </span>
                              </button> */}

                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="Delete Task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {task.submittedImages.length > 0 && (
                            <div className="border-t border-gray-200 pt-4">
                              <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                Submitted Images ({task.submittedImages.length})
                              </h5>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {task.submittedImages.map((img) => (
                                  <div key={img.id} className="relative group">
                                    <img
                                      src={img.url}
                                      alt={img.name}
                                      onClick={() => setSelectedImage(img.url)}
                                      className="w-full h-20 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-orange-500 transition-all"
                                    />
                                    <button
                                      onClick={() =>
                                        removeImage(task.id, img.id)
                                      }
                                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    >
                                      ×
                                    </button>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                                      <span className="text-white text-xs opacity-0 group-hover:opacity-100 text-center p-1 font-medium">
                                        {img.name}
                                      </span>
                                    </div>
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
              onClick={() => setSelectedImage(null)}
            >
              <div className="max-w-4xl max-h-full">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskAssignmentSystem;
