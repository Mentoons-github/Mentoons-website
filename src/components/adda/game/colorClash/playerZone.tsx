import { useState, useEffect } from "react";
import { RotateCw, Trophy, Timer, AlertCircle } from "lucide-react";

const ColorClashPlayerzone = ({
  difficulty = "medium",
  handleGameEnd = () => {},
}: {
  handleGameEnd?: (completed: boolean, reason?: string) => void;
  difficulty?: "easy" | "medium" | "hard";
}) => {
  const [position, setPosition] = useState<"left" | "center" | "right">(
    "center"
  );
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<"moves" | "time" | null>(
    null
  );
  const [moves, setMoves] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [submitsLeft, setSubmitsLeft] = useState(5);
  const [isChecking, setIsChecking] = useState(false);
  const [checkingStage, setCheckingStage] = useState("");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const settings = {
    easy: { maxMoves: 60, maxTime: 180 },
    medium: { maxMoves: 45, maxTime: 140 },
    hard: { maxMoves: 30, maxTime: 90 },
  };

  const { maxMoves, maxTime } = settings[difficulty];
  const [timeRemaining, setTimeRemaining] = useState(maxTime);

  useEffect(() => {
    if (gameWon || gameOver) return;

    if (moves >= maxMoves) {
      setIsRunning(false);
      setGameOver(true);
      setGameOverReason("moves");
      handleGameEnd(false, "moves");
    } else if (timeRemaining <= 0) {
      setIsRunning(false);
      setGameOver(true);
      setGameOverReason("time");
      handleGameEnd(false, "time");
    }
  }, [moves, timeRemaining, gameWon, gameOver, maxMoves, maxTime]);

  const ballSizeClasses =
    difficulty === "easy"
      ? "w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
      : "w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10";

  const squareSizeClasses =
    difficulty === "easy"
      ? "w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44"
      : "w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48";

  const Ball = ({
    ball,
    sizeClass = ballSizeClasses,
  }: {
    ball: { id: number; color: string };
    sizeClass?: string;
  }) => (
    <div
      className={`${sizeClass} rounded-full ${
        ball.color === "red"
          ? "bg-gradient-to-br from-red-400 to-red-600 border-2 border-red-700"
          : "bg-gradient-to-br from-gray-100 to-white border-2 border-gray-300"
      } shadow-md transition-all hover:scale-110`}
    />
  );

  const EmptySlot = ({
    sizeClass = ballSizeClasses,
  }: {
    sizeClass?: string;
  }) => (
    <div
      className={`${sizeClass} rounded-full border-2 border-dashed border-yellow-400/40 bg-yellow-50/30`}
    />
  );

  const createRandomBalls = () => {
    const totalBalls = 33;
    const redCount = Math.floor(totalBalls / 2);
    const whiteCount = totalBalls - redCount;
    const balls: { id: number; color: "red" | "white" }[] = [];

    for (let i = 0; i < redCount; i++) balls.push({ id: i, color: "red" });
    for (let i = 0; i < whiteCount; i++)
      balls.push({ id: redCount + i, color: "white" });

    for (let i = balls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [balls[i], balls[j]] = [balls[j], balls[i]];
    }
    return balls;
  };

  const initializeGame = () => {
    const shuffledBalls = createRandomBalls();
    return {
      left: shuffledBalls.slice(0, 15),
      right: shuffledBalls.slice(15, 30),
      rect: shuffledBalls.slice(30, 33),
    };
  };

  const [gameState] = useState(() => initializeGame());
  const [leftSquare, setLeftSquare] = useState(gameState.left);
  const [rightSquare, setRightSquare] = useState(gameState.right);
  const [rectangleBalls, setRectangleBalls] = useState(gameState.rect);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !gameWon && !gameOver) {
      interval = setInterval(() => setTimeRemaining((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, gameWon, gameOver]);

  const handleSubmit = async () => {
    if (submitsLeft <= 0 || isChecking || gameOver) return;

    setIsChecking(true);
    setCheckingStage("Calculating the result...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCheckingStage("Checking the colored balls...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCheckingStage("Finalizing answer...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const leftReds = leftSquare.filter((b) => b.color === "red").length;
    const leftWhites = 15 - leftReds;
    const rightReds = rightSquare.filter((b) => b.color === "red").length;
    const rightWhites = 15 - rightReds;

    const leftAllSame = leftReds === 15 || leftWhites === 15;
    const rightAllSame = rightReds === 15 || rightWhites === 15;
    const differentColors =
      (leftReds === 15 && rightWhites === 15) ||
      (leftWhites === 15 && rightReds === 15);

    if (leftAllSame && rightAllSame && differentColors) {
      setGameWon(true);
      setIsRunning(false);
      handleGameEnd(true);
    } else {
      setSubmitsLeft((prev) => prev - 1);
    }

    setIsChecking(false);
    setCheckingStage("");
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        if (position === "left") setPosition("center");
        else if (position === "center") setPosition("right");
      } else {
        if (position === "right") setPosition("center");
        else if (position === "center") setPosition("left");
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        if (position === "left") setPosition("center");
        else if (position === "center") setPosition("right");
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        if (position === "right") setPosition("center");
        else if (position === "center") setPosition("left");
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [position]);

  const rotateLeftSquare = () => {
    if (!isRunning || gameWon || gameOver) return;
    setMoves((prev) => prev + 1);
    const newSquare = [...leftSquare];
    const perimeterCore = [0, 1, 2, 3, 10, 11, 12, 13, 14, 6, 7, 8, 9];
    const sequence = [
      newSquare[5],
      ...rectangleBalls,
      newSquare[4],
      ...perimeterCore.map((i) => newSquare[i]),
    ];
    const rotated = [
      sequence[sequence.length - 1],
      ...sequence.slice(0, sequence.length - 1),
    ];
    let idx = 0;
    newSquare[5] = rotated[idx++];
    const newRect = [rotated[idx++], rotated[idx++], rotated[idx++]];
    newSquare[4] = rotated[idx++];
    perimeterCore.forEach((i) => (newSquare[i] = rotated[idx++]));
    setLeftSquare(newSquare);
    setRectangleBalls(newRect);
  };

  const rotateRightSquare = () => {
    if (!isRunning || gameWon || gameOver) return;
    setMoves((prev) => prev + 1);
    const newSquare = [...rightSquare];
    const perimeterCore = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const sequence = [
      newSquare[14],
      ...rectangleBalls,
      newSquare[13],
      ...perimeterCore.map((i) => newSquare[i]),
    ];
    const rotated = [
      sequence[sequence.length - 1],
      ...sequence.slice(0, sequence.length - 1),
    ];
    let idx = 0;
    newSquare[14] = rotated[idx++];
    const newRect = [rotated[idx++], rotated[idx++], rotated[idx++]];
    newSquare[13] = rotated[idx++];
    perimeterCore.forEach((i) => (newSquare[i] = rotated[idx++]));
    setRightSquare(newSquare);
    setRectangleBalls(newRect);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderLeftSquare = () => ({
    top: [leftSquare[0], leftSquare[1], leftSquare[2], leftSquare[3]],
    right: [leftSquare[4], null, null, null, leftSquare[5]],
    bottom: [leftSquare[6], leftSquare[7], leftSquare[8], leftSquare[9]],
    left: [
      leftSquare[10],
      leftSquare[11],
      leftSquare[12],
      leftSquare[13],
      leftSquare[14],
    ],
  });

  const renderRightSquare = () => ({
    top: [rightSquare[0], rightSquare[1], rightSquare[2], rightSquare[3]],
    right: [
      rightSquare[4],
      rightSquare[5],
      rightSquare[6],
      rightSquare[7],
      rightSquare[8],
    ],
    bottom: [rightSquare[9], rightSquare[10], rightSquare[11], rightSquare[12]],
    left: [rightSquare[13], null, null, null, rightSquare[14]],
  });

  const leftBalls = renderLeftSquare();
  const rightBalls = renderRightSquare();

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-1 xs:p-2 sm:p-3 md:p-4 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 bg-black/60" />

      {isChecking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl xs:rounded-3xl p-4 xs:p-6 sm:p-8 shadow-2xl text-center max-w-xs xs:max-w-sm md:max-w-md mx-4 border-2 xs:border-4 border-purple-400">
            <div className="w-12 h-12 xs:w-16 xs:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg xs:text-xl sm:text-2xl font-bold text-purple-900">
              {checkingStage}
            </p>
          </div>
        </div>
      )}

      {gameWon && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl xs:rounded-3xl p-4 xs:p-6 sm:p-8 shadow-2xl text-center max-w-xs xs:max-w-sm md:max-w-md mx-4 border-2 xs:border-4 border-yellow-400">
            <Trophy className="w-16 h-16 xs:w-20 xs:h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 mb-2">
              Victory!
            </h2>
            <p className="text-gray-700 text-base xs:text-lg mb-4 xs:mb-6">
              You sorted all the colors!
            </p>
            <div className="bg-white/50 rounded-xl p-3 xs:p-4 mb-4 xs:mb-6 space-y-2">
              <div className="flex items-center justify-center gap-2 text-lg xs:text-xl font-bold text-gray-800">
                <Timer className="w-4 h-4 xs:w-5 xs:h-5" />
                Time: {formatTime(maxTime - timeRemaining)}
              </div>
              <div className="flex items-center justify-center gap-2 text-lg xs:text-xl font-bold text-gray-800">
                <RotateCw className="w-4 h-4 xs:w-5 xs:h-5" />
                Moves: {moves} / {maxMoves}
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 xs:px-8 py-3 xs:py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl xs:rounded-2xl font-bold text-base xs:text-lg shadow-xl transform hover:scale-105 transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {gameOver && !gameWon && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl xs:rounded-3xl p-4 xs:p-6 sm:p-8 shadow-2xl text-center max-w-xs xs:max-w-sm md:max-w-md mx-4 border-2 xs:border-4 border-red-400">
            <AlertCircle className="w-16 h-16 xs:w-20 xs:h-20 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-black text-red-700 mb-2">
              {gameOverReason === "moves" ? "Moves Exhausted!" : "Time's Up!"}
            </h2>
            <p className="text-gray-700 text-base xs:text-lg mb-4 xs:mb-6">
              {gameOverReason === "moves"
                ? "You've used all your moves!"
                : "Time ran out!"}
            </p>
            <div className="bg-white/50 rounded-xl p-3 xs:p-4 mb-4 xs:mb-6 space-y-2">
              <div className="flex items-center justify-center gap-2 text-lg xs:text-xl font-bold text-gray-800">
                <Timer className="w-4 h-4 xs:w-5 xs:h-5" />
                Time Used: {formatTime(maxTime - timeRemaining)}
              </div>
              <div className="flex items-center justify-center gap-2 text-lg xs:text-xl font-bold text-gray-800">
                <RotateCw className="w-4 h-4 xs:w-5 xs:h-5" />
                Moves Used: {moves} / {maxMoves}
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 xs:px-8 py-3 xs:py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl xs:rounded-2xl font-bold text-base xs:text-lg shadow-xl transform hover:scale-105 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto flex flex-col h-full justify-between py-1 xs:py-2">
        <div className="flex flex-col xs:flex-row items-center justify-between px-2 xs:px-4 mb-1 xs:mb-2 gap-2">
          <div className="bg-white/10 backdrop-blur-md rounded-xl xs:rounded-2xl px-4 xs:px-6 py-2 xs:py-3 shadow-xl border border-white/20">
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Color Clash
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 xs:gap-3 justify-center">
            <div
              className={`backdrop-blur-md rounded-lg xs:rounded-xl px-3 xs:px-5 py-2 xs:py-3 shadow-xl border flex items-center gap-1 xs:gap-2 ${
                timeRemaining <= 30
                  ? "bg-red-500/20 border-red-400 animate-pulse"
                  : "bg-white/10 border-white/20"
              }`}
            >
              <Timer
                className={`w-4 h-4 xs:w-5 xs:h-5 ${
                  timeRemaining <= 30 ? "text-red-300" : "text-cyan-300"
                }`}
              />
              <span
                className={`text-base xs:text-xl font-bold ${
                  timeRemaining <= 30 ? "text-red-300" : "text-white"
                }`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg xs:rounded-xl px-3 xs:px-5 py-2 xs:py-3 shadow-xl border border-white/20 flex items-center gap-1 xs:gap-2">
              <RotateCw className="w-4 h-4 xs:w-5 xs:h-5 text-green-300" />
              <span className="text-base xs:text-xl font-bold text-white">
                {moves} / {maxMoves}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg xs:rounded-xl px-3 xs:px-5 py-2 xs:py-3 shadow-xl border border-white/20 flex items-center gap-1 xs:gap-2">
              <span className="text-base xs:text-xl font-bold text-orange-300">
                Submits: {submitsLeft}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl xs:rounded-2xl px-2 xs:px-4 py-2 mx-2 xs:mx-4 border border-white/10">
          <p className="text-center text-xs xs:text-sm md:text-base text-white/90 font-medium">
            Use <span className="font-bold text-yellow-300">← → / A D</span> or{" "}
            <span className="font-bold text-yellow-300">swipe</span> to move •
            Press <span className="font-bold text-green-300">rotate</span> to
            sort • Click{" "}
            <span className="font-bold text-orange-300">Submit</span> to check (
            {submitsLeft} left)
          </p>
        </div>

        <div className="relative flex gap-4 xs:gap-6 sm:gap-8 md:gap-16 lg:gap-24 items-center justify-center flex-1 py-2 xs:py-4">
          <div className="relative">
            <div className="flex flex-col items-center gap-1 xs:gap-2 md:gap-3">
              <div className="flex gap-1 xs:gap-2 md:gap-3">
                {[...leftBalls.top].reverse().map((b) => (
                  <Ball key={b.id} ball={b} />
                ))}
              </div>
              <div className="flex gap-1 xs:gap-2 md:gap-3 items-center">
                <div className="flex flex-col gap-1 xs:gap-2 md:gap-3">
                  {leftBalls.left.map((b) => (
                    <Ball key={b.id} ball={b} />
                  ))}
                </div>
                <div
                  className={`${squareSizeClasses} bg-gradient-to-br from-orange-300 via-yellow-300 to-orange-400 border-2 xs:border-4 border-orange-500/50 rounded-xl xs:rounded-2xl shadow-2xl`}
                ></div>
                <div className="flex flex-col gap-1 xs:gap-2 md:gap-3">
                  {leftBalls.right.map((ball, idx) => (
                    <div key={idx}>
                      {ball ? <Ball ball={ball} /> : <EmptySlot />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 xs:gap-2 md:gap-3">
                {leftBalls.bottom.map((b) => (
                  <Ball key={b.id} ball={b} />
                ))}
              </div>
            </div>

            {position === "left" && (
              <button
                onClick={rotateLeftSquare}
                className="absolute left-1/2 -translate-x-1/2 -bottom-10 xs:-bottom-12 md:-bottom-14 lg:-bottom-16 w-10 h-10 xs:w-12 xs:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rounded-full flex items-center justify-center shadow-2xl border-2 xs:border-4 border-white/30 transform hover:scale-110 transition-all active:scale-95"
              >
                <RotateCw className="w-5 h-5 xs:w-6 xs:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
              </button>
            )}
          </div>

          <div className="relative">
            <div className="flex flex-col items-center gap-1 xs:gap-2 md:gap-3">
              <div className="flex gap-1 xs:gap-2 md:gap-3">
                {rightBalls.top.map((b) => (
                  <Ball key={b.id} ball={b} />
                ))}
              </div>
              <div className="flex gap-1 xs:gap-2 md:gap-3 items-center">
                <div className="flex flex-col gap-1 xs:gap-2 md:gap-3">
                  {rightBalls.left.map((ball, idx) => (
                    <div key={idx}>
                      {ball ? <Ball ball={ball} /> : <EmptySlot />}
                    </div>
                  ))}
                </div>
                <div
                  className={`${squareSizeClasses} bg-gradient-to-br from-blue-300 via-cyan-300 to-teal-400 border-2 xs:border-4 border-blue-500/50 rounded-xl xs:rounded-2xl shadow-2xl`}
                ></div>
                <div className="flex flex-col gap-1 xs:gap-2 md:gap-3">
                  {rightBalls.right.map((b) => (
                    <Ball key={b.id} ball={b} />
                  ))}
                </div>
              </div>
              <div className="flex gap-1 xs:gap-2 md:gap-3">
                {[...rightBalls.bottom].reverse().map((b) => (
                  <Ball key={b.id} ball={b} />
                ))}
              </div>
            </div>

            {position === "right" && (
              <button
                onClick={rotateRightSquare}
                className="absolute left-1/2 -translate-x-1/2 -bottom-10 xs:-bottom-12 md:-bottom-14 lg:-bottom-16 w-10 h-10 xs:w-12 xs:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rounded-full flex items-center justify-center shadow-2xl border-2 xs:border-4 border-white/30 transform hover:scale-110 transition-all active:scale-95"
              >
                <RotateCw className="w-5 h-5 xs:w-6 xs:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
              </button>
            )}
          </div>

          {position === "center" && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 xs:border-4 border-yellow-400 bg-white backdrop-blur-md rounded-xl xs:rounded-2xl p-1 xs:p-2 flex flex-col-reverse gap-1 xs:gap-2 md:gap-3 shadow-2xl">
              {rectangleBalls.map((ball) => (
                <Ball key={ball.id} ball={ball} />
              ))}
            </div>
          )}

          {position === "left" && (
            <div className="absolute left-[45.1%] top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 xs:border-4 border-yellow-400 bg-white/75 backdrop-blur-md rounded-xl xs:rounded-2xl p-1 xs:p-2 flex flex-col-reverse gap-1 xs:gap-2 md:gap-3 shadow-2xl">
              {rectangleBalls.map((ball) => (
                <Ball key={ball.id} ball={ball} />
              ))}
            </div>
          )}

          {position === "right" && (
            <div className="absolute left-[54.8%] top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 xs:border-4 border-yellow-400 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-xl xs:rounded-2xl p-1 xs:p-2 flex flex-col-reverse gap-1 xs:gap-2 md:gap-3 shadow-2xl">
              {[...rectangleBalls].map((ball) => (
                <Ball key={ball.id} ball={ball} />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center pb-2 xs:pb-3 sm:pb-4">
          <button
            onClick={handleSubmit}
            disabled={submitsLeft <= 0 || isChecking || gameOver}
            className={`px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 py-2 xs:py-3 sm:py-4 rounded-lg xs:rounded-xl sm:rounded-2xl font-bold text-sm xs:text-base sm:text-lg md:text-xl shadow-2xl transform transition-all ${
              submitsLeft <= 0 || isChecking || gameOver
                ? "bg-gray-500 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 active:scale-95"
            } text-white border-2 xs:border-4 border-white/30`}
          >
            {submitsLeft <= 0 ? "No Submits Left" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorClashPlayerzone;
