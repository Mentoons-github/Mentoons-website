import { ReviewCard } from "./InventorsQuestion";

interface InventorsReviewCardProps {
  lastBatchScore: number;
  batchSize: number;
  reviewCards: ReviewCard[];
  onNextRound: () => void;
}

const InventorsReviewCard = ({
  batchSize,
  lastBatchScore,
  reviewCards,
  onNextRound,
}: InventorsReviewCardProps) => {
  return (
    <div className="text-white w-full">
      <h2 className="text-2xl font-bold text-center mb-1 text-yellow-950">
        Answer Comparison
      </h2>

      <p className="text-center text-blue-400 mb-2 md:mb-6 font-semibold">
        Score this round: {lastBatchScore} / {batchSize}
      </p>

      <div className="mb-6">
        <h3 className="text-green-500 font-bold mb-3 text-center">
          ✅ Correct Answers
        </h3>

        <div
          className={`grid ${
            reviewCards.length === 8
              ? "grid-cols-3 md:grid-cols-4"
              : "grid-cols-3 md:grid-cols-4"
          } gap-1 md:gap-4`}
        >
          {reviewCards.map((c) => (
            <div
              key={c.id}
              className="bg-[#25c82f]  border-[4px] border-[#00a056] rounded-md p-1 md:p-3 text-center"
            >
              <img
                src={c.correctInventorImg}
                className="w-16 h-16 mx-auto rounded-full mb-2 border-2 border-[#00a056] bg-black"
              />
              <p className="font-bold text-sm">{c.correctInventor}</p>

              <img
                src={c.correctInventionImg}
                className="w-14 h-14 mx-auto mt-2"
              />
              <p className="text-xs text-black mt-1">{c.correctInvention}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-violet-700 font-bold mb-3 text-center">
          🧑 Your Answers
        </h3>

        <div
          className={`grid ${
            reviewCards.length === 8
              ? "grid-cols-3 md:grid-cols-4"
              : "grid-cols-3 md:grid-cols-4"
          } gap-1 md:gap-4`}
        >
          {reviewCards.map((c) => (
            <div
              key={c.id}
              className={`rounded-md p-1 md:p-3 text-center border-[4px]
                ${
                  c.isCorrect
                    ? "bg-[#25c82f] border-[#00a056]"
                    : "bg-red-800/20 border-[#f2312a]"
                }
              `}
            >
              <div className="flex items-center justify-center mb-1">
                <span
                  className={`text-sm font-bold ${
                    c.isCorrect ? "text-[#043908]" : "text-[#f2312a]"
                  }`}
                >
                  {c.isCorrect ? "✓ Correct" : "✗ Wrong"}
                </span>
              </div>

              <img
                src={c.userInventorImg}
                className={`w-16 h-16 mx-auto rounded-full mb-2 border-2 bg-black ${
                  c.isCorrect ? "border-[#00a056]" : "border-[#f2312a]"
                }`}
              />
              <p className="font-bold text-sm">{c.userInventor}</p>

              <img
                src={c.userInventionImg}
                className="w-14 h-14 mx-auto mt-2"
              />
              <p className="text-xs text-black mt-1">{c.userInvention}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ NEXT BUTTON */}
      <div className="text-center">
        <button
          onClick={onNextRound}
          className="bg-teal-600 hover:bg-teal-500 px-10 py-3 rounded-xl	font-bold shadow-lg transition-all"
        >
          Next Round →
        </button>
      </div>
    </div>
  );
};

export default InventorsReviewCard;
