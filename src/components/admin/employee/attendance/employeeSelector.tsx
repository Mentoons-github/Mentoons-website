import { Employee } from "@/types/employee";

interface EmployeeSelectorProps {
  employees: Employee[];
  selectedEmployee: string;
  onSelectEmployee: (employeeId: string) => void;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  employees,
  selectedEmployee,
  onSelectEmployee,
}) => {
  return (
    <select
      className="w-full md:w-auto bg-white text-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-white outline-none"
      value={selectedEmployee}
      onChange={(e) => onSelectEmployee(e.target.value)}
    >
      <option value="">-- Select an employee --</option>
      {employees.map((emp) => (
        <option key={emp._id} value={emp._id}>
          {emp.name} - {emp.email}
        </option>
      ))}
    </select>
  );
};

export default EmployeeSelector;
