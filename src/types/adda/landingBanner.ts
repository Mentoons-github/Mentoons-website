export type SlideShape =
  | "circle"
  | "triangle"
  | "star"
  | "wave"
  | "square"
  | "hexagon"
  | "diamond";

export interface Slide {
  id: number;
  tag: string;
  headline: string;
  img: string;
  sub: string;
  cta: string;
  accent: string;
  bg: string;
  shape: SlideShape;
  emoji: string;
  badges: string[];
  highlightWord: string;
  link: string;
  items?: Array<{
    name: string;
    link: string;
    image?: string;
    color?: string;
  }>;
}
