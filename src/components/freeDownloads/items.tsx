import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { gamesData } from "@/constant/comicsConstants";
import { SelectedComicType } from "@/pages/FreeDownload";
import { FaDownload } from "react-icons/fa6";

interface ItemsProps {
  setShowFreeDownloadForm: (show: boolean) => void;
  setSelectedComic: (comic: SelectedComicType) => void;
}

const Items = ({ setShowFreeDownloadForm, setSelectedComic }: ItemsProps) => {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      introTl
        .fromTo(
          headingRef.current,
          { y: 50, opacity: 0, scale: 0.85, rotation: -3 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: -1,
            duration: 0.9,
            ease: "back.out(1.7)",
          },
        )
        .fromTo(
          paraRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5",
        );

      gsap.fromTo(
        cardsRef.current,
        { y: 60, opacity: 0, scale: 0.9, rotation: 3 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: cardsRef.current[0]?.parentElement || sectionRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        },
      );

      cardsRef.current.forEach((card) => {
        if (!card) return;

        const tl = gsap.timeline({ paused: true });
        tl.to(card, {
          y: -10,
          scale: 1.04,
          rotation: -1.5,
          duration: 0.35,
          ease: "back.out(2)",
        });

        const enter = () => tl.play();
        const leave = () => tl.reverse();
        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
        });
      });
    }, sectionRef);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center"
    >
      <div className="text-center mb-12">
        <h1
          ref={headingRef}
          className="font-comic text-5xl md:text-7xl tracking-widest uppercase text-yellow-300 mb-6"
          style={{
            WebkitTextStroke: "3px #000",
            textShadow: "5px 5px 0 #000",
            paintOrder: "stroke fill",
          }}
        >
          Free Games & Emergency Tools
        </h1>
        <p
          ref={paraRef}
          className="font-comic text-lg md:text-xl tracking-wide text-gray-900 max-w-2xl mx-auto bg-white border-4 border-black rounded-xl px-5 py-3 shadow-[5px_5px_0_#000]"
        >
          Enjoy our collection of exciting games and essential emergency
          contacts — all available to download and use at no cost.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center w-full">
        {gamesData.map((data, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) cardsRef.current[index] = el;
            }}
            className="group w-full max-w-xs bg-white rounded-2xl h-[480px] flex flex-col overflow-hidden border-4 border-black shadow-[8px_8px_0_#000]"
          >
            <div className="relative h-64 bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 border-b-4 border-black overflow-hidden">
              <img
                src={data.image}
                alt={data.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="font-comic-chip absolute top-3 left-3 bg-red-500 text-white text-sm tracking-widest px-3 py-1 border-2 border-black rounded-md shadow-[3px_3px_0_#000] -rotate-6">
                FREE!
              </span>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h2 className="font-comic text-2xl tracking-widest text-gray-900 mb-2 leading-tight">
                {data.name}
              </h2>
              <p className="font-comic text-base tracking-wide text-gray-700 mb-4 line-clamp-3 flex-grow leading-snug">
                {data.desc}
              </p>
              <button
                onClick={() => {
                  setShowFreeDownloadForm(true);
                  setSelectedComic({
                    thumbnail_url: data.thumbnail_url,
                    pdf_url: data.pdf_url,
                  });
                }}
                className="font-comic-chip w-full px-6 py-3 bg-orange-500 text-white text-lg tracking-widest uppercase rounded-xl border-4 border-black shadow-[4px_4px_0_#000] hover:bg-yellow-400 hover:text-black hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150 flex items-center justify-center gap-2"
                aria-label={`Download ${data.name}`}
              >
                <FaDownload className="w-4 h-4" />
                Download Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Items;
