import { useState, useEffect } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import GameLobbyHeader from "./header";
import ScoringDashboard from "./scoring";
import GameItems from "./gameItems";
import { fetchCandyCoin } from "@/api/game/mentoonsCoin";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { CandyCoins } from "@/types/adda/game/candyCoins";

export interface LeaderboardEntry {
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
  const [coins, setCoins] = useState<CandyCoins | null>(null);
  const { user } = useUser();
  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();

  useEffect(() => {
    fetchLeaderboard();
    fetchUserCandyCoins();
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

  const fetchUserCandyCoins = async () => {
    try {
      const token = await getToken();
      const response = await fetchCandyCoin(token!);
      setCoins(response.candyCoins);
    } catch (error) {
      console.log(error);
      showStatus(
        "error",
        (error as string) ||
          "Error takin coins, Please try again after sometimes"
      );
    }
  };

  const handleLeaderboardClick = () => {
    window.location.href = "/adda/leaderboard";
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 lg:top-10 lg:right-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 rounded-full blur-md opacity-75 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-orange-500 via-amber-400 to-orange-600 rounded-full p-[2px] sm:p-[3px] shadow-2xl">
            <div className="flex items-center justify-center rounded-full h-10 w-28 sm:h-16 sm:w-40 md:h-20 md:w-48 lg:h-24 lg:w-56 bg-gradient-to-br from-slate-900 to-slate-800 shadow-inner">
              <div className="flex items-center justify-between w-full px-2 relative">
                <div className="absolute -left-6 sm:-left-7 md:-left-9 lg:-left-11 top-1/2 -translate-y-1/2">
                  <img
                    src="/assets/games/coins/candyCoin.png"
                    alt="Coin"
                    className="w-16 h-16 md:w-32 md:h-32 lg:w-40 lg:h-40 drop-shadow-[0_0_16px_rgba(251,191,36,0.9)] relative z-10"
                  />
                </div>

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ml-auto pr-3">
                  {coins?.currentCoins ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GameLobbyHeader />
      <div className="px-1 md:px-8 pb-8">
        <ScoringDashboard
          handleLeaderboardClick={handleLeaderboardClick}
          currentUser={currentUser}
          leaderboard={leaderboard}
          loading={loading}
        />
        <GameItems />
      </div>
    </div>
  );
};

export default GameLobby;
