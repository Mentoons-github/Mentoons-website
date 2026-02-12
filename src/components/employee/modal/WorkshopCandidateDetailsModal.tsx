import { WorkshopStudentsTypes } from "@/types/workshopsV2/workshopBatchTypes";
import { WorkshopBatchDates } from "@/utils/formateDate";
import { X, Phone, School, User2 } from "lucide-react";
import { ReactNode, useState } from "react";
import AddScoringModal from "./AddScoringModal";
import ShowScoreModal from "./ShowScoreModal";

const WorkshopCandidateDetailsModal = ({
  candidate,
  currentSession,
  onClose,
}: {
  candidate: WorkshopStudentsTypes;
  currentSession: number;
  onClose: () => void;
}) => {
  const [scoringModalOpen, setScoringModalOpen] = useState(false);
  const [clickedSessionId, setClickedSessionId] = useState<string | null>(null);

  if (!candidate) return null;

  const clickedSession = candidate.scoring.sessions.find(
    (s) => s._id === clickedSessionId,
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-orange-50 px-6 py-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-orange-500 hover:text-orange-400"
          >
            <X />
          </button>

          <div className="flex justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold">{candidate.name}</h2>
              <p className="text-sm text-gray-600">
                Age {candidate.age} · {candidate.gender}
              </p>
            </div>
            <button
              className="py-2 px-3 bg-orange-500 mr-5 rounded-md text-white"
              onClick={() => setScoringModalOpen(true)}
            >
              Add scoring
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[520px] overflow-y-auto">
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <InfoCard
              icon={<User2 size={18} />}
              label="Date of Birth"
              value={WorkshopBatchDates(candidate.dateOfBirth)}
            />

            <InfoCard
              icon={<Phone size={18} />}
              label="Parent Contact"
              value={candidate.mobileNumber}
            />

            <InfoCard
              icon={<School size={18} />}
              label="School"
              value={candidate.school}
            />

            <InfoCard
              icon={<School size={18} />}
              label="Class"
              value={`Class ${candidate.class}`}
            />
          </div>

          {/* Parents */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium mb-2 text-gray-700">Parents</p>
            <div className="flex justify-between text-sm">
              <span>👨 Father: {candidate.fatherName}</span>
              <span>👩 Mother: {candidate.motherName}</span>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Address</p>
            <div className="rounded-lg bg-gray-100 p-3 text-sm">
              {candidate.address}
            </div>
          </div>

          {/* Session Scores */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Session Scores</h2>

            {candidate.scoring.sessions.length === 0 ? (
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                No session scores recorded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {candidate.scoring.sessions.map((session, index) => {
                  return (
                    <div
                      key={index}
                      className={`rounded-xl p-4 border transition border-gray-200 bg-white hover:shadow-sm"
              
            `}
                      onClick={() => setClickedSessionId(session._id as string)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-sm">
                          Session {index + 1} <span className="text-xs font-normal">({session.sessionName})</span>
                        </p>
                      </div>

                      <p className="text-2xl font-semibold text-gray-800">
                        {session.scors.totalScore}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">Total Score</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {scoringModalOpen && (
        <AddScoringModal
          onClose={() => setScoringModalOpen(false)}
          sessionNumber={currentSession}
          studentId={candidate._id}
        />
      )}
      {clickedSession && (
        <ShowScoreModal
          clickedSession={clickedSession}
          onClose={() => setClickedSessionId(null)}
          candidateName={candidate.name}
          studentId={candidate._id}
        />
      )}
    </div>
  );
};

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex gap-3 items-start bg-white border rounded-xl p-4 hover:shadow-sm transition">
    <div className="text-orange-500 mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default WorkshopCandidateDetailsModal;
