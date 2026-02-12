import {
  X,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type InvoiceModalProps = {
  invoice: any;
  onClose: () => void;
};

const InvoiceModal = ({ invoice, onClose }: InvoiceModalProps) => {
  const downloadPDF = async () => {
    const element = document.getElementById("invoice-content");
    if (!element) return;

    document.body.classList.add("pdf-mode");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    document.body.classList.remove("pdf-mode");

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${invoice.transactionId.slice(0, 8)}.pdf`);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const user = invoice.userId;
  const emi = invoice.userPlanId.emiDetails;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-h-[95vh] w-full max-w-4xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="text-gray-600" size={24} />
        </button>

        <div className="flex justify-center p-6 md:p-10">
          <div
            id="invoice-content"
            className="bg-white text-gray-800 w-full max-w-[794px] min-h-[1122px] shadow-sm"
          >
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 md:p-10 rounded-t-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <img
                    src="/assets/LandingPage/logo.png"
                    alt="Mentoons Logo"
                    className="w-44 md:w-52 mb-4"
                  />
                  <div className="text-sm space-y-1 opacity-90">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      <span>Domlur, Bengaluru, Karnataka 560071</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      <span>+91 78928 58593</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      <span>info@mentoons.com</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <h1 className="text-4xl font-bold tracking-wide mb-3">
                    INVOICE
                  </h1>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-sm space-y-1">
                    <p>
                      <strong>No:</strong> INV-
                      {invoice._id.toString().slice(-8)}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(invoice.createdAt)}
                    </p>
                    <p className="text-xs mt-2 opacity-90">
                      {invoice.transactionId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10">
              {/* Billed To Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded"></div>
                  <h2 className="font-bold text-xl text-gray-800">Bill To</h2>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-2">
                      <p className="font-semibold text-lg text-gray-900">
                        {user.name || "User"}
                      </p>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <span>{user.phoneNumber || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          <span>{user.location || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>
                          <strong className="text-gray-800">Joined:</strong>{" "}
                          {formatDate(user.joinedDate || user.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                  <h2 className="font-bold text-xl text-gray-800">
                    Payment Details
                  </h2>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="p-4 text-left font-semibold text-gray-700">
                          Description
                        </th>
                        <th className="p-4 text-left font-semibold text-gray-700">
                          Type
                        </th>
                        <th className="p-4 text-right font-semibold text-gray-700">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-800">
                              Plan Subscription
                            </p>
                            <p className="text-sm text-gray-500">
                              {invoice.userPlanId.paymentType}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                            <CreditCard size={14} />
                            {invoice.paymentType}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <p className="font-bold text-lg text-gray-900">
                            {formatCurrency(invoice.amount)}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* EMI Summary */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded"></div>
                  <h2 className="font-bold text-xl text-gray-800">
                    Plan & EMI Summary
                  </h2>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">
                        Total Plan Amount
                      </p>
                      <p className="font-bold text-2xl text-gray-900">
                        {formatCurrency(invoice.userPlanId.totalAmount)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Down Payment</p>
                      <p className="font-bold text-2xl text-gray-900">
                        {formatCurrency(emi.downPayment)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {emi.paidDownPayment && (
                          <>
                            <CheckCircle2
                              size={14}
                              className="text-green-600"
                            />
                            <span className="text-xs text-green-600 font-medium">
                              Paid
                            </span>
                          </>
                        )}
                        {!emi.paidDownPayment && (
                          <span className="text-xs text-orange-600 font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Monthly EMI</p>
                      <p className="font-bold text-2xl text-gray-900">
                        {formatCurrency(emi.emiAmount)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">EMI Progress</p>
                      <p className="font-bold text-2xl text-gray-900">
                        {emi.paidMonths} / {emi.totalMonths}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        months completed
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">
                        Next Due Date
                      </p>
                      <p className="font-bold text-xl text-gray-900">
                        {formatDate(emi.nextDueDate)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <p className="font-bold text-xl capitalize text-gray-900">
                        {emi.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status Badge */}
              <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="text-green-600" size={20} />
                <span className="font-medium text-green-800">
                  Payment via {invoice.gateway} • Status:{" "}
                  <span className="uppercase">{invoice.status}</span>
                </span>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 pt-6 border-t border-gray-200">
                <p className="font-medium mb-1">Thank you for your business!</p>
                <p>
                  This is a computer-generated invoice and does not require a
                  signature.
                </p>
                <p className="mt-2 text-gray-400">
                  For any queries, please contact us at info@mentoons.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl font-medium"
          >
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
