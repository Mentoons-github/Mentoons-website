import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
      textColor: "text-gray-900",
      subtitleBg: "bg-gray-900/20",
      subtitleText: "text-gray-900",
    },
    {
      title: "Stories for Every Young Mind",
      subtitle: "Engaging & Educational",
      description:
        "Our Comics and stories are designed to help children and teenagers navigate important life topics",
      textColor: "text-gray-900",
      subtitleBg: "bg-gray-900/20",
      subtitleText: "text-gray-900",
    },
    {
      title: "Social Media Safety",
      subtitle: "Navigate the Digital World",
      description:
        "Learn to stay safe online, recognize risks, and build healthy digital habits",
      textColor: "text-white",
      subtitleBg: "bg-white/20",
      subtitleText: "text-white",
    },
    {
      title: "Breaking Free from Gadget Addiction",
      subtitle: "Balance & Mindfulness",
      description:
        "Comic book series that help understand screen time, build self-control, and rediscover real-world connections",
      textColor: "text-white",
      subtitleBg: "bg-white/20",
      subtitleText: "text-white",
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
      className="relative w-full h-[110vh] overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center"
    >
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

      <div className="relative w-full max-w-5xl px-6 md:px-12 text-center z-20">
        {scrollTexts.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) textsRef.current[i] = el;
            }}
            className="absolute inset-0 flex flex-col items-center justify-center will-change-transform"
          >
            <div className="relative w-full flex justify-center">
              <div
                className={`mb-6 inline-block px-5 py-2 sm:px-6 sm:py-3 ${item.subtitleBg} rounded-full backdrop-blur-sm`}
              >
                <p
                  className={`text-xs sm:text-sm md:text-base font-semibold ${item.subtitleText} uppercase tracking-wider`}
                >
                  {item.subtitle}
                </p>
              </div>

              {i === 0 && (
                <img
                  src="/assets/comic-V2/comics.png"
                  alt="welcome comic decoration"
                  className="
                  absolute 
                  -top-72 
                  right-0 
                  w-56 sm:w-72 md:w-96 lg:w-[180px] xl:w-[360px] 
                  h-auto 
                  z-30 
                  opacity-92 
                  pointer-events-none 
                  rotate-[-8deg]
                "
                />
              )}
            </div>

            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 sm:mb-8 leading-tight will-change-[filter,transform,opacity] ${item.textColor}`}
            >
              {item.title}
            </h1>

            <p
              className={`text-base sm:text-lg md:text-xl lg:text-2xl ${item.textColor} font-medium leading-relaxed max-w-3xl mx-auto will-change-[filter,transform,opacity]`}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollTextSection;
