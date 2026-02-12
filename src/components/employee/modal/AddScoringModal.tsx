import { SCROING_SYSTEM } from "@/constant/employee/scoringSystemQuestions";
import { useEffect, useState } from "react";
import { ScoreSelect } from "../dataCaptureComponents/AddScoring/ScoreSelect";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { ScoringCategory } from "@/types/employee/scoringSystemTypes";
import { SessionScoringType } from "@/types/workshopsV2/workshopBatchTypes";
import {
  addScoringWorkshopThunk,
  updateScoringWorkshopThunk,
} from "@/redux/workshop/workshopBatches/workshopBatchThunk";
import { resetWorkshopBatchReducer } from "@/redux/workshop/workshopBatches/workshopBatchSlice";

/* ---------------- TYPES ---------------- */

type ScoreState = {
  [mainIdx: number]: {
    [qIdx: number]: number;
  };
};

const WORKSHOPS = [
  { key: "teenCamp", label: "Teen Camp" },
  { key: "kalakrithi", label: "Kalakrithi" },
  { key: "instantKatha", label: "Instant Katha" },
  { key: "hasyaras", label: "Hasyaras" },
  { key: "swar", label: "Swar" },
] as const;

const AddScoringModal = ({
  onClose,
  sessionNumber,
  studentId,
  currentSession,
}: {
  onClose: () => void;
  sessionNumber?: number;
  studentId?: string;
  currentSession?: SessionScoringType;
}) => {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const { scoringSuccess, error, message, loading } = useAppSelector(
    (s) => s.workshop_batch,
  );

  const [scores, setScores] = useState<ScoreState>({});
  const [mainIdx, setMainIdx] = useState(0);
  const [sessionName, setSessionpName] = useState<string>(
    currentSession?.sessionName || "teenCamp",
  );

  const isEdit = Boolean(currentSession);

  const scoringSource: ScoringCategory[] = SCROING_SYSTEM.find(
    (p) => p[sessionName],
  )![sessionName];

  const getHeadingScore = (mIdx: number) => {
    const questions = scoringSource[mIdx].questions;

    return questions.reduce((sum, _, qIdx) => {
      return sum + (scores?.[mIdx]?.[qIdx] ?? 0);
    }, 0);
  };

  useEffect(() => {
    if (!isEdit) return;

    const init: ScoreState = {};

    currentSession!.scors.headings.forEach((main, m) => {
      init[m] = {};

      currentSession!.scors.headings.forEach((main, m) => {
        init[m] = {};
        main.questions.forEach((q, qIdx) => {
          init[m][qIdx] = q.score;
        });
      });
    });

    setScores(init);
  }, [currentSession, isEdit]);

  /* ---------------- TOAST ---------------- */

  useEffect(() => {
    if (scoringSuccess) {
      toast.success(message);
      dispatch(resetWorkshopBatchReducer());
      onClose();
    }
    if (error) {
      toast.error(error);
      dispatch(resetWorkshopBatchReducer());
    }
  }, [error, message, onClose, scoringSuccess]);

  /* ---------------- SCORE HANDLING ---------------- */

  const handleScoreChange = (m: number, q: number, val: number) => {
    setScores((p) => ({
      ...p,
      [m]: {
        ...p[m],
        [q]: val,
      },
    }));
  };

  /* ---------------- VALIDATION ---------------- */

  const validateStep = () => {
    const questions = scoringSource[mainIdx].questions;
    return questions.every((_, i) => scores?.[mainIdx]?.[i] !== undefined);
  };

  /* ---------------- NAVIGATION ---------------- */

  const isLastStep = () => mainIdx === scoringSource.length - 1;

  const handleNext = () => {
    if (!validateStep()) {
      toast.error("Please score all questions");
      return;
    }
    setMainIdx((p) => p + 1);
  };

  const handlePrev = () => {
    if (mainIdx > 0) setMainIdx((p) => p - 1);
  };

  /* ---------------- SUBMIT ---------------- */

  const buildSubmissionPayload = (): SessionScoringType => {
    let totalScore = 0;

    const headings = scoringSource.map((main, mIdx) => {
      let headingScore = 0;

      const questions = main.questions.map((_, qIdx) => {
        const score = scores?.[mIdx]?.[qIdx] ?? 0;
        headingScore += score;

        return {
          questionIndex: qIdx + 1,
          score,
        };
      });

      totalScore += headingScore;

      return {
        headingIndex: mIdx + 1,
        headingScore,
        questions,
      };
    });

    return {
      sessionName,
      sessionNumber: sessionNumber as number,
      sessionDate: new Date().toISOString(),

      scors: {
        headings,
        totalScore,
      },
    };
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      toast.error("Please score all questions");
      return;
    }

    const token = await getToken();

    if (isEdit) {
      dispatch(
        updateScoringWorkshopThunk({
          token: token as string,
          sessionId: currentSession?._id as string,
          sessionScore: buildSubmissionPayload(),
          studentId: studentId as string,
        }),
      );
    } else {
      dispatch(
        addScoringWorkshopThunk({
          token: token as string,
          studentId: studentId as string,
          sessionScore: buildSubmissionPayload(),
        }),
      );
    }
  };

  /* ---------------- RENDER ---------------- */

  const main = scoringSource[mainIdx];

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl h-[650px] rounded-lg p-6 space-y-6 overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-orange-500"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold text-center">SCORING SYSTEM</h2>
        {/* {!isEdit && ( */}
          <div>
            <select
              value={sessionName}
              onChange={(e) => setSessionpName(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="" disabled>
                Select option
              </option>

              {WORKSHOPS.map((w) => (
                <option key={w.key} value={w.key}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
        {/* )} */}

        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-lg flex justify-between items-center">
            <span>
              {mainIdx + 1}. {main.heading}
            </span>

            <span className="text-sm font-medium text-blue-600">
              Score: {getHeadingScore(mainIdx)}/{main.point}
            </span>
          </h3>

          {main.questions.map((q, qIdx) => (
            <div key={qIdx} className="flex justify-between items-center gap-4">
              <p className="text-sm flex-1">
                {qIdx + 1}. {q.question}
              </p>
              <ScoreSelect
                max={q.point}
                value={scores?.[mainIdx]?.[qIdx]}
                onChange={(v) => handleScoreChange(mainIdx, qIdx, v)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between border-t pt-4">
          <button
            onClick={handlePrev}
            disabled={mainIdx === 0}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Previous
          </button>

          {isLastStep() ? (
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded disabled:bg-gray-700"
            >
              {loading ? "Loading..." : "Submit Scoring"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddScoringModal;
