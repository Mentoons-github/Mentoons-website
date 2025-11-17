type Tab = "overview" | "tasks" | "performance";

interface EmployeeTabsNavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const EmployeeTabsNavigation = ({
  activeTab,
  setActiveTab,
}: EmployeeTabsNavigationProps) => (
  <div className="border-b border-gray-200">
    <div className="flex gap-8 px-8">
      {(["overview", "tasks", "performance"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-4 font-semibold border-b-2 transition-colors capitalize ${
            activeTab === tab
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);

export default EmployeeTabsNavigation;
