import { useState, useEffect } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import GameLobbyHeader from "./header";
import ScoringDashboard from "./scoring";
import GameItems from "./gameItems";
import { fetchCandyCoin } from "@/api/game/mentoonsCoin";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { CandyCoins } from "@/types/adda/game/candyCoins";

/*
  Comic theme (shared with the store pages)
  The lobby keeps a DARK backdrop on purpose: the header, scoring and game
  items children were built for light text on dark, so a white page would
  make them hard to read. Dark navy + yellow halftone dots keeps it comic.
  Switch .comic-lobby to a white background once those children are restyled.
*/
const comicCss = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700;900&display=swap');

.comic-lobby {
  font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif;
  background-color: #0F1B4D;
  background-image: radial-gradient(rgba(255, 217, 59, 0.22) 2px, transparent 2px);
  background-size: 18px 18px;
}
.comic-lobby .comic-title { font-family: 'Bangers', 'Impact', sans-serif; letter-spacing: 0.04em; }
.comic-coin-pill { border: 3px solid #000; box-shadow: 4px 4px 0 #000; }

@media (min-width: 1024px) {
  .comic-coin-pill { border-width: 4px; box-shadow: 6px 6px 0 #000; }
}
`;

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
        `${import.meta.env.VITE_PROD_URL}/game/leaderboard`,
      );
      const data = response.data;

      if (data.success) {
        setLeaderboard(data.data);
        const userId = user?.id;
        if (userId) {
          const foundUser = data.data.find(
            (entry) => entry.playerClerkId === userId,
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
    } catch (error: any) {
      setCoins(null);
      console.log(error);
      showStatus("error", "Sign in to access your Candy Coins balance.");
    }
  };

  const handleLeaderboardClick = () => {
    window.location.href = "/adda/leaderboard";
  };

  return (
    <div className="comic-lobby relative min-h-screen">
      <style>{comicCss}</style>

      {/* Candy coin balance: coin overlaps the pill's left edge, number gets its own space */}
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6 md:right-8 md:top-8 lg:right-10 lg:top-10">
        <div className="comic-coin-pill relative flex h-12 min-w-[7.5rem] items-center justify-end rounded-full bg-[#FFD93B] pl-12 pr-4 sm:h-14 sm:pl-14 md:h-16 md:pl-16 md:pr-5 lg:h-20 lg:pl-20 lg:pr-6">
          <img
            src="/assets/games/coins/candyCoin.png"
            alt="Coin"
            className="absolute left-0 top-1/2 h-14 w-14 -translate-x-1/3 -translate-y-1/2 drop-shadow-[3px_3px_0_#000] sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24"
          />
          <span className="comic-title text-3xl leading-none text-black sm:text-4xl md:text-5xl lg:text-6xl">
            {coins?.currentCoins ?? 0}
          </span>
        </div>
      </div>

      <GameLobbyHeader />
      <div className="px-1 pb-8 md:px-8">
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
