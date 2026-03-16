import { useState, useEffect, useRef, JSX } from "react";

interface Item {
  id: string;
  title: string;
  description: string;
  reverse: boolean;
  iconBg: string;
  imageBg: string;
  icon: JSX.Element;
  illustration: JSX.Element;
}

const items: Item[] = [
  {
    id: "products",
    title: "Products",
    description:
      "Explore our curated range of educational products designed to spark curiosity and build essential skills in children of all ages. From learning kits to hands-on activity sets.",
    reverse: false,
    iconBg: "bg-gray-100",
    imageBg: "bg-orange-50",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#aaa"
        strokeWidth="2"
        className="w-6 h-6"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    illustration: (
      <svg
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
        className="w-52 h-52"
      >
        <rect
          x="10"
          y="112"
          width="140"
          height="8"
          rx="4"
          fill="#f5a623"
          opacity="0.25"
        />
        <rect
          x="18"
          y="62"
          width="36"
          height="50"
          rx="7"
          fill="#f5a623"
          opacity="0.75"
        />
        <rect
          x="62"
          y="72"
          width="36"
          height="40"
          rx="7"
          fill="#ff8a65"
          opacity="0.75"
        />
        <rect
          x="106"
          y="57"
          width="36"
          height="55"
          rx="7"
          fill="#66bb6a"
          opacity="0.75"
        />
        <circle cx="36" cy="50" r="10" fill="#ffd54f" />
        <circle cx="80" cy="60" r="8" fill="#ce93d8" />
        <circle cx="124" cy="44" r="12" fill="#4fc3f7" />
        <rect
          x="24"
          y="76"
          width="22"
          height="3"
          rx="1"
          fill="#fff"
          opacity="0.7"
        />
        <rect
          x="68"
          y="86"
          width="22"
          height="3"
          rx="1"
          fill="#fff"
          opacity="0.7"
        />
        <rect
          x="112"
          y="70"
          width="22"
          height="3"
          rx="1"
          fill="#fff"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    id: "comics",
    title: "Comics",
    description:
      "Engaging and fun comic stories that encourage reading and imagination. Our comics combine adventure with learning to keep kids entertained while building their vocabulary.",
    reverse: true,
    iconBg: "bg-gray-100",
    imageBg: "bg-pink-50",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#aaa"
        strokeWidth="2"
        className="w-6 h-6"
      >
        <path d="M4 4h16v12H4z" />
        <path d="M8 20h8" />
        <path d="M12 16v4" />
      </svg>
    ),
    illustration: (
      <svg
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
        className="w-52 h-52"
      >
        <rect
          x="10"
          y="15"
          width="65"
          height="60"
          rx="5"
          fill="#ffe0b2"
          stroke="#f5a623"
          strokeWidth="2"
        />
        <rect
          x="85"
          y="15"
          width="65"
          height="60"
          rx="5"
          fill="#fce4ec"
          stroke="#f48fb1"
          strokeWidth="2"
        />
        <rect
          x="10"
          y="85"
          width="65"
          height="60"
          rx="5"
          fill="#e3f2fd"
          stroke="#64b5f6"
          strokeWidth="2"
        />
        <rect
          x="85"
          y="85"
          width="65"
          height="60"
          rx="5"
          fill="#e8f5e9"
          stroke="#81c784"
          strokeWidth="2"
        />
        <ellipse
          cx="42"
          cy="38"
          rx="18"
          ry="10"
          fill="#fff"
          stroke="#f5a623"
          strokeWidth="1.5"
        />
        <polygon
          points="35,48 30,58 45,48"
          fill="#fff"
          stroke="#f5a623"
          strokeWidth="1"
        />
        <text
          x="42"
          y="42"
          textAnchor="middle"
          fontSize="7"
          fill="#f5a623"
          fontWeight="bold"
        >
          POW!
        </text>
        <circle cx="117" cy="38" r="14" fill="#f48fb1" opacity="0.7" />
        <circle cx="112" cy="34" r="4" fill="#fff" />
        <circle cx="122" cy="34" r="4" fill="#fff" />
        <polygon
          points="42,95 45,105 55,100 50,110 60,112 50,118 55,128 45,122 42,132 39,122 29,128 34,118 24,112 34,110 29,100 39,105"
          fill="#64b5f6"
          opacity="0.6"
        />
        <text
          x="117"
          y="112"
          textAnchor="middle"
          fontSize="16"
          fill="#81c784"
          fontWeight="bold"
          opacity="0.8"
        >
          Zzz
        </text>
        <text
          x="126"
          y="126"
          textAnchor="middle"
          fontSize="11"
          fill="#81c784"
          opacity="0.5"
        >
          z
        </text>
      </svg>
    ),
  },
  {
    id: "podcasts",
    title: "Podcasts",
    description:
      "Kid-friendly audio stories and educational podcasts that make learning a joy during commutes, bedtime, or playtime. Curated topics across science, history, and creativity.",
    reverse: false,
    iconBg: "bg-gray-100",
    imageBg: "bg-blue-50",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#aaa"
        strokeWidth="2"
        className="w-6 h-6"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    illustration: (
      <svg
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
        className="w-52 h-52"
      >
        <path
          d="M30 80 Q30 35 80 35 Q130 35 130 80"
          fill="none"
          stroke="#4fc3f7"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <rect
          x="18"
          y="75"
          width="22"
          height="35"
          rx="11"
          fill="#4fc3f7"
          opacity="0.8"
        />
        <rect
          x="120"
          y="75"
          width="22"
          height="35"
          rx="11"
          fill="#4fc3f7"
          opacity="0.8"
        />
        <path
          d="M60 100 Q80 88 100 100"
          fill="none"
          stroke="#f5a623"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M50 112 Q80 96 110 112"
          fill="none"
          stroke="#f5a623"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M40 124 Q80 104 120 124"
          fill="none"
          stroke="#f5a623"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
        />
        <circle cx="80" cy="96" r="6" fill="#ce93d8" />
      </svg>
    ),
  },
  {
    id: "games",
    title: "Games",
    description:
      "Interactive and educational games that develop critical thinking, problem-solving, and creativity. Fun-packed challenges designed to keep kids engaged and learning simultaneously.",
    reverse: true,
    iconBg: "bg-gray-100",
    imageBg: "bg-green-50",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#aaa"
        strokeWidth="2"
        className="w-6 h-6"
      >
        <rect x="2" y="6" width="20" height="12" rx="4" />
        <path d="M6 12h4M8 10v4" />
        <circle cx="15" cy="11" r="1" fill="#aaa" />
        <circle cx="18" cy="13" r="1" fill="#aaa" />
      </svg>
    ),
    illustration: (
      <svg
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
        className="w-52 h-52"
      >
        <path
          d="M30 65 Q20 65 18 80 L15 110 Q14 125 28 125 Q38 125 45 115 L55 100 H105 L115 115 Q122 125 132 125 Q146 125 145 110 L142 80 Q140 65 130 65 Z"
          fill="#66bb6a"
          opacity="0.8"
        />
        <rect
          x="46"
          y="82"
          width="10"
          height="28"
          rx="3"
          fill="#fff"
          opacity="0.8"
        />
        <rect
          x="38"
          y="90"
          width="28"
          height="10"
          rx="3"
          fill="#fff"
          opacity="0.8"
        />
        <circle cx="110" cy="84" r="7" fill="#ef5350" opacity="0.9" />
        <circle cx="125" cy="96" r="7" fill="#ffd54f" opacity="0.9" />
        <circle cx="110" cy="108" r="7" fill="#29b6f6" opacity="0.9" />
        <circle cx="95" cy="96" r="7" fill="#66bb6a" opacity="0.9" />
        <rect
          x="70"
          y="91"
          width="10"
          height="6"
          rx="3"
          fill="#fff"
          opacity="0.5"
        />
        <rect
          x="83"
          y="91"
          width="10"
          height="6"
          rx="3"
          fill="#fff"
          opacity="0.5"
        />
      </svg>
    ),
  },
];

function useInView(
  threshold: number = 0.15,
): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

interface CardProps {
  item: Item;
  index: number;
}

function Card({ item, index }: CardProps): JSX.Element {
  const [ref, visible] = useInView();

  return (
    <div
      ref={ref}
      className={`flex flex-col lg:flex-row items-center gap-16 transition-all duration-700 ease-out
        ${item.reverse ? "lg:flex-row-reverse" : ""}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex-1 min-w-0">
        <div
          className={`${item.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
        >
          {item.icon}
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          {item.title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-lg">
          {item.description}
        </p>
        <button className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 transition-colors text-white text-sm font-bold px-5 py-3 rounded-lg">
          Get Started
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path
              d="M3 13 L13 3M13 3H7M13 3V9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        className={`flex-shrink-0 w-72 h-64 rounded-2xl ${item.imageBg} flex items-center justify-center shadow-sm`}
      >
        {item.illustration}
      </div>
    </div>
  );
}

const MoreWeHave = (): JSX.Element => {
  return (
    <section className="relative bg-white overflow-hidden py-20 px-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full opacity-50 translate-x-20 -translate-y-20 pointer-events-none" />
      <div className="absolute bottom-48 left-0 w-52 h-52 bg-pink-200 rounded-full opacity-50 -translate-x-16 pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-40 h-40 border-4 border-gray-200 rounded-full opacity-30 translate-x-10 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <h2 className="text-4xl font-medium tracking-wide">
          WHAT MORE WE HAVE FOR
          <br />
          YOUR CHILD
        </h2>

        <div className="flex flex-col gap-16 mt-10">
          {items.map((item, i) => (
            <Card key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreWeHave;
