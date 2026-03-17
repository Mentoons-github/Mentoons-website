import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6";

const solutions = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M7 20h10" />
        <path d="M9 16v4M15 16v4" />
      </svg>
    ),
    title: "Interactive Workshops:",
    desc: "Join expert-led workshops designed to educate parents and children about healthy technology habits, digital wellbeing, and balanced lifestyle practices.",
  },

  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="8" r="3" />
        <path d="M2 20v-2a4 4 0 014-4h4" />
        <path d="M22 20v-2a4 4 0 00-4-4h-4" />
      </svg>
    ),
    title: "Community Meetup Groups:",
    desc: "Connect with other parents and families through local meetup groups to share experiences, support each other, and learn practical strategies together.",
  },

  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-6 h-6"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M5 21v-2a7 7 0 0114 0v2" />
        <path d="M16 11l2 2 4-4" />
      </svg>
    ),
    title: "One-on-One Session with Psychologist:",
    desc: "Schedule personalized sessions with certified psychologists to address specific concerns and receive expert guidance for your child's digital wellbeing.",
  },
];

const HowCanWeSolveSection = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full my-20 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -left-20 w-64 sm:w-80 h-64 sm:h-80 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, #FFCBA4 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-16 -right-16 w-48 sm:w-64 h-48 sm:h-64 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #FFB085 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div
          className="flex justify-center items-end"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-40px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="w-3/4 aspect-[3/4] overflow-hidden rounded-2xl">
            <img
              src="/assets/home/newPage/solution/happy_family.png"
              alt="Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          }}
        >
          <h2
            className="text-4xl font-medium tracking-wide"
            style={{
              color: "#1A1A1A",
              letterSpacing: "-0.5px",
            }}
          >
            HOW CAN WE SOLVE
            <br />
            THESE ?
          </h2>

          <div className="flex flex-col gap-8 mt-5">
            {solutions.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-5"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(20px)",
                  transition: `opacity 0.6s ease ${0.4 + i * 0.15}s, transform 0.6s ease ${0.4 + i * 0.15}s`,
                }}
              >
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: "#F0EDE8", color: "#9E9E9E" }}
                >
                  {item.icon}
                </div>

                <div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#9E9E9E", fontFamily: "sans-serif" }}
                  >
                    <span className="font-semibold" style={{ color: "#888" }}>
                      {item.title}
                    </span>{" "}
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-10"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease 0.9s",
            }}
          >
            <button className="flex items-center justify-center gap-2 rounded-lg bg-orange-400 px-10 py-2 text-white mt-3 text-lg">
              Get Started <FaArrowUp className="rotate-45" />{" "}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowCanWeSolveSection;
