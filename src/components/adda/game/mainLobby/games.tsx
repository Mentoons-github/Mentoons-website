import { useState, useEffect } from "react";
import { Trophy, Target, Award } from "lucide-react";
import axios from "axios";
import { GAMES } from "@/constant/adda/game/game";
import { useUser } from "@clerk/clerk-react";

interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerClerkId: string;
  userName: string;
  totalScore: number;
  profileImage: string | null;
}

interface ApiResponseLeaderBoard {
  success: boolean;
  count: number;
  data: LeaderboardEntry[];
}

const GameLobby = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
  const { user } = useUser();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get<ApiResponseLeaderBoard>(
        `${import.meta.env.VITE_PROD_URL}/game/leaderboard`
      );
      const data = response.data;

      if (data.success) {
        setLeaderboard(data.data);
        const userId = user?.id;
        if (userId) {
          const foundUser = data.data.find(
            (entry) => entry.playerClerkId === userId
          );
          setCurrentUser(foundUser || null);
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaderboardClick = () => {
    window.location.href = "/adda/leaderboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="relative overflow-hidden pt-16 pb-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 text-center px-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient">
            Game Lobby
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Sharpen your mind, boost creativity, and enhance your logical and
            numerical skills as you embark on thrilling adventures.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            <div className="h-1 w-1 bg-cyan-500 rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
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
                    <h3 className="text-xl font-semibold text-white">
                      Your Rank
                    </h3>
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
                    {currentUser
                      ? currentUser.totalScore.toLocaleString()
                      : "0"}
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

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-5">
            {GAMES.map((game, index) => (
              <div
                key={index}
                className="group relative rounded-xl border-2 border-gray-700 w-full h-64 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 hover:border-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              >
                <div className="absolute left-4 top-8 bottom-8 w-1 bg-gradient-to-b from-transparent via-white to-transparent opacity-60 blur-sm z-10"></div>
                <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent z-10"></div>

                <div className="relative w-full h-full">
                  {game.thumbnail ? (
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-bold">
                      {game.title}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-semibold text-lg text-center">
                      {game.title}
                    </h3>
                  </div>

                  <a
                    href={game.link}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm z-20"
                  >
                    <span className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all">
                      Play
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
