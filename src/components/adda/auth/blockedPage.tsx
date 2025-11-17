import { AlertTriangle, Mail, ShieldAlert } from "lucide-react";
import { useEffect } from "react";

const BlockedPage = () => {
  useEffect(() => {
    window.history.pushState(null, "", "/blocked");
    const handlePopState = () => {
      window.history.pushState(null, "", "/blocked");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <ShieldAlert className="w-20 h-20 text-red-600 animate-pulse" />
            <AlertTriangle className="w-10 h-10 text-red-600 absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Account Blocked
        </h1>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Your account has been permanently blocked.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-gray-700">
            This action cannot be undone. For queries contact support.
          </p>
        </div>

        <a
          href="mailto:info@mentoons.com"
          className="mt-8 inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-4 rounded-lg transition"
        >
          <Mail className="w-5 h-5" />
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default BlockedPage;
