import {
  CheckCircle,
  CreditCard,
  Calendar,
  ArrowLeft,
  Shield,
  Clock,
  Users,
  Star,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { handleFirstDownPayment } from "@/api/workshop/emi";
import { useAuth } from "@clerk/clerk-react";
import { WorkshopPlan } from "@/types/workshopsV2/workshopsV2";

const PaymentDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan as WorkshopPlan;

  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();

  const [selectedPayment, setSelectedPayment] = useState<"FULL" | "EMI">(
    "FULL"
  );
  const [showBPLDiscount, setShowBPLDiscount] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>(
    plan?.mode?.[0] || ""
  );
  const [showBPLUpload, setShowBPLUpload] = useState(false);
  const [bplCardFile, setBplCardFile] = useState<File | null>(null);

  if (!plan) {
    navigate("/workshops");
    return null;
  }

  const introductoryPrice = plan.price.introductory || 14999;
  const bplDiscountPrice = introductoryPrice * 0.3;

  const hasEMI = plan.paymentOptions?.includes("EMI") && plan.emi?.enabled;
  const emiDownPayment = plan.emi?.downPayment || 3000;
  const emiMonthly = plan.emi?.monthlyAmount || 1999;
  const emiMonths = plan.emi?.durationMonths || plan.durationMonths || 6;

  const handleBackToPlans = () => navigate(-1);

  const handleBPLApply = () => {
    if (!showBPLUpload) setShowBPLUpload(true);
  };

  const handlePayment = async () => {
    if (!selectedOption) {
      showStatus("error", "Please select a payment option");
      return;
    }

    const paymentDetails = {
      planId: plan.planId,
      plan,
      paymentType: selectedPayment,
      mode: selectedMode,
      bplApplied: showBPLDiscount,
      amount: selectedOption.details.total,
      initialAmount: selectedOption.details.displayAmount,
      bplCardFile: bplCardFile
        ? {
            name: bplCardFile.name,
            size: bplCardFile.size,
            type: bplCardFile.type,
          }
        : null,
    };

    try {
      showStatus("info", "Initiating payment...");
      const response = await handleFirstDownPayment({
        paymentDetails,
        getToken,
      });
      
      if (response) {
        showStatus("success", "Redirecting to payment gateway...");
      }

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = response;

      const form = tempDiv.querySelector("form");
      if (form) {
        document.body.appendChild(form);
        form.submit();
      } else {
        console.error("Form not found in the response HTML.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      showStatus("error", "Failed to start payment. Please try again.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setBplCardFile(file);
    setShowBPLDiscount(true);
  };

  const handleRemoveBPLCard = () => {
    setBplCardFile(null);
    setShowBPLDiscount(false);
    setShowBPLUpload(false);
  };

  const getPaymentOptions = () => {
    const basePrice = showBPLDiscount ? bplDiscountPrice : introductoryPrice;

    const options = [
      {
        id: "FULL",
        name: "One-Time Payment",
        icon: <CreditCard className="w-5 h-5" />,
        details: {
          displayAmount: basePrice,
          total: basePrice,
          breakdown: "Pay full amount now",
        },
      },
    ];

    if (hasEMI) {
      options.push({
        id: "EMI",
        name: "Monthly EMI",
        icon: <Calendar className="w-5 h-5" />,
        details: {
          displayAmount: emiDownPayment,
          total: basePrice,
          breakdown: `Down payment: ₹${emiDownPayment} + ${emiMonths} × ₹${emiMonthly}/mo`,
        },
      });
    }

    return options;
  };

  const paymentOptions = getPaymentOptions();
  const selectedOption = paymentOptions.find(
    (opt) => opt.id === selectedPayment,
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-black text-white py-6 px-4 border-b-4 border-black">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={handleBackToPlans}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Plans</span>
          </button>
          <h1 className="text-4xl font-bold">Payment Details</h1>
          <p className="text-gray-300 mt-2">
            Review your order and complete payment
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 pb-3 border-b-2 border-black">
            Workshop Details
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-2 border-black p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6" />
                <span className="text-sm font-medium text-gray-600">
                  Duration
                </span>
              </div>
              <p className="text-2xl font-bold">{plan.duration}</p>
            </div>

            <div className="border-2 border-black p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6" />
                <span className="text-sm font-medium text-gray-600">
                  Age Group
                </span>
              </div>
              <p className="text-2xl font-bold">{plan.age} years</p>
            </div>

            <div className="border-2 border-black p-6">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6" />
                <span className="text-sm font-medium text-gray-600">
                  Sessions
                </span>
              </div>
              <p className="text-2xl font-bold">{plan.totalSession} Sessions</p>
            </div>
          </div>

          <div className="mt-6 border-2 border-black p-6">
            <h3 className="font-bold text-lg mb-4">Select Mode</h3>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full border-2 border-black px-4 py-3 text-lg font-medium bg-white focus:outline-none focus:border-gray-600"
            >
              {plan.mode.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 border-2 border-black p-6">
            <h3 className="font-bold text-lg mb-4">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-black text-white p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    BPL Discount Available
                  </h3>
                  <p className="text-gray-300">
                    70% discount for Below Poverty Line families
                  </p>
                </div>
                {!bplCardFile && (
                  <button
                    onClick={handleBPLApply}
                    className="px-8 py-3 font-bold transition-colors bg-transparent text-white border-2 border-white hover:bg-white hover:text-black"
                  >
                    Apply Now
                  </button>
                )}
              </div>

              {showBPLUpload && !bplCardFile && (
                <div className="border-2 border-white p-6 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Upload className="w-5 h-5" />
                    <h4 className="font-bold text-lg">Upload BPL Card</h4>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Please upload a clear photo of your BPL card for
                    verification
                  </p>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:border-2 file:border-white file:text-sm file:font-bold file:bg-white file:text-black hover:file:bg-gray-100 file:cursor-pointer cursor-pointer"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-3">
                    Accepted formats: JPG, PNG, JPEG (Max 5MB)
                  </p>
                </div>
              )}

              {bplCardFile && (
                <div className="border-2 border-white p-6 mt-4 bg-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-white" />
                      <div>
                        <h4 className="font-bold text-lg">BPL Card Uploaded</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          {bplCardFile.name}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Size: {(bplCardFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveBPLCard}
                      className="px-4 py-2 text-sm font-bold border-2 border-white hover:bg-white hover:text-black transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 p-3 bg-green-500/20 border-2 border-green-400">
                    <p className="text-sm font-bold text-green-300">
                      ✓ 70% discount applied to all prices
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 pb-3 border-b-2 border-black">
            Pricing Summary
          </h2>

          <div className="border-2 border-black p-8 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-300">
              <span className="text-lg">Original Price</span>
              <span className="text-lg line-through text-gray-500">
                ₹{plan.price.original}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b-2 border-black">
              <span className="text-xl font-bold">Introductory Price</span>
              <span className="text-2xl font-bold">₹{introductoryPrice}</span>
            </div>

            {showBPLDiscount && (
              <>
                <div className="flex justify-between items-center py-3 bg-gray-100 px-4">
                  <span className="text-lg font-medium">
                    BPL Discount (70%)
                  </span>
                  <span className="text-lg font-bold">
                    - ₹{(introductoryPrice * 0.7).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 bg-black text-white px-4">
                  <span className="text-2xl font-bold">Final Price</span>
                  <span className="text-3xl font-bold">
                    ₹{bplDiscountPrice.toFixed(0)}
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 pb-3 border-b-2 border-black">
            Payment Method
          </h2>

          <div className="space-y-4">
            {paymentOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setSelectedPayment(option.id as "FULL" | "EMI")}
                className={`border-4 p-6 cursor-pointer transition-all ${
                  selectedPayment === option.id
                    ? "border-black bg-gray-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 border-2 flex items-center justify-center ${
                        selectedPayment === option.id
                          ? "border-black bg-black text-white"
                          : "border-gray-400"
                      }`}
                    >
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{option.name}</h3>
                      <p className="text-sm text-gray-600">
                        {option.details.breakdown}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      ₹{option.details.displayAmount.toFixed(0)}
                    </div>
                    {selectedPayment === option.id && (
                      <div className="text-sm font-medium mt-1">Selected</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selectedOption && (
          <section className="mb-12">
            <div className="border-4 border-black p-8 bg-gray-50">
              <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-black">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Order Summary</h3>
                  <p className="text-gray-600">{selectedOption.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedOption.details.breakdown}
                  </p>

                  {selectedPayment === "EMI" && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-lg font-bold text-blue-800">
                        Pay Now: ₹{emiDownPayment.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Then ₹{emiMonthly.toLocaleString()}/month for{" "}
                        {emiMonths} months
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Total course fee: ₹
                        {selectedOption.details.total.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">
                    {selectedPayment === "FULL"
                      ? "Total Amount"
                      : "Total Course Fee"}
                  </p>
                  <div className="text-5xl font-bold">
                    ₹{selectedOption.details.total.toFixed(0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Instant Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Expert Psychologists
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-black text-white py-6 text-2xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
              >
                <Shield className="w-6 h-6" />
                Proceed to Payment
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                🔒 All payments are secure and encrypted
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-black text-white py-8 px-4 mt-12">
        <div className="max-w-5xl mx-auto text-center">
          <p className="mb-2">
            By proceeding, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-gray-300">
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="underline cursor-pointer hover:text-gray-300">
              Privacy Policy
            </span>
          </p>
          <p className="text-sm text-gray-400">
            © 2024 Workshop Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PaymentDetailPage;
