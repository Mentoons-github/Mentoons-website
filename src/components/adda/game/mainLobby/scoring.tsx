import { Award, Target, Trophy } from "lucide-react";
import { LeaderboardEntry } from "./games";

interface ScoringDashboard {
  handleLeaderboardClick: () => void;
  loading: boolean;
  currentUser: LeaderboardEntry | null;
  leaderboard: LeaderboardEntry[];
}

const ScoringDashboard = ({
  handleLeaderboardClick,
  loading,
  currentUser,
  leaderboard,
}: ScoringDashboard) => {
  return (
    <div
      onClick={handleLeaderboardClick}
      className="max-w-7xl mx-auto mb-8 group cursor-pointer"
    >
      <div className="relative rounded-xl border-2 border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6 hover:border-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <div className="text-gray-400 group-hover:text-cyan-400 transition-colors">
            View Full Leaderboard
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-8 h-8 text-cyan-400" />
                <h3 className="text-xl font-semibold text-white">Your Rank</h3>
              </div>
              <p className="text-4xl font-bold text-cyan-400">
                {currentUser ? `#${currentUser.rank}` : "N/A"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">
                  Total Score
                </h3>
              </div>
              <p className="text-4xl font-bold text-blue-400">
                {currentUser ? currentUser.totalScore.toLocaleString() : "0"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8 text-cyan-400" />
                <h3 className="text-xl font-semibold text-white">
                  Top Players
                </h3>
              </div>
              <p className="text-4xl font-bold text-cyan-400">
                {leaderboard.length}
              </p>
            </div>
          </div>
        )}

        {!loading && leaderboard.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Top 3 Players
            </h3>
            <div className="space-y-3">
              {leaderboard.slice(0, 3).map((player) => (
                <div
                  key={player.playerId}
                  className="flex items-center gap-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      player.rank === 1
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900"
                        : player.rank === 2
                        ? "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900"
                        : "bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900"
                    }`}
                  >
                    {player.rank}
                  </div>

                  {player.profileImage ? (
                    <img
                      src={player.profileImage}
                      alt={player.userName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl border-2 border-cyan-500">
                      {player.userName?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      {player.userName}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {player.totalScore.toLocaleString()} points
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoringDashboard;
