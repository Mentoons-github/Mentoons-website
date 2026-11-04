// src/constant/workshops/workshopData.ts
export const AGES = ["6-12", "13-19"];

export interface DurationOption {
  label: string;
  price: number;
  topicLimit: number;
}
export const DURATIONS: DurationOption[] = [
  { label: "4 Weeks", price: 2000, topicLimit: 20 },
  { label: "1 Month", price: 3500, topicLimit: 28 },
  { label: "3 Months", price: 9000, topicLimit: 36 },
  { label: "6 Months", price: 16000, topicLimit: 48 },
];

/** One topic = ONE video. */
export interface Topic {
  id: string;
  name: string;
  group: string;
  minutes: number; // 45 or 60
  about: string;
}

// [id, name, group, minutes (45 or 60), about]
type Row = [string, string, string, number, string];
const rows: Row[] = [
  /* ---------- Module 1: The Birth of Music ---------- */
  [
    "o1",
    "How Music Began",
    "Birth of Music",
    45,
    "Voice, rhythm, sounds of nature and the first instruments.",
  ],
  [
    "o2",
    "The Science of Sound",
    "Birth of Music",
    45,
    "Pitch, rhythm, melody, harmony, timbre, tempo and dynamics.",
  ],
  [
    "o3",
    "Music Through the Ages",
    "Birth of Music",
    45,
    "Ancient, medieval, Renaissance to Romantic and the modern era.",
  ],
  [
    "o4",
    "Indian Music: Swaras to Ragas",
    "Birth of Music",
    60,
    "Vedic chanting, the seven swaras, raga, tala, Hindustani and Carnatic.",
  ],

  /* ---------- Module 2: Exploring Music Genres ---------- */
  [
    "g1",
    "Rock & Roll",
    "Music Genres",
    45,
    "Rebellion, youth culture and stadium shows: Elvis, The Beatles, Queen.",
  ],
  [
    "g2",
    "Pop Music",
    "Music Genres",
    45,
    "Hooks, music videos and global stardom: Michael Jackson, Madonna, Taylor Swift.",
  ],
  [
    "g3",
    "Jazz & Blues",
    "Music Genres",
    45,
    "Improvisation and heritage: Louis Armstrong, B.B. King, Nina Simone.",
  ],
  [
    "g4",
    "Hip-Hop & Rap",
    "Music Genres",
    45,
    "Spoken rhythm, storytelling and identity: Tupac, Notorious B.I.G., Kendrick Lamar.",
  ],
  [
    "g5",
    "Indian Classical, Folk & Film",
    "Music Genres",
    60,
    "Regional traditions and film music: Ravi Shankar, M. S. Subbulakshmi, A. R. Rahman.",
  ],
  [
    "g6",
    "Electronic & Dance Music",
    "Music Genres",
    45,
    "Synthesizers, sampling and DJ culture: Daft Punk, The Chemical Brothers.",
  ],

  /* ---------- Module 3: Legends Behind the Music ---------- */
  [
    "l1",
    "Freddie Mercury",
    "Legends & Stories",
    60,
    "The private life behind a public legend and how image differs from reality.",
  ],
  [
    "l2",
    "Amy Winehouse",
    "Legends & Stories",
    60,
    "Talent, fame and media pressure, told with compassion.",
  ],
  [
    "l3",
    "Michael Jackson",
    "Legends & Stories",
    60,
    "Childhood stardom, innovation and the pressures of global fame.",
  ],
  [
    "l4",
    "Nina Simone",
    "Legends & Stories",
    60,
    "Classical training, discrimination and music as resistance.",
  ],
  [
    "l5",
    "Kurt Cobain",
    "Legends & Stories",
    60,
    "Nirvana's rise and the burden of sudden fame, discussed with care.",
  ],

  /* ---------- Module 4: Iconic Music Albums ---------- */
  [
    "a1",
    "Abbey Road",
    "Iconic Albums",
    60,
    "The Beatles: the famous cover, studio craft and creative legacy.",
  ],
  [
    "a2",
    "Thriller",
    "Iconic Albums",
    60,
    "Michael Jackson: production, music videos and visual storytelling.",
  ],
  [
    "a3",
    "The Dark Side of the Moon",
    "Iconic Albums",
    60,
    "Pink Floyd: prism artwork, concept albums and storytelling through sound.",
  ],
  [
    "a4",
    "Nevermind",
    "Iconic Albums",
    60,
    "Nirvana: how an album brought alternative rock to the mainstream.",
  ],
  [
    "a5",
    "Roja",
    "Iconic Albums",
    60,
    "A. R. Rahman: film music, technology and Indian fusion.",
  ],

  /* ---------- Module 5: The Psychology of Music ---------- */
  [
    "p1",
    "Why Songs Stay With Us",
    "Psychology of Music",
    45,
    "Music, memory, mood and how songs become part of our identity.",
  ],
  [
    "p2",
    "The Mood Map",
    "Psychology of Music",
    45,
    "Pick three songs for three moods and explain your choices.",
  ],

  /* ---------- Module 6: Music Detective Challenge ---------- */
  [
    "d1",
    "Guess, Match & Decode",
    "Detective Challenge",
    45,
    "Guess the genre, match artists and decode album artwork.",
  ],
  [
    "d2",
    "Fact or Myth & Your Music Story",
    "Detective Challenge",
    60,
    "Separate music facts from rumours and present your own music story.",
  ],
];

export const TOPICS: Topic[] = rows.map(
  ([id, name, group, minutes, about]) => ({
    id,
    name,
    group,
    minutes,
    about,
  }),
);
export const GROUPS = [
  "All",
  ...Array.from(new Set(TOPICS.map((t) => t.group))),
];

/** A plan can never include more videos than exist. */
export const topicLimitFor = (d: DurationOption) =>
  Math.min(d.topicLimit, TOPICS.length);

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/* -------------------- enrollment (saved when the plan is confirmed) -------------------- */
export interface Enrollment {
  age: string;
  duration: string;
  price: number;
  topicIds: string[];
  paidAt: number;
}
const ENROLL_KEY = "workshop:enrollment";

export const saveEnrollment = (e: Enrollment) => {
  try {
    localStorage.setItem(ENROLL_KEY, JSON.stringify(e));
  } catch {
    /* ignore */
  }
};
export const getEnrollment = (): Enrollment | null => {
  try {
    const raw = localStorage.getItem(ENROLL_KEY);
    return raw ? (JSON.parse(raw) as Enrollment) : null;
  } catch {
    return null;
  }
};

/* ------------------------------- curriculum ------------------------------- */
/** A lesson is a single video. No sections, no parts. */
export interface Lesson {
  id: string; // "intro" or the topic id (o1, g1, l1, ...)
  title: string;
  group: string;
  about: string;
  minutes: number;
  intro?: boolean;
}

// Put your real video links here. Key = lesson id ("intro" or topic id).
export const VIDEO_URLS: Record<string, string> = {
  // intro: "https://www.youtube-nocookie.com/embed/VIDEO_ID",
  // o1: "https://www.youtube-nocookie.com/embed/VIDEO_ID",
};

export const buildCurriculum = (topicIds: string[]): Lesson[] => [
  {
    id: "intro",
    title: "Welcome & Intro",
    group: "Start here",
    about: "Meet your teacher and see how the workshop works.",
    minutes: 15,
    intro: true,
  },
  ...TOPICS.filter((t) => topicIds.includes(t.id)).map<Lesson>((t) => ({
    id: t.id,
    title: t.name,
    group: t.group,
    about: t.about,
    minutes: t.minutes,
  })),
];

export const fmtTime = (m: number) =>
  m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}` : `${m}m`;
