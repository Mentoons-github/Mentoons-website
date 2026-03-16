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
  sub: string;
  cta: string;
  accent: string;
  bg: string;
  shape: SlideShape;
  emoji: string;
  badges: string[];
  highlightWord: string;
}
