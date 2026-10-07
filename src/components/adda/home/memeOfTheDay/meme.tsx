import { Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const Meme = () => {
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const floatTweenRef = useRef<gsap.core.Tween | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.set(
      [
        el,
        emojiRef.current,
        badgeRef.current,
        imgWrapperRef.current,
        tagRef.current,
      ],
      { opacity: 0 },
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.fromTo(
            el,
            { y: 30, opacity: 0, scale: 0.97 },
            { y: 0, opacity: 1, scale: 1, duration: 0.5 },
          )
            .fromTo(
              emojiRef.current,
              { scale: 0, rotate: -180, opacity: 0 },
              {
                scale: 1,
                rotate: 0,
                opacity: 1,
                duration: 0.45,
                ease: "back.out(1.7)",
              },
              "-=0.25",
            )
            .fromTo(
              badgeRef.current,
              { x: 20, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.35 },
              "-=0.2",
            )
            .fromTo(
              imgWrapperRef.current,
              { scale: 0.88, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.4)" },
              "-=0.2",
            )
            .fromTo(
              tagRef.current,
              { y: 10, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.3 },
              "-=0.1",
            )
            .add(() => {
              floatTweenRef.current = gsap.to(emojiRef.current, {
                y: -4,
                duration: 1.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              });
            });
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      floatTweenRef.current?.kill();
    };
  }, []);

  const handleEmojiHoverEnter = () => {
    gsap.to(emojiRef.current, {
      scale: 1.2,
      rotate: 10,
      duration: 0.2,
      ease: "back.out(2)",
    });
  };

  const handleEmojiHoverLeave = () => {
    gsap.to(emojiRef.current, {
      scale: 1,
      rotate: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleImgHoverEnter = () => {
    gsap.to(imgWrapperRef.current, {
      scale: 1.03,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleImgHoverLeave = () => {
    gsap.to(imgWrapperRef.current, {
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleImgClick = () => {
    gsap.to(imgWrapperRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => navigate("/adda/meme"),
    });
  };

  const handleTagHoverEnter = () => {
    gsap.to(tagRef.current, {
      scale: 1.08,
      y: -2,
      duration: 0.2,
      ease: "back.out(2)",
    });
  };

  const handleTagHoverLeave = () => {
    gsap.to(tagRef.current, {
      scale: 1,
      y: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      className="meme-panel flex flex-col items-center justify-center w-full p-5"
    >
      <style>{`
        .meme-font {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }
        .meme-chip-font {
          font-family: var(--font-comic-chip, var(--font-comic)) !important;
          font-weight: 400 !important;
          letter-spacing: 0.03em;
        }

        .meme-panel {
          background-color: #fffbeb;
          background-image: radial-gradient(rgba(249,115,22,0.10) 1.5px, transparent 2px);
          background-size: 16px 16px;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 14px;
        }

        .meme-header {
          background: #fff;
          border: 2px solid #000;
          border-left-width: 8px;
          border-left-color: #60a5fa;
          box-shadow: 2px 2px 0 #000;
          border-radius: 10px;
        }

        .meme-img {
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 10px;
          background: #fff;
          transition: box-shadow 0.1s ease;
        }
        .meme-img:hover { box-shadow: 4px 4px 0 #000; }
        .meme-img:focus-visible { outline: 3px solid #000; outline-offset: 3px; }

        .meme-chip {
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
        }

        .meme-divider { border-top: 2px dashed #000; }
      `}</style>

      <div className="meme-header flex items-center justify-between w-full px-3 py-2 mb-4">
        <div className="flex items-center gap-2">
          <div
            ref={emojiRef}
            className="relative"
            onMouseEnter={handleEmojiHoverEnter}
            onMouseLeave={handleEmojiHoverLeave}
          >
            <img
              src="/assets/adda/sidebar/e62353b3daac244b2443ebe94d0d8343.png"
              alt="emoji"
              className="w-7 h-7"
            />
          </div>
          <h1 className="meme-font text-base text-black whitespace-nowrap">
            Mentoons Meme
          </h1>
        </div>

        <span
          ref={badgeRef}
          className="meme-chip meme-chip-font flex items-center gap-1 px-3 py-1 text-xs cursor-default"
          style={{ background: "#bbf7d0" }}
          onMouseEnter={() =>
            gsap.to(badgeRef.current, {
              scale: 1.12,
              duration: 0.18,
              ease: "back.out(2)",
            })
          }
          onMouseLeave={() =>
            gsap.to(badgeRef.current, {
              scale: 1,
              duration: 0.18,
              ease: "power2.out",
            })
          }
        >
          <Award size={12} />
          Fresh
        </span>
      </div>

      <div
        ref={imgWrapperRef}
        role="link"
        tabIndex={0}
        aria-label="Open Mentoons Meme"
        className="meme-img relative w-full mb-4 overflow-hidden cursor-pointer"
        onClick={handleImgClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleImgClick();
          }
        }}
        onMouseEnter={handleImgHoverEnter}
        onMouseLeave={handleImgHoverLeave}
      >
        <img
          src="/assets/adda/sidebar/WhatsApp Image 2025-02-17 at 15.56.48_ee80d5fb.jpg"
          alt="meme"
          className="object-cover w-full h-auto"
        />
      </div>

      <div className="meme-divider w-full pt-4 flex justify-center">
        <div
          ref={tagRef}
          className="meme-chip meme-chip-font px-3 py-1 text-xs cursor-default"
          style={{ background: "#fed7aa" }}
          onMouseEnter={handleTagHoverEnter}
          onMouseLeave={handleTagHoverLeave}
        >
          #MemetoonsTuesday
        </div>
      </div>
    </div>
  );
};

export default Meme;
