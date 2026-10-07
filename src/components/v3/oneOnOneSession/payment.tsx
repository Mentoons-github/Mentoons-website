import { Landmark, Lock, Smartphone, Wallet } from "lucide-react";

interface PaymentSectionProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI (Google Pay, PhonePe, etc)", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", icon: Lock },
  { id: "netbanking", label: "Net Banking", icon: Landmark },
  { id: "wallet", label: "Wallets (Paytm, etc.)", icon: Wallet },
];

const PaymentSection = ({
  selectedMethod,
  onSelectMethod,
}: PaymentSectionProps) => {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
          3
        </span>
        <h2 className="text-base font-semibold text-stone-900">Make Payment</h2>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
        {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => {
          const isSelected = id === selectedMethod;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectMethod(id)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                isSelected
                  ? "border-stone-900"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  isSelected ? "border-stone-900" : "border-stone-300"
                }`}
              >
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-stone-900" />
                )}
              </span>
              <Icon className="h-4 w-4 text-stone-500" />
              <span className="text-stone-700">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
        <Lock className="h-3.5 w-3.5" />
        Payments are secured and encrypted.
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <span className="text-sm font-semibold tracking-tight text-stone-700">
          UPI
        </span>
        <span className="text-sm font-semibold italic text-stone-700">
          VISA
        </span>
        <span className="flex -space-x-2">
          <span className="h-5 w-5 rounded-full bg-red-500 opacity-80" />
          <span className="h-5 w-5 rounded-full bg-yellow-500 opacity-80" />
        </span>
        <span className="text-sm font-semibold text-stone-700">RuPay</span>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Your information is safe with us. We maintain strict confidentiality.
      </div>
    </div>
  );
};

export default PaymentSection;
