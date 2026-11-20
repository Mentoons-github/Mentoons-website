export type AgeGroup = "6-12" | "13-16" | "17-19" | "20+";

export const AGE_GROUPS: { key: AgeGroup; label: string }[] = [
  { key: "6-12", label: "6 – 12 years" },
  { key: "13-16", label: "13 – 16 years" },
  { key: "17-19", label: "17 – 19 years" },
  { key: "20+", label: "20+ years" },
];

export interface SalesCategory {
  key: string;
  label: string;
  color: string;
}

export interface SalesProduct {
  id: string;
  name: string;
  category: string;
  ageGroup: AgeGroup;
  price: number;
}

export interface SalesLocation {
  city: string;
  state: string;
}

export interface SalesOrder {
  id: number;
  date: string;
  productId: string;
  units: number;
  city: string;
  customerId: number;
}

export interface SalesAnalyticsData {
  categories: SalesCategory[];
  products: SalesProduct[];
  locations: SalesLocation[];
  orders: SalesOrder[];
}

const categories: SalesCategory[] = [
  {
    key: "conversation_starter",
    label: "Conversation Starter Cards",
    color: "#F59E0B",
  },
  {
    key: "conversation_story",
    label: "Conversation Story Cards",
    color: "#8B5CF6",
  },
  {
    key: "story_reteller",
    label: "Story Reteller Cards",
    color: "#10B981",
  },
  {
    key: "silent_stories",
    label: "Silent Stories",
    color: "#3B82F6",
  },
  {
    key: "colouring_books",
    label: "Colouring Books",
    color: "#EC4899",
  },
  {
    key: "pocket_series",
    label: "Pocket Series",
    color: "#14B8A6",
  },
  {
    key: "number_series",
    label: "Number Series",
    color: "#EF4444",
  },
];

const productSeeds: (SalesProduct & { weight: number })[] = [
  {
    id: "cs-6-12",
    name: "Conversation Starter Cards (6-12 yrs)",
    category: "conversation_starter",
    ageGroup: "6-12",
    price: 199,
    weight: 1.0,
  },
  {
    id: "cs-13-16",
    name: "Conversation Starter Cards (13-16 yrs)",
    category: "conversation_starter",
    ageGroup: "13-16",
    price: 199,
    weight: 0.9,
  },
  {
    id: "cs-17-19",
    name: "Conversation Starter Cards (17-19 yrs)",
    category: "conversation_starter",
    ageGroup: "17-19",
    price: 199,
    weight: 0.7,
  },
  {
    id: "cst-6-12",
    name: "Conversation Story Cards (6-12 yrs)",
    category: "conversation_story",
    ageGroup: "6-12",
    price: 249,
    weight: 0.6,
  },
  {
    id: "cst-13-16",
    name: "Conversation Story Cards (13-16 yrs)",
    category: "conversation_story",
    ageGroup: "13-16",
    price: 249,
    weight: 0.5,
  },
  {
    id: "cst-17-19",
    name: "Conversation Story Cards (17-19 yrs)",
    category: "conversation_story",
    ageGroup: "17-19",
    price: 249,
    weight: 0.4,
  },
  {
    id: "sr-6-12",
    name: "Story Reteller Cards (6-12 yrs)",
    category: "story_reteller",
    ageGroup: "6-12",
    price: 299,
    weight: 0.5,
  },
  {
    id: "sr-13-16",
    name: "Story Reteller Cards (13-16 yrs)",
    category: "story_reteller",
    ageGroup: "13-16",
    price: 299,
    weight: 0.45,
  },
  {
    id: "sr-17-19",
    name: "Story Reteller Cards (17-19 yrs)",
    category: "story_reteller",
    ageGroup: "17-19",
    price: 299,
    weight: 0.35,
  },
  {
    id: "ss-1",
    name: "Silent Stories Vol. 1",
    category: "silent_stories",
    ageGroup: "6-12",
    price: 179,
    weight: 0.7,
  },
  {
    id: "ss-2",
    name: "Silent Stories Vol. 2",
    category: "silent_stories",
    ageGroup: "13-16",
    price: 179,
    weight: 0.5,
  },
  {
    id: "ss-3",
    name: "Silent Stories Vol. 3",
    category: "silent_stories",
    ageGroup: "17-19",
    price: 179,
    weight: 0.4,
  },
  {
    id: "cb-animals",
    name: "Colouring Book: Animals",
    category: "colouring_books",
    ageGroup: "6-12",
    price: 149,
    weight: 0.8,
  },
  {
    id: "cb-patterns",
    name: "Colouring Book: Patterns",
    category: "colouring_books",
    ageGroup: "13-16",
    price: 169,
    weight: 0.45,
  },
  {
    id: "cb-mandala",
    name: "Colouring Book: Mandala",
    category: "colouring_books",
    ageGroup: "20+",
    price: 169,
    weight: 0.35,
  },
  {
    id: "ps-journal",
    name: "Pocket Journal",
    category: "pocket_series",
    ageGroup: "13-16",
    price: 129,
    weight: 0.6,
  },
  {
    id: "ps-reflect",
    name: "Pocket Reflections",
    category: "pocket_series",
    ageGroup: "17-19",
    price: 129,
    weight: 0.5,
  },
  {
    id: "ps-mind",
    name: "Pocket Mindfulness",
    category: "pocket_series",
    ageGroup: "20+",
    price: 149,
    weight: 0.4,
  },
  {
    id: "ns-count",
    name: "Number Series: Counting",
    category: "number_series",
    ageGroup: "6-12",
    price: 159,
    weight: 0.55,
  },
  {
    id: "ns-puzzle",
    name: "Number Series: Puzzles",
    category: "number_series",
    ageGroup: "13-16",
    price: 179,
    weight: 0.3,
  },
];

const products: SalesProduct[] = productSeeds.map(
  ({ weight: _weight, ...p }) => p, // eslint-disable-line @typescript-eslint/no-unused-vars
);

const locationSeeds: (SalesLocation & { weight: number })[] = [
  { city: "Bengaluru", state: "Karnataka", weight: 22 },
  { city: "Mumbai", state: "Maharashtra", weight: 17 },
  { city: "Delhi", state: "Delhi", weight: 15 },
  { city: "Chennai", state: "Tamil Nadu", weight: 10 },
  { city: "Hyderabad", state: "Telangana", weight: 9 },
  { city: "Pune", state: "Maharashtra", weight: 8 },
  { city: "Kolkata", state: "West Bengal", weight: 5 },
  { city: "Kochi", state: "Kerala", weight: 4 },
  { city: "Other locations", state: "", weight: 10 },
];

const locations: SalesLocation[] = locationSeeds.map((l) => ({
  city: l.city,
  state: l.state,
}));

const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const generateOrders = (): SalesOrder[] => {
  const rand = mulberry32(2026);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalWeight = locationSeeds.reduce((s, l) => s + l.weight, 0);
  const pickCity = () => {
    let r = rand() * totalWeight;
    for (const l of locationSeeds) {
      r -= l.weight;
      if (r <= 0) return l.city;
    }
    return locationSeeds[0].city;
  };

  const orders: SalesOrder[] = [];
  let id = 1;

  for (let back = 364; back >= 0; back--) {
    const day = new Date(today);
    day.setDate(day.getDate() - back);
    const weekend = day.getDay() === 0 || day.getDay() === 6;
    const growth = 0.7 + 0.3 * ((365 - back) / 365);

    for (const p of productSeeds) {
      const expected = 1.1 * p.weight * (weekend ? 1.3 : 1) * growth;
      const count = Math.floor(expected) + (rand() < expected % 1 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        orders.push({
          id: id++,
          date: iso(day),
          productId: p.id,
          units: 1 + (rand() < 0.3 ? 1 : 0) + (rand() < 0.1 ? 1 : 0),
          city: pickCity(),
          customerId: 1 + Math.floor(rand() * 900),
        });
      }
    }
  }
  return orders;
};

export const staticSalesAnalytics: SalesAnalyticsData = {
  categories,
  products,
  locations,
  orders: generateOrders(),
};
