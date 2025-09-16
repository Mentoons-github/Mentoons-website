import { useState, useEffect } from "react";

const TextAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [visibleWords, setVisibleWords] = useState<number>(0);
  const words = [
    "Hello",
    "teenagers,",
    "parents",
    "and",
    "everyday",
    "tech-users",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleWords < words.length) {
        setVisibleWords((prev) => prev + 1);
      } else {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [visibleWords, words.length, onComplete]);

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100">
      <div className="text-center px-8">
        <div className="flex flex-wrap justify-center items-center gap-3 text-3xl md:text-4xl lg:text-5xl font-bold">
          {words.map((word, index) => (
            <span
              key={index}
              className={`
                inline-block transition-all duration-700 ease-out transform
                ${
                  index < visibleWords
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95"
                }
                ${index === 0 ? "text-purple-600" : ""}
                ${index === 1 ? "text-blue-600" : ""}
                ${index === 2 ? "text-green-600" : ""}
                ${index === 3 ? "text-orange-500" : ""}
                ${index === 4 ? "text-pink-600" : ""}
                ${index === 5 ? "text-indigo-600" : ""}
              `}
              style={{
                animationDelay: `${index * 0.1}s`,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {word}
              {index < visibleWords && (
                <span className="inline-block ml-1 animate-bounce">
                  {index === 0
                    ? "👋"
                    : index === 1
                    ? "👨‍👩‍👧‍👦"
                    : index === 2
                    ? "👪"
                    : index === 4
                    ? "💻"
                    : ""}
                </span>
              )}
            </span>
          ))}
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-300 rounded-full animate-pulse opacity-60"></div>
          <div
            className="absolute top-3/4 right-1/4 w-6 h-6 bg-pink-300 rounded-full animate-bounce opacity-50"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/6 w-3 h-3 bg-blue-300 rounded-full animate-ping opacity-40"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/3 w-5 h-5 bg-green-300 rounded-full animate-pulse opacity-50"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TextAnimation;
