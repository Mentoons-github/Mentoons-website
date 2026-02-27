import { useEffect, useState } from "react";
import {
  TrendingUp,
  CheckCircle,
  IndianRupee,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";
import EmiTable from "@/components/Workshop/emi/emiTable";
import {
  fetchActiveEmi,
  fetchCompletedPayments,
  fetchEmiStatistics,
  downloadInvoice,
} from "@/api/workshop/emi";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import InvoiceModal from "@/components/Workshop/emi/InvoiceModal";
import { BASE_URL } from "@/api/game/postScore";

export interface Payment {
  userPlanId: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  transactionId?: string;
}

interface CompletedPayment {
  paymentId: string;
  transactionId: string;
  paymentType: string;
  amount: number;
  paymentStatus: string;
  paidAt: string;
}

interface EmiStatistics {
  totalEmiAmount: number;
  paidAmount: number;
  remainingAmount: number;
  totalEmis: number;
  paidEmis: number;
  pendingEmis: number;
  nextDueDate: string | null;
}

interface InvoiceData {
  _id: string;
  transactionId: string;
  amount: number;
  paymentType: "DOWN_PAYMENT" | "FULL" | "EMI";
  status: "SUCCESS" | "FAILED" | "PENDING" | string;
  gateway: string;
  createdAt: string;
  updatedAt?: string;

  userId: {
    _id?: string;
    name: string;
    email: string;
    phoneNumber: string;
  };

  planId: {
    _id?: string;
    name: string;
    age: string;
    duration: string;
    mode: string[];
  };

  userPlanId: {
    _id: string;
    userId: string;
    planId: string;
    paymentType: "EMI" | "FULL" | string;
    totalAmount: number;
    selectedMode: "Online" | "Offline" | string;
    accessStatus?: string;
    bplApplied?: boolean;
    bplStatus?: string;
    bplCardFile?: any;
    createdAt: string;
    updatedAt?: string;

    emiDetails?: {
      downPayment: number;
      paidDownPayment: boolean;
      emiAmount: number;
      totalMonths: number;
      paidMonths: number;
      nextDueDate: string;
      status: string;
    };
  };
}
const Emi: React.FC = () => {
  const [pendingEmi, setPendingEmi] = useState<Payment[]>([]);
  const [completedEmi, setCompletedEmi] = useState<CompletedPayment[]>([]);
  const [statistics, setStatistics] = useState<EmiStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [invoiceLoadingId, setInvoiceLoadingId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null,
  );

  const { getToken } = useAuth();

  useEffect(() => {
    const loadEmiData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [activeRes, statsRes, completedRes] = await Promise.all([
          fetchActiveEmi({ getToken }),
          fetchEmiStatistics({ getToken }),
          fetchCompletedPayments({ getToken }),
        ]);

        setStatistics(statsRes.data ?? null);

        let pending: Payment[] = [];

        if (Array.isArray(activeRes.data)) {
          pending = activeRes.data.map((item: any) => {
            const nextDue = item.nextDueDate;
            const dueDateObj = nextDue ? new Date(nextDue) : new Date(0);

            return {
              userPlanId: String(item.userPlanId || item._id || ""),
              dueDate: nextDue ?? "",
              amount: Number(item.monthlyAmount || item.emiAmount || 0),
              status: dueDateObj < new Date() ? "overdue" : "pending",
            };
          });
        }

        setPendingEmi(pending);

        if (completedRes?.success && Array.isArray(completedRes.data)) {
          setCompletedEmi(completedRes.data);
        }
      } catch (err: any) {
        console.log("error found : ", err);
        const msg = err || "Unknown error";
        if (!msg.includes("404") && !msg.toLowerCase().includes("no active")) {
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    };

    loadEmiData();
  }, [getToken]);

  const handlePayment = async (userPlanId: string) => {
    const selected = pendingEmi.find((p) => p.userPlanId === userPlanId);
    if (!selected) return;

    setPaymentLoading(userPlanId);

    try {
      const token = await getToken();

      const response = await axios.post(
        `${BASE_URL}/workshop/pay-emi`,
        { userPlanId: selected.userPlanId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = response.data;

      const form = tempDiv.querySelector("form");
      if (form) {
        document.body.appendChild(form);
        form.submit();
      } else {
        console.error("Form not found in response HTML");
      }
    } catch (err) {
      alert("Payment initiation failed. Please try again.");
    } finally {
      setPaymentLoading(null);
    }
  };

  const handleOpenInvoice = async (transactionId: string) => {
    if (invoiceLoadingId === transactionId) return;

    setInvoiceLoadingId(transactionId);

    try {
      const result = await downloadInvoice({
        getToken,
        transactionId,
      });

      if (typeof result === "string") {
        alert(`Error: ${result}`);
        return;
      }

      setSelectedInvoice(result.data);
      setInvoiceModalOpen(true);
    } catch (err) {
      console.error("Invoice fetch failed:", err);
      alert("Failed to load invoice details.");
    } finally {
      setInvoiceLoadingId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "None";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading EMI data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <p className="text-red-600 text-center font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!statistics || typeof statistics.totalEmiAmount !== "number") {
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

          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-6 rounded-full">
                  <IndianRupee className="w-16 h-16 text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                EMI Data Not Available
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't load complete EMI statistics.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const percentage =
    statistics.totalEmis > 0
      ? (statistics.paidEmis / statistics.totalEmis) * 100
      : 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
                  ₹{statistics.totalEmiAmount.toLocaleString()}
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
                  ₹{statistics.paidAmount.toLocaleString()}
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
                  ₹{statistics.remainingAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Pending EMIs
              </h2>
              <EmiTable
                payments={pendingEmi}
                onPayment={handlePayment}
                onDownloadInvoice={handleOpenInvoice}
                loadingPayment={paymentLoading}
                loadingInvoiceId={invoiceLoadingId}
                variant="pending"
              />
            </div>

            <div>
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
              >
                {showCompleted ? "Hide" : "View"} Completed Payments
                {completedEmi.length > 0 && (
                  <span className="bg-white/30 px-2.5 py-1 rounded-full text-sm">
                    {completedEmi.length}
                  </span>
                )}
              </button>

              {showCompleted && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Completed Payments
                  </h2>
                  <EmiTable
                    payments={completedEmi.map((p) => ({
                      userPlanId: p.paymentId,
                      dueDate: p.paidAt,
                      amount: p.amount,
                      status: "paid",
                      transactionId: p.transactionId,
                    }))}
                    onPayment={handlePayment}
                    onDownloadInvoice={handleOpenInvoice}
                    loadingPayment={null}
                    loadingInvoiceId={invoiceLoadingId}
                    variant="completed"
                  />
                </div>
              )}
            </div>
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
                      {statistics.paidEmis}
                    </span>
                    <span className="text-lg text-gray-600">
                      of {statistics.totalEmis}
                    </span>
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
                      {statistics.paidEmis}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      EMIs Remaining
                    </span>
                    <span className="text-orange-700 font-bold text-lg">
                      {statistics.pendingEmis}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      Next Payment
                    </span>
                    <span className="text-blue-700 font-bold text-sm">
                      {formatDate(statistics.nextDueDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {invoiceModalOpen && selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => {
            setInvoiceModalOpen(false);
            setSelectedInvoice(null);
          }}
        />
      )}

      {invoiceLoadingId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <p className="text-gray-700 font-medium">
              Fetching invoice details...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emi;
