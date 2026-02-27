import { X, Download, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type InvoiceModalProps = {
  invoice: any;
  onClose: () => void;
};

const InvoiceModal = ({ invoice, onClose }: InvoiceModalProps) => {
  const user = invoice.userId || {};
  const userPlan = invoice.userPlanId || {};
  const plan = invoice.planId || {};
  const emi = userPlan.emiDetails || {};

  const firstName = user.name?.split(/\s+/)[0] || "the student";

  const totalAmount = Number(userPlan.totalAmount ?? 0);
  const paidAmount = Number(invoice.amount ?? 0);
  const balanceDue = totalAmount - paidAmount;

  const planName = plan.name || "Selected Plan";

  const paymentLabel =
    invoice.paymentType === "DOWN_PAYMENT"
      ? "Down Payment (Initial Enrollment)"
      : invoice.paymentType === "FULL"
        ? "Full Payment"
        : invoice.paymentType === "EMI"
          ? "EMI Installment"
          : "Payment";

  const dueDate =
    invoice.paymentType === "DOWN_PAYMENT"
      ? invoice.createdAt
      : emi.nextDueDate || invoice.createdAt;

  const formatDate = (dateStr?: string | Date) => {
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

  const downloadPDF = async () => {
    const element = document.getElementById("invoice-content");
    if (!element) return;

    document.body.classList.add("pdf-mode");

    try {
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Invoice-${(invoice.transactionId || invoice._id || "unknown").slice(0, 8)}.pdf`,
      );
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      document.body.classList.remove("pdf-mode");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[820px] max-h-[95vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          title="Close"
        >
          <X className="text-gray-700" size={20} />
        </button>

        <div className="p-6 md:p-8">
          <div
            id="invoice-content"
            className="bg-white w-full text-gray-800 text-sm leading-relaxed"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-5">
              <img
                src="/assets/LandingPage/logo.png"
                alt="Mentoons"
                className="h-16 mx-auto mb-2"
              />
              <h1 className="text-2xl font-bold">Mentoons</h1>
              <p className="text-gray-600">
                Domlur, Bengaluru, Karnataka 560071
              </p>
              <div className="flex justify-center gap-6 text-xs mt-1">
                <span>Phone: +91 78928 58593</span>
                <span>Email: info@mentoons.com</span>
              </div>
            </div>

            <div className="text-center mb-7">
              <p className="text-base font-semibold text-gray-800">
                Thank you for enrolling in{" "}
                <span className="text-orange-600 font-bold">{planName}!</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                We’re thrilled to have {firstName} join us — get ready for an
                amazing journey!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between mb-7 text-sm gap-6">
              <div className="space-y-1.5">
                <p>
                  <strong>Invoice No:</strong> INV-
                  {(invoice._id || "").toString().slice(-8) || "—"}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(invoice.createdAt)}
                </p>
                <p>
                  <strong>Due Date:</strong> {formatDate(dueDate)}
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <p className="font-bold">Bill To:</p>
                <p>{user.name || "Customer"}</p>
                <p>{user.email || "—"}</p>
                <p>{user.phoneNumber || "—"}</p>
              </div>
            </div>

            <table className="w-full border-collapse mb-7 text-sm">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-400">
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Rate</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">
                    <div className="font-medium">{planName}</div>
                    <div className="mt-1 text-xs text-gray-500 font-light leading-relaxed">
                      Age group: {plan.age || "—"} • Duration:{" "}
                      {plan.duration || "—"} • Mode:{" "}
                      {userPlan.selectedMode || "—"}
                    </div>
                  </td>
                  <td className="p-3 text-center">1</td>
                  <td className="p-3 text-right">
                    {formatCurrency(totalAmount)}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatCurrency(totalAmount)}
                  </td>
                </tr>

                <tr className="border-b bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">{paymentLabel}</div>
                    <div className="mt-1 text-xs text-gray-500 font-light">
                      {invoice.paymentType || "—"} via {invoice.gateway || "—"}
                    </div>
                  </td>
                  <td className="p-3 text-center">1</td>
                  <td className="p-3 text-right">
                    {formatCurrency(paidAmount)}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatCurrency(paidAmount)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end mb-7">
              <div className="w-64 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span>Total Plan Amount:</span>
                  <span className="font-bold">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b font-bold text-base">
                  <span>Paid Now:</span>
                  <span>{formatCurrency(paidAmount)}</span>
                </div>
                {balanceDue > 0 && (
                  <div className="flex justify-between py-1 text-orange-700 font-medium">
                    <span>Balance Due:</span>
                    <span>{formatCurrency(balanceDue)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mb-7">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-100 rounded-full">
                <CheckCircle2 className="text-green-600" size={20} />
                <span className="font-bold uppercase text-green-800">
                  Payment {invoice.status || "PENDING"}
                </span>
              </div>
              <p className="mt-2 text-gray-600 text-sm">
                via {invoice.gateway || "—"} on {formatDate(invoice.createdAt)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Transaction ID: {invoice.transactionId || "—"}
              </p>
            </div>

            <div className="text-center text-xs text-gray-500 border-t pt-4">
              <p>Thank you for your business!</p>
              <p className="mt-1">
                This is a computer-generated invoice. No signature required.
              </p>
              <p className="mt-2">For any queries: info@mentoons.com</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2.5 rounded-lg hover:brightness-110 shadow-md font-medium"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
