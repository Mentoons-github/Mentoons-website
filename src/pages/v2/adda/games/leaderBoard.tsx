import { useState, useEffect, useRef } from "react";
import { useStatusModal } from "@/context/adda/statusModalContext";
import axios from "axios";
import {
  Star,
  Trophy,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Crown,
  Loader2,
} from "lucide-react";
import {
  GAMES,
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

/* collapsed game card height + gap between cards (gap-4 = 16px) */
const CARD_H = 128;
const CARD_GAP = 16;

/* comic helpers */
const comicStroke = (stroke = 3, shadow = 5): React.CSSProperties => ({
  WebkitTextStroke: `${stroke}px #000`,
  textShadow: `${shadow}px ${shadow}px 0 #000`,
  paintOrder: "stroke fill",
});

/* show full names; wrap to a 2nd line instead of cutting with "..." */
const clampTwoLines: React.CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
};

const dotsBg: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(234,88,12,0.18) 2px, transparent 2px)",
  backgroundSize: "18px 18px",
};

const halftone: React.CSSProperties = {
  backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)",
  backgroundSize: "14px 14px",
};

/* ============ GAME CARD (compact + full) ============ */
type GameItem = (typeof GAMES)[number];

const GameCard = ({ data, compact }: { data: GameItem; compact: boolean }) => (
  <a
    href={data.link}
    style={compact ? { height: CARD_H } : undefined}
    className="group relative block rounded-2xl overflow-hidden cursor-pointer border-4 border-black shadow-[5px_5px_0_#000] bg-gray-900 transition-all duration-200 hover:-translate-y-1 hover:-rotate-1 hover:shadow-[8px_8px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
  >
    <div
      className={`bg-cover bg-center transition-transform duration-500 group-hover:scale-110 ${
        compact ? "h-full" : "h-28 sm:h-32"
      }`}
      style={{ backgroundImage: `url(${data.thumbnail})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
    </div>

    <div
      className={`absolute bottom-0 left-0 right-0 ${
        compact ? "p-2 sm:p-3" : "p-3 sm:p-4"
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <h3
          className={`font-comic tracking-widest text-white group-hover:text-yellow-300 transition-colors leading-tight ${
            compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
          }`}
          style={comicStroke(compact ? 1 : 1.5, compact ? 2 : 3)}
        >
          {data.title}
        </h3>
        <ChevronRight
          className={`shrink-0 text-white group-hover:text-yellow-300 transform group-hover:translate-x-1 transition-transform drop-shadow-[2px_2px_0_#000] ${
            compact ? "w-5 h-5" : "w-6 h-6 sm:w-7 sm:h-7"
          }`}
        />
      </div>
    </div>

    {!compact && (
      <span className="font-comic-chip absolute top-2 right-2 bg-red-500 text-white text-xs sm:text-sm tracking-widest px-2 py-0.5 border-2 border-black rounded-md shadow-[2px_2px_0_#000] rotate-6 opacity-0 group-hover:opacity-100 transition-opacity">
        PLAY NOW!
      </span>
    )}
  </a>
);

const LeaderBoard = () => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [gamesExpanded, setGamesExpanded] = useState<boolean>(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [fitCount, setFitCount] = useState<number>(3);
  const slotRef = useRef<HTMLDivElement>(null);
  const { showStatus } = useStatusModal();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  /* measure how many single-row game cards fit in the leftover height */
  useEffect(() => {
    const el = slotRef.current;
    if (!el || gamesExpanded) return;

    const calc = () => {
      const n = Math.floor((el.clientHeight + CARD_GAP) / (CARD_H + CARD_GAP));
      setFitCount(Math.max(1, n));
    };

    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading, gamesExpanded, leaderboardData.length]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponseLeaderBoard>(
        `${import.meta.env.VITE_PROD_URL}/game/leaderboard`,
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
            : "An error occurred",
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
        <img
          src="/assets/games/positions/1st price.png"
          alt="Gold Medal"
          className="w-8 h-14 md:w-10 md:h-16 drop-shadow-[3px_3px_0_rgba(0,0,0,0.9)]"
        />
      );

    if (position === 2)
      return (
        <img
          src="/assets/games/positions/2nd price.png"
          alt="Silver Medal"
          className="w-7 h-12 md:w-9 md:h-14 drop-shadow-[3px_3px_0_rgba(0,0,0,0.9)]"
        />
      );

    if (position === 3)
      return (
        <img
          src="/assets/games/positions/3rd price.png"
          alt="Bronze Medal"
          className="w-6 h-10 md:w-8 md:h-12 drop-shadow-[3px_3px_0_rgba(0,0,0,0.9)]"
        />
      );

    return null;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-yellow-100 flex items-center justify-center"
        style={dotsBg}
      >
        <div className="text-center bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0_#000] px-10 py-8">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="font-comic text-3xl tracking-widest text-gray-900">
            Loading Leaderboard...
          </p>
        </div>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div
        className="min-h-screen bg-yellow-100 flex items-center justify-center p-4"
        style={dotsBg}
      >
        <div className="text-center bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0_#000] p-8">
          <Trophy className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <p className="font-comic text-4xl tracking-widest text-gray-900 mb-2">
            No Data Found
          </p>
          <p className="font-comic text-xl tracking-wide text-gray-700">
            Be the first to play and appear on the leaderboard!
          </p>
        </div>
      </div>
    );
  }

  const visibleGames = gamesExpanded ? GAMES : GAMES.slice(0, fitCount);
  const hasMoreGames = gamesExpanded || GAMES.length > fitCount;

  return (
    <div
      className="min-h-screen bg-yellow-100 p-2 sm:p-4 lg:p-6"
      style={dotsBg}
    >
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* ============ MAIN PANEL ============ */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl border-4 border-black shadow-[10px_10px_0_#000] overflow-hidden">
          {/* Podium header */}
          <div className="relative bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 pt-6 pb-12 sm:pt-8 sm:pb-16 md:pb-20 px-4 border-b-4 border-black overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                ...halftone,
                maskImage: "linear-gradient(to bottom, black, transparent 80%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black, transparent 80%)",
              }}
            />
            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-pulse drop-shadow-[3px_3px_0_#000]" />
                <h1
                  className="font-comic text-4xl sm:text-5xl md:text-7xl tracking-widest uppercase text-yellow-300 -rotate-1"
                  style={comicStroke(3, 5)}
                >
                  Top Champions
                </h1>
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-pulse drop-shadow-[3px_3px_0_#000]" />
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
                          className={`relative rounded-full overflow-hidden border-black shadow-[5px_5px_0_#000] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 bg-white
                          ${
                            isWinner
                              ? "w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 border-[6px]"
                              : "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border-[5px]"
                          }`}
                        >
                          <img
                            src={data.image || getDefaultImage()}
                            alt={data.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div
                          className={`font-comic-chip absolute -bottom-2 -right-2 ${getPodiumColor(
                            actualPosition,
                          ).replace(
                            "bg-gradient-to-t",
                            "bg-gradient-to-br",
                          )} text-white rounded-full shadow-[3px_3px_0_#000] flex items-center justify-center border-4 border-black
                          ${
                            isWinner ? "w-11 h-11 text-xl" : "w-10 h-10 text-lg"
                          }`}
                        >
                          {actualPosition}
                        </div>
                      </div>

                      <h2
                        className={`font-comic tracking-widest text-white mt-3 sm:mt-4 text-center w-max max-w-[150px] sm:max-w-[190px] md:max-w-[240px] leading-[1.05] break-words pr-1 pb-1
                        ${
                          isWinner
                            ? "text-2xl sm:text-3xl md:text-4xl"
                            : "text-xl sm:text-2xl md:text-3xl"
                        }`}
                        style={{ ...comicStroke(2, 3), ...clampTwoLines }}
                        title={data.name}
                      >
                        {data.name}
                      </h2>
                      <div className="flex items-center gap-1 bg-yellow-300 px-3 sm:px-4 py-0.5 rounded-full mt-1 border-[3px] border-black shadow-[3px_3px_0_#000] -rotate-2">
                        <Star
                          className={`text-black fill-current ${
                            isWinner ? "w-4 h-4" : "w-3 h-3"
                          }`}
                        />
                        <span
                          className={`font-comic-chip text-black tracking-wider ${
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
                          actualPosition,
                        )} mt-3 sm:mt-4 rounded-t-2xl border-4 border-b-0 border-black shadow-[5px_0_0_#000] transition-all duration-700`}
                        style={{ height: `${data.bar}px` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rankings */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 bg-yellow-50 overflow-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2
                className="font-comic text-3xl sm:text-4xl md:text-5xl tracking-widest uppercase text-orange-500"
                style={comicStroke(2, 4)}
              >
                Global Rankings
              </h2>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="font-comic-chip lg:hidden bg-orange-500 text-white text-lg tracking-widest uppercase px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150 flex items-center gap-2"
              >
                <Gamepad2 className="w-5 h-5" />
                Games
              </button>
            </div>

            {remainingPlayers.length > 0 ? (
              <div className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0_#000] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-blue-500 text-white border-b-4 border-black">
                        <th className="font-comic-chip p-3 sm:p-4 text-left tracking-widest text-lg sm:text-xl font-normal">
                          Rank
                        </th>
                        <th className="font-comic-chip p-3 sm:p-4 text-left tracking-widest text-lg sm:text-xl font-normal">
                          Player
                        </th>
                        <th className="font-comic-chip p-3 sm:p-4 text-left tracking-widest text-lg sm:text-xl font-normal">
                          Score
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {remainingPlayers.map((player) => (
                        <tr
                          key={player.playerId}
                          className="border-b-2 border-black last:border-b-0 hover:bg-yellow-200 transition-colors duration-200 cursor-pointer group"
                        >
                          <td className="p-3 sm:p-4">
                            <span
                              className={`font-comic-chip ${getRankBadgeColor(
                                player.rank,
                              )} text-white tracking-wider px-3 sm:px-4 py-1 rounded-full border-[3px] border-black shadow-[3px_3px_0_#000] text-sm sm:text-base inline-block min-w-[44px] sm:min-w-[52px] text-center group-hover:-rotate-3 transition-transform`}
                            >
                              #{player.rank}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <img
                                src={player.profileImage || getDefaultImage()}
                                alt={player.userName}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] border-black shadow-[3px_3px_0_#000] object-cover group-hover:scale-110 transition-transform"
                              />
                              <span className="font-comic tracking-widest text-gray-900 text-lg sm:text-xl">
                                {player.userName}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-comic-chip tracking-wider text-orange-600 text-lg sm:text-xl">
                                {player.totalScore}
                              </span>
                              <span className="font-comic tracking-widest text-gray-600 text-sm sm:text-base">
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
              <div className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0_#000] p-8 text-center">
                <p className="font-comic tracking-widest text-gray-700 text-2xl">
                  No additional players in rankings
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ============ SIDEBAR ============ */}
        {/*
          Collapsed (desktop): the inner card is absolutely positioned, so it does NOT
          add to the row height. The row height comes from the players list, and the
          wrapper's min-h is a safety net when there are only a few players.
          Expanded (desktop): the inner card becomes a normal block, so the full
          game list sets the height.
        */}
        <div
          className={`fixed lg:relative inset-0 lg:inset-auto w-full lg:w-96 xl:w-[420px] z-[40] lg:z-auto transition-transform duration-300 lg:translate-x-0 ${
            showSidebar ? "translate-x-0" : "translate-x-full"
          } ${gamesExpanded ? "" : "lg:min-h-[660px]"}`}
        >
          <div
            className={`flex flex-col h-full overflow-hidden bg-gradient-to-b from-orange-500 via-orange-500 to-red-500 lg:rounded-3xl lg:border-4 border-black lg:shadow-[10px_10px_0_#000] ${
              gamesExpanded ? "lg:h-auto" : "lg:absolute lg:inset-0"
            }`}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={halftone}
            />

            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden absolute top-4 right-4 bg-white text-black p-2 rounded-full border-4 border-black shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all z-10"
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
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Champion card */}
            <div className="relative shrink-0 p-4 sm:p-6 border-b-4 border-black bg-blue-600">
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={halftone}
              />
              <div className="relative flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0_#000]">
                <div className="relative">
                  <img
                    src={topThree[0]?.profileImage || getDefaultImage()}
                    alt="profile"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-black shadow-[4px_4px_0_#000] object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-yellow-300 rounded-full p-1 border-[3px] border-black">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2
                    className="font-comic text-2xl sm:text-3xl tracking-widest text-gray-900 leading-[1.05] break-words"
                    style={clampTwoLines}
                    title={topThree[0]?.userName}
                  >
                    {topThree[0]?.userName || "No Champion"}
                  </h2>
                  <div className="flex items-center gap-1 bg-yellow-300 px-2 sm:px-3 py-0.5 rounded-full mt-1 w-fit border-[3px] border-black shadow-[2px_2px_0_#000] -rotate-2">
                    <Star className="text-black w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                    <span className="font-comic-chip text-black tracking-wider text-xs sm:text-sm whitespace-nowrap">
                      Top Scorer
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="bg-orange-100 border-[3px] border-black shadow-[2px_2px_0_#000] px-2 sm:px-3 py-0.5 rounded-lg">
                      <div className="font-comic tracking-widest text-orange-600 text-sm">
                        Score
                      </div>
                      <div className="font-comic-chip tracking-wider text-gray-900 text-sm sm:text-base">
                        {topThree[0]?.totalScore || 0}
                      </div>
                    </div>
                    <div className="bg-orange-100 border-[3px] border-black shadow-[2px_2px_0_#000] px-2 sm:px-3 py-0.5 rounded-lg">
                      <div className="font-comic tracking-widest text-orange-600 text-sm">
                        Rank
                      </div>
                      <div className="font-comic-chip tracking-wider text-gray-900 text-sm sm:text-base">
                        #1
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game library */}
            <div className="relative flex-1 min-h-0 p-4 sm:p-6 flex flex-col overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 sm:mb-5 shrink-0">
                <Gamepad2 className="w-7 h-7 sm:w-9 sm:h-9 text-white drop-shadow-[3px_3px_0_#000]" />
                <h2
                  className="font-comic text-4xl sm:text-5xl tracking-widest uppercase text-yellow-300"
                  style={comicStroke(2, 4)}
                >
                  Game Library
                </h2>
              </div>

              {/* this slot is measured: it takes whatever height is left */}
              <div
                ref={slotRef}
                className={
                  gamesExpanded ? "" : "flex-1 min-h-0 overflow-hidden"
                }
              >
                <div
                  className={
                    gamesExpanded
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5"
                      : "grid grid-cols-1 gap-4"
                  }
                >
                  {visibleGames.map((data, index) => (
                    <GameCard
                      key={index}
                      data={data}
                      compact={!gamesExpanded}
                    />
                  ))}
                </div>
              </div>

              {hasMoreGames && (
                <button
                  onClick={() => setGamesExpanded((prev) => !prev)}
                  className="font-comic-chip shrink-0 w-full mt-5 px-6 py-3 bg-yellow-300 text-black text-lg tracking-widest uppercase rounded-xl border-4 border-black shadow-[4px_4px_0_#000] hover:bg-white hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150 flex items-center justify-center gap-2"
                >
                  {gamesExpanded ? (
                    <>
                      Show Less
                      <ChevronUp className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      More Games ({GAMES.length - fitCount})
                      <ChevronDown className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
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
