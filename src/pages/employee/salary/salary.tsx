import { useState } from "react";
import {
  Calendar,
  TrendingUp,
  FileText,
  Download,
  Eye,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

interface Payment {
  id: number;
  date: string;
  amount: number;
  status: string;
  reference: string;
}

const currentEmployee = {
  id: 1,
  name: "Devan P S",
  position: "Software Developer",
  department: "Engineering",
  joiningDate: "2022-05-15",
  employeeId: "EMP-2022-0042",
  manager: "Mahesh",
  bankAccount: "**** **** **** 4321",
  taxId: "***-**-1234",
};

const salaryDetails = {
  currentSalary: 25000,
  currency: "INR",
  effectiveDate: "2025-04-01",
  paymentSchedule: "Monthly",
  nextPaymentDate: "2025-05-31",
  baseSalary: 300000,
  bonus: 10000,
  retirement: 15000,
  tax: 36000,
  healthInsurance: 4800,
  netMonthly: 25000 - (15000 + 36000 + 4800) / 12 + 10000 / 12,
};

const salaryHistory = [
  {
    id: 1,
    effectiveDate: "2025-04-01",
    amount: 300000,
    previousAmount: 270000,
    reason: "Annual raise",
    document: "sal_review_2025.pdf",
  },
  {
    id: 2,
    effectiveDate: "2024-04-01",
    amount: 270000,
    previousAmount: 240000,
    reason: "Annual raise",
    document: "sal_review_2024.pdf",
  },
  {
    id: 3,
    effectiveDate: "2023-04-01",
    amount: 240000,
    previousAmount: 216000,
    reason: "Annual raise",
    document: "sal_review_2023.pdf",
  },
  {
    id: 4,
    effectiveDate: "2022-04-01",
    amount: 216000,
    previousAmount: null,
    reason: "Initial salary",
    document: "offer_letter.pdf",
  },
];

const paymentHistory: Payment[] = [
  {
    id: 1,
    date: "2025-04-30",
    amount: 2123.33,
    status: "Paid",
    reference: "PAY-APR-2025",
  },
  {
    id: 2,
    date: "2025-03-31",
    amount: 1912.5,
    status: "Paid",
    reference: "PAY-MAR-2025",
  },
  {
    id: 3,
    date: "2025-02-29",
    amount: 1912.5,
    status: "Paid",
    reference: "PAY-FEB-2025",
  },
  {
    id: 4,
    date: "2025-01-31",
    amount: 1912.5,
    status: "Paid",
    reference: "PAY-JAN-2025",
  },
  {
    id: 5,
    date: "2024-12-31",
    amount: 1912.5,
    status: "Paid",
    reference: "PAY-DEC-2024",
  },
  {
    id: 6,
    date: "2024-11-30",
    amount: 1912.5,
    status: "Paid",
    reference: "PAY-NOV-2024",
  },
];

const EmployeeSalaryPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null); // Fix: Changed type from Date to Payment
  const [showHelp, setShowHelp] = useState(false);

  const calculateGrowth = () => {
    if (salaryHistory.length < 2) return 0;

    const initial = salaryHistory[salaryHistory.length - 1].amount;
    const current = salaryHistory[0].amount;
    const years = salaryHistory.length - 1;

    if (years === 0 || initial === 0) return 0;

    return ((current / initial) ** (1 / years) - 1) * 100;
  };

  const annualGrowth = calculateGrowth().toFixed(1);

  const openPayslip = (payment: Payment) => {
    // Fix: Changed parameter type to Payment
    setSelectedPayment(payment);
    setIsPayslipOpen(true);
  };

  const formatCurrency = (amount: number, showCents = false) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: showCents ? 2 : 0,
      maximumFractionDigits: showCents ? 2 : 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              My Salary & Compensation
            </h1>
            <p className="text-gray-500">
              View and manage your salary information
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-2">₹</div>
              <div>
                <p className="text-sm text-gray-500">Current Salary</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(salaryDetails.currentSalary)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "overview"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "history"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Salary History
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "payments"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Payment History
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "documents"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Documents
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Employee Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Name</span>
                        <span className="font-medium">
                          {currentEmployee.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Employee ID</span>
                        <span className="font-medium">
                          {currentEmployee.employeeId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Position</span>
                        <span className="font-medium">
                          {currentEmployee.position}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Department</span>
                        <span className="font-medium">
                          {currentEmployee.department}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Joining Date</span>
                        <span className="font-medium">
                          {new Date(
                            currentEmployee.joiningDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Manager</span>
                        <span className="font-medium">
                          {currentEmployee.manager}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Salary Breakdown
                      </h3>
                      <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <HelpCircle size={18} />
                      </button>
                    </div>

                    {showHelp && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800">
                        <div className="flex items-start">
                          <AlertCircle
                            size={16}
                            className="mr-2 mt-0.5 flex-shrink-0"
                          />
                          <p>
                            This breakdown shows your current compensation
                            package. The gross amount is your base salary plus
                            any bonuses. Deductions include taxes, retirement
                            contributions, and health insurance.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Base Salary</span>
                        <span className="font-medium">
                          {formatCurrency(salaryDetails.baseSalary)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bonus</span>
                        <span className="font-medium">
                          {formatCurrency(salaryDetails.bonus)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-700 font-medium">
                          Gross Annual
                        </span>
                        <span className="font-bold">
                          {formatCurrency(salaryDetails.currentSalary)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Gross Monthly</span>
                        <span className="font-medium">
                          {formatCurrency(
                            salaryDetails.currentSalary / 12,
                            true
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Tax Withholding</span>
                        <span>-{formatCurrency(salaryDetails.tax)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Retirement Contribution</span>
                        <span>-{formatCurrency(salaryDetails.retirement)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Health Insurance</span>
                        <span>
                          -{formatCurrency(salaryDetails.healthInsurance)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-700 font-medium">
                          Net Monthly
                        </span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(salaryDetails.netMonthly, true)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-white border rounded-lg p-6 flex items-center">
                    <div className="rounded-full bg-green-100 p-3 mr-4">
                      <TrendingUp className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Annual Growth</p>
                      <p className="text-xl font-bold">{annualGrowth}%</p>
                      <p className="text-xs text-gray-500">
                        Average yearly increase
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6 flex items-center">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                      <Calendar className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Next Payment</p>
                      <p className="text-xl font-bold">
                        {new Date(
                          salaryDetails.nextPaymentDate
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {salaryDetails.paymentSchedule} payment schedule
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6 flex items-center">
                    <div className="rounded-full bg-purple-100 p-3 mr-4">
                      <FileText className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Payment Details</p>
                      <p className="text-xl font-bold truncate">
                        {currentEmployee.bankAccount}
                      </p>
                      <p className="text-xs text-gray-500">
                        Bank account for direct deposit
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Salary History Tab */}
            {activeTab === "history" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Salary Adjustment History
                  </h3>
                  <button
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded-md"
                    onClick={() => console.log("Download history")}
                  >
                    <Download size={16} className="mr-1" />
                    Export
                  </button>
                </div>

                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Effective Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Change
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Reason
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Document
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {salaryHistory.map((history) => {
                        const percentChange = history.previousAmount
                          ? ((history.amount - history.previousAmount) /
                              history.previousAmount) *
                            100
                          : 0;
                        const isPositive = percentChange > 0;

                        return (
                          <tr key={history.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(
                                history.effectiveDate
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(history.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {history.previousAmount ? (
                                <span
                                  className={`${
                                    isPositive
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {isPositive ? "+" : ""}
                                  {percentChange.toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-gray-500">Initial</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {history.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                              <a href="#" className="hover:text-blue-800">
                                {history.document}
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payment History Tab */}
            {activeTab === "payments" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Payment History
                  </h3>
                  <button
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded-md"
                    onClick={() => console.log("Download payments")}
                  >
                    <Download size={16} className="mr-1" />
                    Export
                  </button>
                </div>

                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Payment Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Reference
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
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
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payment.amount, true)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.reference}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openPayslip(payment)}
                              className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                            >
                              <Eye size={16} className="mr-1" />
                              View Payslip
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Salary Documents
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {salaryHistory.map((history) => (
                    <div
                      key={history.id}
                      className="bg-white border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {history.document}
                        </p>
                        <p className="text-sm text-gray-500">
                          {history.reason} -{" "}
                          {new Date(history.effectiveDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download size={18} />
                      </button>
                    </div>
                  ))}

                  <div className="bg-white border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        annual_tax_statement_2024.pdf
                      </p>
                      <p className="text-sm text-gray-500">
                        Annual Tax Statement - January 31, 2025
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download size={18} />
                    </button>
                  </div>

                  <div className="bg-white border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        benefit_summary_2025.pdf
                      </p>
                      <p className="text-sm text-gray-500">
                        Benefits Summary - January 15, 2025
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isPayslipOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Payslip for{" "}
                {new Date(selectedPayment.date).toLocaleDateString()}
              </h3>
              <button
                onClick={() => setIsPayslipOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Employee:</span>
                <span className="font-medium">{currentEmployee.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Employee ID:</span>
                <span className="font-medium">
                  {currentEmployee.employeeId}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Payment Date:</span>
                <span className="font-medium">
                  {new Date(selectedPayment.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reference:</span>
                <span className="font-medium">{selectedPayment.reference}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Earnings</h4>
                <div className="bg-white border rounded-md">
                  <div className="flex justify-between p-3 border-b">
                    <span className="text-gray-500">Base Salary</span>
                    <span>
                      {formatCurrency(salaryDetails.baseSalary / 12, true)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-gray-500">Bonus/Commission</span>
                    <span>
                      {formatCurrency(salaryDetails.bonus / 12, true)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 border-t font-medium">
                    <span>Gross Pay</span>
                    <span>
                      {formatCurrency(salaryDetails.currentSalary / 12, true)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Deductions</h4>
                <div className="bg-white border rounded-md">
                  <div className="flex justify-between p-3 border-b">
                    <span className="text-gray-500">Income Tax</span>
                    <span>-{formatCurrency(salaryDetails.tax / 12, true)}</span>
                  </div>
                  <div className="flex justify-between p-3 border-b">
                    <span className="text-gray-500">
                      Retirement Contribution
                    </span>
                    <span>
                      -{formatCurrency(salaryDetails.retirement / 12, true)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-gray-500">Health Insurance</span>
                    <span>
                      -
                      {formatCurrency(salaryDetails.healthInsurance / 12, true)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 border-t font-medium">
                    <span>Total Deductions</span>
                    <span>
                      -
                      {formatCurrency(
                        (salaryDetails.tax +
                          salaryDetails.retirement +
                          salaryDetails.healthInsurance) /
                          12,
                        true
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between p-4 bg-blue-50 rounded-md font-bold">
                <span>Net Pay</span>
                <span className="text-blue-700">
                  {formatCurrency(selectedPayment.amount, true)}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setIsPayslipOpen(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                onClick={() => console.log("Download payslip")}
              >
                <Download size={16} className="mr-1" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalaryPanel;
