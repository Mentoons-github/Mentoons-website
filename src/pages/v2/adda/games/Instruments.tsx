// Instruments.tsx
import postScore from "@/api/game/postScore";
import InstrumentQuestions from "@/components/adda/games/IdentifyInstruments/InstrumentQuestions";
import InstrumentsDifficulty from "@/components/adda/games/IdentifyInstruments/InstrumentsDifficulty";
import InstrumentsFinished from "@/components/adda/games/IdentifyInstruments/InstrumentsFinished";
import StartScreen from "@/components/adda/games/IdentifyInstruments/StartScreen";
import {
  INSTRUMENT_BY_DIFFICULTY,
  InstrumentTypes,
} from "@/constant/games/instrumentQuestions";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";

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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = questions[currentIndex];

  const { getToken } = useAuth();

  const gameId = `instruments${difficulty}`;

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
      postScore({
        body: { gameId, difficulty: difficulty as string, score },
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
