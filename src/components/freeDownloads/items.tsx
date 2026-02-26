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
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
        )
        .fromTo(
          paraRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
          "-=0.7",
        );

      gsap.fromTo(
        cardsRef.current,
        {
          y: 60,
          opacity: 0,
          scale: 0.92,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.11,
          ease: "power3.out",
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
          y: -12,
          scale: 1.04,
          duration: 0.5,
          ease: "power2.out",
        });

        card.addEventListener("mouseenter", () => tl.play());
        card.addEventListener("mouseleave", () => tl.reverse());
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center"
    >
      <div className="text-center mb-12">
        <h1
          ref={headingRef}
          className="text-4xl md:text-6xl font-bold tracking-wider font-montserrat bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 bg-clip-text text-transparent mb-4"
        >
          Free Games & Emergency Tools
        </h1>
        <p
          ref={paraRef}
          className="text-md text-gray-600 font-montserrat max-w-2xl mx-auto"
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
            className="group w-full max-w-xs bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-[480px] flex flex-col overflow-hidden border border-orange-100 hover:border-orange-200"
          >
            <div className="relative h-64 bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 rounded-t-2xl overflow-hidden">
              <img
                src={data.image}
                alt={data.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-bold tracking-wider font-montserrat text-gray-900 mb-2">
                {data.name}
              </h2>
              <p className="text-sm text-gray-600 font-montserrat mb-4 line-clamp-3 flex-grow leading-relaxed">
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
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-yellow-600 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
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
