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
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        titleRef.current,
        { y: 45, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 1.1 },
      )
        .fromTo(
          textRef.current,
          { y: 35, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 1 },
          "-=0.7",
        )
        .fromTo(
          imgRef.current,
          { x: 60, opacity: 0, scale: 0.85, rotation: 4 },
          { x: 0, opacity: 1, scale: 1, rotation: 0, duration: 1.3 },
          "-=0.9",
        );
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={bannerRef}
      className="relative min-h-[50vh] bg-gradient-to-br from-orange-400 via-yellow-300 to-orange-500 p-6 md:p-10 rounded-3xl overflow-hidden"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id="curveClip">
            <path d="M0,0 Q30,40 100,10 L100,90 Q70,100 30,100 L0,80 Q10,40 0,0 Z" />
          </clipPath>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#gradient)"
          clipPath="url(#curveClip)"
        />
      </svg>

      <div className="relative z-10 ml-6 md:ml-12 font-montserrat space-y-6">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold tracking-wider text-gray-900 drop-shadow-lg w-48 md:w-64"
        >
          FREE DOWNLOADS
        </h1>
        <p
          ref={textRef}
          className="max-w-md md:max-w-xl text-gray-900 text-base md:text-lg leading-relaxed"
        >
          Dive into a collection of fun and engaging games to play anytime,
          anywhere — plus access important emergency contact tools designed to
          keep you informed and prepared. Everything is just a click away, and
          completely free!
        </p>
      </div>

      <img
        ref={imgRef}
        src="/assets/freeDownloads/bg.png"
        alt="Free Downloads Icon"
        className="absolute top-4 right-4 md:top-1/4 md:right-1/4 translate-x-1/2 w-auto h-[250px]"
      />
    </div>
  );
};

export default FreeBanner;
