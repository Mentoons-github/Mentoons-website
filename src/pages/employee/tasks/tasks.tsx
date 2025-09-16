import { useState, useEffect } from "react";
import {
  FaSearch,
  FaCheckCircle,
  FaRegCircle,
  FaCalendarAlt,
  FaTasks,
  FaChartBar,
  FaImage,
  FaTimes,
  FaEye,
  FaPaperclip,
  FaCheck,
} from "react-icons/fa";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  dueDate: string;
  imageUrl?: string;
  imageName?: string;
  selected?: boolean;
}

interface ImageModalProps {
  imageUrl: string;
  imageName: string;
  onClose: () => void;
}

const ImageModal = ({ imageUrl, imageName, onClose }: ImageModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <FaImage className="mr-2 text-blue-500" /> {imageName}
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl focus:outline-none"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        <div className="overflow-auto flex-1 flex items-center justify-center bg-gray-100 rounded-md">
          <img
            src={imageUrl}
            alt={imageName}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployeeTasks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateInput, setSelectedDateInput] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Create Admin Page",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
      selected: false,
    },
    {
      id: 2,
      title: "Integrate Backend of admin panel",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
      selected: false,
    },
    {
      id: 3,
      title: "Check for errors",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
      selected: false,
    },
  ]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [modalImage, setModalImage] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDateInput(e.target.value);
    filterTasks(searchQuery, e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    filterTasks(e.target.value, selectedDateInput);
  };

  const filterTasks = (query: string, date: string) => {
    let filtered = tasks;

    if (query) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (date) {
      filtered = filtered.filter((task) => task.dueDate === date);
    }

    setFilteredTasks(filtered);
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleTaskSelection = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, selected: !task.selected } : task
      )
    );
  };

  const submitSelectedTasks = () => {
    setTasks(
      tasks.map((task) =>
        task.selected && !task.completed
          ? { ...task, completed: true, selected: false }
          : task
      )
    );
  };

  const selectAllFilteredTasks = () => {
    const filteredIds = new Set(filteredTasks.map((task) => task.id));
    setTasks(
      tasks.map((task) =>
        filteredIds.has(task.id) && !task.completed
          ? { ...task, selected: true }
          : task
      )
    );
  };

  const deselectAllTasks = () => {
    setTasks(tasks.map((task) => ({ ...task, selected: false })));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    taskId: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? { ...task, imageUrl, imageName: file.name }
            : task
        )
      );

      setModalImage({ url: imageUrl, name: file.name });
    }
  };

  const viewImage = (imageUrl: string, imageName: string) => {
    setModalImage({ url: imageUrl, name: imageName });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  useEffect(() => {
    filterTasks(searchQuery, selectedDateInput);
  }, [tasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const selectedTasksCount = tasks.filter(
    (t) => t.selected && !t.completed
  ).length;

  return (
    <div className="flex flex-col bg-gray-100 p-4 min-h-screen gap-6">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <FaChartBar className="text-blue-500" /> Task Statistics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {totalTasks}
            </div>
            <div className="text-sm font-medium text-blue-800">Total Tasks</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {completedTasks}
            </div>
            <div className="text-sm font-medium text-green-800">Completed</div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {pendingTasks}
            </div>
            <div className="text-sm font-medium text-orange-800">Pending</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {completionRate}%
            </div>
            <div className="text-sm font-medium text-purple-800">
              Completion Rate
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center p-2 gap-4 bg-white rounded-md shadow-lg w-full">
        <FaSearch className="ml-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search Tasks"
          className="p-2 outline-none w-full"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 w-full flex-1">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <FaTasks className="text-xl text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
            </div>

            <div className="flex items-center gap-4 ml-0 md:ml-6 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" />
                <label htmlFor="date" className="font-medium text-gray-700">
                  Select Date:
                </label>
              </div>
              <input
                type="date"
                id="date"
                className="outline-none border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={selectedDateInput}
                onChange={handleDateInputChange}
              />
            </div>
          </div>
          <div className="bg-blue-100 px-4 py-2 rounded-full mt-4 md:mt-0">
            <span className="font-semibold text-blue-700">
              {filteredTasks.filter((t) => !t.completed).length} pending /{" "}
              {filteredTasks.length} total
            </span>
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={selectAllFilteredTasks}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Select All
            </button>
            <button
              onClick={deselectAllTasks}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Deselect All
            </button>
          </div>

          <button
            onClick={submitSelectedTasks}
            disabled={selectedTasksCount === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors ${
              selectedTasksCount > 0
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <FaCheck /> Submit Selected Tasks{" "}
            {selectedTasksCount > 0 && `(${selectedTasksCount})`}
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
            Assigned Tasks
          </h2>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No tasks found for the selected date or search query.
            </div>
          ) : (
            <ul className="space-y-3 mt-4">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className={`flex flex-col md:flex-row justify-between items-center gap-3 p-4 border rounded-md ${
                    task.completed
                      ? "bg-green-50 border-green-200"
                      : task.selected
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-200"
                  } hover:shadow-md transition-all`}
                >
                  <div className="flex items-center gap-3 flex-1 w-full">
                    <button
                      onClick={() =>
                        task.completed
                          ? toggleTaskCompletion(task.id)
                          : toggleTaskSelection(task.id)
                      }
                      className="text-xl focus:outline-none"
                    >
                      {task.completed ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : task.selected ? (
                        <FaCheckCircle className="text-blue-500" />
                      ) : (
                        <FaRegCircle className="text-gray-400 hover:text-blue-500" />
                      )}
                    </button>
                    <span
                      className={`flex-1 text-left ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0 w-full md:w-auto">
                    <div className="flex items-center">
                      <label className="relative cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md flex items-center gap-2 mr-2">
                        <FaPaperclip />
                        <span>Attach</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg, image/png, image/jpg"
                          onChange={(e) => handleImageUpload(e, task.id)}
                        />
                      </label>

                      {task.imageUrl && (
                        <button
                          onClick={() =>
                            viewImage(task.imageUrl!, task.imageName!)
                          }
                          className="bg-blue-100 text-blue-700 px-3 py-2 rounded-md flex items-center gap-2 hover:bg-blue-200 transition-colors"
                        >
                          <FaEye /> View Image
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      {task.completed && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Completed
                        </span>
                      )}
                      {!task.completed && task.selected && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {modalImage && (
        <ImageModal
          imageUrl={modalImage.url}
          imageName={modalImage.name}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default EmployeeTasks;
