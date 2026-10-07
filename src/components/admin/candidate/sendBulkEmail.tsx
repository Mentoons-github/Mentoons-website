import { useState } from "react";
import { X, Loader2, CheckCircle2, XCircle, Send } from "lucide-react";
import { api } from "@/api/axiosInstance/axiosInstance";

interface BulkSendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateIds: string[];
  onSent: () => void;
}

type ModalStatus = "idle" | "sending" | "success" | "error";

interface CandidateResult {
  candidateId: string;
  name: string;
  email: string;
  sent: boolean;
}

interface BulkResult {
  successCount: number;
  failedCount: number;
  total: number;
  results: CandidateResult[];
}

const BulkSendEmailModal = ({
  isOpen,
  onClose,
  candidateIds,
  onSent,
}: BulkSendEmailModalProps) => {
  const [status, setStatus] = useState<ModalStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [result, setResult] = useState<BulkResult | null>(null);

  const handleSend = async () => {
    setStatus("sending");
    setProgress(0);
    setSentCount(0);

    const total = candidateIds.length;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev < 90 ? prev + 5 : prev;
        setSentCount(Math.floor((next / 100) * total));
        return next;
      });
    }, 300);

    try {
      const { data } = await api.post("/candidate/bulk-send-email", {
        candidateIds,
      });
      clearInterval(interval);
      setProgress(100);
      setSentCount(data.successCount ?? total);
      setResult({
        successCount: data.successCount,
        failedCount: data.failedCount,
        total: data.total,
        results: data.results || [],
      });
      setStatus("success");
      onSent();
    } catch (error: any) {
      clearInterval(interval);
      setProgress(0);
      setStatus("error");
      setErrorMessage(
        error?.response?.data?.message || "Failed to send emails",
      );
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setErrorMessage("");
    setProgress(0);
    setSentCount(0);
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 px-6 py-4">
          <h2 className="text-white text-xl font-bold [font-family:'Luckiest_Guy',cursive]">
            Send Bulk Email
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:opacity-80 transition"
            disabled={status === "sending"}
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6">
          {status === "idle" && (
            <>
              <p className="text-sm text-gray-600 mb-6">
                Send email to{" "}
                <span className="font-semibold text-orange-500">
                  {candidateIds.length} candidates
                </span>
                ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold"
                >
                  <Send size={16} />
                  Send to {candidateIds.length}
                </button>
              </div>
            </>
          )}

          {status === "sending" && (
            <div className="flex flex-col items-center py-8">
              <Loader2
                size={40}
                className="text-orange-500 animate-spin mb-4"
              />
              <p className="text-sm text-gray-600 mb-1">
                Sending emails to {candidateIds.length} candidates...
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {sentCount} of {candidateIds.length} sent
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">{progress}%</p>
            </div>
          )}

          {status === "success" && result && (
            <div className="flex flex-col items-center py-8">
              <CheckCircle2 size={48} className="text-green-500 mb-4" />
              <p className="text-sm font-semibold text-gray-700">
                {result.successCount} of {result.total} emails sent
              </p>
              {result.failedCount > 0 && (
                <>
                  <p className="text-xs text-red-500 mt-1">
                    {result.failedCount} failed to send
                  </p>
                  <div className="w-full mt-4 max-h-40 overflow-y-auto rounded-lg border border-red-100 bg-red-50">
                    {result.results
                      .filter((r) => !r.sent)
                      .map((r) => (
                        <div
                          key={r.candidateId}
                          className="px-3 py-2 text-xs text-red-600 border-b border-red-100 last:border-b-0"
                        >
                          <span className="font-medium">{r.name}</span>{" "}
                          <span className="text-red-400">({r.email})</span>
                        </div>
                      ))}
                  </div>
                </>
              )}
              <button
                onClick={handleClose}
                className="mt-5 px-5 py-2 text-sm rounded-lg bg-gray-800 text-white font-semibold"
              >
                Close
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center py-8">
              <XCircle size={48} className="text-red-500 mb-4" />
              <p className="text-sm font-semibold text-gray-700">
                {errorMessage}
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setStatus("idle")}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-white font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkSendEmailModal;
