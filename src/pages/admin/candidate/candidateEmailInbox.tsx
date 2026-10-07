import { useState, useEffect } from "react";
import {
  Search,
  Mail,
  MailCheck,
  Clock,
  ArrowLeft,
  Paperclip,
  Loader2,
  Inbox,
} from "lucide-react";
import { api } from "@/api/axiosInstance/axiosInstance";

interface InboxCandidate {
  _id: string;
  name: string;
  email: string;
  jobTitle?: string;
  emailed?: boolean;
  lastEmailedAt?: string;
  emailCount?: number;
}

interface SentEmail {
  _id: string;
  subject?: string;
  body: string;
  attachments?: { url: string; originalName: string; mimetype: string }[];
  createdAt: string;
  status: "sent" | "failed";
}

type FilterType = "all" | "mailed" | "not_mailed" | "recent";

const FILTERS: { key: FilterType; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All Candidates", icon: <Inbox size={17} /> },
  { key: "mailed", label: "Mailed", icon: <MailCheck size={17} /> },
  { key: "not_mailed", label: "Not Mailed", icon: <Mail size={17} /> },
  { key: "recent", label: "Recently Mailed", icon: <Clock size={17} /> },
];

const CandidateEmailInbox = ({ onBack }: { onBack: () => void }) => {
  const [candidates, setCandidates] = useState<InboxCandidate[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const [selectedCandidate, setSelectedCandidate] =
    useState<InboxCandidate | null>(null);
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [isLoadingThread, setIsLoadingThread] = useState(false);

  const fetchCandidates = async () => {
    setIsLoadingList(true);
    try {
      const params = new URLSearchParams();
      params.set("filterType", activeFilter);
      params.set("limit", "100");
      if (search.trim()) params.set("search", search.trim());

      const { data } = await api.get(`/candidate/email-inbox?${params}`);
      setCandidates(data.data.candidates || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchCandidates, 300);
    return () => clearTimeout(timeout);
  }, [activeFilter, search]);

  const openThread = async (candidate: InboxCandidate) => {
    setSelectedCandidate(candidate);
    setIsLoadingThread(true);
    try {
      const { data } = await api.get(
        `/candidate/emails?candidateId=${candidate._id}`,
      );
      setEmails(data.data.emails || []);
    } catch (error) {
      console.error(error);
      setEmails([]);
    } finally {
      setIsLoadingThread(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-yellow-50">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-base text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={19} />
          Back to table
        </button>
        <span className="text-base font-semibold text-gray-800 ml-2">
          Email Inbox
        </span>
      </div>

      <div className="flex h-[650px]">
        {/* Left: candidate list */}
        <div className="w-[380px] border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100 space-y-3">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates..."
                className="w-full pl-9 pr-3 py-2.5 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border whitespace-nowrap ${
                    activeFilter === f.key
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoadingList ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={26} className="text-orange-500 animate-spin" />
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-16 text-sm text-gray-400">
                No candidates found.
              </div>
            ) : (
              candidates.map((c) => (
                <button
                  key={c.email}
                  onClick={() => openThread(c)}
                  className={`w-full text-left px-4 py-4 border-b border-gray-50 hover:bg-orange-50/50 transition ${
                    selectedCandidate?.email === c.email ? "bg-orange-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-800 truncate">
                      {c.name}
                    </span>
                    {c.emailed ? (
                      <MailCheck
                        size={16}
                        className="text-emerald-500 shrink-0"
                      />
                    ) : (
                      <Mail size={16} className="text-gray-300 shrink-0" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500 truncate mt-0.5">
                    {c.email}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm text-gray-400 truncate">
                      {c.jobTitle || "-"}
                    </span>
                    {c.lastEmailedAt && (
                      <span className="text-sm text-gray-400 shrink-0">
                        {new Date(c.lastEmailedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {typeof c.emailCount === "number" && c.emailCount > 0 && (
                    <div className="mt-1.5">
                      <span className="text-sm text-gray-400">
                        Emails sent: {c.emailCount}
                      </span>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: thread view */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {!selectedCandidate ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Mail size={48} strokeWidth={1.2} />
              <p className="text-base mt-3">
                Select a candidate to view emails
              </p>
            </div>
          ) : isLoadingThread ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={32} className="text-orange-500 animate-spin" />
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-5 pb-4 border-b border-gray-200 space-y-1.5">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedCandidate.name}
                </h3>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-400">To: </span>
                  {selectedCandidate.email}
                </p>
                {selectedCandidate.jobTitle && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-400">
                      Applied for:{" "}
                    </span>
                    {selectedCandidate.jobTitle}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-1">
                  {emails.length} email{emails.length !== 1 ? "s" : ""} sent
                  {selectedCandidate.lastEmailedAt && (
                    <>
                      {" "}
                      · Last sent:{" "}
                      {new Date(
                        selectedCandidate.lastEmailedAt,
                      ).toLocaleString()}
                    </>
                  )}
                </p>
              </div>

              {emails.length === 0 ? (
                <div className="text-center py-16 text-base text-gray-400">
                  No emails sent to this candidate yet.
                </div>
              ) : (
                <div className="space-y-5">
                  {emails.map((email) => (
                    <div
                      key={email._id}
                      className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3 gap-4">
                        <div className="min-w-0">
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">Subject: </span>
                            <span className="text-base text-gray-800 font-medium">
                              {email.subject || "(no subject)"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            <span className="font-medium">From: </span>
                            Mentoons HR Team
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            <span className="font-medium">To: </span>
                            {selectedCandidate.email}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">Sent: </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(email.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-400 font-medium mb-1.5 mt-4">
                        Message:
                      </div>
                      <div
                        className="text-base text-gray-700 prose prose-base max-w-none border border-gray-100 rounded-md p-4 bg-gray-50/50"
                        dangerouslySetInnerHTML={{ __html: email.body }}
                      />

                      {email.attachments && email.attachments.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="text-sm text-gray-400 font-medium mb-1.5">
                            Attachments ({email.attachments.length}):
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {email.attachments.map((a, i) => (
                              <a
                                key={i}
                                href={a.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600"
                              >
                                <Paperclip size={15} />
                                {a.originalName}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                        <span className="text-sm text-gray-400 font-medium">
                          Status:
                        </span>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            email.status === "sent"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {email.status === "sent" ? "Sent" : "Failed"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateEmailInbox;
