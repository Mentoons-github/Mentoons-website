import { motion } from "framer-motion";
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
    <motion.div
      ref={containerRef}
      className="flex flex-col items-center justify-center w-full p-4 bg-white border border-gray-100 shadow-lg rounded-xl dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            ref={emojiRef}
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="relative"
          >
            <img
              src="/assets/adda/sidebar/e62353b3daac244b2443ebe94d0d8343.png"
              alt="emoji"
              className="w-7 h-7"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute w-3 h-3 border border-white rounded-full -top-1 -right-1 bg-mt-yellow"
            />
          </motion.div>
          <h1 className="font-semibold text-md text-men-blue dark:text-white figtree whitespace-nowrap">
            Mentoons Meme
          </h1>
        </div>

        <motion.span
          ref={badgeRef}
          exit={{ opacity: 0, x: 20 }}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-mt-teal/20 text-mt-teal"
          onMouseEnter={() =>
            gsap.to(badgeRef.current, {
              scale: 1.1,
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
        </motion.span>
      </div>

      <motion.div
        ref={imgWrapperRef}
        className="relative w-full mb-3 overflow-hidden rounded-xl group cursor-pointer"
        onClick={handleImgClick}
        onMouseEnter={handleImgHoverEnter}
        onMouseLeave={handleImgHoverLeave}
      >
        <img
          src="/assets/adda/sidebar/WhatsApp Image 2025-02-17 at 15.56.48_ee80d5fb.jpg"
          alt="meme"
          className="object-cover w-full h-auto transition-all rounded-xl"
        />
        <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-br from-mt-purple/20 via-transparent to-mt-yellow/20 group-hover:opacity-100 rounded-xl" />
      </motion.div>

      <motion.div
        ref={tagRef}
        className="px-2 py-1 text-xs font-medium rounded-full text-mt-orange dark:text-mt-yellow bg-mt-orange/10 dark:bg-mt-yellow/20 cursor-default"
        onMouseEnter={handleTagHoverEnter}
        onMouseLeave={handleTagHoverLeave}
      >
        #MemetoonsTuesday
      </motion.div>
    </motion.div>
  );
};

export default Meme;
