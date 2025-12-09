import { useState, useEffect } from "react";
import { useStatusModal } from "@/context/adda/statusModalContext";
import axios from "axios";
import {
  Star,
  Trophy,
  Medal,
  ChevronRight,
  Gamepad2,
  Crown,
  Loader2,
} from "lucide-react";
import {
  GAMES,
  getBorderColor,
  getPodiumColor,
  getRankBadgeColor,
} from "@/constant/adda/game/game";

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerClerkId: string;
  userName: string;
  totalScore: number;
  profileImage: string | null;
}

export interface ApiResponseLeaderBoard {
  success: boolean;
  count: number;
  data: LeaderboardEntry[];
}

interface Player {
  image: string;
  name: string;
  score: number;
  bar: number;
  position: number;
}

const LeaderBoard = () => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { showStatus } = useStatusModal();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponseLeaderBoard>(
        `${import.meta.env.VITE_PROD_URL}/game/leaderboard`
      );

      if (response.data.success && response.data.data) {
        setLeaderboardData(response.data.data);
      } else {
        setLeaderboardData([]);
      }
    } catch (err) {
      console.log("error found :", err);
      showStatus(
        "error",
        axios.isAxiosError(err)
          ? err.message
          : err instanceof Error
          ? err.message
          : "An error occurred"
      );
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const topThree = leaderboardData.slice(0, 3);
  const remainingPlayers = leaderboardData.slice(3);

  const getDefaultImage = () => "/assets/adda/QRCode/qrCode.jpg";

  const players: Player[] = [
    topThree[1]
      ? {
          image: topThree[1].profileImage || getDefaultImage(),
          name: topThree[1].userName,
          score: topThree[1].totalScore,
          bar: 150,
          position: 2,
        }
      : null,
    topThree[0]
      ? {
          image: topThree[0].profileImage || getDefaultImage(),
          name: topThree[0].userName,
          score: topThree[0].totalScore,
          bar: 200,
          position: 1,
        }
      : null,
    topThree[2]
      ? {
          image: topThree[2].profileImage || getDefaultImage(),
          name: topThree[2].userName,
          score: topThree[2].totalScore,
          bar: 120,
          position: 3,
        }
      : null,
  ].filter((player): player is Player => player !== null);

  const getMedalIcon = (position: number) => {
    if (position === 1)
      return (
        <Trophy className="text-yellow-400 w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_10px_rgba(252,211,77,0.8)]" />
      );
    if (position === 2)
      return (
        <Medal className="text-gray-300 w-9 h-9 md:w-11 md:h-11 drop-shadow-[0_0_8px_rgba(209,213,219,0.7)]" />
      );
    if (position === 3)
      return (
        <Medal className="text-yellow-600 w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_8px_rgba(202,138,4,0.7)]" />
      );
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">
            Loading Leaderboard...
          </p>
        </div>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-2xl font-bold text-gray-700 mb-2">No Data Found</p>
          <p className="text-gray-500">
            Be the first to play and appear on the leaderboard!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-orange-50 to-red-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="flex-1 flex flex-col bg-white rounded-2xl lg:rounded-l-3xl shadow-2xl overflow-hidden">
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 pt-6 pb-12 sm:pt-8 sm:pb-16 md:pb-20 px-4">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]"></div>
            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-pulse" />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  Top Champions
                </h1>
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-pulse" />
              </div>

              <div className="flex items-end justify-center gap-3 sm:gap-6 md:gap-8 lg:gap-10 px-2 sm:px-4">
                {players.map((data, index) => {
                  const actualPosition = data.position;
                  const displayOrder =
                    actualPosition === 1 ? 1 : actualPosition === 2 ? 0 : 2;
                  const isWinner = actualPosition === 1;

                  return (
                    <div
                      className="flex flex-col items-center animate-fadeIn"
                      key={index}
                      style={{
                        order: displayOrder,
                        animationDelay: `${index * 0.2}s`,
                      }}
                    >
                      <div
                        className="relative mb-2 sm:mb-3 animate-bounce"
                        style={{ animationDuration: "2s" }}
                      >
                        {getMedalIcon(actualPosition)}
                      </div>

                      <div className="relative group">
                        <div
                          className={`absolute inset-0 ${getBorderColor(
                            actualPosition
                          )} rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity drop-shadow-xl`}
                        ></div>
                        <div
                          className={`relative rounded-full overflow-hidden border-4 ${getBorderColor(
                            actualPosition
                          )} shadow-2xl transition-all duration-300 group-hover:scale-110
                          ${
                            isWinner
                              ? "w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 border-[8px]"
                              : "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border-[6px]"
                          }`}
                        >
                          <img
                            src={data.image || getDefaultImage()}
                            alt={data.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div
                          className={`absolute -bottom-2 -right-2 ${getPodiumColor(
                            actualPosition
                          ).replace(
                            "bg-gradient-to-t",
                            "bg-gradient-to-br"
                          )} text-white font-bold rounded-full shadow-lg flex items-center justify-center border-2 border-white
                          ${
                            isWinner ? "w-10 h-10 text-lg" : "w-9 h-9 text-base"
                          }`}
                        >
                          {actualPosition}
                        </div>
                      </div>

                      <h2
                        className={`font-bold text-white mt-2 sm:mt-3 drop-shadow-md text-center max-w-[120px] truncate
                        ${
                          isWinner
                            ? "text-xl sm:text-2xl md:text-3xl"
                            : "text-lg sm:text-xl md:text-2xl"
                        }`}
                      >
                        {data.name}
                      </h2>
                      <div className="flex items-center gap-1 bg-yellow-400 px-3 sm:px-4 py-1 rounded-full mt-1 shadow-md">
                        <Star
                          className={`text-yellow-900 fill-current ${
                            isWinner ? "w-4 h-4" : "w-3 h-3"
                          }`}
                        />
                        <span
                          className={`text-yellow-900 font-bold ${
                            isWinner
                              ? "text-base sm:text-lg"
                              : "text-sm sm:text-base"
                          }`}
                        >
                          {data.score}
                        </span>
                      </div>

                      <div
                        className={`w-20 sm:w-24 md:w-28 ${getPodiumColor(
                          actualPosition
                        )} mt-3 sm:mt-4 rounded-t-2xl shadow-2xl transition-all duration-700 border-t-4 ${getBorderColor(
                          actualPosition
                        )}`}
                        style={{ height: `${data.bar}px` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gradient-to-b from-white to-gray-50 overflow-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
                Global Rankings
              </h2>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Gamepad2 className="w-5 h-5" />
                Games
              </button>
            </div>

            {remainingPlayers.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white">
                        <th className="p-3 sm:p-4 text-left font-bold text-sm sm:text-base">
                          Rank
                        </th>
                        <th className="p-3 sm:p-4 text-left font-bold text-sm sm:text-base">
                          Player
                        </th>
                        <th className="p-3 sm:p-4 text-left font-bold text-sm sm:text-base">
                          Score
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {remainingPlayers.map((player) => (
                        <tr
                          key={player.playerId}
                          className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 transition-all duration-300 cursor-pointer group"
                        >
                          <td className="p-3 sm:p-4">
                            <span
                              className={`${getRankBadgeColor(
                                player.rank
                              )} text-white font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-md text-xs sm:text-sm inline-block min-w-[40px] sm:min-w-[48px] text-center`}
                            >
                              #{player.rank}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="relative">
                                <img
                                  src={player.profileImage || getDefaultImage()}
                                  alt={player.userName}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-blue-300 group-hover:border-orange-400 transition-colors shadow-md object-cover"
                                />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                              <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                {player.userName}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-orange-600 text-sm sm:text-base">
                                {player.totalScore}
                              </span>
                              <span className="text-gray-500 text-xs sm:text-sm">
                                pts
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <p className="text-gray-500 text-lg">
                  No additional players in rankings
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className={`fixed lg:relative inset-0 lg:inset-auto w-full lg:w-96 xl:w-[420px] bg-gradient-to-b from-orange-500 via-red-500 to-red-600 lg:rounded-r-3xl shadow-2xl flex flex-col z-[40] lg:z-auto transition-transform duration-300 lg:translate-x-0 ${
            showSidebar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => setShowSidebar(false)}
            className="lg:hidden absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="bg-gradient-to-r from-red-800 to-blue-800 p-4 sm:p-6 lg:rounded-tr-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
            <div className="relative flex items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl border border-white/20">
              <div className="relative">
                <img
                  src={topThree[0]?.profileImage || getDefaultImage()}
                  alt="profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-yellow-400 shadow-2xl object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-lg">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-900" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg truncate">
                  {topThree[0]?.userName || "No Champion"}
                </h2>
                <div className="flex items-center gap-1 bg-yellow-400 px-2 sm:px-3 py-1 rounded-full mt-1 w-fit">
                  <Star className="text-yellow-900 w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                  <span className="text-yellow-900 font-bold text-xs sm:text-sm whitespace-nowrap">
                    Top Scorer
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-lg">
                    <div className="text-yellow-300 text-xs font-semibold">
                      Score
                    </div>
                    <div className="text-white text-sm sm:text-base font-bold">
                      {topThree[0]?.totalScore || 0}
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-lg">
                    <div className="text-yellow-300 text-xs font-semibold">
                      Rank
                    </div>
                    <div className="text-white text-sm sm:text-base font-bold">
                      #1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                Game Library
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
              {GAMES.map((data, index) => (
                <a
                  href={data.link}
                  key={index}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-4 border-white/30 hover:border-yellow-400 bg-gray-900"
                >
                  <div
                    className="h-28 sm:h-32 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${data.thumbnail})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/95 via-blue-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold text-base sm:text-lg group-hover:text-yellow-300 transition-colors drop-shadow-lg">
                        {data.title}
                      </h3>
                      <ChevronRight className="text-white group-hover:text-yellow-300 w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-semibold">
                        Play Now
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LeaderBoard;
