import { useEffect, useState } from "react";
import { TrendingUp, CheckCircle, IndianRupee, ArrowLeft } from "lucide-react";
import EmiTable from "@/components/Workshop/emi/emiTable";
import InvoiceModal from "@/components/Workshop/emi/InvoiceModal";
import { useAuth } from "@clerk/clerk-react";
import { useAppDispatch } from "@/hooks/useRedux";
import { getInvoiceDetailsThunk } from "@/redux/workshop/workshopThunk";

export interface Payment {
  id: number;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

const Emi: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, dueDate: "December 5th, 2024", amount: 4500, status: "paid" },
    { id: 2, dueDate: "January 5th, 2025", amount: 4500, status: "paid" },
    { id: 3, dueDate: "February 5th, 2025", amount: 4500, status: "paid" },
    { id: 4, dueDate: "March 5th, 2025", amount: 4500, status: "paid" },
    { id: 5, dueDate: "April 5th, 2025", amount: 4500, status: "paid" },
    { id: 6, dueDate: "May 5th, 2025", amount: 4500, status: "paid" },
    { id: 7, dueDate: "June 5th, 2025", amount: 4500, status: "paid" },
    { id: 8, dueDate: "July 5th, 2025", amount: 4500, status: "pending" },
    { id: 9, dueDate: "August 5th, 2025", amount: 4500, status: "pending" },
    { id: 10, dueDate: "September 5th, 2025", amount: 4500, status: "pending" },
    { id: 11, dueDate: "October 5th, 2025", amount: 4500, status: "pending" },
    { id: 12, dueDate: "November 5th, 2025", amount: 4500, status: "pending" },
  ]);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { getToken } = useAuth();

  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const fetchToken = async () => {
      const t = (await getToken()) as string;
      setToken(t);
    };

    fetchToken();
  }, [getToken]);

  useEffect(() => {
    if (!token) return;

    dispatch(
      getInvoiceDetailsThunk({
        transactionId: "pay_KIDS_DP_001",
        token,
      })
    );
  }, [dispatch, token]);

  const totalEmi = payments.length;
  const paidEmi = payments.filter((p) => p.status === "paid").length;
  const totalAmount = totalEmi * 4500;
  const paidAmount = paidEmi * 4500;
  const remainingAmount = totalAmount - paidAmount;

  const handlePayment = (id: number): void => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "paid" as const } : p))
    );
  };

  const percentage = (paidEmi / totalEmi) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const pendingPayments = payments.filter((p) => p.status !== "paid");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-5xl font-bold text-gray-800 mb-2">EMI</h1>
          <p className="text-gray-600">
            Track and manage your installment payments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total EMI Amount</p>
                <p className="text-3xl font-bold text-gray-800">
                  ₹{totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <IndianRupee className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{paidAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Remaining Amount</p>
                <p className="text-3xl font-bold text-orange-600">
                  ₹{remainingAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Pending EMIs
            </h2>
            <EmiTable payments={pendingPayments} onPayment={handlePayment} />
            <button
              className="px-3 py-2 rounded-md bg-orange-500"
              onClick={() => setInvoiceModalOpen(true)}
            >
              Invoice Details
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Payment Progress
              </h2>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <svg
                    width={220}
                    height={220}
                    className="transform -rotate-90"
                  >
                    <circle
                      cx={110}
                      cy={110}
                      r={radius}
                      stroke="#e5e7eb"
                      strokeWidth={16}
                      fill="none"
                    />
                    <circle
                      cx={110}
                      cy={110}
                      r={radius}
                      stroke="url(#gradient)"
                      strokeWidth={16}
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-gray-800">
                      {paidEmi}
                    </span>
                    <span className="text-lg text-gray-600">of {totalEmi}</span>
                    <span className="text-sm text-green-600 font-semibold mt-1">
                      {percentage.toFixed(0)}% Complete
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">EMIs Paid</span>
                    <span className="text-green-700 font-bold text-lg">
                      {paidEmi}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      EMIs Remaining
                    </span>
                    <span className="text-orange-700 font-bold text-lg">
                      {totalEmi - paidEmi}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      Next Payment
                    </span>
                    <span className="text-blue-700 font-bold text-sm">
                      {pendingPayments.length > 0
                        ? pendingPayments[0].dueDate
                        : "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {invoiceModalOpen && (
        <InvoiceModal onClose={() => setInvoiceModalOpen(false)} />
      )}
    </div>
  );
};

export default Emi;
