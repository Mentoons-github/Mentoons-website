import { useState, useEffect } from "react";
import {
  X,
  UserPlus,
  ChevronDown,
  User,
  Mail,
  Briefcase,
  Users,
} from "lucide-react";

const mockEmployees = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Frontend Developer",
    department: "Engineering",
    avatar: "https://loremflickr.com/250/250/dog",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "UI/UX Designer",
    department: "Design",
    avatar: "https://loremflickr.com/250/250/dog",
    color: "bg-pink-500",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Backend Developer",
    department: "Engineering",
    avatar: "https://loremflickr.com/250/250/dog",
    color: "bg-green-500",
  },
];

const TeamMembers = ({ onClose }: { onClose: () => void }) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [isCardVisible, setIsCardVisible] = useState<boolean>(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const selectedEmployee = mockEmployees.find(
    (emp) => emp.id === parseInt(selectedId)
  );

  useEffect(() => {
    if (selectedId) {
      setIsCardVisible(true);
    } else {
      setIsCardVisible(false);
    }
  }, [selectedId]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(e.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleAddEmployee = () => {
    if (selectedEmployee) {
      setSuccessMessage(`${selectedEmployee.name} added to the team!`);
      setIsSuccessVisible(true);

      setTimeout(() => {
        setIsSuccessVisible(false);
        setSelectedId("");
      }, 2000);
    }
  };

  return (
    <div
      onClick={() => onClose()}
      className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50 transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out"
      >
        <div className="flex items-center justify-between border-b p-4">
          <h1 className="text-orange-500 font-bold text-xl flex items-center">
            <UserPlus className="mr-2" size={20} />
            Add Team Member
          </h1>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-5">
            <label
              htmlFor="member"
              className="block mb-2 font-medium text-gray-700 flex items-center"
            >
              <Users size={16} className="mr-2" />
              Select Available Employee
            </label>
            <div className="relative">
              <select
                id="member"
                onChange={handleSelectChange}
                value={selectedId}
                className="w-full border border-gray-300 p-3 rounded-md pr-10 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:outline-none transition-all appearance-none"
              >
                <option value="">-- Select employee --</option>
                {mockEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isCardVisible ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {selectedEmployee && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-5 shadow-sm">
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`${selectedEmployee.color} w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden`}
                  >
                    <img
                      src={selectedEmployee.avatar}
                      className="w-full h-full object-cover"
                      alt={`${selectedEmployee.name}'s avatar`}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <User size={16} className="mr-2 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span className="ml-2 text-gray-700">
                      {selectedEmployee.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span className="ml-2 text-gray-700">
                      {selectedEmployee.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase size={16} className="mr-2 text-gray-500" />
                    <span className="font-medium">Role:</span>
                    <span className="ml-2 text-gray-700">
                      {selectedEmployee.role}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-gray-500" />
                    <span className="font-medium">Department:</span>
                    <span className="ml-2 text-gray-700">
                      {selectedEmployee.department}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className={`mb-4 transition-all duration-300 ${
              isSuccessVisible
                ? "opacity-100 h-12 bg-green-100 border border-green-300 text-green-700 rounded-md flex items-center justify-center"
                : "opacity-0 h-0"
            }`}
          >
            {successMessage}
          </div>

          <button
            type="button"
            disabled={!selectedEmployee}
            className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center transition-all duration-300 ${
              selectedEmployee
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            onClick={handleAddEmployee}
          >
            <UserPlus size={18} className="mr-2" />
            Add to Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
