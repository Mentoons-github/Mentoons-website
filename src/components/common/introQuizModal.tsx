import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Smartphone,
  Users,
  Clapperboard,
  Film,
  Landmark,
  Lightbulb,
  Medal,
  Brain,
  Check,
  Cloud,
  PartyPopper,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  Wallet,
  X,
} from "lucide-react";

const DEBUG_ALWAYS_SHOW = true;

const HIDDEN_PATHS = [
  "/sign-in",
  "/sign-up",
  "/blocked",
  "/quiz",
  "/employee",
  "/admin",
  "/add-password",
];

type Question = { q: string; answer: string; wrong: string[] };
type Stage = "intro" | "quiz" | "result";

type CategoryId =
  | "mobile"
  | "social"
  | "entertainment"
  | "sports"
  | "movies"
  | "mythology"
  | "inventions"
  | "finance";
type Category = {
  id: CategoryId;
  title: string;
  subtitle: string;
  icon: typeof Brain;
};
const CATEGORIES: Category[] = [
  {
    id: "mobile",
    title: "Mobile & Technology",
    subtitle: "Phones, apps and gadgets",
    icon: Smartphone,
  },
  {
    id: "social",
    title: "Social Media & Influencers",
    subtitle: "Creators and online trends",
    icon: Users,
  },
  {
    id: "entertainment",
    title: "Entertainment",
    subtitle: "Music, artists and pop culture",
    icon: Clapperboard,
  },
  {
    id: "sports",
    title: "Sports",
    subtitle: "Cricket, football and more",
    icon: Medal,
  },
  {
    id: "movies",
    title: "Movies",
    subtitle: "Cinema and famous films",
    icon: Film,
  },
  {
    id: "mythology",
    title: "Temples & Mythology",
    subtitle: "Ancient India, epics and temples",
    icon: Landmark,
  },
  {
    id: "inventions",
    title: "Inventions & Discoveries",
    subtitle: "Inventors and discoveries",
    icon: Lightbulb,
  },
  {
    id: "finance",
    title: "Finance & Digital Money",
    subtitle: "UPI, NFTs, crypto and banking",
    icon: Wallet,
  },
];
const QUESTION_BANK: Record<CategoryId, Question[]> = {
  mobile: [
    {
      q: "What does 5G stand for?",
      answer: "Fifth Generation",
      wrong: ["Five Gigabytes", "Fifth Gigabyte", "Fast Gateway"],
    },
    {
      q: "Which company develops Android?",
      answer: "Google",
      wrong: ["Apple", "Nokia", "Sony"],
    },
    {
      q: "Which company makes the iPhone?",
      answer: "Apple",
      wrong: ["Samsung", "Google", "Motorola"],
    },
    {
      q: "What does SIM stand for?",
      answer: "Subscriber Identity Module",
      wrong: [
        "Signal Internet Mode",
        "Smart Internal Memory",
        "System Identity Machine",
      ],
    },
    {
      q: "What does GPS stand for?",
      answer: "Global Positioning System",
      wrong: [
        "General Phone Signal",
        "Global Phone Service",
        "Ground Position Sensor",
      ],
    },
    {
      q: "Which mobile feature lets you pay by tapping a terminal?",
      answer: "NFC",
      wrong: ["GPS", "Bluetooth LE Audio", "Airplane mode"],
    },
    {
      q: "What is the main purpose of airplane mode?",
      answer: "Disable wireless connections",
      wrong: ["Increase screen brightness", "Charge faster", "Erase app data"],
    },
    {
      q: "Which is an open-source mobile operating system?",
      answer: "Android",
      wrong: ["iOS", "iPadOS", "watchOS"],
    },
    {
      q: "What is a smartphone hotspot used for?",
      answer: "Sharing internet access",
      wrong: [
        "Cleaning storage",
        "Taking panoramic photos",
        "Blocking notifications",
      ],
    },
    {
      q: "Which technology is commonly used for short-range wireless earbuds?",
      answer: "Bluetooth",
      wrong: ["HDMI", "Ethernet", "VGA"],
    },
    {
      q: "What does OLED describe?",
      answer: "A display technology",
      wrong: ["A charging port", "A mobile network", "A file format"],
    },
    {
      q: "What does an app update commonly provide?",
      answer: "Bug fixes and new features",
      wrong: [
        "A new phone number",
        "Extra physical RAM",
        "A replacement battery",
      ],
    },
  ],
  social: [
    {
      q: "Which platform is known for short-form Reels?",
      answer: "Instagram",
      wrong: ["LinkedIn", "Wikipedia", "GitHub"],
    },
    {
      q: "What does DM mean on social media?",
      answer: "Direct Message",
      wrong: ["Daily Media", "Digital Mention", "Display Mode"],
    },
    {
      q: "Which company owns Instagram?",
      answer: "Meta",
      wrong: ["Google", "Apple", "Microsoft"],
    },
    {
      q: "What is a hashtag mainly used for?",
      answer: "Grouping and discovering posts",
      wrong: ["Encrypting messages", "Charging a phone", "Deleting followers"],
    },
    {
      q: "Which platform is best known for professional networking?",
      answer: "LinkedIn",
      wrong: ["Snapchat", "Twitch", "Pinterest"],
    },
    {
      q: "What does a verified badge generally indicate?",
      answer: "An account has been authenticated",
      wrong: [
        "All posts are factual",
        "The user has a million followers",
        "The account cannot be hacked",
      ],
    },
    {
      q: "Which platform is best known for long-form creator videos?",
      answer: "YouTube",
      wrong: ["Google Maps", "Dropbox", "Gmail"],
    },
    {
      q: "What is a brand collaboration for a creator?",
      answer: "A promotional partnership",
      wrong: ["A password reset", "A deleted account", "An app update"],
    },
    {
      q: "What does engagement rate measure?",
      answer: "Audience interactions relative to reach or followers",
      wrong: ["Battery percentage", "Internet speed", "Video resolution"],
    },
    {
      q: "What is a social media algorithm used for?",
      answer: "Ranking and recommending content",
      wrong: ["Manufacturing phones", "Printing photos", "Charging cameras"],
    },
    {
      q: "What does a sponsored post usually mean?",
      answer: "Content promoted through payment or a partnership",
      wrong: ["A private message", "A blocked account", "A deleted video"],
    },
    {
      q: "Which platform is associated with disappearing Snaps?",
      answer: "Snapchat",
      wrong: ["LinkedIn", "Reddit", "Wikipedia"],
    },
  ],
  entertainment: [
    {
      q: "Which musical instrument usually has 88 keys?",
      answer: "Piano",
      wrong: ["Guitar", "Violin", "Flute"],
    },
    {
      q: "What is a podcast?",
      answer: "An episodic audio or video program",
      wrong: ["A movie ticket", "A game controller", "A music instrument"],
    },
    {
      q: "Which award is associated with recorded music?",
      answer: "Grammy",
      wrong: ["Oscar", "Booker Prize", "Pulitzer for Journalism"],
    },
    {
      q: "What is a stand-up comedian known for?",
      answer: "Performing comedy for a live audience",
      wrong: ["Directing traffic", "Writing code", "Playing tennis"],
    },
    {
      q: "What does an encore mean at a concert?",
      answer: "An additional performance",
      wrong: ["A sound check", "A ticket refund", "A rehearsal"],
    },
    {
      q: "Which is a streaming platform for TV shows and films?",
      answer: "Netflix",
      wrong: ["Google Sheets", "WhatsApp", "Google Drive"],
    },
    {
      q: "What does a DJ typically do?",
      answer: "Select and mix recorded music",
      wrong: ["Direct movies", "Edit newspapers", "Design buildings"],
    },
    {
      q: "What is karaoke?",
      answer: "Singing along to instrumental tracks",
      wrong: ["A type of camera", "A board game", "A film award"],
    },
    {
      q: "What is a sitcom?",
      answer: "A situation comedy",
      wrong: [
        "A horror soundtrack",
        "A sports tournament",
        "A documentary camera",
      ],
    },
    {
      q: "What does a season finale refer to?",
      answer: "The last episode of a season",
      wrong: ["The first trailer", "A cast audition", "A soundtrack release"],
    },
    {
      q: "What is animation?",
      answer: "Creating the illusion of movement from images",
      wrong: [
        "Recording only live sports",
        "Printing magazines",
        "Mixing live concert audio",
      ],
    },
    {
      q: "Which instrument is played with a bow?",
      answer: "Violin",
      wrong: ["Drum kit", "Trumpet", "Piano"],
    },
    {
      q: "Who is known as the King of Rock and Roll?",
      answer: "Elvis Presley",
      wrong: ["Chuck Berry", "Little Richard", "Buddy Holly"],
    },
    {
      q: "What is the name of Elvis Presley's famous home in Memphis?",
      answer: "Graceland",
      wrong: ["Neverland", "Biltmore", "Monticello"],
    },
    {
      q: "Who is known as the King of Pop?",
      answer: "Michael Jackson",
      wrong: ["Prince", "Elvis Presley", "Justin Timberlake"],
    },
    {
      q: "Which Michael Jackson album is one of the best-selling albums of all time?",
      answer: "Thriller",
      wrong: ["Bad", "Dangerous", "Invincible"],
    },
    {
      q: "Which signature dance move did Michael Jackson popularise?",
      answer: "Moonwalk",
      wrong: ["Macarena", "Floss", "Twist"],
    },
    {
      q: "Which country was Bob Marley born in?",
      answer: "Jamaica",
      wrong: ["Cuba", "Brazil", "Kenya"],
    },
    {
      q: "Which music genre is Bob Marley most associated with?",
      answer: "Reggae",
      wrong: ["Opera", "Country", "Heavy metal"],
    },
    {
      q: "What was the name of Bob Marley's band?",
      answer: "The Wailers",
      wrong: ["The Beatles", "The Rolling Stones", "The Eagles"],
    },
    {
      q: "Which band had members John, Paul, George and Ringo?",
      answer: "The Beatles",
      wrong: ["Queen", "ABBA", "The Beach Boys"],
    },
    {
      q: "Who was the lead vocalist of the band Queen?",
      answer: "Freddie Mercury",
      wrong: ["Mick Jagger", "Robert Plant", "Elton John"],
    },
    {
      q: "Which Indian composer won two Oscars for Slumdog Millionaire?",
      answer: "A. R. Rahman",
      wrong: ["Ilaiyaraaja", "Pritam", "Anirudh Ravichander"],
    },
    {
      q: "Who is known as the Queen of Pop?",
      answer: "Madonna",
      wrong: ["Adele", "Taylor Swift", "Celine Dion"],
    },
    {
      q: "Which singer is known for the song Shape of You?",
      answer: "Ed Sheeran",
      wrong: ["Bruno Mars", "Justin Bieber", "Shawn Mendes"],
    },
    {
      q: "Who is often called the Nightingale of India?",
      answer: "Lata Mangeshkar",
      wrong: ["Asha Bhosle", "Shreya Ghoshal", "Alka Yagnik"],
    },
  ],
  sports: [
    {
      q: "How many players are on the field for one cricket team?",
      answer: "11",
      wrong: ["9", "10", "12"],
    },
    {
      q: "Which sport uses a shuttlecock?",
      answer: "Badminton",
      wrong: ["Tennis", "Cricket", "Hockey"],
    },
    {
      q: "How many players are on the field for one football (soccer) team?",
      answer: "11",
      wrong: ["7", "9", "12"],
    },
    {
      q: "What is a hat-trick in football?",
      answer: "Three goals by one player in a match",
      wrong: ["Three yellow cards", "Three corners", "Three substitutions"],
    },
    {
      q: "Which sport uses the term love for zero?",
      answer: "Tennis",
      wrong: ["Cricket", "Basketball", "Golf"],
    },
    {
      q: "How many points is a basketball free throw worth?",
      answer: "1",
      wrong: ["2", "3", "4"],
    },
    {
      q: "Which country hosted the 2016 Summer Olympics?",
      answer: "Brazil",
      wrong: ["Japan", "China", "France"],
    },
    {
      q: "What does LBW stand for in cricket?",
      answer: "Leg Before Wicket",
      wrong: ["Long Ball Wide", "Left Bat Win", "Leg Behind Wicket"],
    },
    {
      q: "Which sport features a checkmate?",
      answer: "Chess",
      wrong: ["Golf", "Volleyball", "Boxing"],
    },
    {
      q: "How long is an Olympic swimming pool?",
      answer: "50 metres",
      wrong: ["25 metres", "75 metres", "100 metres"],
    },
    {
      q: "Which sport uses the term birdie?",
      answer: "Golf",
      wrong: ["Football", "Cricket", "Boxing"],
    },
    {
      q: "How many rings appear on the Olympic symbol?",
      answer: "5",
      wrong: ["4", "6", "7"],
    },
  ],
  movies: [
    {
      q: "Who directed Titanic (1997)?",
      answer: "James Cameron",
      wrong: ["Steven Spielberg", "Christopher Nolan", "Peter Jackson"],
    },
    {
      q: "Which film series features Hogwarts?",
      answer: "Harry Potter",
      wrong: ["Star Wars", "Jurassic Park", "The Matrix"],
    },
    {
      q: "Which Indian film features the song Naatu Naatu?",
      answer: "RRR",
      wrong: ["Baahubali", "Kantara", "KGF"],
    },
    {
      q: "Who directed Inception?",
      answer: "Christopher Nolan",
      wrong: ["James Cameron", "Quentin Tarantino", "Ridley Scott"],
    },
    {
      q: "Which film features the fictional kingdom Wakanda?",
      answer: "Black Panther",
      wrong: ["Avatar", "Iron Man", "Aquaman"],
    },
    {
      q: "Who played Jack in Titanic (1997)?",
      answer: "Leonardo DiCaprio",
      wrong: ["Brad Pitt", "Tom Cruise", "Matt Damon"],
    },
    {
      q: "Which film series features Darth Vader?",
      answer: "Star Wars",
      wrong: ["The Lord of the Rings", "Harry Potter", "Fast & Furious"],
    },
    {
      q: "What is a film screenplay?",
      answer: "The written script for a film",
      wrong: ["A cinema projector", "A movie ticket", "A sound effect"],
    },
    {
      q: "Who directed the original Jurassic Park (1993)?",
      answer: "Steven Spielberg",
      wrong: ["George Lucas", "Tim Burton", "Peter Jackson"],
    },
    {
      q: "Which film won the first Academy Award for Best Animated Feature?",
      answer: "Shrek",
      wrong: ["Toy Story", "Finding Nemo", "The Lion King"],
    },
    {
      q: "Which Indian filmmaker directed Baahubali?",
      answer: "S. S. Rajamouli",
      wrong: ["Mani Ratnam", "Shankar", "Sanjay Leela Bhansali"],
    },
    {
      q: "What is a movie sequel?",
      answer: "A story that continues an earlier film",
      wrong: ["A film trailer", "A deleted scene", "A subtitle track"],
    },
  ],
  mythology: [
    {
      q: "Which city is home to the Brihadeeswarar Temple?",
      answer: "Thanjavur",
      wrong: ["Madurai", "Varanasi", "Ujjain"],
    },
    {
      q: "Which deity is the central figure of the Ramayana?",
      answer: "Rama",
      wrong: ["Krishna", "Ganesha", "Indra"],
    },
    {
      q: "Which epic tells the story of the Kurukshetra War?",
      answer: "Mahabharata",
      wrong: ["Ramayana", "Silappatikaram", "Panchatantra"],
    },
    {
      q: "Which empire was ruled by Ashoka?",
      answer: "Maurya Empire",
      wrong: ["Gupta Empire", "Chola Empire", "Mughal Empire"],
    },
    {
      q: "Which temple is famous for its stone chariot at Hampi?",
      answer: "Vittala Temple",
      wrong: ["Meenakshi Temple", "Konark Sun Temple", "Kedarnath Temple"],
    },
    {
      q: "Which deity is associated with the trident (trishula)?",
      answer: "Shiva",
      wrong: ["Brahma", "Indra", "Surya"],
    },
    {
      q: "Where is the Konark Sun Temple located?",
      answer: "Odisha",
      wrong: ["Kerala", "Gujarat", "Punjab"],
    },
    {
      q: "Which ancient Indian dynasty built the Brihadeeswarar Temple?",
      answer: "Chola dynasty",
      wrong: ["Maurya dynasty", "Gupta dynasty", "Satavahana dynasty"],
    },
    {
      q: "Who is traditionally credited with composing the Ramayana?",
      answer: "Valmiki",
      wrong: ["Vyasa", "Kalidasa", "Tulsidas"],
    },
    {
      q: "Which deity is commonly depicted with an elephant head?",
      answer: "Ganesha",
      wrong: ["Kartikeya", "Hanuman", "Vishnu"],
    },
    {
      q: "Which temple complex is located in Madurai?",
      answer: "Meenakshi Amman Temple",
      wrong: ["Somnath Temple", "Golden Temple", "Jagannath Temple"],
    },
    {
      q: "Which Gupta ruler is often called Vikramaditya?",
      answer: "Chandragupta II",
      wrong: ["Ashoka", "Harsha", "Rajaraja I"],
    },
  ],
  inventions: [
    {
      q: "Who invented the World Wide Web?",
      answer: "Tim Berners-Lee",
      wrong: ["Bill Gates", "Steve Jobs", "Mark Zuckerberg"],
    },
    {
      q: "Who is known as the first computer programmer?",
      answer: "Ada Lovelace",
      wrong: ["Alan Turing", "Grace Hopper", "Marie Curie"],
    },
    {
      q: "Who invented the Rubik’s Cube?",
      answer: "Ernő Rubik",
      wrong: ["Thomas Edison", "Albert Einstein", "Walt Disney"],
    },
    {
      q: "Who introduced the equals sign (=)?",
      answer: "Robert Recorde",
      wrong: ["Isaac Newton", "Galileo Galilei", "Albert Einstein"],
    },
    {
      q: "Who sent the first network email using the @ sign in addressing?",
      answer: "Ray Tomlinson",
      wrong: ["Tim Berners-Lee", "Larry Page", "Elon Musk"],
    },
    {
      q: "Who invented the ballpoint pen design widely used today?",
      answer: "László Bíró",
      wrong: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla"],
    },
    {
      q: "Who invented the first electric battery?",
      answer: "Alessandro Volta",
      wrong: ["Isaac Newton", "Albert Einstein", "Galileo Galilei"],
    },
    {
      q: "Who invented the modern stethoscope?",
      answer: "René Laennec",
      wrong: ["Louis Pasteur", "Marie Curie", "Isaac Newton"],
    },
    {
      q: "Who introduced the infinity symbol (∞)?",
      answer: "John Wallis",
      wrong: ["Pythagoras", "Albert Einstein", "Euclid"],
    },
    {
      q: "Who invented the safety pin in 1849?",
      answer: "Walter Hunt",
      wrong: ["Henry Ford", "Levi Strauss", "Benjamin Franklin"],
    },
    {
      q: "Who created the original set of 176 mobile emoji in 1999?",
      answer: "Shigetaka Kurita",
      wrong: ["Steve Jobs", "Mark Zuckerberg", "Bill Gates"],
    },
    {
      q: "Who built the Pascaline mechanical calculator?",
      answer: "Blaise Pascal",
      wrong: ["Isaac Newton", "Leonardo da Vinci", "Galileo Galilei"],
    },
  ],
  finance: [
    {
      q: "What does UPI stand for?",
      answer: "Unified Payments Interface",
      wrong: [
        "Universal Payment Index",
        "United Pay Interface",
        "Unified Pocket Identity",
      ],
    },
    {
      q: "Which organisation developed UPI in India?",
      answer: "NPCI",
      wrong: ["SEBI", "NABARD", "IRDAI"],
    },
    {
      q: "What does NFT stand for?",
      answer: "Non-Fungible Token",
      wrong: [
        "New Financial Transfer",
        "Network File Token",
        "Non-Fixed Transaction",
      ],
    },
    {
      q: "What is a UPI PIN used for?",
      answer: "Authorising a payment",
      wrong: [
        "Unlocking your phone screen",
        "Logging into social media",
        "Changing your SIM card",
      ],
    },
    {
      q: "How does a QR code help in UPI payments?",
      answer: "You scan it to pay quickly",
      wrong: [
        "It charges your phone",
        "It increases your bank balance",
        "It prints a cheque",
      ],
    },
    {
      q: "Which technology do most NFTs and cryptocurrencies rely on?",
      answer: "Blockchain",
      wrong: ["Bluetooth", "Dial-up internet", "Photocopying"],
    },
    {
      q: "What does ATM stand for?",
      answer: "Automated Teller Machine",
      wrong: [
        "Automatic Time Money",
        "Advanced Transfer Method",
        "Authorised Teller Mode",
      ],
    },
    {
      q: "What is a cryptocurrency?",
      answer: "A digital currency secured by cryptography",
      wrong: [
        "A paper note printed by banks",
        "A coin made of crystal",
        "A type of credit card",
      ],
    },
    {
      q: "Which of these is a well-known cryptocurrency?",
      answer: "Bitcoin",
      wrong: ["Debit card", "Cheque", "Passbook"],
    },
    {
      q: "What does KYC stand for in banking?",
      answer: "Know Your Customer",
      wrong: ["Keep Your Cash", "Key Yield Certificate", "Know Your Currency"],
    },
    {
      q: "What is a UPI ID (Virtual Payment Address) like name@bank used for?",
      answer: "Receiving money without sharing bank details",
      wrong: [
        "Booking train tickets only",
        "Storing photos online",
        "Locking your bank account",
      ],
    },
    {
      q: "What does EMI stand for?",
      answer: "Equated Monthly Instalment",
      wrong: [
        "Easy Money Interface",
        "Electronic Mobile Income",
        "Equal Market Investment",
      ],
    },
  ],
};
const TOTAL_QUESTIONS = 10;
const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
type ReadyQuestion = Question & { options: string[] };
const buildQuiz = (category: CategoryId): ReadyQuestion[] =>
  shuffle(QUESTION_BANK[category])
    .slice(0, TOTAL_QUESTIONS)
    .map((q) => ({
      ...q,
      options: shuffle([q.answer, ...q.wrong]),
    }));

const OPTION_COLORS = [
  "border-sky-300 bg-sky-50 hover:bg-sky-100",
  "border-pink-300 bg-pink-50 hover:bg-pink-100",
  "border-yellow-300 bg-yellow-50 hover:bg-yellow-100",
  "border-purple-300 bg-purple-50 hover:bg-purple-100",
];

const QuizPromptModal = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("intro");
  const [questions, setQuestions] = useState<ReadyQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState<CategoryId>("mobile");
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearAdvance = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  };
  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  const userId = user?.id;
  const identity = userId ?? "guest";
  const permanentKey = `quizPrompt:done:${identity}`;
  const sessionKey = `quizPrompt:snoozed:${identity}`;
  const isHiddenPath = HIDDEN_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (!isLoaded) {
      setOpen(false);
      return;
    }
    if (isHiddenPath) return;

    if (!DEBUG_ALWAYS_SHOW) {
      if (
        localStorage.getItem(permanentKey) ||
        sessionStorage.getItem(sessionKey)
      )
        return;

      if (isSignedIn) {
        const lastSignIn = user?.lastSignInAt?.getTime() ?? 0;
        const justLoggedIn = Date.now() - lastSignIn < 2 * 60 * 1000;
        if (!justLoggedIn) return;
      }
    }

    const t = setTimeout(() => {
      if (!DEBUG_ALWAYS_SHOW) sessionStorage.setItem(sessionKey, "1");
      setStage("intro");
      setOpen(true);
    }, 600);
    return () => clearTimeout(t);
  }, [
    isLoaded,
    isSignedIn,
    userId,
    user?.lastSignInAt,
    isHiddenPath,
    permanentKey,
    sessionKey,
  ]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleLater();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleLater = () => {
    clearAdvance();
    sessionStorage.setItem(sessionKey, "1");
    setOpen(false);
  };

  const handleNever = () => {
    clearAdvance();
    localStorage.setItem(permanentKey, "1");
    setOpen(false);
  };

  const handleStart = () => {
    clearAdvance();
    setQuestions(buildQuiz(category));
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setStage("quiz");
  };

  const handlePick = (option: string) => {
    if (selected !== null) return;
    setSelected(option);
    if (option === questions[current].answer) setScore((s) => s + 1);
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      if (current + 1 >= questions.length) {
        if (!DEBUG_ALWAYS_SHOW) localStorage.setItem(permanentKey, "1");
        setStage("result");
      } else {
        setCurrent(current + 1);
        setSelected(null);
      }
    }, 1500);
  };

  const handleRegister = () => {
    clearAdvance();
    setOpen(false);
    navigate("/sign-up");
  };

  const handleMoreQuizzes = () => {
    clearAdvance();
    setOpen(false);
    navigate("/quiz");
  };

  if (!open) return null;

  const q = questions[current];
  const activeCategory = CATEGORIES.find((c) => c.id === category)!;
  const progress = questions.length
    ? ((current + (selected !== null ? 1 : 0)) / questions.length) * 100
    : 0;

  const resultMessage =
    score >= 9
      ? "Super genius!"
      : score >= 7
        ? "Awesome job!"
        : score >= 5
          ? "Nice work!"
          : "Good try! You'll get better!";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-indigo-950/60 p-4 backdrop-blur-sm animate-[qpFade_.25s_ease-out]"
      onClick={stage === "intro" ? handleLater : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-prompt-title"
    >
      <style>{`
        @keyframes qpFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes qpPop {
          0% { opacity: 0; transform: scale(.8) translateY(30px) }
          70% { transform: scale(1.03) translateY(-4px) }
          100% { opacity: 1; transform: none }
        }
        @keyframes qpSlide { from { opacity: 0; transform: translateX(24px) } to { opacity: 1; transform: none } }
        @keyframes qpBounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes qpTwinkle { 0%,100% { opacity: 1; transform: scale(1) rotate(0) } 50% { opacity: .5; transform: scale(.7) rotate(20deg) } }
        @keyframes qpDrift { 0%,100% { transform: translateX(0) } 50% { transform: translateX(10px) } }
        @media (prefers-reduced-motion: reduce) {
          .qp-anim { animation: none !important }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="qp-anim relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-[2rem] border-4 border-white bg-white shadow-2xl animate-[qpPop_.5s_ease-out]"
      >
        {stage === "intro" && (
          <>
            <div className="relative overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-yellow-200 px-6 pb-8 pt-6 text-center">
              <Cloud
                className="qp-anim absolute left-4 top-5 h-9 w-9 fill-white text-white opacity-90 animate-[qpDrift_6s_ease-in-out_infinite]"
                aria-hidden
              />
              <Cloud
                className="qp-anim absolute right-12 top-14 h-6 w-6 fill-white text-white opacity-80 animate-[qpDrift_5s_ease-in-out_infinite_reverse]"
                aria-hidden
              />
              <Star
                className="qp-anim absolute left-8 top-20 h-5 w-5 fill-yellow-300 text-yellow-400 animate-[qpTwinkle_2s_ease-in-out_infinite]"
                aria-hidden
              />
              <Sparkles
                className="qp-anim absolute right-14 top-6 h-6 w-6 text-yellow-100 animate-[qpTwinkle_2.4s_ease-in-out_infinite]"
                aria-hidden
              />
              <Star
                className="qp-anim absolute bottom-6 right-8 h-4 w-4 fill-pink-300 text-pink-400 animate-[qpTwinkle_1.8s_ease-in-out_infinite]"
                aria-hidden
              />

              <button
                onClick={handleLater}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sky-600 shadow-md transition hover:scale-110 hover:bg-sky-50"
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </button>

              <div className="qp-anim relative mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-pink-400 to-orange-400 shadow-xl animate-[qpBounce_2.4s_ease-in-out_infinite]">
                <Brain className="h-8 w-8 text-white" strokeWidth={2.2} />
              </div>

              <p className="text-sm font-bold text-indigo-800/80">
                Hi{user?.firstName ? ` ${user.firstName}` : ""}!
              </p>
              <h2
                id="quiz-prompt-title"
                className="mt-0.5 flex items-center justify-center gap-2 text-2xl font-extrabold text-indigo-900"
              >
                Common Sense Test
                <PartyPopper
                  className="h-6 w-6 text-pink-500"
                  strokeWidth={2.4}
                />
              </h2>
            </div>

            <div className="px-6 pb-5 pt-5 text-center">
              <p className="text-xl font-extrabold leading-snug text-gray-800">
                Choose your quiz category!
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-500">
                Pick a topic and answer 10 fun questions.
              </p>

              <div
                className="mt-4 grid grid-cols-1 gap-2 text-left sm:grid-cols-2"
                role="group"
                aria-label="Quiz category"
              >
                {CATEGORIES.map((item) => {
                  const Icon = item.icon;
                  const active = category === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCategory(item.id)}
                      className={`flex items-center gap-2 rounded-xl border-2 p-2.5 transition ${active ? "border-indigo-500 bg-indigo-50 shadow-sm" : "border-gray-200 bg-white hover:border-sky-300"}`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? "bg-indigo-500 text-white" : "bg-sky-100 text-sky-600"}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-extrabold text-gray-800">
                          {item.title}
                        </span>
                        <span className="block text-[10px] leading-tight text-gray-500">
                          {item.subtitle}
                        </span>
                      </span>
                      {active && (
                        <Check className="ml-auto h-4 w-4 shrink-0 text-indigo-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleStart}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border-b-4 border-orange-700 bg-gradient-to-b from-orange-400 to-orange-500 py-3 text-lg font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0.5 active:border-b-2"
              >
                <Rocket className="h-5 w-5" strokeWidth={2.5} />
                Start the Quiz
              </button>

              <div className="mt-4 flex items-center justify-between px-1 text-sm font-semibold">
                <button
                  onClick={handleLater}
                  className="text-sky-600 transition hover:text-sky-800"
                >
                  Maybe later
                </button>
                <button
                  onClick={handleNever}
                  className="text-gray-400 transition hover:text-gray-600"
                >
                  Don't show again
                </button>
              </div>
            </div>
          </>
        )}

        {stage === "quiz" && q && (
          <>
            <div className="relative bg-gradient-to-b from-sky-400 to-sky-300 px-5 pb-4 pt-4">
              <button
                onClick={handleLater}
                aria-label="Close quiz"
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sky-600 shadow-md transition hover:scale-110 hover:bg-sky-50"
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </button>

              <h2
                id="quiz-prompt-title"
                className="flex items-center gap-2 text-lg font-extrabold text-white"
              >
                <Brain className="h-5 w-5" strokeWidth={2.5} />
                Question {current + 1} of {questions.length}
              </h2>

              <p className="mt-1 text-xs font-bold text-indigo-900">
                {activeCategory.title}
              </p>
              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div
              key={current}
              className="qp-anim px-5 pb-5 pt-5 animate-[qpSlide_.3s_ease-out]"
            >
              <p className="text-center text-lg font-extrabold leading-snug text-gray-800">
                {q.q}
              </p>

              <div className="mt-4 space-y-2.5">
                {q.options.map((opt, i) => {
                  const isCorrect = opt === q.answer;
                  const isPicked = opt === selected;
                  let style = OPTION_COLORS[i % OPTION_COLORS.length];

                  if (selected !== null) {
                    if (isCorrect)
                      style = "border-green-500 bg-green-100 text-green-800";
                    else if (isPicked)
                      style = "border-red-400 bg-red-100 text-red-700";
                    else style = "border-gray-200 bg-gray-50 text-gray-400";
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handlePick(opt)}
                      disabled={selected !== null}
                      className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left text-base font-bold text-gray-700 transition ${style} ${
                        selected === null ? "active:scale-[0.98]" : ""
                      }`}
                    >
                      <span>{opt}</span>
                      {selected !== null && isCorrect && (
                        <Check
                          className="h-5 w-5 shrink-0 text-green-600"
                          strokeWidth={3}
                        />
                      )}
                      {selected !== null && isPicked && !isCorrect && (
                        <X
                          className="h-5 w-5 shrink-0 text-red-500"
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`mt-4 rounded-xl px-4 py-3 text-center text-sm font-extrabold ${selected === q.answer ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {selected === q.answer
                    ? "✓ Correct! Great job!"
                    : `✕ Not quite! Correct answer: ${q.answer}`}
                  <p className="mt-1 text-xs font-semibold opacity-70">
                    Moving to the next question automatically…
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {stage === "result" && (
          <>
            <div className="relative overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-yellow-200 px-6 pb-8 pt-6 text-center">
              <Star
                className="qp-anim absolute left-8 top-8 h-6 w-6 fill-yellow-300 text-yellow-400 animate-[qpTwinkle_2s_ease-in-out_infinite]"
                aria-hidden
              />
              <Sparkles
                className="qp-anim absolute right-10 top-10 h-7 w-7 text-yellow-100 animate-[qpTwinkle_2.4s_ease-in-out_infinite]"
                aria-hidden
              />
              <Star
                className="qp-anim absolute bottom-6 left-12 h-4 w-4 fill-pink-300 text-pink-400 animate-[qpTwinkle_1.8s_ease-in-out_infinite]"
                aria-hidden
              />

              <button
                onClick={() => {
                  clearAdvance();
                  setOpen(false);
                }}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sky-600 shadow-md transition hover:scale-110 hover:bg-sky-50"
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </button>

              <div className="qp-anim relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-yellow-300 to-orange-400 shadow-xl animate-[qpBounce_2.4s_ease-in-out_infinite]">
                <Trophy className="h-10 w-10 text-white" strokeWidth={2.2} />
              </div>

              <h2
                id="quiz-prompt-title"
                className="text-2xl font-extrabold text-indigo-900"
              >
                {resultMessage}
              </h2>
            </div>

            <div className="px-6 pb-5 pt-5 text-center">
              <p className="mb-2 text-sm font-bold text-indigo-700">
                {activeCategory.title}
              </p>
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Your score
              </p>
              <p className="text-5xl font-extrabold text-orange-500">
                {score}
                <span className="text-2xl text-gray-400">
                  {" "}
                  / {questions.length}
                </span>
              </p>

              <p className="mt-4 text-base font-extrabold text-indigo-700">
                Thanks for attempting the quiz!
              </p>
              <p className="mt-0.5 text-sm font-bold text-gray-600">
                Enjoy Mentoons!
              </p>

              <button
                onClick={() => {
                  clearAdvance();
                  setOpen(false);
                }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border-b-4 border-orange-700 bg-gradient-to-b from-orange-400 to-orange-500 py-3 text-lg font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0.5 active:border-b-2"
              >
                <Check className="h-5 w-5" strokeWidth={3} />
                Done
              </button>

              <button
                onClick={() => {
                  setStage("intro");
                  setSelected(null);
                }}
                className="mt-3 w-full rounded-full border-2 border-indigo-200 py-2.5 text-sm font-extrabold text-indigo-700 hover:bg-indigo-50"
              >
                Try another category
              </button>

              {!isSignedIn ? (
                <div className="mt-5 rounded-2xl bg-indigo-50 p-4 text-center">
                  <p className="text-base font-extrabold text-indigo-800">
                    Want to play more quizzes? Register now!
                  </p>
                  <p className="mt-1 text-xs font-semibold text-gray-600">
                    Create your free account to explore more quizzes on
                    Mentoons.
                  </p>
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 py-3 font-extrabold text-white shadow-md hover:brightness-105"
                  >
                    <Rocket className="h-5 w-5" /> Register Now
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleMoreQuizzes}
                  className="mt-3 text-sm font-semibold text-sky-600 transition hover:text-sky-800"
                >
                  Try more quizzes
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPromptModal;
