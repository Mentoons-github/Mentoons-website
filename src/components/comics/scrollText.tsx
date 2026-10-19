import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  Comic theme (shared with the rest of the store)
  Text now sits in white comic caption boxes with a coloured sticker on top,
  so it stays readable over any of the four background images (the old
  light/dark text colour switching is no longer needed).
  Scroll / pin / background-swap logic is unchanged.
*/
const comicCss = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700;900&display=swap');

.comic-scroll { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; color: #000; }
.comic-scroll .comic-title { font-family: 'Bangers', 'Impact', sans-serif; letter-spacing: 0.04em; }
.comic-scroll .comic-caption { border: 3px solid #000; box-shadow: 4px 4px 0 #000; }

@media (min-width: 1024px) {
  .comic-scroll .comic-caption { border-width: 4px; box-shadow: 8px 8px 0 #000; }
}
`;

const ScrollTextSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const textsRef = useRef<HTMLDivElement[]>([]);
  const bgLayersRef = useRef<HTMLDivElement[]>([]);

  const scrollTexts = [
    {
      title: "Digital Wellness Series",
      subtitle: "E-Comics & Audio Comics",
      description:
        "Welcome to the world of meaningful stories and valuable life lessons",
      stickerBg: "bg-[#FFD93B]",
      stickerText: "text-black",
    },
    {
      title: "Stories for Every Young Mind",
      subtitle: "Engaging & Educational",
      description:
        "Our Comics and stories are designed to help children and teenagers navigate important life topics",
      stickerBg: "bg-[#2D6BFF]",
      stickerText: "text-white",
    },
    {
      title: "Social Media Safety",
      subtitle: "Navigate the Digital World",
      description:
        "Learn to stay safe online, recognize risks, and build healthy digital habits",
      stickerBg: "bg-[#FF4D3D]",
      stickerText: "text-white",
    },
    {
      title: "Breaking Free from Gadget Addiction",
      subtitle: "Balance & Mindfulness",
      description:
        "Comic book series that help understand screen time, build self-control, and rediscover real-world connections",
      stickerBg: "bg-[#BDF5D0]",
      stickerText: "text-black",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const texts = textsRef.current.filter(Boolean);
    const bgLayers = bgLayersRef.current.filter(Boolean);

    const ctx = gsap.context(() => {
      gsap.set(texts, {
        opacity: 0,
        y: 100,
        filter: "blur(12px)",
        scale: 0.92,
      });

      gsap.set(bgLayers[0], { y: 0 });
      gsap.set(bgLayers[1], { y: "100%" });
      gsap.set(bgLayers[2], { y: "100%" });
      gsap.set(bgLayers[3], { y: "100%" });

      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "+=7200",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      texts.forEach((text, i) => {
        const tl = gsap.timeline();

        if (i > 0 && i < bgLayers.length) {
          tl.to(
            bgLayers[i - 1],
            { y: "-100%", duration: 3, ease: "power1.inOut" },
            0,
          );
          tl.to(bgLayers[i], { y: "0%", duration: 3, ease: "power1.inOut" }, 0);
        }

        tl.to(
          text,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          i > 0 ? "+=0.5" : 0,
        );

        tl.to({}, { duration: 3.5 });

        tl.to(text, {
          opacity: 0,
          y: -70,
          filter: "blur(10px)",
          scale: 0.97,
          duration: 1,
          ease: "power2.in",
        });

        masterTL.add(tl, i > 0 ? "-=1.2" : 0);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="comic-scroll relative flex h-[110vh] w-full items-center justify-center overflow-hidden border-y-4 border-black bg-white lg:border-y-8"
    >
      <style>{comicCss}</style>

      <div
        className="absolute inset-0 bg-cover bg-center"
        ref={(el) => el && (bgLayersRef.current[0] = el)}
        style={{
          backgroundImage: "url('/assets/comic-V2/vertical-bg/1.jpg')",
        }}
      />

      <div
        className="absolute inset-0 bg-cover bg-center"
        ref={(el) => el && (bgLayersRef.current[1] = el)}
        style={{
          backgroundImage: "url('/assets/comic-V2/vertical-bg/2.jpg')",
        }}
      />

      <div
        className="absolute inset-0 bg-cover bg-center"
        ref={(el) => el && (bgLayersRef.current[2] = el)}
        style={{
          backgroundImage: "url('/assets/comic-V2/vertical-bg/3.jpg')",
        }}
      />

      <div
        className="absolute inset-0 bg-cover bg-center"
        ref={(el) => el && (bgLayersRef.current[3] = el)}
        style={{
          backgroundImage: "url('/assets/comic-V2/vertical-bg/4.jpg')",
        }}
      />

      <div className="relative z-20 w-full max-w-5xl px-4 text-center md:px-12">
        {scrollTexts.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) textsRef.current[i] = el;
            }}
            className="absolute inset-0 flex flex-col items-center justify-center will-change-transform"
          >
            {/* Caption box: the sticker overlaps its top-left corner */}
            <div className="relative w-full max-w-3xl">
              <span
                className={`comic-title comic-caption absolute -top-5 left-3 z-10 -rotate-3 px-4 py-1 text-xl sm:-top-6 sm:left-6 sm:text-2xl lg:text-3xl ${item.stickerBg} ${item.stickerText}`}
              >
                {item.subtitle}
              </span>

              <div className="comic-caption rounded-2xl bg-white px-5 pb-6 pt-9 sm:px-8 sm:pb-8 sm:pt-12 lg:rotate-1">
                <h1 className="comic-title mb-4 text-4xl leading-[1.05] will-change-[filter,transform,opacity] sm:mb-5 sm:text-5xl md:text-6xl lg:text-7xl">
                  {item.title}
                </h1>

                <p className="mx-auto max-w-2xl text-base font-bold leading-relaxed will-change-[filter,transform,opacity] sm:text-lg md:text-xl lg:text-2xl">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollTextSection;
