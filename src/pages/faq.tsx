import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import FaqHeader from "@/components/faq/faqHeader";
import Categories from "@/components/faq/categories";
import { SITE_FAQ } from "@/constant/faq";
import type { SiteCategory } from "@/types";
import FaqCard from "@/components/faq/faqCard";

const CATEGORY_COLORS: Record<string, { active: string; idle: string }> = {
  All: {
    active: "bg-violet-600 text-white border-violet-600",
    idle: "text-violet-600 border-violet-300 hover:border-violet-500",
  },
};

const COLOR_PALETTE = [
  {
    active: "bg-pink-500 text-white border-pink-500",
    idle: "text-pink-500 border-pink-300 hover:border-pink-500",
  },
  {
    active: "bg-orange-500 text-white border-orange-500",
    idle: "text-orange-500 border-orange-300 hover:border-orange-500",
  },
  {
    active: "bg-green-500 text-white border-green-500",
    idle: "text-green-500 border-green-300 hover:border-green-500",
  },
  {
    active: "bg-blue-500 text-white border-blue-500",
    idle: "text-blue-500 border-blue-300 hover:border-blue-500",
  },
  {
    active: "bg-yellow-500 text-white border-yellow-500",
    idle: "text-yellow-500 border-yellow-300 hover:border-yellow-500",
  },
  {
    active: "bg-red-500 text-white border-red-500",
    idle: "text-red-500 border-red-300 hover:border-red-500",
  },
];

const buildCategoryConfigs = () => {
  const configs = [{ label: "All" as SiteCategory, ...CATEGORY_COLORS["All"] }];
  SITE_FAQ.forEach((section, i) => {
    const palette = COLOR_PALETTE[i % COLOR_PALETTE.length];
    configs.push({
      label: section.category as SiteCategory,
      active: palette.active,
      idle: palette.idle,
    });
  });
  return configs;
};

const CATEGORY_CONFIGS = buildCategoryConfigs();

const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState<SiteCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // 1. Filter by category
  const categoryFiltered =
    selectedCategory === "All"
      ? SITE_FAQ
      : SITE_FAQ.filter((item) => item.category === selectedCategory);

  // 2. Filter by search query
  const filteredFaqs =
    searchQuery.trim() === ""
      ? categoryFiltered
      : categoryFiltered
          .map((section) => ({
            ...section,
            faqs: section.faqs.filter(
              (faq) =>
                faq.question
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
          }))
          .filter((section) => section.faqs.length > 0);

  const hasResults = filteredFaqs.length > 0;

  useEffect(() => {
    if (!listRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-section",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 80%",
          },
        },
      );
    }, listRef);

    return () => ctx.revert();
  }, [filteredFaqs.length, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50/40">
      <FaqHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="pt-16">
        <Categories
          categories={CATEGORY_CONFIGS}
          defaultCategory="All"
          onSelect={(cat) => setSelectedCategory(cat ?? "All")}
        />

        <div ref={listRef} className="mt-12 space-y-10 px-6 md:px-20 pb-20">
          {hasResults ? (
            filteredFaqs.map((section) => (
              <div key={section.category} className="faq-section">
                <h2 className="text-2xl font-bold mb-4">
                  {section.icon} {section.category}
                </h2>

                <div className="space-y-4">
                  {section.faqs.map((faq, index) => (
                    <FaqCard
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-6xl mb-4">🔍</span>
              <p className="text-xl font-semibold text-gray-500">
                No results for &quot;{searchQuery}&quot;
              </p>
              <p className="text-gray-400 mt-2 text-sm">
                Try a different word or clear the search.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-5 py-2 rounded-full border-2 border-violet-300 text-violet-600 font-medium hover:bg-violet-50 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
