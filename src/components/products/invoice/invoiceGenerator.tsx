import { forwardRef } from "react";
import { OrderData } from "@/types";

interface InvoiceGeneratorProps {
  order: OrderData;
}

const InvoiceGenerator = forwardRef<HTMLDivElement, InvoiceGeneratorProps>(
  ({ order }, ref) => {
    const generationDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const issueDate = new Date(order.purchaseDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const items = order.items.map((item) => ({
      id: item.productId,
      name: item.productName,
      image: item.productImage || "https://placehold.co/400",
      quantity: item.quantity,
      price: item.price,
    }));

    const discountPercentage = order.discount || 0;
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const discountAmount =
      discountPercentage > 0 ? (subtotal * discountPercentage) / 100 : 0;
    const total = subtotal - discountAmount;

    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <style>
          {`
            @media print {
              html, body {
                height: auto !important;
                overflow: visible !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              
              body * {
                visibility: hidden;
              }
              
              #invoice, #invoice * {
                visibility: visible;
              }
              
              #invoice {
                position: absolute;
                left: 0;
                top: 0;
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 0.5in !important;
                box-shadow: none !important;
                border-radius: 0 !important;
                background: white !important;
                min-height: auto !important;
                height: auto !important;
                page-break-after: avoid !important;
              }
              
              .no-print {
                display: none !important;
              }
              
              .invoice-container {
                font-size: 11pt !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: none !important;
                border-radius: 0 !important;
                max-width: none !important;
                background: white !important;
              }
              
              table {
                page-break-inside: auto;
                width: 100% !important;
                border-spacing: 0;
              }
              
              th, td {
                vertical-align: middle !important;
                line-height: 1.2 !important;
              }
              
              img {
                max-width: 100%;
                height: auto;
              }
              
              .bg-gray-100 {
                background: white !important;
              }
              
              .bg-gray-50 {
                background: #f9f9f9 !important;
              }
              
              .bg-blue-50 {
                background: #eff6ff !important;
              }
              
              .bg-gradient-to-r {
                background: #2563eb !important;
              }
              
              .min-h-screen {
                min-height: auto !important;
              }
              
              .space-y-6 > :not([hidden]) ~ :not([hidden]) {
                margin-top: 1rem !important;
              }
              
              .mt-8 {
                margin-top: 1.5rem !important;
              }
              
              .py-8 {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
              }
            }
          `}
        </style>
        <div
          id="invoice"
          ref={ref}
          className="invoice-container max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6"
        >
          <div className="invoice-header flex flex-col sm:flex-row justify-center items-center gap-6">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-blue-600">
                Mentoons
              </h1>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                399, 2nd Cross Rd, Opposite The Paul Hotel, HBCS Colony,
                <br />
                Amarjyoti Layout, Domlur,
                <br />
                Bengaluru, Karnataka 560071
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>
              <span className="font-medium">Date:</span> {generationDate}
            </p>
            <div className="no-print space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                Download PDF
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm">
                Print
              </button>
            </div>
          </div>

          <div className="border-t-2 border-blue-500"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Bill To:</h2>
              <p className="text-sm font-medium">
                {order.customerName || "Customer"}
              </p>
              <p className="text-sm text-gray-600">{order.email || "N/A"}</p>
              <p className="text-sm text-gray-600">{order.phone || "N/A"}</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold text-gray-700">
                Invoice Details:
              </h2>
              <p className="text-sm">
                <span className="font-medium">Invoice No:</span> {order.orderId}
              </p>
              <p className="text-sm">
                <span className="font-medium">Date Issued:</span> {issueDate}
              </p>
            </div>
          </div>

          <div className="invoice-title bg-blue-600 text-white text-xl font-bold py-3 px-5 rounded-lg text-center">
            INVOICE
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b p-2 text-left font-semibold text-gray-700 w-[5%]">
                    #
                  </th>
                  <th className="border-b p-2 text-left font-semibold text-gray-700 w-[50%]">
                    Description
                  </th>
                  <th className="border-b p-2 text-right font-semibold text-gray-700 w-[15%]">
                    Qty
                  </th>
                  <th className="border-b p-2 text-right font-semibold text-gray-700 w-[15%]">
                    Price
                  </th>
                  <th className="border-b p-2 text-right font-semibold text-gray-700 w-[15%]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border-b p-2">{index + 1}</td>
                    <td className="border-b p-2">{item.name}</td>
                    <td className="border-b p-2 text-right">{item.quantity}</td>
                    <td className="border-b p-2 text-right">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="border-b p-2 text-right">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan={4} className="border-b p-2 text-right">
                    Subtotal:
                  </td>
                  <td className="border-b p-2 text-right">
                    ₹{subtotal.toFixed(2)}
                  </td>
                </tr>
                {discountPercentage > 0 && (
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={4} className="border-b p-2 text-right">
                      Discount ({discountPercentage}%):
                    </td>
                    <td className="border-b p-2 text-right text-green-600">
                      -₹{discountAmount.toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr className="bg-blue-50 font-bold">
                  <td colSpan={4} className="p-2 text-right">
                    Total:
                  </td>
                  <td className="p-2 text-right">₹{total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="invoice-footer mt-8 pt-6 border-t-2 border-gray-200 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-blue-800 mb-2">
                Thank You for Choosing Mentoons!
              </h3>
              <p className="text-sm text-gray-600">
                If you have any questions, feedback, or need assistance, feel
                free to reach out at{" "}
                <span className="font-medium text-blue-600">
                  info@mentoons.com
                </span>
              </p>
              <div className="mt-3 text-xs text-gray-500">
                <p>
                  This is a computer-generated invoice and does not require a
                  physical signature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default InvoiceGenerator;
