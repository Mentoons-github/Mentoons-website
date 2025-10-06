import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import SessionHeader from "@/components/employee/session/sessionHeader";
import StatsBar from "@/components/employee/session/sessionStats";
import TabsAndViewToggle from "@/components/employee/session/tabsAndViewToggle";
import Filters from "@/components/employee/session/filterSession";
import SessionList from "@/components/employee/session/listSession";
import CompleteSessionModal from "../modal/completeSession";
import { Session, Stats } from "@/types/employee";

const generateThreeDigitId = (existingIds: string[]): string => {
  let newId: number;
  do {
    newId = Math.floor(100 + Math.random() * 900);
  } while (existingIds.includes(newId.toString()));
  return newId.toString();
};

const PsychologistTask: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<"not-completed" | "completed">(
    "not-completed"
  );
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set()
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("Authentication token not found. Please sign in.");
        }

        const apiUrl = `${import.meta.env.VITE_PROD_URL}/sessions`;
        const response = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedSessions = (response.data.data || response.data || []).map(
          (session: Session) => ({
            ...session,
            date: new Date(session.date),
            completedAt: session.completedAt
              ? new Date(session.completedAt)
              : undefined,
            diagnosis: session.diagnosis
              ? {
                  ...session.diagnosis,
                  addedAt: session.diagnosis.addedAt
                    ? new Date(session.diagnosis.addedAt)
                    : undefined,
                }
              : null,
          })
        );

        setSessions(fetchedSessions);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setError("Failed to load sessions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [getToken]);

  const getStats = (): Stats => {
    const total = sessions.length;
    const pending = sessions.filter(
      (s) => s.status === "pending" || s.status === "booked"
    ).length;
    const today = sessions.filter((s) => isToday(new Date(s.date))).length;
    const completed = sessions.filter((s) => s.status === "completed").length;
    return { total, pending, today, completed };
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getFilteredSessions = (): Session[] => {
    const tabFilteredSessions = sessions.filter((session) => {
      if (activeTab === "completed") {
        return session.status === "completed";
      } else {
        return session.status !== "completed";
      }
    });

    return tabFilteredSessions.filter((session) => {
      const statusMatch = !statusFilter || session.status === statusFilter;
      const dateMatch =
        !dateFilter ||
        new Date(session.date).toDateString() ===
          new Date(dateFilter).toDateString();
      const searchMatch =
        !searchFilter ||
        session.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        session.phone.includes(searchFilter);
      return statusMatch && dateMatch && searchMatch;
    });
  };

  const toggleSessionDetails = (sessionId: string): void => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const openCompleteModal = (sessionId: string): void => {
    setCurrentSessionId(sessionId);
    setShowModal(true);
    setModalMessage({ type: null, message: "" });
  };

  const cancelSession = async (sessionId: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to cancel this session?"))
      return;

    const sessionIndex = sessions.findIndex((s) => s._id === sessionId);
    if (sessionIndex === -1) return;

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not found. Please sign in.");
      }

      const apiUrl = `${import.meta.env.VITE_PROD_URL}/sessions/${sessionId}`;
      await axios.patch(
        apiUrl,
        { status: "cancelled" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedSessions = [...sessions];
      updatedSessions[sessionIndex].status = "cancelled";
      setSessions(updatedSessions);
    } catch (err) {
      console.error("Failed to cancel session:", err);
      setError("Failed to cancel session. Please try again later.");
    }
  };

  const completeSession = async (values: {
    symptoms: string;
    remedies: string;
  }): Promise<{ success: boolean; message: string }> => {
    if (!currentSessionId) {
      return { success: false, message: "No session selected." };
    }

    const sessionIndex = sessions.findIndex((s) => s._id === currentSessionId);
    if (sessionIndex === -1) {
      return { success: false, message: "Session not found." };
    }

    const existingIds = sessions
      .flatMap((s) => (s.diagnosis?._id ? [s.diagnosis._id] : []))
      .filter(Boolean) as string[];
    const diagnosisId = generateThreeDigitId(existingIds);

    const updatedFields = {
      status: "completed",
      completedAt: new Date().toISOString(),
      diagnosis: {
        _id: diagnosisId,
        symptoms: values.symptoms,
        remedies: values.remedies,
        addedAt: new Date().toISOString(),
      },
    };

    console.log("updated field :", updatedFields);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not found. Please sign in.");
      }

      const apiUrl = `${
        import.meta.env.VITE_PROD_URL
      }/sessions/${currentSessionId}`;
      await axios.patch(apiUrl, updatedFields, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedSession: Session = {
        ...sessions[sessionIndex],
        status: updatedFields.status as
          | "completed"
          | "booked"
          | "pending"
          | "cancelled"
          | "aborted",
        completedAt: new Date(updatedFields.completedAt),
        diagnosis: {
          ...updatedFields.diagnosis,
          addedAt: new Date(updatedFields.diagnosis.addedAt),
        },
      };

      const updatedSessions = [...sessions];
      updatedSessions[sessionIndex] = updatedSession;
      setSessions(updatedSessions);
      setShowModal(false);
      setCurrentSessionId(null);
      return {
        success: true,
        message: `Session completed successfully! Diagnosis ID: ${diagnosisId}`,
      };
    } catch (err) {
      console.error("Failed to complete session:", err);
      return {
        success: false,
        message: "Failed to complete session. Please try again later.",
      };
    }
  };

  const getCurrentSession = (): Session | null => {
    if (!currentSessionId) return null;
    return sessions.find((s) => s._id === currentSessionId) || null;
  };

  const resetModalMessage = () => {
    setModalMessage({ type: null, message: "" });
  };

  const stats = getStats();

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <SessionHeader
          title="Psychology Consultation Dashboard"
          description="Manage your client sessions and consultations"
        />
        <StatsBar stats={stats} />
        <TabsAndViewToggle
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          viewMode={viewMode}
          setViewMode={setViewMode}
          activeSessionsCount={
            sessions.filter((s) => s.status !== "completed").length
          }
          completedSessionsCount={
            sessions.filter((s) => s.status === "completed").length
          }
        />
        <Filters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          activeTab={activeTab}
        />
        <SessionList
          sessions={getFilteredSessions()}
          viewMode={viewMode}
          isLoading={isLoading}
          error={error}
          activeTab={activeTab}
          expandedSessions={expandedSessions}
          toggleSessionDetails={toggleSessionDetails}
          openCompleteModal={openCompleteModal}
          cancelSession={cancelSession}
        />
        <CompleteSessionModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            resetModalMessage();
          }}
          currentSession={getCurrentSession()}
          onSubmit={async (values) => {
            const result = await completeSession(values);
            setModalMessage({
              type: result.success ? "success" : "error",
              message: result.message,
            });
          }}
          message={modalMessage}
        />
      </div>
    </div>
  );
};

export default PsychologistTask;
