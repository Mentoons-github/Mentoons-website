import { SITE_CATEGORIES } from "@/constant/faq";

export interface CommonFAQ {
  q: string;
  ans: string;
  link?: string;
}

export type Site_FAQ = {
  question: string;
  answer: string;
};

export type SiteCategory = (typeof SITE_CATEGORIES)[number];

export type Site_FAQData = {
  category: string;
  faqs: Site_FAQ[];
  icon: string;
  color: string;
};
