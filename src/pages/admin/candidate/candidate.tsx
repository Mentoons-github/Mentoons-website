import { useState, useEffect } from "react";
import {
  Mail,
  ExternalLink,
  Loader2,
  Search,
  X,
  Send,
  CheckCircle2,
  Users,
  Inbox,
} from "lucide-react";
import { api } from "@/api/axiosInstance/axiosInstance";
import SendEmailModal, {
  EmailRecipient,
} from "@/components/admin/candidate/sendCandidateModal";
import CandidateEmailInbox from "./candidateEmailInbox";

interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  currentLocation?: string;
  totalExperienceYears?: number;
  currentDesignation?: string;
  jobTitle?: string;
  noticePeriod?: string;
  source: string;
  status: string;
  resumeUrl?: string;
  emailed?: boolean;
  lastEmailedAt?: string;
  emailCount?: number;
  createdAt: string;
}

interface Filters {
  search: string;
  jobTitle: string;
  location: string;
  minExperience: string;
  maxExperience: string;
  status: string;
  source: string;
  keySkills: string;
  emailed: string;
}

const STATUS_OPTIONS = [
  "Inbox",
  "Shortlisted",
  "In Review",
  "Interview Scheduled",
  "Selected",
  "Rejected",
  "On Hold",
  "Hired",
];

const SOURCE_OPTIONS = [
  "Naukri",
  "Internshala",
  "Job Posting",
  "LinkedIn",
  "Referral",
  "Direct",
  "Other",
];

const emptyFilters: Filters = {
  search: "",
  jobTitle: "",
  location: "",
  minExperience: "",
  maxExperience: "",
  status: "",
  source: "",
  keySkills: "",
  emailed: "",
};

const CandidateTable = () => {
  const [page, setPage] = useState(1);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showInbox, setShowInbox] = useState(false);

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [searchInput, setSearchInput] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isFetchingAll, setIsFetchingAll] = useState(false);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);
  const [emailTargetIds, setEmailTargetIds] = useState<string[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setSearchInput("");
    setPage(1);
  };

  const fetchCandidates = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim()) params.set(key, value.trim());
      });

      const { data } = await api.get(`/candidate?${params.toString()}`);
      setCandidates(data.data.candidates || []);
      setTotalPages(data.data.totalPages || 1);
      setTotalCount(data.data.totalCount || 0);
      setSelectedIds(new Set());
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showInbox) {
      fetchCandidates();
    }
  }, [page, filters, showInbox]);

  const hasActiveFilters =
    Object.values(filters).some((v) => v.trim() !== "") ||
    searchInput.trim() !== "";

  const allSelected =
    candidates.length > 0 && selectedIds.size === candidates.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(candidates.map((c) => c._id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const markEmailed = (ids: string[]) => {
    setCandidates((prev) =>
      prev.map((c) => (ids.includes(c._id) ? { ...c, emailed: true } : c)),
    );
  };

  const openEmailModalForCandidate = (candidate: Candidate) => {
    setEmailTargetIds([candidate._id]);
    setEmailRecipients([
      { id: candidate._id, name: candidate.name, email: candidate.email },
    ]);
    setIsEmailModalOpen(true);
  };

  const openEmailModalForSelected = () => {
    const selected = candidates.filter((c) => selectedIds.has(c._id));
    setEmailTargetIds(selected.map((c) => c._id));
    setEmailRecipients(
      selected.map((c) => ({ id: c._id, name: c.name, email: c.email })),
    );
    setIsEmailModalOpen(true);
  };

  const openEmailModalForAll = async () => {
    setIsFetchingAll(true);
    try {
      const { data } = await api.get(`/candidate?page=1&limit=100000`);
      const all: Candidate[] = data.data.candidates || [];
      setEmailTargetIds(all.map((c) => c._id));
      setEmailRecipients(
        all.map((c) => ({ id: c._id, name: c.name, email: c.email })),
      );
      setIsEmailModalOpen(true);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsFetchingAll(false);
    }
  };

  if (showInbox) {
    return <CandidateEmailInbox onBack={() => setShowInbox(false)} />;
  }

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, phone, skills..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filters.source}
            onChange={(e) => updateFilter("source", e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">All Sources</option>
            {SOURCE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filters.emailed}
            onChange={(e) => updateFilter("emailed", e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">All Candidates</option>
            <option value="true">Emailed</option>
            <option value="false">Not Emailed</option>
          </select>

          <button
            onClick={() => setShowMoreFilters((prev) => !prev)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 whitespace-nowrap"
          >
            {showMoreFilters ? "Fewer Filters" : "More Filters"}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg border border-red-200 text-red-500 hover:bg-red-50 whitespace-nowrap"
            >
              <X size={14} />
              Clear
            </button>
          )}

          <button
            onClick={() => setShowInbox(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 whitespace-nowrap"
          >
            <Inbox size={14} />
            View Sent Mails
          </button>

          <button
            onClick={openEmailModalForAll}
            disabled={isFetchingAll || totalCount === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gray-900 text-white font-semibold hover:opacity-90 whitespace-nowrap disabled:opacity-50"
          >
            {isFetchingAll ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Users size={14} />
            )}
            Email All Candidates
          </button>
        </div>

        {showMoreFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              value={filters.jobTitle}
              onChange={(e) => updateFilter("jobTitle", e.target.value)}
              placeholder="Job title"
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              placeholder="Location"
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              value={filters.keySkills}
              onChange={(e) => updateFilter("keySkills", e.target.value)}
              placeholder="Skills (comma separated)"
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                value={filters.minExperience}
                onChange={(e) => updateFilter("minExperience", e.target.value)}
                placeholder="Min exp"
                className="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="number"
                min={0}
                value={filters.maxExperience}
                onChange={(e) => updateFilter("maxExperience", e.target.value)}
                placeholder="Max exp"
                className="w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        )}

        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
            <span className="text-sm text-orange-700 font-medium">
              {selectedIds.size} selected
            </span>
            <button
              onClick={openEmailModalForSelected}
              className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold hover:opacity-90"
            >
              <Send size={14} />
              Send Email to Selected
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-orange-500 animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-sm text-red-500">
          Failed to load candidates.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-orange-50 to-yellow-50 text-gray-600 text-left">
                  <th className="px-4 py-3 font-semibold w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-orange-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Applied For</th>
                  <th className="px-4 py-3 font-semibold">Experience</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Emailed</th>
                  <th className="px-4 py-3 font-semibold">Resume</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr
                    key={candidate._id}
                    className={`border-t border-gray-100 hover:bg-orange-50/40 transition ${
                      selectedIds.has(candidate._id) ? "bg-orange-50/60" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(candidate._id)}
                        onChange={() => toggleSelectOne(candidate._id)}
                        className="w-4 h-4 accent-orange-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {candidate.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div>{candidate.email}</div>
                      {(candidate.mobile || candidate.phone) && (
                        <div className="text-xs text-gray-400">
                          {candidate.mobile || candidate.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {candidate.jobTitle || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {candidate.totalExperienceYears
                        ? `${candidate.totalExperienceYears} yrs`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {candidate.currentLocation || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {candidate.source}
                    </td>
                    <td className="px-4 py-3">
                      {candidate.emailed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          <CheckCircle2 size={12} />
                          Emailed
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                          Not sent
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {candidate.resumeUrl ? (
                        <a
                          href={candidate.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-600 inline-flex items-center gap-1"
                        >
                          View <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEmailModalForCandidate(candidate)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-semibold hover:opacity-90"
                      >
                        <Mail size={14} />
                        Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {candidates.length === 0 && (
            <div className="text-center py-16 text-sm text-gray-400">
              No candidates found.
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages} · {totalCount} candidates
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        recipients={emailRecipients}
        recipientType="candidate"
        onSent={() => {
          markEmailed(emailTargetIds);
        }}
      />
    </div>
  );
};

export default CandidateTable;
