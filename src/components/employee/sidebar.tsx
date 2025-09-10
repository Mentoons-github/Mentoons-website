import { NavLink } from "react-router-dom";

const EmployeeSidebar = () => {
  const navItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Tasks", icon: "✅" },
    { name: "Request Leave", icon: "📜" },
    { name: "YourTeam", icon: "👥" },
    { name: "Salary", icon: "🪙" },
    { name: "Session_Calls", icon: "📞" },
    // { name: "Incentive", icon: "💳" },
  ];

  return (
    <div className="sticky top-0 left-0 h-screen w-15 md:w-45 lg:w-64 bg-gray-800 shadow-lg flex flex-col transition-all duration-300 ease-in-out">
      <div className="p-4 border-b border-gray-700">
        <img
          alt="mentoons-logo"
          src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png "
          className="w-32 mx-auto object-contain"
        />
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={`/employee/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `flex items-center p-3 text-lg font-medium rounded-lg transition-all duration-300
                  ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-gray-300 hover:bg-orange-400 hover:text-white"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span className="hidden md:block">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <NavLink to="/profile" className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold">
            U
          </div>
          <div className="hidden md:block ml-3">
            <p className="text-sm font-medium text-white">User Profile</p>
            <p className="text-xs text-gray-400">Settings</p>
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default EmployeeSidebar;
