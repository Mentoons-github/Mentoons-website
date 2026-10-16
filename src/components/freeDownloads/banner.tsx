import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const FreeBanner = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "back.out(1.6)" },
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        titleRef.current,
        { y: 45, opacity: 0, scale: 0.8, rotation: -4 },
        { y: 0, opacity: 1, scale: 1, rotation: -2, duration: 0.9 },
      )
        .fromTo(
          textRef.current,
          { y: 35, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8 },
          "-=0.5",
        )
        .fromTo(
          imgRef.current,
          { x: 60, opacity: 0, scale: 0.7, rotation: 10 },
          { x: 0, opacity: 1, scale: 1, rotation: 0, duration: 1 },
          "-=0.6",
        );
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={bannerRef}
      className="relative min-h-[50vh] bg-gradient-to-br from-orange-400 via-yellow-300 to-orange-500 p-6 md:p-10 rounded-3xl overflow-hidden border-4 border-black shadow-[10px_10px_0_#000]"
    >
      {/* halftone overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)",
          backgroundSize: "14px 14px",
          maskImage: "linear-gradient(to left, black, transparent 70%)",
          WebkitMaskImage: "linear-gradient(to left, black, transparent 70%)",
        }}
      />

      <div className="relative z-10 ml-2 md:ml-12 space-y-8">
        <h1
          ref={titleRef}
          className="font-comic text-6xl md:text-8xl tracking-widest text-white uppercase leading-none max-w-xs md:max-w-md"
          style={{
            WebkitTextStroke: "3px #000",
            textShadow: "6px 6px 0 #000",
            paintOrder: "stroke fill",
          }}
        >
          FREE DOWNLOADS
        </h1>

        <p
          ref={textRef}
          className="font-comic relative max-w-md md:max-w-xl bg-white text-gray-900 text-lg md:text-2xl tracking-wide leading-snug border-4 border-black rounded-2xl p-5 shadow-[6px_6px_0_#000]"
        >
          Dive into a collection of fun and engaging games to play anytime,
          anywhere — plus access important emergency contact tools designed to
          keep you informed and prepared. Everything is just a click away, and
          completely free!
          {/* speech bubble tail */}
          <span className="absolute -top-[18px] left-10 w-0 h-0 border-l-[14px] border-r-[14px] border-b-[18px] border-l-transparent border-r-transparent border-b-black" />
          <span className="absolute -top-[10px] left-[42px] w-0 h-0 border-l-[12px] border-r-[12px] border-b-[15px] border-l-transparent border-r-transparent border-b-white" />
        </p>
      </div>

      <div className="absolute inset-y-0 right-0 hidden lg:flex items-center pr-10 xl:pr-24 pointer-events-none">
        <img
          ref={imgRef}
          src="/assets/freeDownloads/bg.png"
          alt="Free Downloads Icon"
          className="w-auto h-[300px] xl:h-[380px] drop-shadow-[6px_6px_0_rgba(0,0,0,0.9)]"
        />
      </div>
    </div>
  );
};

export default FreeBanner;
