import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Task, Attachment } from "@/redux/admin/task/taskApi";

export const getStatusIcon = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "in-progress":
      return <Clock className="w-5 h-5 text-blue-500" />;
    case "overdue":
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case "pending":
      return <Clock className="w-5 h-5 text-yellow-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

export const getStatusColor = (status: Task["status"]): string => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityColor = (priority: Task["priority"]): string => {
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

export const getDaysRemaining = (dueDate: string): number => {
  const today = new Date();
  const due = new Date(dueDate);
  const timeDiff = due.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const isImage = (attachment: Attachment): boolean => {
  const ext = attachment.name.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "");
};

export const getRoleColor = (role: string) => {
  const roleColors = {
    admin: "bg-red-100 text-red-800 border-red-200",
    moderator: "bg-orange-100 text-orange-800 border-orange-200",
    premium: "bg-purple-100 text-purple-800 border-purple-200",
    user: "bg-blue-100 text-blue-800 border-blue-200",
    editor: "bg-green-100 text-green-800 border-green-200",
  };
  return (
    roleColors[role.toLowerCase() as keyof typeof roleColors] ||
    "bg-gray-100 text-gray-800 border-gray-200"
  );
};

export const getSubscriptionStatusColor = (status: string) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
  };
  return (
    statusColors[status.toLowerCase() as keyof typeof statusColors] ||
    "bg-gray-100 text-gray-800"
  );
};

export const getSocialColor = (platform: string) => {
  const colors = {
    facebook: "text-blue-600 hover:bg-blue-50 border-blue-200",
    twitter: "text-sky-500 hover:bg-sky-50 border-sky-200",
    instagram: "text-pink-600 hover:bg-pink-50 border-pink-200",
    linkedin: "text-blue-700 hover:bg-blue-50 border-blue-200",
    website: "text-gray-600 hover:bg-gray-50 border-gray-200",
  };
  return (
    colors[platform as keyof typeof colors] ||
    "text-gray-600 hover:bg-gray-50 border-gray-200"
  );
};
