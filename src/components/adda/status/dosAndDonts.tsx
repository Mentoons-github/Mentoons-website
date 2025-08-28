import { useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { DONTS, DOS } from "@/constant/adda/status";

interface DosAndDontsProps {
  isOpen: boolean;
  onClose: () => void;
}

const DosAndDonts: React.FC<DosAndDontsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"dos" | "donts">("dos");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="bg-gradient-to-br from-orange-600 via-orange-400 to-orange-600 text-white p-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Community Guidelines
            </h1>
            <p className="text-purple-100 text-lg opacity-90">
              Creating a positive space for everyone
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center -mt-6 relative z-10 px-8">
          <div className="flex bg-white rounded-2xl p-2 shadow-lg border">
            <button
              onClick={() => setActiveTab("dos")}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === "dos"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Do's
            </button>
            <button
              onClick={() => setActiveTab("donts")}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === "donts"
                  ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              <XCircle className="w-5 h-5" />
              Don'ts
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 pt-12">
          <div className="relative h-80 overflow-hidden">
            {/* Do's Content */}
            <div
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                activeTab === "dos"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <div className="h-full">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-green-700 flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    Best Practices
                  </h2>
                  <p className="text-green-600 mt-2">
                    Guidelines for positive engagement
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 h-52 overflow-y-auto pr-2">
                  {DOS.map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:shadow-md border border-green-100 hover:border-green-200 hover:-translate-y-1"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-medium leading-relaxed text-sm">
                          {item.text}
                        </p>
                        <span className="inline-block mt-2 px-3 py-1 bg-green-200 text-green-700 text-xs font-semibold rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Don'ts Content */}
            <div
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                activeTab === "donts"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-full"
              }`}
            >
              <div className="h-full">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-red-700 flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                      <XCircle className="w-7 h-7 text-white" />
                    </div>
                    Things to Avoid
                  </h2>
                  <p className="text-red-600 mt-2">
                    Keep our community safe and welcoming
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 h-52 overflow-y-auto pr-2">
                  {DONTS.map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 transition-all duration-300 hover:shadow-md border border-red-100 hover:border-red-200 hover:-translate-y-1"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-medium leading-relaxed text-sm">
                          {item.text}
                        </p>
                        <span className="inline-block mt-2 px-3 py-1 bg-red-200 text-red-700 text-xs font-semibold rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-purple-50 via-purple-100 to-pink-50 p-6 text-center border-t">
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <span className="text-2xl">🌟</span>
            <p className="font-medium">
              Together we create a positive and inclusive community!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DosAndDonts;
