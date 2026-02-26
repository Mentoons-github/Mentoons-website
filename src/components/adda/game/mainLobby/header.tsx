import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GameLobbyHeader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: -60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        decorRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          delay: 0.6,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.to(blob1Ref.current, {
        x: 40,
        y: -30,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(blob2Ref.current, {
        x: -40,
        y: 30,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden pt-16 pb-8">
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={blob1Ref}
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
        ></div>
        <div
          ref={blob2Ref}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"
        ></div>
      </div>

      <div className="relative z-10 text-center md:px-8">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient"
        >
          Game Lobby
        </h1>
        <p
          ref={subtitleRef}
          className="text-gray-400 md:text-xl max-w-2xl mx-auto"
        >
          Sharpen your mind, boost creativity, and enhance your logical and
          numerical skills as you embark on thrilling adventures.
        </p>
        <div
          ref={decorRef}
          className="mt-6 flex items-center justify-center gap-2"
        >
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          <div className="h-1 w-1 bg-cyan-500 rounded-full"></div>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default GameLobbyHeader;
