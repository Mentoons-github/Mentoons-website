import postScore from "@/api/game/postScore";
import HowToPlay from "@/components/adda/game/howToPlay/howToPlay";
import InstrumentQuestions from "@/components/adda/games/IdentifyInstruments/InstrumentQuestions";
import InstrumentsDifficulty from "@/components/adda/games/IdentifyInstruments/InstrumentsDifficulty";
import InstrumentsFinished from "@/components/adda/games/IdentifyInstruments/InstrumentsFinished";
import StartScreen from "@/components/adda/games/IdentifyInstruments/StartScreen";
import { GAME_INSTRUCTIONS } from "@/constant/adda/game/instructions";
import {
  INSTRUMENT_BY_DIFFICULTY,
  InstrumentTypes,
} from "@/constant/games/instrumentQuestions";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import { BiBulb } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Instruments = () => {
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<
    "easy" | "medium" | "hard" | null
  >(null);

  const [questions, setQuestions] = useState<InstrumentTypes[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [completeSend, setCompleteSend] = useState(false);
  const [isInstructionOpen, setInstructionOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const current = questions[currentIndex];

  const { getToken } = useAuth();

  const gameId = `sound_and_strings${difficulty}`;

  const gameInstructions = GAME_INSTRUCTIONS.find(
    (inst) =>
      inst.game.toLowerCase().replace(/_/g, "").replace(/\s+/g, "") ===
      "soundandstrings"
  );
  // Load and auto-play audio when question changes
  useEffect(() => {
    if (!current?.audio) return;

    setAudioLoaded(false);
    setIsPlaying(false);

    // Create new audio element for each question
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const audio = new Audio(current.audio);
    audioRef.current = audio;

    // Set up event listeners
    audio.addEventListener("loadeddata", () => {
      setAudioLoaded(true);
      // Try to auto-play
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Autoplay prevented:", err);
          setIsPlaying(false);
        });
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });

    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });

    audio.addEventListener("play", () => {
      setIsPlaying(true);
    });

    // Start loading
    audio.load();

    // Cleanup
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [currentIndex, current?.audio]);

  const handleSubmit = () => {
    if (!selected) return;

    setSubmitted(true);

    // Pause audio when submitting
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    if (selected === current.answer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
        setSubmitted(false);
      } else {
        setFinished(true);
      }
    }, 2000);
  };

  const handleSelect = (option: string) => {
    if (submitted) return;
    setSelected(option);
  };

  const toggleAudio = () => {
    if (!audioRef.current || !audioLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Play error:", err);
      });
    }
  };

  useEffect(() => {
    if (difficulty === "easy") setQuestions(INSTRUMENT_BY_DIFFICULTY.easy);
    if (difficulty === "medium") setQuestions(INSTRUMENT_BY_DIFFICULTY.medium);
    if (difficulty === "hard") setQuestions(INSTRUMENT_BY_DIFFICULTY.hard);
  }, [difficulty]);

  const resetGame = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setStarted(true);
    setDifficulty(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setIsPlaying(false);
    setAudioLoaded(false);
    setSubmitted(false);
  };

  const sendResult = async () => {
    setCompleteSend(true);
    try {
      const success = score === questions.length;
      postScore({
        body: { gameId, difficulty: difficulty as string, score, success },
        token: (await getToken()) || "",
      });
    } catch (error) {
      console.log(error as string);
    }
  };

  if (finished) {
    if (!completeSend) {
      sendResult();
    }
    return (
      <InstrumentsFinished
        questions={questions}
        resetGame={resetGame}
        score={score}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-2 md:p-4"
      style={{ backgroundImage: "url('/assets/games/instruments/bg3.png')" }}
    >
      <HowToPlay
        instructions={gameInstructions?.steps || []}
        isModalOpen={isInstructionOpen}
        setClose={() => setInstructionOpen(false)}
      />
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-50 flex items-center justify-between gap-2">
        <button
          onClick={() => navigate("/adda/game-lobby")}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm shadow-md hover:bg-black/40 transition-all flex-shrink-0"
        >
          <FaChevronLeft className="text-white text-xl sm:text-2xl" />
        </button>

        <button
          onClick={() => setInstructionOpen(true)}
          className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-md text-white font-bold py-2 px-3 sm:py-2.5 sm:px-4 md:px-6 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-blue-400/30 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 flex-shrink-0"
        >
          <span className="hidden xs:inline sm:inline">How To Play</span>
          <span className="inline xs:hidden sm:hidden">Help</span>
          <BiBulb className="text-base sm:text-xl animate-pulse" />
        </button>
      </div>
      <div className="absolute inset-0 bg-black/40" />
      {!started && <StartScreen onStart={() => setStarted(true)} />}

      {started && !difficulty && (
        <InstrumentsDifficulty setDifficulty={setDifficulty} />
      )}

      {started && difficulty && !finished && current && (
        <InstrumentQuestions
          currentIndex={currentIndex}
          questions={questions}
          score={score}
          current={current}
          selected={selected}
          submitted={submitted}
          isPlaying={isPlaying}
          audioLoaded={audioLoaded}
          toggleAudio={toggleAudio}
          handleSelect={handleSelect}
          handleSubmit={handleSubmit}
          resetGame={resetGame}
        />
      )}
    </div>
  );
};

export default Instruments;
