import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AboutMentoons = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      containerRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55 },
    )
      .fromTo(
        cardRefs.current.filter(Boolean),
        { x: -25, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
        "-=0.3",
      )
      .fromTo(
        tagsRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35 },
        "-=0.1",
      );
  }, []);

  const handleCardHoverEnter = (el: HTMLDivElement | null) => {
    if (!el) return;
    gsap.to(el, { x: 4, scale: 1.01, duration: 0.2, ease: "power2.out" });
  };

  const handleCardHoverLeave = (el: HTMLDivElement | null) => {
    if (!el) return;
    gsap.to(el, { x: 0, scale: 1, duration: 0.2, ease: "power2.out" });
  };

  const cards = [
    {
      accent: "#60a5fa",
      emoji: "🎨",
      label: "Our Mission",
      text: "At Mentoons, we believe in leveraging the power of cartoons and comics to impart mentoring and learning lessons. Our unique approach revolves around conducting workshops for social media de-addiction, mobile de-addiction and gaming de-addiction.",
    },
    {
      accent: "#fb923c",
      emoji: "👥",
      label: "Our Team",
      text: "Our team of talented artists, psychologists/educators and storytellers work together to create a vibrant world of comics, audio comics, podcasts and engaging workshops that inspire creativity, critical thinking and a love for life.",
    },
    {
      accent: "#4ade80",
      emoji: "🌟",
      label: "Our Approach",
      text: "At Mentoons, we believe that learning should be an adventure! We're passionate about nurturing young minds through the power of storytelling, visual arts and interactive experiences.",
    },
    {
      accent: "#c084fc",
      emoji: "🎯",
      label: "Our Impact",
      text: "Our impactful lessons resonate with people of all age groups, creating meaningful connections and lasting positive change.",
    },
  ];

  const tags = [
    { label: "Comics", bg: "#bfdbfe" },
    { label: "Workshops", bg: "#fed7aa" },
    { label: "Podcasts", bg: "#bbf7d0" },
  ];

  return (
    <div ref={containerRef} className="ab-panel p-6 mt-5">
      <style>{`
        .ab-font {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }
        .ab-chip-font {
          font-family: var(--font-comic-chip, var(--font-comic)) !important;
          font-weight: 400 !important;
          letter-spacing: 0.03em;
        }

        .ab-panel {
          background-color: #fffbeb;
          background-image: radial-gradient(rgba(249,115,22,0.10) 1.5px, transparent 2px);
          background-size: 16px 16px;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 14px;
        }

        .ab-card {
          background: #fff;
          border: 2px solid #000;
          border-left-width: 8px;
          box-shadow: 2px 2px 0 #000;
          border-radius: 10px;
          transition: box-shadow 0.1s ease;
        }
        .ab-card:hover { box-shadow: 3px 3px 0 #000; }

        .ab-divider {
          border-top: 2px dashed #000;
        }

        .ab-tag {
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
        }
      `}</style>

      <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
        {cards.map((card, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="ab-card p-4 cursor-default"
            style={{ borderLeftColor: card.accent }}
            onMouseEnter={() => handleCardHoverEnter(cardRefs.current[i])}
            onMouseLeave={() => handleCardHoverLeave(cardRefs.current[i])}
          >
            <p className="ab-font text-black text-base mb-2">
              {card.emoji} {card.label}
            </p>
            <p>{card.text}</p>
          </div>
        ))}
      </div>

      <div ref={tagsRef} className="ab-divider mt-5 pt-4">
        <div className="flex items-center justify-center">
          <div className="flex space-x-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="ab-tag ab-chip-font px-3 py-1 text-xs cursor-default"
                style={{ background: tag.bg }}
                onMouseEnter={(e) =>
                  gsap.to(e.currentTarget, {
                    scale: 1.12,
                    duration: 0.18,
                    ease: "back.out(2)",
                  })
                }
                onMouseLeave={(e) =>
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    duration: 0.18,
                    ease: "power2.out",
                  })
                }
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMentoons;
