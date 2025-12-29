import { useRef, useState, useEffect } from "react";

interface UserInputProps {
  disabled?: boolean;
  mainWord?: string;
  value?: string;
  onChange?: (word: string) => void;
  onEnter?: () => void;
  wordLength?: number;
  showError?: boolean;
}

const UserInput = ({
  disabled = false,
  mainWord = "",
  value = "",
  onChange,
  onEnter,
  wordLength = 4,
  showError = false,
}: UserInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [letters, setLetters] = useState<string[]>(Array(wordLength).fill(""));

  useEffect(() => {
    setLetters(Array(wordLength).fill(""));
  }, [wordLength]);

  useEffect(() => {
    if (value === "") {
      setLetters(Array(wordLength).fill(""));
      inputRefs.current.forEach((input) => {
        if (input) input.value = "";
      });
      inputRefs.current[0]?.focus();
    } else {
      const newLetters = value
        .toUpperCase()
        .padEnd(wordLength, "")
        .split("")
        .slice(0, wordLength);
      setLetters(newLetters);
    }
  }, [value, wordLength]);

  const notifyChange = (newLetters: string[]) => {
    const word = newLetters.join("").trim();
    if (onChange) {
      onChange(word);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newLetters = [...letters];
    newLetters[index] = value.toUpperCase();
    setLetters(newLetters);
    notifyChange(newLetters);

    if (value && index < wordLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "Enter" && onEnter) {
      onEnter();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .toUpperCase()
      .slice(0, wordLength);

    const newLetters = [...letters];
    pastedData.split("").forEach((char, index) => {
      if (index < wordLength) {
        newLetters[index] = char;
      }
    });
    setLetters(newLetters);
    notifyChange(newLetters);

    const nextIndex = Math.min(pastedData.length, wordLength - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const isValidLetter = (letter: string): boolean => {
    if (!mainWord || !letter) return true;
    return mainWord.toUpperCase().includes(letter.toUpperCase());
  };

  const boxSize = "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16";
  const textSize = "text-xl sm:text-2xl md:text-3xl";
  const gapSize = "gap-1.5 sm:gap-2 md:gap-3";

  return (
    <>
      <style>{`
        @keyframes blink-red {
          0%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-blink-red { animation: blink-red 0.5s ease-in-out; }
      `}</style>
      <div
        className={`flex items-center justify-center ${gapSize} mt-2 sm:mt-3 md:mt-4 flex-shrink-0 flex-wrap max-w-4xl mx-auto px-2`}
      >
        {Array.from({ length: wordLength }).map((_, i) => (
          <div
            key={i}
            className={`relative ${boxSize} rounded-lg sm:rounded-xl
             bg-gradient-to-br from-slate-100 via-slate-50 to-white
             border-2 ${
               showError
                 ? "border-red-500 bg-red-50"
                 : letters[i] && !isValidLetter(letters[i])
                 ? "border-red-400"
                 : "border-slate-300"
             }
             shadow-[0_8px_24px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)]
             hover:shadow-[0_12px_32px_rgba(59,130,246,0.25),0_4px_12px_rgba(59,130,246,0.15),inset_0_1px_2px_rgba(255,255,255,0.9)]
             hover:border-blue-400
             hover:-translate-y-1
             hover:scale-105
             transition-all duration-300 ease-out
             backdrop-blur-sm
             p-1.5 sm:p-2
             group
             ${disabled ? "opacity-50 pointer-events-none" : ""}
             ${showError ? "animate-blink-red" : ""}`}
          >
            <input
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              maxLength={1}
              disabled={disabled}
              value={letters[i]}
              className={`w-full h-full rounded-md sm:rounded-lg text-center ${textSize} font-bold
               bg-transparent ${
                 showError
                   ? "text-red-600"
                   : letters[i] && !isValidLetter(letters[i])
                   ? "text-red-600"
                   : "text-slate-800"
               }
               focus:text-blue-600
               outline-none
               transition-all duration-200
               caret-blue-500
               selection:bg-blue-200
               disabled:cursor-not-allowed`}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
            />
            <div className="absolute top-1 sm:top-1.5 left-1 sm:left-1.5 w-4 h-4 sm:w-6 sm:h-6 bg-white/80 rounded-full blur-lg pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 bg-white/90 rounded-full pointer-events-none" />

            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-1 bg-slate-400/20 rounded-full blur-sm pointer-events-none" />
          </div>
        ))}
      </div>
    </>
  );
};

export default UserInput;
