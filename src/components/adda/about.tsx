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
      borderColor: "border-blue-400",
      emoji: "🎨",
      label: "Our Mission",
      text: "At Mentoons, we believe in leveraging the power of cartoons and comics to impart mentoring and learning lessons. Our unique approach revolves around conducting workshops for social media de-addiction, mobile de-addiction and gaming de-addiction.",
    },
    {
      borderColor: "border-orange-400",
      emoji: "👥",
      label: "Our Team",
      text: "Our team of talented artists, psychologists/educators and storytellers work together to create a vibrant world of comics, audio comics, podcasts and engaging workshops that inspire creativity, critical thinking and a love for life.",
    },
    {
      borderColor: "border-green-400",
      emoji: "🌟",
      label: "Our Approach",
      text: "At Mentoons, we believe that learning should be an adventure! We're passionate about nurturing young minds through the power of storytelling, visual arts and interactive experiences.",
    },
    {
      borderColor: "border-purple-400",
      emoji: "🎯",
      label: "Our Impact",
      text: "Our impactful lessons resonate with people of all age groups, creating meaningful connections and lasting positive change.",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 shadow-sm border border-orange-100 mt-5"
    >
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        {cards.map((card, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className={`bg-white/60 rounded-lg p-4 border-l-4 ${card.borderColor} cursor-default`}
            onMouseEnter={() => handleCardHoverEnter(cardRefs.current[i])}
            onMouseLeave={() => handleCardHoverLeave(cardRefs.current[i])}
          >
            <p className="font-medium text-gray-700 mb-2">
              {card.emoji} {card.label}
            </p>
            <p>{card.text}</p>
          </div>
        ))}
      </div>

      <div ref={tagsRef} className="mt-4 pt-4 border-t border-orange-200">
        <div className="flex items-center justify-center">
          <div className="flex space-x-2">
            {[
              { label: "Comics", bg: "bg-blue-100", text: "text-blue-800" },
              {
                label: "Workshops",
                bg: "bg-orange-100",
                text: "text-orange-800",
              },
              { label: "Podcasts", bg: "bg-green-100", text: "text-green-800" },
            ].map((tag, i) => (
              <span
                key={i}
                className={`px-2 py-1 ${tag.bg} ${tag.text} rounded-full text-xs font-medium cursor-default`}
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
