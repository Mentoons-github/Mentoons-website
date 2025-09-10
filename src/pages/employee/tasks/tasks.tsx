import { Task } from "@/types/employee/task";
import React, { useState, useEffect } from "react";

const Tasks: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  useEffect(() => {
    const sampleTask: Task = {
      _id: "1",
      name: "Complete Project Documentation",
      completed: false,
      files: ["screenshot1.png", "screenshot2.png"],
      deadline: new Date("2025-09-30T23:59:59.999Z"),
      assignedTo: { name: "John Doe", email: "john@example.com" },
      assignedBy: { name: "Jane Smith", email: "jane@example.com" },
      createdAt: new Date(),
    };
    setTask(sampleTask);
  }, []);

  if (!task) return <div>Loading...</div>;

  return (
    <div className="p-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Employee Tasks</h1>
        <div>{/* Sorting buttons can be added here */}</div>
      </div>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div className="p-3 rounded-md shadow-md bg-white">
          <h2 className="text-lg font-semibold">{task.name}</h2>
          <p className="text-sm text-gray-600">
            Status: {task.completed ? "Completed" : "Pending"}
          </p>
          <p className="text-sm text-gray-600">
            Deadline: {task.deadline.toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Assigned to: {task.assignedTo.name} ({task.assignedTo.email})
          </p>
          <p className="text-sm text-gray-600">
            Assigned by: {task.assignedBy.name} ({task.assignedBy.email})
          </p>
          <div className="mt-2">
            <p className="text-sm font-medium">Screenshots:</p>
            {task.files.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {task.files.map((file, index) => (
                  <li key={index} className="text-blue-600">
                    <a
                      href={`#${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No screenshots attached</p>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Created: {task.createdAt.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
