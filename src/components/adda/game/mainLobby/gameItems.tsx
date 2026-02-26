import { useEffect, useRef } from "react";
import { GAMES } from "@/constant/adda/game/game";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GameItems = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { y: 80, opacity: 0, scale: 0.85, rotateY: 15 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 0.8,
          ease: "back.out(1.2)",
          stagger: {
            amount: 0.9,
            from: "start",
          },
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      cardRefs.current.forEach((card) => {
        if (!card) return;

        const img = card.querySelector("img");
        if (img) {
          gsap.to(img, {
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        ScrollTrigger.create({
          trigger: card,
          start: "top 75%",
          onEnter: () => {
            gsap.to(card, {
              borderColor: "rgba(99, 179, 237, 0.5)",
              duration: 0.4,
              ease: "power1.out",
              yoyo: true,
              repeat: 1,
            });
          },
        });
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-7xl mx-auto" ref={gridRef}>
      <div
        ref={titleRef}
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-2 md:gap-5"
      >
        {GAMES.map((game, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            className="group relative rounded-xl border-2 border-gray-700 w-full h-40 md:h-64 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 hover:border-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute left-4 top-8 bottom-8 w-1 bg-gradient-to-b from-transparent via-white to-transparent opacity-60 blur-sm z-10"></div>
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent z-10"></div>

            <div className="relative w-full h-full">
              {game.thumbnail ? (
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-bold">
                  {game.title}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg text-center">
                  {game.title}
                </h3>
              </div>

              <a
                href={game.link}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm z-20"
              >
                <span className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all">
                  Play
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameItems;
