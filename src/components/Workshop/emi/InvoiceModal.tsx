import { X, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type InvoiceModalProps = {
  onClose: () => void;
};

const InvoiceModal = ({ onClose }: InvoiceModalProps) => {
  const downloadPDF = async () => {
    const element = document.getElementById("invoice-content");
    if (!element) return;

    // 🔒 Force desktop/A4 mode
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
    pdf.save("Workshop-Invoice.pdf");
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl
                   max-h-[95vh] w-full max-w-[900px]
                   overflow-y-auto p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <X
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-500"
        />

        {/* ================= A4 PREVIEW ================= */}
        <div className="flex justify-center">
          <div
            id="invoice-content"
            className="
              bg-white text-gray-700
              w-[794px] min-h-[1123px]
              p-10 shadow
              text-[16px]
            "
          >
            {/* Header */}
            <div className="flex justify-between mb-8">
              <div className="space-y-2">
                <img
                  src="/assets/LandingPage/logo.png"
                  alt="logo"
                  className="w-48"
                />
                <div>
                  <p>Domlur, Bengaluru</p>
                  <p>Karnataka 560071</p>
                  <p>+91 7892858593</p>
                </div>
              </div>

              <div className="text-right space-y-2">
                <h1 className="text-[24px] font-semibold tracking-wide">
                  INVOICE
                </h1>
                <div>
                  <p><b>Invoice No:</b> INV-1023</p>
                  <p><b>Date:</b> 13 Jan 2026</p>
                </div>
              </div>
            </div>

            {/* Billed To */}
            <div className="mb-8">
              <p className="font-semibold mb-1">Billed To</p>
              <p>Parent Name: Ahmed Ali</p>
              <p>Child Name: Ayaan</p>
              <p>+91 7514825425</p>
            </div>

            {/* Workshop Table */}
            <div className="border rounded-md overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Workshop</th>
                    <th className="p-3 text-left">Payment Type</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">Kalakrithi (Art therapy)</td>
                    <td className="p-3">EMI – Month 2</td>
                    <td className="p-3 text-right">₹3,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Summary */}
            <div className="flex justify-end">
              <div className="w-72 space-y-3">
                <div className="flex justify-between">
                  <span>Total Plan Amount</span>
                  <span>₹18,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid Till Now</span>
                  <span>₹6,000</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-3">
                  <span>Remaining Amount</span>
                  <span>₹12,000</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-20 text-center text-xs text-gray-500">
              This is a system-generated invoice. No signature required.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-4">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
