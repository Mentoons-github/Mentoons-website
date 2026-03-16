import { useState } from "react";
import { FaArrowUp } from "react-icons/fa6";

const cards = [
  {
    title: "Community",
    description:
      "A safe and supportive space where parents and kids can connect, share experiences, ask questions, and learn from each other. Build friendships and grow together in a positive community.",
    image: "https://cdn-icons-png.flaticon.com/512/681/681494.png",
  },
  {
    title: "One on One Session with Psychologist",
    description:
      "Book private sessions with our experienced psychologists to discuss challenges, emotions, and personal growth. Get professional guidance and support tailored to every child's needs.",
    image: "https://illustrations.popsy.co/amber/video-call.svg",
  },
  {
    title: "Audio Comics & E-Comics",
    description:
      "Explore a world of fun and meaningful stories through our Audio Comics and E-Comics. Designed to entertain kids while helping them learn values, emotions, and important life lessons.",
    image: "https://illustrations.popsy.co/amber/remote-work.svg",
    image2: "https://cdn-icons-png.flaticon.com/512/2702/2702134.png",
  },
];

const MentoonsHelp = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative bg-white py-20 px-6 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full border border-gray-300 opacity-40"
        style={{ transform: "translate(30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 right-8 w-40 h-40 rounded-full"
        style={{
          background: "rgba(255, 200, 200, 0.25)",
          filter: "blur(30px)",
        }}
      />

      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-medium tracking-wide">
          HOW WILL MENTOONS HELP
          <br />
          IN THESE ?
        </h2>
        <p className="text-md text-gray-500 max-w-6xl mx-auto leading-relaxed mt-5">
          Mentoos brings balance to children's lives through captivating audio
          books, silent stories, counseling, and interactive worksheets. By
          igniting imagination, fostering reading habits, and providing a safe
          space for emotional expression, we empower children to develop
          resilience and coping skills. Through engaging activities, we promote
          cognitive growth and a harmonious relationship with technology,
          ensuring a well-rounded and balanced childhood.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {cards.map((card, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative bg-white rounded-2xl border border-gray-100 px-8 pt-8 pb-8 flex flex-col items-center text-center cursor-pointer"
            style={{
              boxShadow:
                hovered === i
                  ? "0 12px 40px rgba(0,0,0,0.12)"
                  : "0 2px 16px rgba(0,0,0,0.06)",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
              transform: hovered === i ? "translateY(-4px)" : "translateY(0)",
            }}
          >
            {i === 2 && (
              <div
                className="absolute bottom-0 right-0 w-24 h-24 rounded-full"
                style={{
                  background: "rgba(255, 180, 180, 0.3)",
                  filter: "blur(20px)",
                  zIndex: 0,
                }}
              />
            )}
            <div className="w-36 h-36 mb-5 relative z-10">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 relative z-10">
              {card.title}
            </h3>
            <p className="text-md text-gray-400 leading-relaxed relative z-10">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="flex items-center justify-center gap-2 rounded-lg bg-orange-400 px-10 py-2 text-white mt-3 text-lg">
          Get Started <FaArrowUp className="rotate-45" />{" "}
        </button>
      </div>
    </section>
  );
};

export default MentoonsHelp;
