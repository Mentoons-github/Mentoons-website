import { useState } from "react";
import {
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  Edit,
  Trash2,
  MapPin,
  DownloadCloud,
  Calendar,
  User,
  ArrowUpDown,
  CheckCircle,
  Briefcase,
  Home,
  Building,
} from "lucide-react";
import TeamMembers from "@/components/employee/modal/teamModal";

const EmployeeYourTeamPanel = () => {
  const employees = [
    {
      id: 1,
      name: "Alex Johnson",
      position: "Frontend Developer",
      department: "Engineering",
      email: "alex.j@youteam.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      avatar: "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk",
      status: "Active",
      workMode: "Onsite",
      joinDate: "Jan 12, 2023",
      tasksCompleted: 24,
    },
    {
      id: 2,
      name: "Maya Patel",
      position: "UX Designer",
      department: "Design",
      email: "maya.p@youteam.com",
      phone: "+1 (555) 987-6543",
      location: "New York, NY",
      avatar: "https://loremflickr.com/250/250/dog",
      status: "Active",
      workMode: "Hybrid",
      joinDate: "Mar 5, 2023",
      tasksCompleted: 18,
    },
    {
      id: 3,
      name: "Thomas Wilson",
      position: "Backend Developer",
      department: "Engineering",
      email: "thomas.w@youteam.com",
      phone: "+1 (555) 456-7890",
      location: "Austin, TX",
      avatar: "https://avatar.iran.liara.run/public/boy?username=Ash",
      status: "On Leave",
      workMode: "Onsite",
      joinDate: "Aug 22, 2022",
      tasksCompleted: 32,
    },
    {
      id: 4,
      name: "Sarah Kim",
      position: "Project Manager",
      department: "Management",
      email: "sarah.k@youteam.com",
      phone: "+1 (555) 789-0123",
      location: "Chicago, IL",
      avatar: "https://placebeard.it/250/250",
      status: "Active",
      workMode: "Hybrid",
      joinDate: "Oct 15, 2022",
      tasksCompleted: 41,
    },
    {
      id: 5,
      name: "James Rodriguez",
      position: "DevOps Engineer",
      department: "Engineering",
      email: "james.r@youteam.com",
      phone: "+1 (555) 234-5678",
      location: "Seattle, WA",
      avatar: "https://robohash.org/mail@ashallendesign.co.uk",
      status: "Remote",
      workMode: "Remote",
      joinDate: "May 8, 2023",
      tasksCompleted: 29,
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("grid");
  const [activeFilter, setActiveFilter] = useState("all");
  const [workModeFilter, setWorkModeFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      activeFilter === "all" ||
      (activeFilter === "active" && employee.status === "Active") ||
      (activeFilter === "remote" && employee.status === "Remote") ||
      (activeFilter === "onLeave" && employee.status === "On Leave");

    const matchesWorkMode =
      workModeFilter === "all" ||
      (workModeFilter === "onsite" && employee.workMode === "Onsite") ||
      (workModeFilter === "hybrid" && employee.workMode === "Hybrid") ||
      (workModeFilter === "remote" && employee.workMode === "Remote");

    return matchesSearch && matchesStatus && matchesWorkMode;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "On Leave":
        return "bg-yellow-500";
      case "Remote":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getWorkModeIcon = (workMode: string) => {
    switch (workMode) {
      case "Onsite":
        return <Building className="h-4 w-4 mr-2 text-gray-400" />;
      case "Hybrid":
        return <Home className="h-4 w-4 mr-2 text-gray-400" />;
      case "Remote":
        return <Briefcase className="h-4 w-4 mr-2 text-gray-400" />;
      default:
        return <Briefcase className="h-4 w-4 mr-2 text-gray-400" />;
    }
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Team</h1>
        <p className="text-gray-500 mt-1">
          Manage your team members and their access
        </p>
      </div>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search team members..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-white border border-gray-200 rounded-lg">
            <button
              className={`px-4 py-2 flex items-center ${
                activeFilter === "all"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 flex items-center ${
                activeFilter === "active"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveFilter("active")}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 flex items-center ${
                activeFilter === "remote"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveFilter("remote")}
            >
              Remote
            </button>
            <button
              className={`px-4 py-2 flex items-center ${
                activeFilter === "onLeave"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveFilter("onLeave")}
            >
              On Leave
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-white border border-gray-200 rounded-lg">
            <button
              className={`px-3 py-2 flex items-center text-sm ${
                workModeFilter === "all"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setWorkModeFilter("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-2 flex items-center text-sm ${
                workModeFilter === "onsite"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setWorkModeFilter("onsite")}
            >
              <Building className="h-4 w-4 mr-1" /> Onsite
            </button>
            <button
              className={`px-3 py-2 flex items-center text-sm ${
                workModeFilter === "hybrid"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setWorkModeFilter("hybrid")}
            >
              <Home className="h-4 w-4 mr-1" /> Hybrid
            </button>
            <button
              className={`px-3 py-2 flex items-center text-sm ${
                workModeFilter === "remote"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setWorkModeFilter("remote")}
            >
              <Briefcase className="h-4 w-4 mr-1" /> Remote
            </button>
          </div>
          <div className="flex bg-white border border-gray-200 rounded-lg">
            <button
              className={`p-2 ${
                activeView === "grid"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveView("grid")}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z" />
              </svg>
            </button>
            <button
              className={`p-2 ${
                activeView === "list"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveView("list")}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Members</p>
              <p className="text-2xl font-semibold mt-1">{employees.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-semibold mt-1">
                {employees.filter((e) => e.status === "Active").length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <div className="h-6 w-6 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Remote</p>
              <p className="text-2xl font-semibold mt-1">
                {employees.filter((e) => e.status === "Remote").length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <div className="h-6 w-6 rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">On Leave</p>
              <p className="text-2xl font-semibold mt-1">
                {employees.filter((e) => e.status === "On Leave").length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <div className="h-6 w-6 rounded-full bg-yellow-500"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Onsite</p>
              <p className="text-2xl font-semibold mt-1">
                {employees.filter((e) => e.workMode === "Onsite").length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Building className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hybrid</p>
              <p className="text-2xl font-semibold mt-1">
                {employees.filter((e) => e.workMode === "Hybrid").length}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <Home className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {activeView === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {employee.position}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        employee.status
                      )} text-white`}
                    >
                      {employee.status}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      {employee.workMode}
                      {getWorkModeIcon(employee.workMode)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {employee.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {employee.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {employee.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    Joined: {employee.joinDate}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="font-medium text-green-600">
                      {employee.tasksCompleted}
                    </span>{" "}
                    tasks completed
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end space-x-2">
                <button className="p-1 text-blue-600 hover:text-blue-800">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-500 hover:text-gray-700">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center cursor-pointer">
                    Employee <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Work Mode
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Join Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tasks
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={employee.avatar}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.position}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col text-sm text-gray-500">
                      <div>{employee.email}</div>
                      <div>{employee.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        employee.status
                      )} text-white`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      {getWorkModeIcon(employee.workMode)}
                      {employee.workMode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span className="font-medium text-green-600">
                        {employee.tasksCompleted}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredEmployees.length === 0 && (
        <div className="mt-10 text-center p-8 bg-white rounded-lg border border-gray-200">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No team members found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No team members match your current search or filter criteria.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
                setWorkModeFilter("all");
              }}
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {filteredEmployees.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{filteredEmployees.length}</span> of{" "}
            <span className="font-medium">{employees.length}</span> team members
          </p>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              <DownloadCloud className="h-4 w-4 mr-2" />
              Export Team Data
            </button>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-blue-500 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpen && <TeamMembers onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default EmployeeYourTeamPanel;
